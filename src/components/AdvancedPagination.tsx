import React from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface AdvancedPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  language: "en" | "ar";
  itemsCount?: number;
  itemsPerPage?: number;
  className?: string;
}

export const AdvancedPagination: React.FC<AdvancedPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  language,
  itemsCount,
  itemsPerPage,
  className = "",
}) => {
  // Don't render if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(Math.max(1, currentPage - 1));
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(Math.min(totalPages, currentPage + 1));
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  // Determine which page buttons to show
  const getPageButtons = () => {
    const pages: number[] = [];
    const maxButtonsToShow = 5;

    if (totalPages <= maxButtonsToShow) {
      // Show all pages if total pages is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);

      // Calculate start and end of middle range
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the start
      if (currentPage <= 3) {
        end = Math.min(totalPages - 1, maxButtonsToShow - 1);
      }
      // Adjust if we're near the end
      else if (currentPage >= totalPages - 2) {
        start = Math.max(2, totalPages - (maxButtonsToShow - 2));
      }

      // Add ellipsis before middle range if needed
      if (start > 2) {
        pages.push(-1); // -1 represents ellipsis
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis after middle range if needed
      if (end < totalPages - 1) {
        pages.push(-1); // -1 represents ellipsis
      }

      // Show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageButtons = getPageButtons();

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Main Pagination Controls */}
      <div className="flex flex-col gap-4 p-4 bg-muted/30 rounded-lg">
        {/* Pagination Buttons */}
        <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="gap-2"
            title={language === "ar" ? "الصفحة الأولى" : "First page"}>
            {language === "ar" ? (
              <>
                الأولى
                <ChevronsRight className="h-4 w-4" />
              </>
            ) : (
              <>
                <ChevronsLeft className="h-4 w-4" />
                First
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="gap-2">
            {language === "ar" ? (
              <>
                السابق
                <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              <>
                <ArrowLeft className="h-4 w-4" />
                Previous
              </>
            )}
          </Button>

          <div className="flex gap-1 flex-wrap justify-center">
            {pageButtons.map((page, idx) => {
              if (page === -1) {
                // Ellipsis
                return (
                  <div key={`ellipsis-${idx}`} className="px-2 py-2">
                    <span className="text-muted-foreground">...</span>
                  </div>
                );
              }

              return (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageClick(page)}
                  className="h-10 w-10 p-0">
                  {page}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="gap-2">
            {language === "ar" ? (
              <>
                <ArrowLeft className="h-4 w-4" />
                التالي
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="gap-2"
            title={language === "ar" ? "الصفحة الأخيرة" : "Last page"}>
            {language === "ar" ? (
              <>
                <ChevronsLeft className="h-4 w-4" />
                الأخيرة
              </>
            ) : (
              <>
                Last
                <ChevronsRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {/* Page Info */}
        <div
          className={`text-sm text-muted-foreground ${
            language === "ar" ? "text-left" : "text-right"
          }`}>
          {language === "ar"
            ? `صفحة ${currentPage} من ${totalPages}`
            : `Page ${currentPage} of ${totalPages}`}
          {itemsCount !== undefined && itemsPerPage !== undefined && (
            <>
              {language === "ar"
                ? ` • ${itemsCount} عناصر`
                : ` • ${itemsCount} items`}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
