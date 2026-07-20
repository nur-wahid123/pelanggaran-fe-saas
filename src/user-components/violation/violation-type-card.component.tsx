import { ViolationType, ViolationTypeDetailDto } from "@/objects/violation-type.object";
import useInfiniteScroll from "../hook/useInfiniteScroll.hook";
import ENDPOINT from "@/config/url";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Users, Hash, TrendingUp } from "lucide-react";
import { ViolationCardParameter } from "./violation-card.component";

export default function ViolationTypeCard({ filter }: ViolationCardParameter) {
    const { data, loading, ref } = useInfiniteScroll<ViolationTypeDetailDto, HTMLDivElement>({ filter, take: 20, url: ENDPOINT.MASTER_VIOLATION })
    const router = useRouter();
    return (
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {data.map((violation_type, i) => {
                const isLastItem = data.length === i + 1;

                return (
                    <Card
                        key={i}
                        ref={isLastItem ? ref : null}
                        onClick={() => router.push(`/dashboard/violation-type/${violation_type.id}`)}
                        className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50"
                    >
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {/* Header with Violation Type Name */}
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="h-12 w-12 bg-destructive/10 rounded-full flex items-center justify-center flex-shrink-0">
                                            <AlertTriangle className="h-6 w-6 text-destructive" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold break-words leading-tight" title={violation_type.name}>
                                                {violation_type.name || 'N/A'}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">Jenis Pelanggaran</p>
                                        </div>
                                    </div>
                                    <Badge variant="destructive" className="flex-shrink-0">
                                        {violation_type.total_violated} Kali
                                    </Badge>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-blue-500" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Poin</p>
                                            <p className="font-semibold">{violation_type.point} Kali</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-green-500" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Siswa Pelanggar</p>
                                            <p className="font-semibold">{violation_type.total_student} Siswa</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Info */}
                                <div className="flex items-center gap-2">
                                    <Hash className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Rata-rata per siswa</p>
                                        <p className="font-semibold">
                                            {(violation_type.total_student ?? 0) > 0 ? ((violation_type.total_violated ?? 0) / (violation_type.total_student ?? 0)).toFixed(2) : '0'} kali
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}

            {loading && (
                <Card>
                    <CardContent className="p-8">
                        <div className="flex items-center justify-center">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                                <p className="text-muted-foreground">Memuat data...</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {data.length === 0 && !loading && (
                <Card>
                    <CardContent className="p-8">
                        <div className="text-center">
                            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">
                                {filter.search === '' ? 'Tidak ada data jenis pelanggaran' : 'Data tidak ditemukan'}
                            </h3>
                            <p className="text-muted-foreground">
                                {filter.search === ''
                                    ? 'Belum ada data jenis pelanggaran untuk ditampilkan'
                                    : 'Coba ubah kata kunci pencarian atau filter tanggal'
                                }
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}