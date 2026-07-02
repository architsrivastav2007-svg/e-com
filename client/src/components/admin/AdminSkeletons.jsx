const StatSkeleton = () => (
  <div className="h-32 animate-pulse rounded-[1.75rem] border border-slate-200 bg-slate-100" />
);

const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-lg shadow-slate-200/60">
    <div className="border-b border-slate-200 px-6 py-4">
      <div className="h-5 w-40 animate-pulse rounded-full bg-slate-200" />
    </div>
    <div className="divide-y divide-slate-100">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-4 px-6 py-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {Array.from({ length: columns }).map((_, columnIndex) => (
            <div key={columnIndex} className="h-4 animate-pulse rounded-full bg-slate-100" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

const ListSkeleton = ({ rows = 4 }) => (
  <div className="space-y-3 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} className="h-16 animate-pulse rounded-2xl bg-slate-100" />
    ))}
  </div>
);

export { StatSkeleton, TableSkeleton, ListSkeleton };