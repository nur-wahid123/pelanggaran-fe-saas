"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ENDPOINT from "@/config/url";
import { setDocumentTitle } from "@/util/util";
import axios from "axios";
import {
  GraduationCap,
  Shield,
  Users,
  BarChart3,
  ArrowRight,
  Sparkles,
  BookOpen,
  Award,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { SchoolObject } from "@/objects/school.object";
import { notFound, useParams } from "next/navigation";

export default function SchoolHomepage() {
  const { slug } = useParams();
  const [school, setSchool] = useState<SchoolObject | null>(null);
  const [logo, setLogo] = useState<number>(0);

  useEffect(() => {
    async function fetchSchoolData() {

      try {
        const response = await axios.get(ENDPOINT.SLUG_SCHOOL(String(slug)));
        const schoolData = response.data.data;
        setSchool(schoolData);
        setDocumentTitle("Homepage", schoolData.name || "");

        // Simpan slug di localStorage agar alur login & logout sinkron
        if (typeof window !== "undefined") {
          localStorage.setItem("schoolSlug", String(slug));
        }

        // Fetch image logo ID jika image (imageLinkId) tersedia
        if (schoolData.image) {
          const imgRes = await axios.get(`${ENDPOINT.LIST_IMAGE}/${schoolData.image}`);
          const imageList = imgRes.data.data;
          if (imageList && imageList.length > 0) {
            setLogo(imageList[0]);
          }
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            notFound()
          }
        }
        console.error("Gagal memuat data sekolah:", error);
      }
    }
    fetchSchoolData();
  }, [slug]);

  if (!school) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Memuat halaman sekolah...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-20 lg:py-32">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-200/30 to-blue-200/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-yellow-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo and School Info */}
            <div className="mb-8">
              <div className="inline-block p-6 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-6">
                {logo !== 0 ? (
                  <img
                    src={`${ENDPOINT.DETAIL_IMAGE}/${logo}`}
                    width={120}
                    alt="Logo Sekolah"
                    className="mx-auto max-h-[120px] object-contain"
                  />
                ) : (
                  <GraduationCap className="h-16 w-16 text-blue-600 mx-auto" />
                )}
              </div>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 text-yellow-500" />
                <span className="text-lg font-medium text-gray-600">
                  {school.is_demo && "Demo "}Sistem Pencatatan Pelanggaran
                </span>
                <Sparkles className="h-6 w-6 text-yellow-500" />
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                {school.name}
              </h1>
              {school.address && (
                <p className="text-md text-gray-500 mb-6 italic">
                  {school.address}
                </p>
              )}
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Kelola dan pantau pelanggaran siswa dengan mudah, cepat, dan
                efisien. Sistem yang dirancang khusus untuk mendukung proses
                pembelajaran yang lebih baik.
              </p>
            </div>

            {/* CTA Button */}
            <div className="mb-16">
              <Link href={`/login/${slug}`}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <GraduationCap className="mr-2 h-6 w-6" />
                  Masuk ke Sistem
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Mengapa Memilih Sistem Kami?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Solusi lengkap untuk manajemen pelanggaran siswa dengan
              fitur-fitur canggih dan antarmuka yang user-friendly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="p-6 text-center">
                <div className="inline-block p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Keamanan Terjamin
                </h3>
                <p className="text-gray-600">
                  Data pelanggaran siswa terlindungi dengan sistem keamanan
                  berlapis
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="p-6 text-center">
                <div className="inline-block p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Mudah Digunakan
                </h3>
                <p className="text-gray-600">
                  Antarmuka yang intuitif dan mudah dipahami oleh semua pengguna
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="p-6 text-center">
                <div className="inline-block p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Laporan Lengkap
                </h3>
                <p className="text-gray-600">
                  Analisis data dan laporan statistik yang komprehensif
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-orange-50 to-yellow-50">
              <CardContent className="p-6 text-center">
                <div className="inline-block p-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Pembelajaran
                </h3>
                <p className="text-gray-600">
                  Mendukung proses pembelajaran yang lebih efektif dan
                  terstruktur
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-12 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Award className="h-6 w-6 text-yellow-400" />
            <span className="text-lg font-semibold">
              Sistem Pencatatan Pelanggaran
            </span>
          </div>
          <p className="text-gray-300">
            Solusi terbaik untuk manajemen pelanggaran siswa di era digital
          </p>
        </div>
      </div>
    </div>
  );
}
