"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { axiosInstance } from "@/util/request.util";
import { useToast } from "@/hooks/use-toast";
import ENDPOINT from "@/config/url";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setDocumentTitle } from "@/util/util";

interface CreateSchoolModeDto {
  name: string;
  description: string;
  students_limit: number;
  violation_type_limit: number;
  violation_limit: number;
  classes_limit: number;
  user_limit: number;
  is_demo: boolean;
}

const initialState: CreateSchoolModeDto = {
  name: "",
  description: "",
  students_limit: 100,
  violation_type_limit: 10,
  violation_limit: 1000,
  classes_limit: 10,
  user_limit: 10,
  is_demo: false,
};

export default function Page() {
  const [form, setForm] = useState<CreateSchoolModeDto>(initialState);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    setDocumentTitle('Tambah Mode Sekolah', 'Superadmin');
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "number") {
      setForm((prev) => ({
        ...prev,
        [name]: value === "" ? 0 : Number(value),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSwitch = (name: keyof CreateSchoolModeDto, value: boolean) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.post(ENDPOINT.SCHOOL_MODES_CREATE, form, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.toast({
        title: "Berhasil!",
        description: "Mode sekolah baru telah disimpan.",
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
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-violet-50 py-8 px-4 md:px-12">
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/superadmin/school-modes" className="text-gray-500 hover:text-gray-800">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="text-2xl font-bold tracking-tight">
            Tambah Mode Sekolah Baru
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
                  placeholder="Contoh: Premium, Starter"
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
                  placeholder="Deskripsi tingkat langganan/mode"
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
              <Button type="submit" disabled={loading} className="flex gap-2">
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Simpan Mode
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
