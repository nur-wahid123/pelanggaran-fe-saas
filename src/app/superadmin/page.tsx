'use client'
import Link from "next/link";
import {
    SchoolIcon,
    UsersIcon,
    GraduationCapIcon, CalendarMinus2Icon, CalendarPlus2Icon
} from "lucide-react";
import {useCallback, useEffect, useState} from "react";
import {SuperadminDashboardDataObject} from "@/objects/superadmin-dashboard-data.object";
import {axiosInstance} from "@/util/request.util";
import ENDPOINT from "@/config/url";
import {StatsObject} from "@/objects/stats.object";


export default function page() {

    const [data, setData] = useState<SuperadminDashboardDataObject>({
        total_active_school: 0,
        total_inactive_school: 0,
        total_violations: 0,
        total_users: 0,
        total_students: 0,
        most_violation_school: {
            id: 0,
            name: "",
            violationCount: 0,
        },
        violations_this_month: 0,
        violations_last_month: 0,
    })

    const [stats, setStats] = useState<StatsObject[]>([]);

    useEffect(() => {
        if (!data) return;
        const total_active_school = new StatsObject('Total Sekolah Aktif', data.total_active_school ?? 0,
            <SchoolIcon/>, '/superadmin/school', 'Lihat Sekolah');
        const total_inactive_school = new StatsObject('Total Sekolah Non-Aktif', data.total_inactive_school ?? 0,
            <SchoolIcon/>, '/superadmin/school', 'Lihat Sekolah');
        const total_users = new StatsObject('Total Pengguna', data.total_users ?? 0,
            <UsersIcon/>, '#', '');
        const total_students = new StatsObject('Total Siswa', data.total_students ?? 0,
            <GraduationCapIcon/>, '#', '');
        const most_violation_school = new StatsObject('Sekolah dengan Pelanggaran terbanyak', data.most_violation_school?.name ?? "",
            <SchoolIcon/>, `/superadmin/school/${data.most_violation_school?.id}`, 'Lihat Sekolah');
        const violations_last_month = new StatsObject('Pelanggaran Bulan Lalu', data.violations_last_month ?? 0,
            <CalendarMinus2Icon/>, '#', '');
        const violations_this_month = new StatsObject('Pelanggaran Bulan Ini', data.violations_this_month ?? 0,
            <CalendarPlus2Icon/>, '#', '');
        const st = []
        st.push(most_violation_school)
            st.push(total_active_school)
            st.push(total_inactive_school)
            st.push(total_users)
            st.push(total_students)
            st.push(violations_last_month)
            st.push(violations_this_month)
        setStats(st)
    }, [data]);

    const fetchData = useCallback(async ()=>{
        await axiosInstance.get(ENDPOINT.SUPERADMIN_DASHBOARD_DATA).then((res)=>{
            setData(res.data.data);
        })
    },[setData])

    useEffect(() => {
        fetchData()
    }, []);

    return (
        <div className="min-h-[80vh] bg-gradient-to-br from-blue-50 via-white to-violet-50 py-8 px-4 md:px-12">
            <h1 className="text-3xl font-bold mb-8 tracking-tight text-blue-900">Superadmin Dashboard</h1>
            {(() => {
                // Split into rows by 3, but handle the last row responsively
                const rows = [];
                const perRow = 3;
                const count = stats.length;
                let i = 0;
                let isFirstRow = true
                while (i < count) {
                    if (count % perRow === 1 && isFirstRow) {
                        // One left, full width row
                        rows.push(
                            <div key={`row-${i}`} className="mb-8 grid grid-cols-1 gap-6">
                                <div
                                    className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center gap-3 hover:shadow-lg transition-shadow"
                                >
                                    <div>{stats[i].icon}</div>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {stats[i].value}
                                    </div>
                                    <div className="text-sm text-gray-500">{stats[i].label}</div>
                                    {stats[i].link && (
                                        <Link
                                            href={stats[i].link ?? ""}
                                            className="mt-2 text-blue-600 hover:underline text-xs"
                                        >
                                            {stats[i].linkLabel}
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                        i += 1;
                        isFirstRow = false
                    } else if (count % perRow === 2 && isFirstRow) {
                        // Two left, two columns row
                        rows.push(
                            <div key={`row-${i}`} className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[0, 1].map(j => (
                                    <div
                                        key={i + j}
                                        className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center gap-3 hover:shadow-lg transition-shadow"
                                    >
                                        <div>{stats[i + j].icon}</div>
                                        <div className="text-2xl font-bold text-gray-900">
                                            {stats[i + j].value}
                                        </div>
                                        <div className="text-sm text-gray-500">{stats[i + j].label}</div>
                                        {stats[i + j].link && (
                                            <Link
                                                href={stats[i + j].link ?? ""}
                                                className="mt-2 text-blue-600 hover:underline text-xs"
                                            >
                                                {stats[i + j].linkLabel}
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </div>
                        );
                        i += 2;
                        isFirstRow = false
                    } else {
                        // Three per row default
                        rows.push(
                            <div key={`row-${i}`} className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[0, 1, 2].map(j => (
                                    <div
                                        key={i + j}
                                        className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center gap-3 hover:shadow-lg transition-shadow"
                                    >
                                        <div>{stats[i + j].icon}</div>
                                        <div className="text-2xl font-bold text-gray-900">
                                            {stats[i + j].value}
                                        </div>
                                        <div className="text-sm text-gray-500">{stats[i + j].label}</div>
                                        {stats[i + j].link && (
                                            <Link
                                                href={stats[i + j].link ?? ""}
                                                className="mt-2 text-blue-600 hover:underline text-xs"
                                            >
                                                {stats[i + j].linkLabel}
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </div>
                        );
                        i += 3;
                    }
                }
                return rows;
            })()}
        </div>
    );
}
