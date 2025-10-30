"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Users,
  Loader2,
  UserCog,
  User,
  BookOpen,
  ShieldCheck,
  Info,
  AnnoyedIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/util/request.util";
import ENDPOINT from "@/config/url";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { SchoolObject } from "@/objects/school.object";
import { RoleEnum } from "@/enums/role.enum";
import { formatDateToExactString } from "@/util/date.util";
import { PagePaths, PagesEnum } from "@/enums/pages.enum";
import { useToast } from "@/hooks/use-toast";
import { PreviewImage } from "@/user-components/preview-image.component";

export default function SchoolDetailPage() {
  const { slug } = useParams() as { slug: string };
  const [school, setSchool] = useState<SchoolObject | null>(null);
  const [loading, setLoading] = useState(true);
  const toaster = useToast();
  const router = useRouter();
  const [images, setImages] = useState<number[]>([]);
  const fetchImage = useCallback(async (school: SchoolObject) => {
    await axiosInstance.get(`${ENDPOINT.LIST_IMAGE}/${school?.image}`).then((res) => {
        setImages(res.data.data)
    })
}, [school])

  const handleImpersonate = useCallback(async (userId: number) => {
    await axiosInstance
      .post(`${ENDPOINT.IMPERSONATE_USER}/${userId}`)
      .then((res) => {
        const token = res.data.data.access_token;
        const role = res.data.data.role as RoleEnum;

        if (token) {
          try {
            localStorage.setItem("token", token);
          } catch (error) {
            console.error(error);
          }
        } else {
          console.error("Token is undefined");
          return;
        }
        toaster.toast({
          title: "Success",
          description: "Berhasil Login",
          variant: "default",
        });
        if (role === RoleEnum.SUPERADMIN) {
          router.push("/superadmin");
        } else {
          router.push("/dashboard");
        }
        toaster.toast({
          title: "Berhasil",
          description: "Berhasil Melakukan Impesonate",
        });
      })
      .catch(() => {
        toaster.toast({
          title: "Gagal",
          variant: "destructive",
          description: "Gagal melakukan Impersonate",
        });
      });
  }, []);

  useEffect(() => {
    async function fetchSchool() {
      try {
        const res = await axiosInstance.get(
          `${ENDPOINT.DETAIL_SCHOOL}/${slug}`
        );
        setSchool(res.data.data);
        fetchImage(res.data.data);
      } catch (e) {
        console.error(e);
        setSchool(null);
      } finally {
        setLoading(false);
      }
    }
    fetchSchool();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin w-10 h-10 mb-2" />
        <span className="text-muted-foreground">Memuat detail sekolah...</span>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Building2 className="w-10 h-10 mb-2 text-destructive" />
        <span className="text-destructive font-semibold">
          Sekolah tidak ditemukan.
        </span>
        <Link href="/superadmin/school">
          <Button variant="outline" className="mt-4">
            Kembali ke daftar sekolah
          </Button>
        </Link>
      </div>
    );
  }

  // Statistic items
  const stats = [
    {
      label: "Siswa",
      value: school.students ? school.students.length : 0,
      icon: <User className="w-4 h-4 text-blue-500" />,
      limit: school.students_limit,
      color: "text-blue-700",
    },
    {
      label: "Admin",
      value: school.users
        ? school.users.filter((u) => u.role === RoleEnum.ADMIN).length
        : 0,
      icon: <UserCog className="w-4 h-4 text-purple-500" />,
      limit: school.user_limit,
      color: "text-purple-700",
    },
    {
      label: "Kelas",
      value: school.classes ? school.classes.length : 0,
      icon: <BookOpen className="w-4 h-4 text-orange-500" />,
      limit: school.classes_limit,
      color: "text-orange-700",
    },
    {
      label: "Jenis Pelanggaran",
      value: school.violation_types?.length ?? 0,
      icon: <ShieldCheck className="w-4 h-4 text-pink-500" />,
      limit: school.violation_type_limit,
      color: "text-pink-700",
    },
    {
      label: "Pelanggaran",
      value: school.violations ? school.violations.length : 0,
      icon: <ShieldCheck className="w-4 h-4 text-red-500" />,
      limit: school.violation_limit,
      color: "text-red-700",
    },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
        <PreviewImage src={`${ENDPOINT.DETAIL_IMAGE}/${images[0]}`}/>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-3xl font-bold text-primary">{school.name}</h1>
          </div>
          <div className="flex flex-wrap gap-2 items-center mb-2">
            <Badge variant="outline" className="text-xs">
              <MapPin className="w-3 h-3 mr-1" />
              {school.address}
            </Badge>
            {school.email && (
              <Badge variant="outline" className="text-xs">
                <Mail className="w-3 h-3 mr-1" />
                {school.email}
              </Badge>
            )}
            {school.phone && (
              <Badge variant="outline" className="text-xs">
                <Phone className="w-3 h-3 mr-1" />
                {school.phone}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium">Status:</span>
            {typeof school.is_active === "boolean" ? (
              <Badge
                className={`text-xs px-2 py-1 ${
                  school.is_active
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-red-100 text-red-700 border-red-200"
                }`}
                variant="outline"
              >
                {school.is_active ? "Aktif" : "Tidak Aktif"}
              </Badge>
            ) : (
              <Badge className="text-xs" variant="outline">
                Tidak diketahui
              </Badge>
            )}
            {typeof school.is_demo === "boolean" && (
              <Badge
                className={`text-xs px-2 py-1 ${
                  school.is_demo
                    ? "bg-red-100 text-red-700 border-red-200"
                    : "bg-green-100 text-green-700 border-green-200"
                }`}
                variant="outline"
              >
                {school.is_demo ? "Demo" : "Full"}
              </Badge>
            )}
          </div>
          <div className="text-muted-foreground text-sm mt-1">
            {school.description ? (
              <span>{school.description}</span>
            ) : (
              <span className="italic">Deskripsi belum diisi</span>
            )}
          </div>
        </div>
      </div>
      <Separator className="my-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`flex flex-col items-center justify-center bg-white rounded-lg shadow p-4 border border-gray-100 hover:shadow-md transition group`}
          >
            <div className="mb-2">{stat.icon}</div>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
            {stat.limit && (
              <div className="text-[10px] text-gray-400 mt-1">
                Limit: {stat.limit}
              </div>
            )}
          </div>
        ))}
      </div>
      <Separator className="my-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <MapPin className="w-5 h-5" /> Alamat Sekolah
          </h2>
          <div className="text-muted-foreground">
            {school.address ? (
              <span>{school.address}</span>
            ) : (
              <span className="italic">Alamat belum diisi</span>
            )}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Info className="w-5 h-5" /> Info Lainnya
          </h2>
          <ul className="text-muted-foreground text-sm space-y-1">
            <li>
              <span className="font-medium">Email:</span>{" "}
              {school.email || <span className="italic">Belum diisi</span>}
            </li>
            <li>
              <span className="font-medium">Telepon:</span>{" "}
              {school.phone || <span className="italic">Belum diisi</span>}
            </li>
            <li>
              <span className="font-medium">Tanggal Mulai:</span>{" "}
              {school.start_date
                ? formatDateToExactString(new Date(school.start_date))
                : "-"}
            </li>
          </ul>
        </div>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium">Dibuat:</span>
          <span>
            {school.start_date ? (
              formatDateToExactString(new Date(school.start_date))
            ) : (
              <span className="italic">-</span>
            )}
          </span>
        </div>
        <div className="flex gap-2">
          <Link href={PagePaths.superadminSchoolEdit(school.id ?? 0)}>
            <Button variant="default" size="sm">
              Edit Sekolah
            </Button>
          </Link>
          <Link href={PagesEnum.SUPERADMIN_SCHOOL}>
            <Button variant="outline" size="sm">
              Kembali
            </Button>
          </Link>
        </div>
      </div>
      <Separator className="my-6" />
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" /> Daftar User Sekolah
        </h2>
        {school.users && school.users.length > 0 ? (
          <div className="flex flex-col gap-2">
            {school.users.map((user, idx: number) => (
              <div
                key={user.id ?? idx}
                className="rounded-lg border border-gray-200 bg-white dark:bg-gray-900 p-4 shadow-sm flex flex-row items-center gap-4"
              >
                <div className="flex-shrink-0">
                  <User className="w-10 h-10 text-primary bg-primary/10 rounded-full p-2" />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="font-semibold text-base truncate">
                    {user.name || (
                      <span className="italic text-muted-foreground">-</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1 text-sm min-w-[120px]">
                  <div>
                    <span className="font-medium">Email:</span>{" "}
                    {user.email || (
                      <span className="italic text-muted-foreground">-</span>
                    )}
                  </div>
                  <div>
                    <span className="font-medium">Role:</span>{" "}
                    <Badge variant="secondary">
                      {user.role &&
                      RoleEnum[user.role as unknown as keyof typeof RoleEnum]
                        ? RoleEnum[
                            user.role as unknown as keyof typeof RoleEnum
                          ]
                        : user.role || <span className="italic">-</span>}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>{" "}
                  </div>
                </div>
                <div>
                  <Button onClick={() => handleImpersonate(user?.id ?? 0)}>
                    <AnnoyedIcon className="w-4 h-4 mr-2" />
                    Impersonate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground italic">
            Belum ada user terdaftar di sekolah ini.
          </div>
        )}
      </div>
    </div>
  );
}
