"use client";
import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarDays,
  School,
  UploadCloud,
  Loader2,
} from "lucide-react";
import { axiosInstance } from "@/util/request.util";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import ENDPOINT from "@/config/url";
import { useRouter } from "next/navigation";
import { setDocumentTitle } from "@/util/util";
import { PagesEnum } from "@/enums/pages.enum";

interface CreateSchoolDto {
  school_name?: string;
  school_slug?: string;
  is_demo?: boolean;
  is_active?: boolean;
  address?: string;
  phone?: string;
  description?: string;
  email?: string;
  image?: File | null;
  start_date?: Date | null;
  students_limit?: number;
  violation_limit?: number;
  classes_limit?: number;
  user_limit?: number;
  violation_type_limit?: number;
  user_username?: string;
  user_name?: string;
  user_email?: string;
  user_password?: string;
  mode_id?: number;
}

const initialState: CreateSchoolDto = {
  school_name: "",
  school_slug: "",
  is_demo: false,
  is_active: true,
  address: "",
  phone: "",
  description: "",
  email: "",
  image: null,
  start_date: null,
  students_limit: 500,
  violation_limit: 5000,
  classes_limit: 30,
  user_limit: 20,
  violation_type_limit: 50,
  user_username: "",
  user_name: "",
  user_email: "",
  user_password: "",
  mode_id: undefined,
};

