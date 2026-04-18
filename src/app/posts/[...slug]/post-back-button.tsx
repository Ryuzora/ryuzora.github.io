'use client';

import { useRouter } from 'next/navigation';

export default function PostBackButton() {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push('/posts');
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="inline-flex items-center gap-2 text-sm font-medium text-stone-400 transition-colors hover:text-amber-700"
    >
      <span aria-hidden="true">←</span>
      Back
    </button>
  );
}

