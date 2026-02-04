import React from 'react';
import Button from './Button';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-center gap-4 py-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="rounded-full border-2 hover:border-primary"
        iconName="ChevronLeft"
      />
      
      <div className="flex items-center gap-2">
        {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            const isActive = page === currentPage;
            return (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        isActive 
                        ? 'bg-primary scale-125' 
                        : 'bg-border hover:bg-accent/50'
                    }`}
                />
            );
        })}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="rounded-full border-2 hover:border-primary"
        iconName="ChevronRight"
      />
    </div>
  );
};

export default Pagination;