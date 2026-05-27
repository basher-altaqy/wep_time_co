export default function Loading() {
  return (
    <div className="container-app py-8">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-64 rounded bg-border" />
        <div className="h-4 w-96 rounded bg-border" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="surface-card p-6 space-y-3">
              <div className="h-5 w-3/4 rounded bg-border" />
              <div className="h-3 w-full rounded bg-border" />
              <div className="h-3 w-5/6 rounded bg-border" />
              <div className="h-3 w-2/3 rounded bg-border" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
