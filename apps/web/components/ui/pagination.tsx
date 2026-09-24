'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = (): (number | '...')[] => {
    const pages: (number | '...')[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    if (currentPage > 3) pages.push('...');

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push('...');

    pages.push(totalPages);

    return pages;
  };

  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1A2332]/10 text-[#1A2332]/40 transition-all duration-200 hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-[#1A2332]/10 disabled:hover:text-[#1A2332]/40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Pages */}
      {getPageNumbers().map((page, i) =>
        page === '...' ? (
          <span
            key={`dots-${i}`}
            className="flex h-9 w-9 items-center justify-center text-[#1A2332]/30"
          >
            <MoreHorizontal className="h-4 w-4" />
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 ${
              currentPage === page
                ? 'bg-[#1A2332] text-white shadow-lg shadow-[#1A2332]/20'
                : 'border border-[#1A2332]/10 text-[#1A2332]/60 hover:border-primary/30 hover:text-primary'
            }`}
          >
            {page}
          </button>
        ),
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1A2332]/10 text-[#1A2332]/40 transition-all duration-200 hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-[#1A2332]/10 disabled:hover:text-[#1A2332]/40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export function usePagination<T>(items: T[], itemsPerPage: number) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    totalItems: items.length,
  };
}
