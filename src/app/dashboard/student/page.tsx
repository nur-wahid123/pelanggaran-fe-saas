"use client";
import { Button } from "@/components/ui/button";
import ENDPOINT from "@/config/url";
import { Student } from "@/objects/student.object";
import StudentFilterComponent from "@/user-components/student/student-filter.component";
import ImportStudent from "@/user-components/student/student-import.component";
import SearchBar from "@/user-components/ui/search-bar";
import { Download } from "lucide-react";
import ExcelJS from "exceljs";
import { useContext, useEffect, useState } from "react";
import StudentCard from "@/user-components/student/student-card.component";
import AddStudent from "@/user-components/student/add-student.component";
import useInfiniteScroll from "@/user-components/hook/useInfiniteScroll.hook";
import { AppContext } from "@/user-components/contexts/app.context";
import { setDocumentTitle } from "@/util/util";

export interface StudentFilterType {
  classId?: number;
  search: string;
}

export default function Page() {
  const { school } = useContext(AppContext);
  useEffect(()=>{
    setDocumentTitle('Siswa', school.name ?? "")
  },[])
  const [filter, setFilter] = useState<StudentFilterType>({
    classId: undefined,
    search: "",
  });
  const {
    data: stData,
    loading,
    ref,
    refresh,
  } = useInfiniteScroll<Student, HTMLDivElement>({
    filter,
    take: 20,
    url: ENDPOINT.MASTER_STUDENT,
  });
  async function handleDownload() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Template Input Siswa");
    worksheet.columns = [
      { header: "Nama", width: 40 },
      { header: "NISN", width: 20 },
      { header: "NIS", width: 8 },
      { header: "Kelas", width: 8 },
    ];

    worksheet.getRow(1).eachCell((cell) => {
      cell.protection = { locked: true }; // Lock the header cells
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Template Input Siswa.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleSearch(query: string) {
    if (query !== filter.search) {
      setFilter((prev) => ({ ...prev, search: query }));
    }
  }

  return (
    <div className="p-4 h-full">
      <h1 className="scroll-m-20 text-2xl mb-4 font-extrabold tracking-tight lg:text-5xl">
        Siswa
      </h1>
      {/* Responsive horizontal scroll for header controls */}
      <div className="w-full">
        <div className="flex flex-row flex-wrap gap-4 items-stretch my-4">
          <div className="flex-grow min-w-[220px]">
            <SearchBar onSearch={handleSearch} />
          </div>
          <div className="flex-grow min-w-[220px]">
            <StudentFilterComponent filter={filter} setFilter={setFilter} />
          </div>
          <div className="flex-grow min-w-[220px]">
            <Button className="w-full" onClick={handleDownload}>
              Download template <Download />
            </Button>
          </div>
          <div className="flex-grow min-w-[220px]">
            <ImportStudent reFetch={refresh} />
          </div>
          <div className="flex-grow min-w-[220px]">
            <AddStudent refresh={refresh} />
          </div>
        </div>
      </div>
      <div className="max-h-[40rem] w-full flex flex-col gap-2 overflow-y-auto">
        {stData.map((student, i) => (
          <StudentCard
            isLoading={loading}
            student={student}
            ref={stData.length === i + 1 ? ref : null}
            key={i}
          />
        ))}
        {loading && (
          <div className="flex justify-center items-center h-full">
            Loading..
          </div>
        )}
        {stData.length === 0 && !loading && (
          <div className="flex justify-center items-center h-full">
            {filter.search !== "" ? "Data Tidak Ditemukan" : "Data Kosong"}
          </div>
        )}
      </div>
    </div>
  );
}