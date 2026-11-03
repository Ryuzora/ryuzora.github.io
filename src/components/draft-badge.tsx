// Only ever rendered in `npm run dev`: drafts are removed from production builds.
export default function DraftBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border-2 border-dashed border-amber-400 bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-amber-800 ${className}`}
    >
      <span aria-hidden="true">✎</span>
      Draft
    </span>
  );
}
