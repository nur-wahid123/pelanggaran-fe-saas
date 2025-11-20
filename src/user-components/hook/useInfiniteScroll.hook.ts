import { axiosInstance } from "@/util/request.util";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useRef } from "react";

interface UseInfiniteScrollParam {
  url: string;
  take: number;
  filter: object;
  /**
   * Set to `false` to disable automatic fetching.
   * @default true
   */
  enabled?: boolean;
}

interface ApiResponse<T> {
  data: T[];
  pagination?: {
    has_next_page: boolean;
    item_count: number;
  };
}

/**
 * A hook for infinite scrolling using TanStack Query.
 * @param filter - The filter object for the query. It's recommended to memoize this object to prevent unnecessary refetches.
 */
export default function useInfiniteScroll<T, T2 extends Element>({
  filter,
  take,
  url,
  enabled = true,
}: UseInfiniteScrollParam) {
  const {
    data,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: [url, filter, take],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosInstance.get<ApiResponse<T>>(url, {
        params: {
          page: pageParam,
          take,
          ...filter,
        },
      });
      return { ...res.data, currentPage: pageParam };
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination?.has_next_page) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled,
  });

  const observer = useRef<IntersectionObserver | null>(null);
  const ref = useCallback(
    (node: T2 | null) => {
      if (typeof window === "undefined") return;
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage],
  );

  const flattenedData = data?.pages.flatMap((page) => page.data) ?? [];

  return {
    data: flattenedData,
    loading: isFetching,
    hasMore: hasNextPage,
    error: isError,
    totalItems: data?.pages[0]?.pagination?.item_count ?? 0,
    ref,
    refresh: refetch,
  };
}

