import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrashIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { axiosInstance } from "@/util/request.util";
import ENDPOINT from "@/config/url";
import { timeAgo } from "@/util/date.util";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ExportViolationResponseDto } from "@/objects/export-violation.dto";

export default function DeleteAllViolations() {
  const [open, setOpen] = useState(false);
  const [isSure, setIsSure] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const toaster = useToast();

  const [data, setData] = useState<ExportViolationResponseDto>({
    date: new Date(),
    user: { id: 0, name: "" },
  });

  const handleDelete = useCallback(async () => {
    await axiosInstance
      .delete(ENDPOINT.DELETE_VIOLATION_ALL)
      .then(() => {
        toaster.toast({
          title: "Sukses",
          description: "Seluruh data pelanggaran berhasil dihapus.",
          variant: "default",
        });
        setOpen(false);
        setConfirm(false)
        setIsSure(false)
        setConfirmText("")
      })
      .catch((e) => {
        console.error(e);
        toaster.toast({
          title: "Gagal",
          description: "Gagal menghapus seluruh data pelanggaran.",
          variant: "destructive",
        });
      });
  }, []);

  useEffect(() => {
    if (confirmText === "hapuspelanggaran") {
      setConfirm(true);
    } else {
      setConfirm(false);
    }
  }, [confirmText]);

  const fetchData = useCallback(async () => {
    await axiosInstance.get(ENDPOINT.GET_EXPORT_VIOLATION).then((res) => {
      setData(res.data.data);
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [open]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          <span>Hapus Seluruh Data Pelanggaran</span>
          <TrashIcon className="w-4 h-4 text-primary/70" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="mt-2">
              Hapusss <TrashIcon className="ml-2" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Hapus Pelanggaran</DialogTitle>
              <DialogDescription asChild>
                <div className="flex flex-col gap-4">
                  <p>
                    Apakah Anda yakin ingin menghapus{" "}
                    <b>seluruh data pelanggaran</b>? Tindakan ini{" "}
                    <b>tidak dapat dibatalkan</b> dan{" "}
                    <b>data tidak bisa dipulihkan</b>. Mohon pastikan Anda telah
                    melakukan backup data sebelumnya.
                  </p>
                  <p>
                    <span className="font-semibold">Backup terakhir:</span>{" "}
                    {data.date
                      ? `${timeAgo(new Date(data.date ?? new Date()))} oleh ${data.user?.name || "Tidak diketahui"}`
                      : "Belum pernah backup"}
                  </p>
                  {!isSure && (
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setOpen(false)}>
                        Batal
                      </Button>
                      <Button
                        disabled={data.date === null}
                        variant="destructive"
                        onClick={() => {
                          setIsSure(true);
                          // lanjutkan proses hapus jika diperlukan
                        }}
                      >
                        {data.date === null
                          ? "Silahkan Lakukan Backup Terlebih Dahulu"
                          : "Yakin, Hapus Data"}
                      </Button>
                    </div>
                  )}
                  {isSure && (
                    <div className="flex flex-col gap-2">
                      <div>
                        Tulis <b>hapuspelanggaran</b> untuk melanjutkan
                      </div>
                      <Input
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                      />
                      <Button disabled={!confirm} onClick={handleDelete}>
                        Hapus Seluruh Pelanggaran
                      </Button>
                    </div>
                  )}
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
