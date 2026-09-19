export default function SkeletonCard() {
  return (
    <div className="glass overflow-hidden rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <div className="skeleton h-4 w-24 rounded-full" />
        <div className="skeleton h-3 w-16 rounded-full" />
      </div>
      <div className="skeleton mt-5 h-7 w-3/4 rounded-lg" />
      <div className="mt-3 space-y-2">
        <div className="skeleton h-3 w-full rounded-full" />
        <div className="skeleton h-3 w-5/6 rounded-full" />
        <div className="skeleton h-3 w-2/3 rounded-full" />
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div className="skeleton h-10 w-32 rounded-full" />
        <div className="flex gap-2">
          <div className="skeleton h-10 w-10 rounded-xl" />
          <div className="skeleton h-10 w-10 rounded-xl" />
        </div>
      </div>
    </div>
  );
}