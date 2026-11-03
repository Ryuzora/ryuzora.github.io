import Link from 'next/link';

const aboutData = {
  name: 'Faqih Azma',
  introLabel: 'Halo, aku',
  tagline: 'Nama asliku Muhammad Azma Al Faqih, panggil aja Faqih.',
  bio: 'Di sini aku nulis review, opini, dan ranking soal hal-hal yang aku suka: drakor, musik, anime, sampai setup meja. Nggak ada jadwal, nulis kalau lagi pengen aja.',
};

const contact = {
  label: 'faqihazma@yahoo.com',
  href: 'mailto:faqihazma@yahoo.com',
};

export default function AboutContent() {
  return (
    <main className="min-h-screen bg-[var(--color-neutral)] px-6 py-16 sm:px-10 lg:px-20">
      <section className="mx-auto grid w-full max-w-4xl gap-10 rounded-3xl border border-[var(--color-border)] p-6 sm:p-10 md:grid-cols-[240px_1fr] md:items-center">
        {/* Placeholder: swap this div for an <Image> once you have a photo */}
        <div
          aria-hidden="true"
          className="flex aspect-[4/5] w-full max-w-[240px] items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[linear-gradient(135deg,var(--color-surface),color-mix(in_srgb,var(--color-tertiary)_30%,white))] font-serif text-7xl font-bold text-[var(--color-primary)] opacity-80"
        >
          F
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            {aboutData.introLabel}
          </p>
          <h1 className="mt-2 font-serif text-5xl font-bold leading-tight text-[var(--color-primary)] sm:text-6xl">
            {aboutData.name}
          </h1>
          <p className="mt-3 text-lg text-[var(--color-text-muted)]">{aboutData.tagline}</p>

          <div className="my-6 h-1 w-14 rounded-full bg-[color:color-mix(in_srgb,var(--color-primary)_45%,white)]" />

          <p className="max-w-xl text-base leading-relaxed text-[var(--color-text)]">{aboutData.bio}</p>

          <p className="mt-8 text-sm text-[var(--color-text-muted)]">
            Mau ngobrol?{' '}
            <Link
              href={contact.href}
              className="font-semibold text-[var(--color-primary)] underline-offset-4 hover:text-[var(--color-secondary)] hover:underline"
            >
              {contact.label}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
