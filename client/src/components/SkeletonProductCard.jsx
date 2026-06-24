import React from 'react';

const SkeletonProductCard = () => {
  return (
    <div className="bg-bg-surface rounded-xl border border-bg-border overflow-hidden relative">
      {/* Image Area */}
      <div className="aspect-square bg-bg-raised animate-pulse rounded-t-xl" />

      {/* Info Area */}
      <div className="p-5 space-y-4">
        {/* Category line */}
        <div className="h-3 w-16 bg-bg-raised animate-pulse rounded" />

        {/* Product Name line */}
        <div className="h-6 w-3/4 bg-bg-raised animate-pulse rounded" />

        {/* Description line */}
        <div className="h-4 w-full bg-bg-raised animate-pulse rounded" />

        {/* Rating line */}
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 bg-bg-raised animate-pulse rounded-full" />
          <div className="h-4 w-12 bg-bg-raised animate-pulse rounded" />
        </div>

        {/* Price & Cart button row */}
        <div className="flex justify-between items-end pt-2">
          <div className="space-y-2">
            <div className="h-3 w-12 bg-bg-raised animate-pulse rounded" />
            <div className="h-5 w-20 bg-bg-raised animate-pulse rounded" />
          </div>
          <div className="h-11 w-11 bg-bg-raised animate-pulse rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonProductCard;
