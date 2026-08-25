"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const handlePageClick = (page: number) => {
    if (onPageChange && page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-10 mb-14">
      {/* First Page */}
      {currentPage > 2 && (
        <button
          onClick={() => handlePageClick(1)}
          aria-label="Trang đầu"
          className="h-9 sm:h-10 px-2.5 sm:px-3 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-[#ffd875] hover:text-black hover:border-[#ffd875] text-white/70 transition-all text-xs font-bold"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
      )}

      {/* Previous Page */}
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Trang trước"
        className="h-9 sm:h-10 px-2.5 sm:px-3 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-[#ffd875] hover:text-black hover:border-[#ffd875] text-white/70 transition-all disabled:opacity-30 disabled:pointer-events-none text-xs font-bold"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Leading Ellipsis */}
      {pages.length > 0 && (pages[0] ?? 0) > 1 && (
        <>
          <button
            onClick={() => handlePageClick(1)}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 transition-all text-xs sm:text-sm font-bold"
          >
            1
          </button>
          {(pages[0] ?? 0) > 2 && (
            <span className="text-white/30 px-1 text-xs">...</span>
          )}
        </>
      )}

      {/* Page Numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => handlePageClick(page)}
          className={`
            w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl border transition-all text-xs sm:text-sm font-black
            ${
              currentPage === page
                ? "bg-[#ffd875] text-black border-[#ffd875] shadow-[0_0_15px_rgba(255,216,117,0.35)] scale-105"
                : "bg-white/5 border-white/10 hover:bg-white/10 hover:text-white text-white/70"
            }
          `}
        >
          {page}
        </button>
      ))}

      {/* Trailing Ellipsis */}
      {pages.length > 0 && (pages[pages.length - 1] ?? 0) < totalPages && (
        <>
          {(pages[pages.length - 1] ?? 0) < totalPages - 1 && (
            <span className="text-white/30 px-1 text-xs">...</span>
          )}
          <button
            onClick={() => handlePageClick(totalPages)}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 transition-all text-xs sm:text-sm font-bold"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next Page */}
      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Trang sau"
        className="h-9 sm:h-10 px-2.5 sm:px-3 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-[#ffd875] hover:text-black hover:border-[#ffd875] text-white/70 transition-all disabled:opacity-30 disabled:pointer-events-none text-xs font-bold"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Last Page */}
      {currentPage < totalPages - 1 && (
        <button
          onClick={() => handlePageClick(totalPages)}
          aria-label="Trang cuối"
          className="h-9 sm:h-10 px-2.5 sm:px-3 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-[#ffd875] hover:text-black hover:border-[#ffd875] text-white/70 transition-all text-xs font-bold"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
