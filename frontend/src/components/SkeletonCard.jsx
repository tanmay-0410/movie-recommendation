import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="min-w-[90px] md:min-w-[90px] aspect-[2/3] rounded-xl overflow-hidden shrink-0">
      <div className="skeleton w-full h-full rounded-xl" />
    </div>
  );
};

const SkeletonRow = () => {
  return (
    <div className="px-4 md:px-12 my-8">
      <div className="skeleton h-7 w-48 rounded-md mb-4" />
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 7 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
};

export { SkeletonCard, SkeletonRow };
export default SkeletonCard;
