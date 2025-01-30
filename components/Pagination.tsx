"use client";

import { ITEM_PER_PAGE } from "@/constants";
import { useRouter } from "next/navigation";

type Props = {
  page: number;
  count: number;
};

const Pagination = ({ page, count }: Props) => {
  const router = useRouter();

  const changePage = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", page.toString());
    router.push(`${window.location.pathname}?${params}`);
  };

  const hasPrev = page > 1;
  const hasNext = page < (count)/ITEM_PER_PAGE;

  return (
    <div className="p-4 flex items-center justify-between text-gray-500">
      <button
        disabled={!hasPrev}
        onClick={() => changePage(page - 1)}
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Prev
      </button>
      <div className="flex items-center gap-2 text-sm">
        {Array.from({ length: Math.ceil(count / ITEM_PER_PAGE) }).map(
          (_, index) => {
            const pageIndex = index + 1;
            return (
              <button
                onClick={() => changePage(pageIndex)}
                key={pageIndex}
                className={`px-2 rounded-sm  ${
                  page === pageIndex ? "bg-lamaSky" : ""
                }`}
              >
                {pageIndex}
              </button>
            );
          }
        )}
      </div>
      <button
        disabled={!hasNext}
        onClick={() => changePage(page + 1)}
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
