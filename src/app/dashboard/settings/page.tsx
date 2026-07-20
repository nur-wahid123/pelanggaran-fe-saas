"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ENDPOINT from "@/config/url";
import { useToast } from "@/hooks/use-toast";
import { PreviewImage } from "@/user-components/preview-image.component";
import { axiosInstance } from "@/util/request.util";
import {
  Edit,
  Image as ImageIcon,
  School2,
  SaveAllIcon,
  ThumbsUpIcon,
} from "lucide-react";

import { useCallback, useContext, useEffect, useState } from "react";
import { SchoolObject } from "@/objects/school.object";
import { AppContext } from "@/user-components/contexts/app.context";
import DeleteAllViolations from "@/user-components/violation/delete-all-violations.component";

export default function Page() {
  const { user, isLoading, refreshData } = useContext(AppContext);
  const [file, setFile] = useState<File | undefined | null>(undefined);
  const [school, setSchool] = useState<SchoolObject | null>(null);
  const [loading, setLoading] = useState(false);
  const toaster = useToast();
  const [images, setImages] = useState<number[]>([]);
  const fetchImage = useCallback(
    async (school: SchoolObject) => {
      await axiosInstance
        .get(`${ENDPOINT.LIST_IMAGE}/${school?.image}`)
        .then((res) => {
          setImages(res.data.data);
        });
    },
    [school]
  );

  const fetchSchool = useCallback(async () => {
    const res = await axiosInstance.get(
      `${ENDPOINT.DETAIL_SCHOOL_ADMIN}/${user.school_id}`
    );
    setSchool(res.data.data);
    fetchImage(res.data.data);
  }, [isLoading]);
  useEffect(() => {
    if (!isLoading) {
      fetchSchool();
    }
  }, [isLoading]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      setLoading(true);
      e.preventDefault();
      if (school == null) return;
      let imageId: number | undefined = undefined;
      if (file !== undefined && file !== null) {
        try {
          const fd = new FormData();
          fd.append("files", file);
          const res = await axiosInstance.post(ENDPOINT.UPLOAD_IMAGE, fd, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          imageId = res.data.data;
        } catch (error) {
          console.error(error);
          toaster.toast({
            description: "Data Gagal Di Input",
            title: "Gagal",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      }

      const { name, email, description, phone, address } = school;
      const body = {
        school_name: name,
        email,
        description,
        phone,
        address,
        ...(imageId !== null && imageId !== undefined
          ? { image: imageId }
          : {}),
      };

      await axiosInstance
        .patch(`${ENDPOINT.ADMIN_UPDATE_SCHOOL}/${school.id}`, body)
        .then(async () => {
          refreshData();
          setFile(undefined);
          fetchSchool();
          toaster.toast({
            title: "Berhasil",
            description: (
              <div className="flex gap-3">
                <ThumbsUpIcon /> Berhasil Mengubah Data
              </div>
            ),
          });
        })
        .catch((err) => {
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
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [school, file]
  );

  return (
    <div className="w-full h-full flex flex-col items-center md:items-start justify-start py-6 px-2 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6 md:mb-6 md:text-left text-center">
        <School2 className="w-8 h-8 text-primary mx-auto md:mx-0" />
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-800">
          Pengaturan Sekolah
        </h1>
      </div>
      <div className="flex flex-col justify-between max-w-2xl gap-3">
        <div className="w-full">
          <DeleteAllViolations />
        </div>
        <form onSubmit={handleSubmit} className="w-full max-w-2xl">
          <div className="flex flex-col gap-8">
            {/* School Name */}
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-2 text-base md:text-lg font-semibold text-gray-800">
                <span>Nama Sekolah</span>
                <Edit className="w-4 h-4 text-primary/70" />
              </label>
              <Input
                disabled={loading}
                className="flex-1 text-base mt-1"
                value={school?.name ?? ""}
                onChange={(e) => setSchool({ ...school, name: e.target.value })}
                placeholder="Masukkan nama sekolah"
              />
            </div>
            {/* School Address */}
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-2 text-base md:text-lg font-semibold text-gray-800">
                <span>Alamat Sekolah</span>
                <Edit className="w-4 h-4 text-primary/70" />
              </label>
              <Input
                disabled={loading}
                className="flex-1 text-base mt-1"
                value={school?.address ?? ""}
                onChange={(e) =>
                  setSchool({ ...school, address: e.target.value })
                }
                placeholder="Masukkan alamat sekolah"
              />
            </div>
            {/* School Email */}
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-2 text-base md:text-lg font-semibold text-gray-800">
                <span>Email Sekolah</span>
                <Edit className="w-4 h-4 text-primary/70" />
              </label>
              <Input
                type="email"
                disabled={loading}
                className="flex-1 text-base mt-1"
                value={school?.email ?? ""}
                onChange={(e) =>
                  setSchool({ ...school, email: e.target.value })
                }
                placeholder="Masukkan email sekolah"
              />
            </div>
            {/* School Phone */}
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-2 text-base md:text-lg font-semibold text-gray-800">
                <span>Nomor Telepon</span>
                <Edit className="w-4 h-4 text-primary/70" />
              </label>
              <Input
                type="tel"
                disabled={loading}
                className="flex-1 text-base mt-1"
                value={school?.phone ?? ""}
                onChange={(e) =>
                  setSchool({ ...school, phone: e.target.value })
                }
                placeholder="Masukkan nomor telepon sekolah"
              />
            </div>
            {/* School Description */}
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-2 text-base md:text-lg font-semibold text-gray-800">
                <span>Deskripsi Sekolah</span>
                <Edit className="w-4 h-4 text-primary/70" />
              </label>
              <textarea
                disabled={loading}
                className="flex-1 text-base mt-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y min-h-[80px]"
                value={school?.description ?? ""}
                onChange={(e) =>
                  setSchool({ ...school, description: e.target.value })
                }
                placeholder="Masukkan deskripsi sekolah"
              />
            </div>
            {/* School Logo */}
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start md:justify-start text-center md:text-left">
              <div className="flex flex-col items-center gap-2">
                <span className="flex items-center gap-2 text-base md:text-lg font-semibold text-gray-800">
                  <span>Logo Sekolah</span>
                  <ImageIcon className="w-4 h-4 text-primary/70" />
                </span>
                <PreviewImage
                  src={`${ENDPOINT.DETAIL_IMAGE}/${images[0]}`}
                  alt="Logo"
                  className="w-28 h-28 rounded-lg border border-gray-200 shadow"
                />
                <span className="text-xs text-gray-500">Preview Logo</span>
                <span className="text-xs text-gray-500">
                  Format: JPG, PNG, dsb.
                </span>
              </div>
              {file !== null && file !== undefined && (
                <div className="flex flex-col items-center gap-2">
                  <span className="flex items-center gap-2 text-base md:text-lg font-semibold text-gray-800">
                    <span>Logo Sekolah (Baru)</span>
                    <ImageIcon className="w-4 h-4 text-primary/70" />
                  </span>
                  <PreviewImage
                    src={URL.createObjectURL(file)}
                    alt="Logo Baru"
                    className="w-28 h-28 rounded-lg border border-gray-200 shadow"
                  />
                  <span className="text-xs text-gray-500">
                    Preview Logo Baru
                  </span>
                  <span className="text-xs text-gray-500">
                    Format: JPG, PNG, dsb.
                  </span>
                </div>
              )}
              <div className="flex flex-col gap-2 flex-1 w-full items-center md:items-start">
                <label className="flex items-center gap-3 cursor-pointer w-fit">
                  <Input
                    disabled={loading}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files?.length) {
                        setFile(files[0]);
                      }
                    }}
                  />
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20 hover:bg-primary/20 transition-colors">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Pilih Logo
                  </span>
                </label>
              </div>
            </div>
          </div>
          {/* Delete All Violations */}
          <Button>
            <SaveAllIcon /> Simpan
          </Button>
        </form>
      </div>
    </div>
  );
}
