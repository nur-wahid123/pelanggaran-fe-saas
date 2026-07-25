"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckIcon, Loader2, Save } from "lucide-react";
import { axiosInstance } from "@/util/request.util";
import ENDPOINT from "@/config/url";
import { useToast } from "@/hooks/use-toast";
import { PagePaths } from "@/enums/pages.enum";
import { SchoolObject } from "@/objects/school.object";
import { SchoolModeObject } from "@/objects/school-mode.object";
import { setDocumentTitle } from "@/util/util";

export default function EditSchoolPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  const toaster = useToast();
  const [school, setSchool] = useState<SchoolObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modes, setModes] = useState<SchoolModeObject[]>([]);

  const fetchModes = useCallback(async () => {
    try {
      const response = await axiosInstance.get(ENDPOINT.SCHOOL_MODES_LIST);
      setModes(response.data.data);
    } catch (err) {
      console.error("Failed to fetch school modes", err);
    }
  }, []);

  useEffect(() => {
    fetchModes();
  }, [fetchModes]);

  const handleModeChange = (modeIdStr: string) => {
    if (!school) return;
    const modeId = Number(modeIdStr);
    const selectedMode = modes.find((m) => m.id === modeId);
    if (selectedMode) {
      setSchool({
        ...school,
        mode_id: modeId,
        is_demo: selectedMode.is_demo,
        students_limit: selectedMode.students_limit,
        violation_limit: selectedMode.violation_limit,
        classes_limit: selectedMode.classes_limit,
        user_limit: selectedMode.user_limit,
        violation_type_limit: selectedMode.violation_type_limit,
      });
    }
  };

  const fetchSchool = useCallback(async () => {
    try {
      const res = await axiosInstance.get(
        `${ENDPOINT.DETAIL_SCHOOL}/${slug}`
      );
      setSchool(res.data.data);
      setDocumentTitle('Edit Sekolah', res.data.data.name ?? '');
    } catch (e) {
      console.error(e);
      setSchool(null);
    } finally {
      setLoading(false);
    }
  }, [setSchool])

  useEffect(() => {
    fetchSchool();
  }, [slug]);

  // List of fields that should only accept numeric input
  const numericFields = [
    "students_limit",
    "violation_type_limit",
    "violation_limit",
    "classes_limit",
    "user_limit",
  ];

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    if (!school) return;
    const target = e.target;
    const { name, value, type } = target;

    let newValue: any = value;

    if (type === "checkbox" && target instanceof HTMLInputElement) {
      newValue = target.checked;
    } else if (numericFields.includes(name)) {
      if (value === "") {
        newValue = 0;
      } else if (/^\d+$/.test(value)) {
        newValue = value.replace(/^0+(\d)/, "$1");
        newValue = Number(newValue);
      } else {
        return;
      }
    }

    setSchool({
      ...school,
      [name]: newValue,
    });
  }

  function handleSwitchChange(name: string, value: boolean) {
    if (!school) return;
    setSchool({
      ...school,
      [name]: value,
    });
  }

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!school) return;
    setSaving(true);
    setError(null);
    try {
      await axiosInstance
        .patch(`${ENDPOINT.UPDATE_SCHOOL}/${school.id}`, { ...school, school_name: school.name })
        .then(() => {
          toaster.toast({
            title: "Berhasil",
            description: (
              <div className="flex gap-2 justify-center">
                <CheckIcon /> Berhasil Mengubah Data
              </div>
            ),
            variant: "default",
          });
          router.push(PagePaths.superadminSchoolDetail(school.id ?? 0));
        });
    } catch (err: any) {
      if (err.code === 400) {
        toaster.toast({
          title: "Error",
          description: err.response.data.message[0],
          variant: "destructive",
        });
      } else {
        toaster.toast({
          title: "Error",
          description: err.response.data.message,
          variant: "destructive",
        });
      }
    }
  }, [school, setSaving]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin mr-2" />
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  if (!school) {
    return <div className="text-center py-8">School not found.</div>;
  }

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-6">Edit School</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={school.name || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            value={school.phone || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            value={school.address || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={school.email || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={school.description || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="mode_id">School Mode</Label>
          <div className="mt-1">
            <Select
              value={school.mode?.id ? String(school.mode?.id) : ""}
              onValueChange={handleModeChange}
            >
              <SelectTrigger id="mode_id" className="w-full">
                <SelectValue placeholder="Select School Mode" />
              </SelectTrigger>
              <SelectContent>
                {modes?.map((m) => (
                  <SelectItem key={m.id} value={String(m.id)}>
                    {m.name} {m.description ? `- ${m.description}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Label htmlFor="is_active">Active</Label>
          <Switch
            id="is_active"
            checked={!!school.is_active}
            onCheckedChange={(val) => handleSwitchChange("is_active", val)}
          />
        </div>
        <div>
          <Label htmlFor="students_limit">Students Limit</Label>
          <Input
            id="students_limit"
            name="students_limit"
            type="text"
            value={school.students_limit ?? ""}
            disabled={true}
            className="cursor-not-allowed"
          />
        </div>
        <div>
          <Label htmlFor="violation_type_limit">Violation Type Limit</Label>
          <Input
            id="violation_type_limit"
            name="violation_type_limit"
            type="text"
            value={school.violation_type_limit ?? ""}
            disabled={true}
            className="cursor-not-allowed"
          />
        </div>
        <div>
          <Label htmlFor="violation_limit">Violation Limit</Label>
          <Input
            id="violation_limit"
            name="violation_limit"
            type="text"
            value={school.violation_limit ?? ""}
            disabled={true}
            className="cursor-not-allowed"
          />
        </div>
        <div>
          <Label htmlFor="classes_limit">Classes Limit</Label>
          <Input
            id="classes_limit"
            name="classes_limit"
            type="text"
            value={school.classes_limit ?? ""}
            disabled={true}
            className="cursor-not-allowed"
          />
        </div>
        <div>
          <Label htmlFor="user_limit">User Limit</Label>
          <Input
            id="user_limit"
            name="user_limit"
            type="text"
            value={school.user_limit ?? ""}
            disabled={true}
            className="cursor-not-allowed"
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
