import React from 'react';

function Pagination({ currentPage, totalItems, itemsPerPage, onPageChange }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-12 mb-6">
      {/* Previous Button */}
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="p-2 border border-outline-variant rounded hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-all"
      >
        <span className="material-symbols-outlined text-on-surface text-sm flex items-center">
          arrow_back_ios_new
        </span>
      </button>

      {/* Page Numbers */}
      <div className="flex gap-1">
        {Array.from({ length: totalPages }, (_, i) => {
          const pageNum = i + 1;
          const isActive = currentPage === pageNum;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-9 h-9 text-xs font-bold rounded transition-all flex items-center justify-center ${
                isActive
                  ? 'bg-primary text-on-primary neon-glow'
                  : 'border border-outline-variant text-on-surface hover:bg-white/5'
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="p-2 border border-outline-variant rounded hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-all"
      >
        <span className="material-symbols-outlined text-on-surface text-sm flex items-center">
          arrow_forward_ios
        </span>
      </button>
    </div>
  );
}

export default Pagination;