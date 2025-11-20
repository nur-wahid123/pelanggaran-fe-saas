"use client";
import { Button } from "@/components/ui/button";
import ENDPOINT from "@/config/url";
import { SchoolObject } from "@/objects/school.object";
import useInfiniteScroll from "@/user-components/hook/useInfiniteScroll.hook";
import SchoolCard from "@/user-components/school/school-card.component";
import { PlusIcon, School as SchoolIcon, Loader2, XIcon } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import SearchBar from "@/user-components/ui/search-bar";

export default function Page() {
  const [search, setSearch] = useState("");
  const { data, loading, ref } = useInfiniteScroll<
    SchoolObject,
    HTMLAnchorElement
  >({ filter: { search }, take: 20, url: ENDPOINT.MASTER_SCHOOL });

  const handleSearch = useCallback(
    (query: string) => {
      if (query !== search) {
        setSearch(query);
      }
    },
    [search]
  );

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-blue-50 via-white to-violet-50 py-8 px-4 md:px-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <SchoolIcon className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold tracking-tight">Daftar Sekolah</h1>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <SearchBar
            className={["w-full md:w-64"]}
            text="Cari sekolah..."
            onSearch={handleSearch}
          />
          <Link href="/superadmin/school/add">
            <Button className="flex gap-2">
              <PlusIcon className="w-4 h-4" />
              Tambah Sekolah
            </Button>
          </Link>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="overflow-x-auto">
          <div className="flex flex-col gap-6">
            {data.map((school, i) => (
              <Link
                href={`/superadmin/school/${school.id}`}
                key={i}
                ref={i === data.length - 1 ? ref : undefined}
              >
                <SchoolCard school={school} isLoading={loading} />
              </Link>
            ))}
            {loading && (
              <div className="col-span-full flex justify-center py-6">
                <Loader2 className="animate-spin inline-block mr-2" />
                Memuat data...
              </div>
            )}
            {!loading && data.length === 0 && (
              <div className="col-span-full flex justify-center py-6">
                <XIcon />
                Data Kosong
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
