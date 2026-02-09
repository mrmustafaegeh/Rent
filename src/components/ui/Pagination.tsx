'use client';

import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button, ButtonProps } from "@/components/ui/Button"

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
    showControls?: boolean;
}

export function Pagination({ 
    currentPage, 
    totalPages, 
    onPageChange, 
    className,
    showControls = true
}: PaginationProps) {
    
    // Generate page numbers
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5; // e.g., 1 ... 4 5 6 ... 10

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first and last
            // Show current +/- 1
            
            if (currentPage <= 3) {
                 pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                 pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                 pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <nav 
            role="navigation" 
            aria-label="pagination" 
            className={cn("flex items-center justify-center gap-2", className)}
        >
            {showControls && (
                <Button
                    variant="outline"
                    className="h-8 w-8 p-0 rounded-lg border-gray-200 text-gray-400 hover:text-navy hover:border-navy hover:bg-white"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    aria-label="Go to previous page"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
            )}

            <div className="flex items-center gap-1">
                {getPageNumbers().map((page, i) => (
                    <React.Fragment key={i}>
                        {page === '...' ? (
                            <span className="flex h-8 w-8 items-center justify-center text-gray-400">
                                <MoreHorizontal className="h-4 w-4" />
                            </span>
                        ) : (
                            <button
                                onClick={() => onPageChange(page as number)}
                                className={cn(
                                    "h-8 w-8 text-xs font-bold rounded-lg transition-all flex items-center justify-center",
                                    currentPage === page
                                    ? "bg-navy text-gold shadow-md shadow-navy/20"
                                    : "text-gray-500 hover:bg-gray-100 hover:text-navy"
                                )}
                                aria-label={`Go to page ${page}`}
                                aria-current={currentPage === page ? "page" : undefined}
                            >
                                {page}
                            </button>
                        )}
                    </React.Fragment>
                ))}
            </div>

            {showControls && (
                <Button
                    variant="outline"
                    className="h-8 w-8 p-0 rounded-lg border-gray-200 text-gray-400 hover:text-navy hover:border-navy hover:bg-white"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    aria-label="Go to next page"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            )}
        </nav>
    )
}
