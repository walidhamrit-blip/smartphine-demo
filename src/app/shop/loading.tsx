export default function Loading() {
  return (
    <div className="container-wide py-16">
      <div className="mb-8 h-8 w-48 animate-pulse rounded-full bg-surface-2" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-[1.4rem] border border-line bg-surface">
            <div className="aspect-[4/5] animate-pulse bg-surface-2" />
            <div className="space-y-2 p-4">
              <div className="h-3 w-1/3 animate-pulse rounded-full bg-surface-2" />
              <div className="h-4 w-3/4 animate-pulse rounded-full bg-surface-2" />
              <div className="h-4 w-1/2 animate-pulse rounded-full bg-surface-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
