import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ENDPOINT from "@/config/url";
import { Student } from "@/objects/student.object";
import { ViolationType } from "@/objects/violation-type.object";
import { axiosInstance } from "@/util/request.util";
import {
  ArrowDownSquare,
  PlusCircleIcon,
  RefreshCwIcon,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import Summary from "./summary.component";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { truncateName } from "@/util/util";
import useInfiniteScroll from "../hook/useInfiniteScroll.hook";
import SearchBar from "../ui/search-bar";
import UploadViolationImages from "../violation/upload-violation-image.component";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StudentAndViolationInput() {
  const [files, setFiles] = useState<File[]>([]);
  const [studentIds, setStudentIds] = useState<Student[]>([]);
  const [violationIds, setViolationIds] = useState<ViolationType[]>([]);
  const [search, setSearch] = useState<{ student: string; violation: string }>({
    student: "",
    violation: "",
  });
  const [note, setNote] = useState<string>("");
  const toaster = useToast();
  const divRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const divRef2 = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [dialogVisibility, setDialogVisibility] = useState(false);

  const {
    data: dataStudents,
    loading: loadingStudent,
    ref: refS,
  } = useInfiniteScroll<Student, HTMLTableRowElement>({
    filter: { search: search.student },
    take: 20,
    url: ENDPOINT.MASTER_STUDENT,
  });

  const {
    data: dataViolations,
    loading: loadingViolationTypes,
    ref: refV,
  } = useInfiniteScroll<ViolationType, HTMLTableRowElement>({
    filter: { search: search.violation },
    take: 20,
    url: ENDPOINT.MASTER_VIOLATION_TYPE,
  });

  const router = useRouter();

  const handleSubmit = async () => {
    setIsLoading(true);
    setProgress(10);

    const stdIds = studentIds.map((s) => s.id);
    const vltIds = violationIds.map((v) => v.id);

    if (stdIds.length === 0 || vltIds.length === 0) {
      toaster.toast({
        description: "Data Harus Lengkap",
        title: "Gagal",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    let imageId: number | undefined = undefined;
    if (files.length !== 0) {
      try {
        const fd = new FormData();
        files.forEach((f) => fd.append("files", f));
        const res = await axiosInstance.post(ENDPOINT.UPLOAD_IMAGE, fd, {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
            );
            setProgress(percentCompleted > 40 ? 40 : percentCompleted);
          },
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
        setDialogVisibility(false);
        return;
      } finally {
        setIsLoading(false);
        setProgress(0);
      }
    }

    const body = {
      student_ids: stdIds,
      violation_type_ids: vltIds,
      note,
      image_id: files.length === 0 ? null : imageId,
    };

    await axiosInstance
      .post(ENDPOINT.CREATE_VIOLATION, body, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted =
            (Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total ?? 0)
            ) /
              100) *
              50 +
            40;
          setProgress(percentCompleted > 90 ? 90 : percentCompleted);
        },
      })
      .then((res) => {
        toaster.toast({
          description: "Berhasil Menambahkan Data",
          title: "Sukses",
        });
        setProgress(100);
        const a = res.data.data as number;
        router.push(`/dashboard/input-violation-confirmation/${a}`);
      })
      .catch(async (e) => {
        if (imageId !== undefined) {
          await axiosInstance.delete(`${ENDPOINT.DELETE_IMAGE}/${imageId}`);
        }
        console.error(e);
        const message =
          e.response.data.message;
        toaster.toast({
          description: "Data Gagal Di Input : " + message,
          title: "Gagal",
          variant: "destructive",
        });
        setIsLoading(false);
      }).finally(()=>{
        setIsLoading(false);
        setSearch({ ...search, student: "", violation: "" });
        setProgress(0);
      });

  };

  const setVlt = (violation: ViolationType) => {
    setViolationIds(violationIds.filter((v) => v.id !== violation.id));
  };

  const setStd = (student: Student) => {
    setStudentIds(studentIds.filter((s) => s.id !== student.id));
  };

  const handleSearch = useCallback(
    (query: string) => {
      if (query !== search.student) {
        setSearch({ ...search, student: query });
      }
    },
    [search]
  );

  const handleSearchVi = useCallback(
    (query: string) => {
      if (query !== search.violation) {
        setSearch({ ...search, violation: query });
      }
    },
    [search]
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Student and Violation Selection */}
      <div className="w-full grid grid-cols-1 grid-rows-2 lg:grid-cols-2 lg:grid-rows-1 gap-6">
        {/* Student Selection */}
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <SearchBar text="Cari Siswa..." onSearch={handleSearch} />
            <Button
              type="button"
              size="sm"
              className="md:hidden"
              variant="outline"
              onClick={() =>
                divRef.current?.scrollIntoView({ behavior: "smooth" })
              }
              title="Scroll ke Pelanggaran"
            >
              <ArrowDownSquare className="mr-2" /> Lihat Pelanggaran
            </Button>
          </div>
          <div className="w-full h-full max-h-96 overflow-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Siswa</TableHead>
                  <TableHead>NIS</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataStudents.map((student, i) => (
                  <TableRow
                    ref={dataStudents.length === i + 1 ? refS : null}
                    key={student.id}
                  >
                    <TableCell>
                      <div className="text-lg font-semibold">
                        {student.name?.toUpperCase()}
                      </div>
                      <p className="text-sm text-gray-500">
                        {student.national_student_id}
                      </p>
                    </TableCell>
                    <TableCell>{student.school_student_id}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        disabled={studentIds.some((s) => s.id === student.id)}
                        onClick={() => setStudentIds([...studentIds, student])}
                        className="btn hidden md:flex btn-primary"
                        variant="default"
                      >
                        <PlusCircleIcon className="mr-2" /> Tambahkan Siswa
                      </Button>
                      <Button
                        size="sm"
                        disabled={studentIds.some((s) => s.id === student.id)}
                        onClick={() => setStudentIds([...studentIds, student])}
                        className="btn md:hidden btn-primary"
                        variant="default"
                        aria-label="Tambahkan Siswa"
                      >
                        <PlusCircleIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {loadingStudent && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      <Loader2 className="animate-spin inline mr-2" /> Memuat...
                    </TableCell>
                  </TableRow>
                )}
                {!loadingStudent && dataStudents.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center text-gray-500"
                    >
                      {search.student === ""
                        ? "Data Siswa Kosong"
                        : "Siswa Tidak Ditemukan"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        {/* Violation Selection */}
        <div className="w-full flex flex-col gap-4">
          <div ref={divRef} className="flex flex-col gap-3">
            <SearchBar text="Cari Pelanggaran..." onSearch={handleSearchVi} />
            <Button
              size="sm"
              className="md:hidden"
              type="button"
              variant="outline"
              onClick={() =>
                divRef2.current?.scrollIntoView({ behavior: "smooth" })
              }
              title="Scroll ke Detail"
            >
              <ArrowDownSquare className="mr-2" /> Lihat Detail
            </Button>
          </div>
          <div className="w-full h-full max-h-96 overflow-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Pelanggaran</TableHead>
                  <TableHead>Poin</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataViolations.map((violation, i) => (
                  <TableRow
                    ref={dataViolations.length === i + 1 ? refV : null}
                    key={violation.id}
                  >
                    <TableCell>
                      <div>{violation.name}</div>
                    </TableCell>
                    <TableCell>{violation.point}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        disabled={violationIds.some(
                          (v) => v.id === violation.id
                        )}
                        onClick={() =>
                          setViolationIds([...violationIds, violation])
                        }
                        className="btn hidden md:flex btn-primary"
                        variant="default"
                      >
                        <PlusCircleIcon className="mr-2" /> Tambahkan
                        Pelanggaran
                      </Button>
                      <Button
                        size="sm"
                        disabled={violationIds.some(
                          (v) => v.id === violation.id
                        )}
                        onClick={() =>
                          setViolationIds([...violationIds, violation])
                        }
                        className="btn md:hidden btn-primary"
                        variant="default"
                        aria-label="Tambahkan Pelanggaran"
                      >
                        <PlusCircleIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {loadingViolationTypes && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      <Loader2 className="animate-spin inline mr-2" /> Memuat...
                    </TableCell>
                  </TableRow>
                )}
                {!loadingViolationTypes && dataViolations.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center text-gray-500"
                    >
                      {search.violation === ""
                        ? "Data Pelanggaran Kosong"
                        : "Pelanggaran Tidak Ditemukan"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Detail Section */}
      <div className="flex flex-col min-h-56 flex-grow w-full">
        <div ref={divRef2} className="flex gap-4 items-center mb-2">
          <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-5xl">
            Detail Pelanggaran
          </h1>
          <Button
            variant="outline"
            size="icon"
            title="Reset Pilihan"
            onClick={() => {
              setStudentIds([]);
              setViolationIds([]);
            }}
          >
            <RefreshCwIcon />
          </Button>
        </div>
        <Summary
          students={studentIds}
          violations={violationIds}
          setStudentIds={setStd}
          setViolationIds={setVlt}
        />
      </div>

      {/* Upload Images */}
      <UploadViolationImages files={files} setFiles={setFiles} />

      {/* Submit Button and Dialog */}
      <div className="flex w-full">
        <Button
          className="w-full"
          onClick={() => {
            const stdIds = studentIds.map((s) => s.id);
            const vltIds = violationIds.map((v) => v.id);
            if (stdIds.length === 0 || vltIds.length === 0) {
              toaster.toast({
                description: "Data Harus Lengkap",
                title: "Gagal",
                variant: "destructive",
              });
              return;
            }
            setDialogVisibility(true);
          }}
          variant="default"
        >
          <PlusCircleIcon className="mr-2" /> Tambahkan Pelanggaran
        </Button>
        {/* 
          Please import the following if not already:
          import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
        */}
        <Dialog open={dialogVisibility} onOpenChange={setDialogVisibility}>
          <DialogContent className="max-w-3xl w-full text-black p-0 sm:p-0">
            <DialogHeader>
              <DialogTitle>
                <div className="flex p-6 items-center gap-2">
                  <CheckCircle2 className="text-green-600" />
                  Konfirmasi Data
                </div>
              </DialogTitle>
              <DialogDescription asChild>
                <div className="w-full flex flex-col gap-6 p-4 sm:p-6">
                  {/* Responsive grid: stack on mobile, side by side on desktop */}
                  <div className="flex flex-col gap-6 md:flex-row md:gap-8">
                    {/* Student Card */}
                    <Card className="w-full md:w-1/2 bg-muted rounded-lg shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-center text-base md:text-lg font-semibold">
                          Nama Siswa
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="flex flex-col gap-2 max-h-52 overflow-y-auto px-2 pb-4">
                          {studentIds.length === 0 ? (
                            <div className="text-center text-muted-foreground text-sm py-4">
                              Belum ada siswa dipilih
                            </div>
                          ) : (
                            <ul className="flex flex-col gap-2">
                              {studentIds.map((student) => (
                                <li
                                  key={student.id}
                                  className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 px-2 py-2 rounded hover:bg-accent transition"
                                >
                                  <span className="truncate font-medium text-sm sm:text-base">
                                    {truncateName(
                                      student.name?.toUpperCase() ?? "",
                                      30
                                    )}
                                  </span>
                                  <span className="text-slate-400 text-xs sm:text-sm truncate sm:ml-2">
                                    {student.national_student_id && (
                                      <>NISN: {student.national_student_id}</>
                                    )}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    {/* Violation Card */}
                    <Card className="w-full md:w-1/2 bg-muted rounded-lg shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-center text-base md:text-lg font-semibold">
                          Daftar Pelanggaran
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="flex flex-col gap-2 max-h-52 overflow-y-auto px-2 pb-4">
                          {violationIds.length === 0 ? (
                            <div className="text-center text-muted-foreground text-sm py-4">
                              Belum ada pelanggaran dipilih
                            </div>
                          ) : (
                            <ul className="flex flex-col gap-2">
                              {violationIds.map((violation) => (
                                <li
                                  key={violation.id}
                                  className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 px-2 py-2 rounded hover:bg-accent transition"
                                >
                                  <span className="font-medium text-sm sm:text-base truncate flex-1">
                                    {violation.name}
                                  </span>
                                  <span className="text-xs sm:text-sm text-muted-foreground sm:text-center">
                                    {violation.point} Poin
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        {violationIds.length > 0 && (
                          <div className="flex flex-row justify-between items-center font-semibold mt-2 border-t pt-2 border-slate-200 px-2 text-sm sm:text-base">
                            <span>Total</span>
                            <span>
                              {violationIds.reduce(
                                (acc, curr) => acc + curr.point,
                                0
                              )}{" "}
                              Poin
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                  {/* Note */}
                  <div className="flex flex-col gap-2 text-black">
                    <div className="font-semibold">Catatan</div>
                    <Textarea
                      disabled={isLoading}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Tambahkan catatan jika diperlukan..."
                      className="resize-none min-h-[60px] sm:min-h-[80px]"
                    />
                  </div>
                  {/* Actions */}
                  <div className="flex flex-col-reverse sm:flex-row gap-3 justify-center items-stretch sm:items-center">
                    <Button
                      disabled={isLoading}
                      variant="outline"
                      onClick={() => setDialogVisibility(false)}
                      className="w-full sm:w-auto"
                    >
                      <XCircle className="mr-2" /> Batal
                    </Button>
                    <Button
                      disabled={isLoading}
                      onClick={handleSubmit}
                      variant="default"
                      className="w-full sm:w-auto"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="animate-spin mr-2" /> Memproses...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="mr-2" /> Tambahkan
                        </>
                      )}
                    </Button>
                    {progress !== 0 && (
                      <div className="flex items-center w-full sm:w-1/3">
                        <Progress value={progress} className="w-full" />
                      </div>
                    )}
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
