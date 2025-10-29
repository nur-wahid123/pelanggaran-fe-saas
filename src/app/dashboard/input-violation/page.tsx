'use client'

import { AppContext } from "@/user-components/contexts/app.context";
import StudentAndViolationInput from "@/user-components/input-violation/student-and-violation-input"
import { setDocumentTitle } from "@/util/util";
import { useContext, useEffect } from "react";

export default function Page() {
    const { school } = useContext(AppContext);
    useEffect(()=>{
      setDocumentTitle('Catat Pelanggaran', school.name ?? "")
    },[])
    return (
        <div className="p-4 w-full">
            <h1 className="scroll-m-20 text-2xl mb-4 font-extrabold tracking-tight lg:text-5xl">
                Input Pelanggaran
            </h1>
            <StudentAndViolationInput/>
        </div>
    )
}