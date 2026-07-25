"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Save, AlertTriangle } from "lucide-react";
import { axiosInstance } from "@/util/request.util";
import { useToast } from "@/hooks/use-toast";
import ENDPOINT from "@/config/url";
import Link from "next/link";
import { setDocumentTitle } from "@/util/util";

interface SchoolModeDto {
  id?: number;
  name: string;
  description: string;
  students_limit: number;
  violation_type_limit: number;
  violation_limit: number;
  classes_limit: number;
  user_limit: number;
  is_demo: boolean;
}

export default function Page() {
  const params = useParams();
  const idStr = params?.id as string;
  const id = Number(idStr);
  const toast = useToast();
  const router = useRouter();

  const [form, setForm] = useState<SchoolModeDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchModeDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(ENDPOINT.SCHOOL_MODES_DETAIL(id));
      const m = response.data.data;
      setDocumentTitle('Edit Mode Sekolah', m.name ?? '');
      setForm({
        id: m.id,
        name: m.name,
        description: m.description || "",
        students_limit: m.students_limit,
        violation_type_limit: m.violation_type_limit,
        violation_limit: m.violation_limit,
        classes_limit: m.classes_limit,
        user_limit: m.user_limit,
        is_demo: m.is_demo,
      });
    } catch (err) {
      console.error("Failed to fetch mode details", err);
      toast.toast({
        title: "Gagal memuat",
        description: "Gagal memuat detail mode sekolah.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    if (id) {
      fetchModeDetails();
    }
  }, [id, fetchModeDetails]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!form) return;
    const { name, value, type } = e.target;
    if (type === "number") {
      setForm((prev) => prev ? ({
        ...prev,
        [name]: value === "" ? 0 : Number(value),
      }) : null);
    } else {
      setForm((prev) => prev ? ({ ...prev, [name]: value }) : null);
    }
  };

  const handleSwitch = (name: keyof SchoolModeDto, value: boolean) => {
    if (!form) return;
    setForm((prev) => prev ? ({ ...prev, [name]: value }) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);

    try {
      await axiosInstance.patch(ENDPOINT.SCHOOL_MODES_UPDATE(id), form, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.toast({
        title: "Berhasil!",
        description: "Perubahan mode sekolah berhasil disimpan.",
        variant: "default",
        duration: 4000,
      });

      router.push("/superadmin/school-modes");
    } catch (err: any) {
      toast.toast({
        title: "Gagal",
        description: err?.response?.data?.message || "Terjadi kesalahan.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="animate-spin mr-2" />
        Memuat data...
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-muted-foreground gap-2">
        <AlertTriangle className="w-8 h-8 text-amber-500" />
        <span>Detail mode sekolah tidak ditemukan.</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-violet-50 py-8 px-4 md:px-12">
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/superadmin/school-modes" className="text-gray-500 hover:text-gray-800">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="text-2xl font-bold tracking-tight">
            Edit Mode Sekolah - {form.name}
          </span>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="name">Nama Mode</Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="mt-1"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="students_limit">Limit Siswa</Label>
                <Input
                  id="students_limit"
                  name="students_limit"
                  type="number"
                  min={1}
                  value={form.students_limit}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="classes_limit">Limit Kelas</Label>
                <Input
                  id="classes_limit"
                  name="classes_limit"
                  type="number"
                  min={1}
                  value={form.classes_limit}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="violation_limit">Limit Pelanggaran</Label>
                <Input
                  id="violation_limit"
                  name="violation_limit"
                  type="number"
                  min={1}
                  value={form.violation_limit}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="violation_type_limit">Limit Jenis Pelanggaran</Label>
                <Input
                  id="violation_type_limit"
                  name="violation_type_limit"
                  type="number"
                  min={1}
                  value={form.violation_type_limit}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="user_limit">Limit Pengguna</Label>
                <Input
                  id="user_limit"
                  name="user_limit"
                  type="number"
                  min={1}
                  value={form.user_limit}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>

              <div className="flex items-center justify-between border rounded-lg p-3 mt-1 bg-gray-50/50">
                <div className="flex flex-col gap-0.5">
                  <Label htmlFor="is_demo">Demo Mode</Label>
                  <span className="text-xs text-muted-foreground">
                    Batasi akses selayaknya mode demo
                  </span>
                </div>
                <Switch
                  id="is_demo"
                  checked={form.is_demo}
                  onCheckedChange={(v) => handleSwitch("is_demo", v)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Link href="/superadmin/school-modes">
                <Button type="button" variant="outline">
                  Batal
                </Button>
              </Link>
              <Button type="submit" disabled={saving} className="flex gap-2">
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