export default function Page() {
  const [form, setForm] = useState<CreateSchoolDto>(initialState);
  const [loading, setLoading] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const router = useRouter();
  const [modes, setModes] = useState<any[]>([]);

  useEffect(() => {
    setDocumentTitle('Tambah Sekolah', 'Superadmin');
    const fetchModes = async () => {
      try {
        const response = await axiosInstance.get(ENDPOINT.SCHOOL_MODES_LIST);
        setModes(response.data.data);
        if (response.data.data.length > 0) {
          const defaultMode = response.data.data.find((m: any) => m.name === 'Normal') || response.data.data[0];
          setForm((prev) => ({
            ...prev,
            mode_id: defaultMode.id,
            is_demo: defaultMode.is_demo,
            students_limit: defaultMode.students_limit,
            violation_limit: defaultMode.violation_limit,
            classes_limit: defaultMode.classes_limit,
            user_limit: defaultMode.user_limit,
            violation_type_limit: defaultMode.violation_type_limit,
          }));
        }
      } catch (err) {
        console.error("Failed to fetch school modes", err);
      }
    };
    fetchModes();
  }, []);

  const handleModeChange = (modeIdStr: string) => {
    const modeId = Number(modeIdStr);
    const selectedMode = modes.find((m) => m.id === modeId);
    if (selectedMode) {
      setForm((prev) => ({
        ...prev,
        mode_id: modeId,
        is_demo: selectedMode.is_demo,
        students_limit: selectedMode.students_limit,
        violation_limit: selectedMode.violation_limit,
        classes_limit: selectedMode.classes_limit,
        user_limit: selectedMode.user_limit,
        violation_type_limit: selectedMode.violation_type_limit,
      }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "number") {
      setForm((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSwitch = (name: keyof CreateSchoolDto, value: boolean) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleCalendar = (date: Date | undefined) => {
    setForm((prev) => ({ ...prev, start_date: date ?? null }));
    setCalendarOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let imageId: number | undefined = undefined;
    if (form.image === null) {
      toast.toast({
        title: "Kurang Lengkap",
        description: "tolong tambahkan logo sekolah",
      });
    }
    try {
      if (form.image !== null && form.image !== undefined) {
        try {
          const fd = new FormData();
          fd.append("files", form.image);
          const res = await axiosInstance.post(ENDPOINT.UPLOAD_IMAGE, fd, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          imageId = res.data.data;
        } catch (error) {
          console.error(error);
          toast.toast({
            description: "Data Gagal Di Input",
            title: "Gagal",
            variant: "destructive",
          });
          return;
        }
      }
      const body = { ...form, image: imageId };

      await axiosInstance.post(ENDPOINT.SCHOOL_CREATE, body, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.toast({
        title: "Sekolah berhasil ditambahkan!",
        description: "Data sekolah baru telah disimpan.",
        variant: "default",
        duration: 4000,
      });

      setForm(initialState);
      if (fileInputRef.current) fileInputRef.current.value = "";
      router.push(PagesEnum.SUPERADMIN_SCHOOL);
    } catch (err: any) {
      if (imageId !== undefined) {
        await axiosInstance.delete(`${ENDPOINT.DELETE_IMAGE}/${imageId}`);
      }
      toast.toast({
        title: "Gagal menambahkan sekolah",
        description: err?.response?.data?.message || "Terjadi kesalahan.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col min-h-screen px-2 py-8">
      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-3 mb-8">
          <School className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-bold tracking-tight">
            Tambahkan Sekolah Baru
          </span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="school_name">Nama Sekolah</Label>
              <Input
                id="school_name"
                name="school_name"
                placeholder="Contoh: SMAN 1 Srengat"
                value={form.school_name}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="school_slug">Slug Sekolah</Label>
              <Input
                id="school_slug"
                name="school_slug"
                placeholder="Contoh: smangat, smaga, smada"
                value={form.school_slug}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Sekolah</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="school@email.com"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="phone">Telepon</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="08xxxxxxxxxx"
                value={form.phone}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="address">Alamat</Label>
              <Input
                id="address"
                name="address"
                placeholder="Jl. Contoh No. 1"
                value={form.address}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="start_date">Tanggal Mulai</Label>
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !form.start_date && "text-muted-foreground"
                  )}
                  onClick={() => setCalendarOpen((v) => !v)}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {form.start_date
                    ? format(form.start_date, "PPP")
                    : "Pilih tanggal"}
                </Button>
                {calendarOpen && (
                  <div className="absolute z-20 bg-white mt-2 border rounded shadow">
                    <Calendar
                      mode="single"
                      selected={form.start_date ?? undefined}
                      onSelect={handleCalendar}
                      initialFocus
                    />
                  </div>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="image">Logo/Gambar Sekolah</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFile}
                />
                <UploadCloud className="w-5 h-5 text-blue-400" />
              </div>
              {form.image && (
                <div className="mt-2">
                  <img
                    src={URL.createObjectURL(form.image)}
                    alt="Preview"
                    className="h-16 rounded shadow border"
                  />
                </div>
              )}
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Deskripsi singkat sekolah"
                value={form.description}
                onChange={handleChange}
                className="mt-1"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="mode_id">Mode Sekolah</Label>
              <div className="mt-1">
                <Select
                  value={form.mode_id ? String(form.mode_id) : ""}
                  onValueChange={handleModeChange}
                >
                  <SelectTrigger id="mode_id" className="w-full">
                    <SelectValue placeholder="Pilih Mode Sekolah" />
                  </SelectTrigger>
                  <SelectContent>
                    {modes.map((m) => (
                      <SelectItem key={m.id} value={String(m.id)}>
                        {m.name} {m.description ? `- ${m.description}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="is_active">Status Aktif</Label>
              <div className="flex items-center gap-2 mt-1">
                <Switch
                  id="is_active"
                  checked={form.is_active}
                  onCheckedChange={(v) => handleSwitch("is_active", v)}
                />
                <span className="text-sm text-muted-foreground">
                  Sekolah aktif
                </span>
              </div>
            </div>
          </div>
          <div>
            <div className="flex flex-col gap-6">
              <div>
                <Label htmlFor="students_limit">Siswa Maks</Label>
                <Input
                  id="students_limit"
                  name="students_limit"
                  type="number"
                  value={form.students_limit}
                  disabled={true}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="violation_limit">Pelanggaran Maks</Label>
                <Input
                  id="violation_limit"
                  name="violation_limit"
                  type="number"
                  value={form.violation_limit}
                  disabled={true}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="classes_limit">Kelas Maks</Label>
                <Input
                  id="classes_limit"
                  name="classes_limit"
                  type="number"
                  value={form.classes_limit}
                  disabled={true}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="user_limit">User Maks</Label>
                <Input
                  id="user_limit"
                  name="user_limit"
                  type="number"
                  value={form.user_limit}
                  disabled={true}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="violation_type_limit">Jenis Pelanggaran Maks</Label>
                <Input
                  id="violation_type_limit"
                  name="violation_type_limit"
                  type="number"
                  value={form.violation_type_limit}
                  disabled={true}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-muted">
            <h2 className="font-semibold mb-2 flex items-center gap-2">
              <span>Admin Sekolah</span>
              <span className="text-xs text-muted-foreground">
                (Akun admin utama sekolah)
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="user_username">Username</Label>
                <Input
                  id="user_username"
                  name="user_username"
                  placeholder="adminsekolah"
                  value={form.user_username}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="userName">Nama Admin</Label>
                <Input
                  id="user_name"
                  name="user_name"
                  placeholder="Nama Admin"
                  value={form.user_name}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="user_email">Email Admin</Label>
                <Input
                  id="user_email"
                  name="user_email"
                  type="email"
                  placeholder="admin@email.com"
                  value={form.user_email}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="user_password">Password</Label>
                <Input
                  id="user_password"
                  name="user_password"
                  type="password"
                  placeholder="Password"
                  value={form.user_password}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-6">
            <Button
              type="submit"
              className="bg-blue-600 text-white font-bold px-8 py-2 rounded shadow hover:bg-blue-700 transition-all flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <School className="w-5 h-5" />
                  Tambahkan Sekolah
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
