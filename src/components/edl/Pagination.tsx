import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Colors } from '../../types/edlTypes';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  handlePageChange: (page: number) => void;
  colors: Colors;
}

export const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage, 
  handlePageChange,
  colors
}: PaginationProps) => {
  if (totalItems <= itemsPerPage) return null;

  return (
    <div className="px-4 py-3 border-t border-gray-200 dark:border-neutral-700 flex items-center justify-between">
      <div className="text-sm text-gray-700 dark:text-neutral-400">
        Affichage de <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> à{' '}
        <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> sur{' '}
        <span className="font-medium">{totalItems}</span> résultats
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 border rounded-md text-sm font-medium ${
            currentPage === 1
              ? 'text-gray-400 dark:text-neutral-500 border-gray-200 dark:border-neutral-700 cursor-not-allowed'
              : 'text-gray-700 dark:text-neutral-300 border-gray-300 dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-700'
          }`}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 border rounded-md text-sm font-medium ${
              currentPage === page
                ? `${colors.primary.light} ${colors.primary.dark} text-white border-blue-600 dark:border-blue-700`
                : 'text-gray-700 dark:text-neutral-300 border-gray-300 dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-700'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 border rounded-md text-sm font-medium ${
            currentPage === totalPages
              ? 'text-gray-400 dark:text-neutral-500 border-gray-200 dark:border-neutral-700 cursor-not-allowed'
              : 'text-gray-700 dark:text-neutral-300 border-gray-300 dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-700'
          }`}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};