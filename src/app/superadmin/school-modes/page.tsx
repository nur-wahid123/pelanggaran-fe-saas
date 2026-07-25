"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import ENDPOINT from "@/config/url";
import { SchoolModeObject } from "@/objects/school-mode.object";
import { PlusIcon, Trash2, Edit, Loader2, Info } from "lucide-react";
import Link from "next/link";
import { axiosInstance } from "@/util/request.util";
import { useToast } from "@/hooks/use-toast";
import { setDocumentTitle } from "@/util/util";

export default function Page() {
  const [modes, setModes] = useState<SchoolModeObject[]>([]);
  const [loading, setLoading] = useState(true);
  const toaster = useToast();

  const fetchModes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(ENDPOINT.SCHOOL_MODES_LIST);
      setModes(response.data.data);
    } catch (err) {
      console.error("Failed to fetch modes", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setDocumentTitle('Daftar Mode Sekolah', 'Superadmin');
    fetchModes();
  }, [fetchModes]);

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus mode sekolah ini?")) {
      try {
        const res = await axiosInstance.delete(ENDPOINT.SCHOOL_MODES_DELETE(id));
        toaster.toast({
          title: "Berhasil",
          description: res.data?.message || "Mode sekolah berhasil dihapus.",
        });
        fetchModes();
      } catch (err: any) {
        toaster.toast({
          title: "Gagal menghapus",
          description: err.response?.data?.message || "Gagal menghapus mode sekolah.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-blue-50 via-white to-violet-50 py-8 px-4 md:px-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">Daftar Mode Sekolah</h1>
        </div>
        <div>
          <Link href="/superadmin/school-modes/add">
            <Button className="flex gap-2">
              <PlusIcon className="w-4 h-4" />
              Tambah Mode
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin mr-2" />
            Memuat data...
          </div>
        ) : modes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
            <Info className="w-8 h-8 text-gray-300" />
            <span>Belum ada data mode sekolah.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Mode</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Deskripsi</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Siswa</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Kelas</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Pelanggaran</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipe Pelanggaran</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Pengguna</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Demo</th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Aksi</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {modes.map((mode) => (
                  <tr key={mode.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{mode.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{mode.description || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600">{mode.students_limit?.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600">{mode.classes_limit?.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600">{mode.violation_limit?.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600">{mode.violation_type_limit?.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600">{mode.user_limit?.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        mode.is_demo 
                          ? "bg-red-50 text-red-600 border border-red-100" 
                          : "bg-green-50 text-green-600 border border-green-100"
                      }`}>
                        {mode.is_demo ? "Demo" : "Standard"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center gap-2">
                        <Link href={`/superadmin/school-modes/edit/${mode.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-800">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-600 hover:text-red-800"
                          onClick={() => mode.id && handleDelete(mode.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
