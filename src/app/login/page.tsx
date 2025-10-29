'use client'
import { LoginForm } from "@/components/login-form"
import { setDocumentTitle } from "@/util/util"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import React, { useEffect } from "react"

export default function LoginPage() {

  useEffect(()=>{
    setDocumentTitle("Login",'')
  },[])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-2">
      <div className="w-full max-w-sm mx-auto">
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 mb-1">
              Selamat Datang
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Masuk ke akun Anda untuk melanjutkan
            </p>
          </div>

          <LoginForm />
        </div>
        <div className="text-center mt-4">
          <p className="text-xs text-gray-400">
            © 2024 Sistem Pencatatan Pelanggaran.
          </p>
        </div>
      </div>
    </div>
  );
}
