"use client";
import ENDPOINT from "@/config/url";
import { LogObject } from "@/objects/logger.object";
import useInfiniteScroll from "@/user-components/hook/useInfiniteScroll.hook";
import { formatDateToExactStringAndTime } from "@/util/date.util";
import { LucideLoaderPinwheel } from "lucide-react";

export default function Page() {
  const { data, ref, loading } = useInfiniteScroll<LogObject, HTMLDivElement>({
    filter: {},
    take: 20,
    url: ENDPOINT.GET_USER_LOGS,
  });
  return (
    <div className="p-4 h-full">
      <h1 className="scroll-m-20 text-2xl mb-4 font-extrabold tracking-tight lg:text-5xl">
        Log User
      </h1>
      <div className="overflow-y-auto flex md:max-h-[48rem] max-h-[32rem] border-y-2 py-2 flex-col gap-2">
        {data.map((log, i) => (
          <div
            key={i}
            ref={data.length === i + 1 ? ref : null}
            className="border rounded-md px-4 py-3 bg-card text-card-foreground shadow-sm flex flex-col sm:flex-row sm:items-center justify-between"
          >
            <div className="flex-1">
              <span className="font-medium">{log.message}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-2 sm:mt-0 sm:ml-4 whitespace-nowrap">
              {formatDateToExactStringAndTime(new Date(log.date))}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center justify-center p-4">
            <LucideLoaderPinwheel className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        {!loading && data.length === 0 && (
          <div className="text-center text-muted-foreground p-6">
            Data Kosong
          </div>
        )}
      </div>
    </div>
  );
}
