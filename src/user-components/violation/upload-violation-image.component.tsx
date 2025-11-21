'use client'
import { Button } from "@/components/ui/button";
import { convertHeic } from "@/util/util";
import { Trash } from "lucide-react";
import { useRef, useState } from "react";

export default function UploadViolationImages({ files, setFiles }: { files: File[], setFiles: React.Dispatch<React.SetStateAction<File[]>> }) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const fileInputRef2 = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState(false)
    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-rows-2 md:grid-rows-1 gap-3">
                <Button
                    type="button"
                    disabled={loading}
                    onClick={() => fileInputRef.current?.click()}
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                              />
                            </svg>
                            Memuat...
                        </span>
                    ) : (
                        "Pilih Gambar Dari File"
                    )}
                </Button>
                <Button
                    disabled={loading}
                    type="button"
                    onClick={() => fileInputRef2.current?.click()}
                    className="md:hidden"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                              />
                            </svg>
                            Memuat...
                        </span>
                    ) : (
                        "Buka Kamera"
                    )}
                </Button>
            </div>
            <input
                ref={fileInputRef}
                accept="image/*,.heic"
                type="file"
                multiple
                className="hidden"
                onChange={async (e) => {
                    setLoading(true)
                    if (!e.target.files) return

                    const selectedFiles = Array.from(e.target.files)

                    const processedFiles = await Promise.all(
                        selectedFiles.map(async (file) => {
                            const ext = file.name.split('.').pop()?.toLowerCase()
                            if (ext === "heic") {
                                return await convertHeic(file).then((a) => {
                                    return a
                                })
                            }
                            return file
                        })
                    )
                    setLoading(false)

                    setFiles((prev) => [...prev, ...processedFiles])
                    e.target.value = ""
                }}
            />

            <input
                ref={fileInputRef2}
                accept="image/*,.heic"
                type="file"
                multiple
                capture="environment"
                className="hidden"
                onChange={async (e) => {
                    setLoading(true)
                    if (!e.target.files) return

                    const selectedFiles = Array.from(e.target.files)

                    const processedFiles = await Promise.all(
                        selectedFiles.map(async (file) => {
                            const ext = file.name.split('.').pop()?.toLowerCase()
                            if (ext === "heic") {
                                return await convertHeic(file).then((a) => {
                                    setLoading(false)
                                    return a
                                })
                            }
                            return file
                        })
                    )

                    setFiles((prev) => [...prev, ...processedFiles])
                    e.target.value = ""
                }}
            />

            {files.length > 0 &&
                <div className="border flex flex-wrap gap-4 border-slate-300 p-4 rounded-sm">
                    {files.map((file) => {
                        const ext = file.name.split('.').pop()?.toLowerCase();
                        const isHeic = ext === "heic";
                        return (
                            <div key={file.name} className="w-1/4 p-2 flex flex-col justify-center border border-slate-300 rounded hover:scale-[99%]">
                                {isHeic ? (
                                    <div className="w-full h-32 bg-gray-100 flex flex-col items-center justify-center">
                                        <span className="block text-gray-700 text-sm mb-1">HEIC</span>
                                        <span className="block text-gray-400 text-xs">Preview not supported</span>
                                    </div>
                                ) : (
                                    <img className="w-full h-auto" src={URL.createObjectURL(file)} alt={file.name} />
                                )}
                                <p className="text-center text-sm ">
                                    {file.name.length > 20 ? (
                                        <>{file.name.slice(0, 8)}...{file.name.split('.').pop()}</>
                                    ) : (
                                        file.name
                                    )}
                                </p>
                                <Button type="button" onClick={() => setFiles(files.filter((f) => f.name !== file.name))}><Trash /></Button>
                            </div>
                        );
                    })}
                </div>
            }
        </div>
    )
}