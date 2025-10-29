import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, Plus, RefreshCcwDotIcon } from "lucide-react"
import ExcelJS, { CellValue } from "exceljs";
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { axiosInstance } from "@/util/request.util"
import ENDPOINT from "@/config/url"

export class ViolationTypeCreateDto {
    public name?: string;
    public point?: number;
}

const BATCH_SIZE = 200;

export default function ImportViolationType({ reFetch }: { reFetch: () => void }) {
    const [fileData, setFileData] = useState<ViolationTypeCreateDto[]>([]);
    const [chunks, setChunks] = useState<ViolationTypeCreateDto[][]>([]);
    const [successChunks, setSuccessChunks] = useState<number[]>([]);
    const [successCount, setSuccessCount] = useState<number>(0);
    const [bool, setBool] = useState({ loading: false, dialog: false });
    const toaster = useToast();

    // Read and parse Excel file
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target?.files;
        if (!selectedFiles || selectedFiles.length === 0) return;

        const reader = new FileReader();
        reader.readAsArrayBuffer(selectedFiles[0]);
        reader.onload = async (e) => {
            if (!e.target) return;
            const buffer = e.target.result as ArrayBuffer;
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(buffer);
            const worksheet = workbook.getWorksheet(1);
            if (!worksheet) {
                toaster.toast({
                    title: "Error",
                    description: "Worksheet tidak ditemukan",
                    variant: "destructive"
                });
                return;
            }
            let rowKey: CellValue[] = [];
            const rows: ViolationTypeCreateDto[] = [];
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) {
                    const rowData = row.values;
                    rowKey = Object.values(rowData);
                    rowKey.unshift('oi');
                }
                if (rowNumber > 1) {
                    const item = new ViolationTypeCreateDto();
                    const rowData = row.values;
                    if (Array.isArray(rowData) && rowData.length > 0) {
                        item.name = rowData[rowKey.indexOf('Nama')] as string;
                        item.point = Number(rowData[rowKey.indexOf('Poin')]);
                    }
                    if (item.name && !isNaN(item.point as number)) {
                        rows.push(item);
                    }
                }
            });
            setFileData(rows);
            const chunked = chunkArray(rows, BATCH_SIZE);
            setChunks(chunked);
            setSuccessChunks([]);
            setSuccessCount(0);
        };
    };

    // Utility to chunk array
    function chunkArray<T>(array: T[], chunkSize: number): T[][] {
        const results: T[][] = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            results.push(array.slice(i, i + chunkSize));
        }
        return results;
    }

    // Download Excel template
    async function handleDownloadTemplate() {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Template Jenis Pelanggaran');
        worksheet.columns = [
            { header: 'Nama', width: 40 },
            { header: 'Poin', width: 8 },
        ];
        worksheet.getRow(1).eachCell((cell) => {
            cell.protection = { locked: true };
        });
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Template Jenis Pelanggaran.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Send a single batch
    async function sendBatch(chunk: ViolationTypeCreateDto[], index: number) {
        setBool(b => ({ ...b, loading: true }));
        try {
            const res = await axiosInstance.post(`${ENDPOINT.CREATE_VIOLATION_TYPE_BATCH}`, { items: chunk });
            if (res.data.code === 400) {
                throw res.data;
            }
            toaster.toast({
                title: `Batch ${index + 1} berhasil`,
                description: `Berhasil memasukkan ${chunk.length} Jenis Pelanggaran`
            });
            setSuccessChunks(prev => [...prev, index]);
            setSuccessCount(prev => prev + chunk.length);
            reFetch();
        } catch (error: any) {
            let errMsg = error?.response?.data?.message;
            if (Array.isArray(errMsg)) errMsg = errMsg[0];
            toaster.toast({
                title: "Gagal Memasukkan Batch",
                variant: "destructive",
                description: `Batch ${index + 1} gagal: ${errMsg || "Unknown error"}`
            });
        } finally {
            setBool(b => ({ ...b, loading: false }));
        }
    }

    // Send all batches sequentially
    async function sendAllBatches() {
        setBool(b => ({ ...b, loading: true }));
        let totalSuccess = 0;
        const failedBatches: number[] = [];
        for (let i = 0; i < chunks.length; i++) {
            try {
                const res = await axiosInstance.post(`${ENDPOINT.CREATE_VIOLATION_TYPE_BATCH}`, { items: chunks[i] });
                if (res.data.code === 400) throw res.data;
                setSuccessChunks(prev => [...prev, i]);
                totalSuccess += chunks[i].length;
                reFetch();
            } catch (error: any) {
                failedBatches.push(i + 1);
                let errMsg = error?.response?.data?.message;
                if (Array.isArray(errMsg)) errMsg = errMsg[0];
                toaster.toast({
                    title: `Batch ${i + 1} gagal`,
                    variant: "destructive",
                    description: errMsg || "Unknown error"
                });
            }
        }
        setSuccessCount(totalSuccess);
        if (failedBatches.length === 0) {
            toaster.toast({
                title: "Sukses",
                description: "Semua batch berhasil diimport"
            });
        } else {
            toaster.toast({
                title: "Sebagian batch gagal",
                description: `Batch gagal: ${failedBatches.join(", ")}`
            });
        }
        setBool(b => ({ ...b, loading: false }));
    }

    // Reset all state
    function handleReset() {
        setFileData([]);
        setChunks([]);
        setSuccessChunks([]);
        setSuccessCount(0);
        setBool(b => ({ ...b, loading: false }));
    }

    return (
        <Dialog open={bool.dialog} onOpenChange={a => setBool({ ...bool, dialog: a })}>
            <DialogTrigger asChild>
                <Button>
                    <Plus /> Import Excel
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Import Jenis Pelanggaran</DialogTitle>
                    <DialogDescription asChild>
                        <div style={{ height: "60vh" }} className="flex flex-col overflow-auto gap-3">
                            <Label className="label">
                                Masukkan Daftar Jenis Pelanggaran
                            </Label>
                            <Button onClick={handleDownloadTemplate}>
                                Download Template <Download />
                            </Button>
                            <Input
                                type="file"
                                name="file"
                                accept=".xls,.xlsx"
                                className="file-input file-input-bordered"
                                id="file"
                                onChange={handleFileChange}
                            />
                            <p>Berhasil membaca {fileData.length} data jenis pelanggaran</p>
                            <Button
                                type="button"
                                onClick={() => {
                                    if (fileData.length === 0) {
                                        toaster.toast({
                                            title: "Tidak ada data",
                                            description: "Silakan upload file terlebih dahulu",
                                            variant: "destructive"
                                        });
                                        return;
                                    }
                                    const chunked = chunkArray(fileData, BATCH_SIZE);
                                    setChunks(chunked);
                                    setSuccessChunks([]);
                                    setSuccessCount(0);
                                    toaster.toast({
                                        title: "Data dipisahkan",
                                        description: `${chunked.length} batch siap diimport`
                                    });
                                }}
                            >
                                Pisahkan data (Batch {BATCH_SIZE})
                            </Button>
                            <div className="flex w-full justify-between items-center">
                                <Label>Berhasil Memasukkan {successCount} data</Label>
                                <Button onClick={handleReset}><RefreshCcwDotIcon /></Button>
                            </div>
                            <div className="flex w-full flex-wrap gap-3">
                                {chunks.length > 0 && (
                                    <Button
                                        disabled={bool.loading}
                                        className="btn"
                                        onClick={sendAllBatches}
                                    >
                                        Import Semua Batch
                                    </Button>
                                )}
                                {chunks.map((chunk, index) => (
                                    <div key={index}>
                                        <Button
                                            disabled={bool.loading || successChunks.includes(index)}
                                            className="btn"
                                            onClick={() => sendBatch(chunk, index)}
                                        >
                                            Import batch ke-{index + 1} ({chunk.length} data)
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}