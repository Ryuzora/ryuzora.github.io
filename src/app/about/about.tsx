import Image from 'next/image';
import Link from 'next/link';

const aboutData = {
  name: 'Faqih Azma',
  introLabel: "Halo aku,",
  tagline: 'Nama asliku Muhammad Azma Al Faqih, bisa dipanggil Faqih',
  bio: [
    'I started Petal & Parchment as a digital scrapbook for passing thoughts, but it quickly grew into a space for deliberate reflection. My background is rooted in literature and analog photography, which heavily influences how I see the digital world.',
    'I believe in the beauty of the slow web - spaces that invite you to linger rather than scroll. Here, I document essays on design, memory, and the tactile nature of living in a screen-dominated era.',
  ],
  quote: '"The most profound stories are often written in the margins."',
};

const socials = [
  { label: 'Email', href: 'mailto:faqihazma@yahoo.com', icon: '@' },
  { label: 'Website', href: '#', icon: 'oo' },
  { label: 'Portfolio', href: '#', icon: 'o' },
];

export default function AboutContent() {
  return (
    <main className="min-h-screen bg-[var(--color-neutral)] px-6 py-12 sm:px-10 lg:px-20">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-neutral)] p-6 sm:p-10">
          <div className="grid gap-8 md:grid-cols-[280px_1fr] md:items-center">
            <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
              <Image
                src="/images/image1.jpeg"
                alt="Portrait"
                width={600}
                height={750}
                className="h-full w-full object-cover"
                priority
              />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                {aboutData.introLabel}
              </p>
              <h1 className="mt-2 font-serif text-5xl font-bold leading-tight text-[var(--color-primary)] sm:text-6xl">
                {aboutData.name}
              </h1>
              <p className="mt-4 max-w-lg text-lg leading-relaxed text-[var(--color-text-muted)] sm:text-2xl">
                {aboutData.tagline}
              </p>
              <div className="mt-6 h-1 w-14 rounded-full bg-[color:color-mix(in_srgb,var(--color-primary)_45%,white)]" />
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <article className="rounded-2xl border border-[var(--color-border)] bg-[color:color-mix(in_srgb,var(--color-surface)_82%,white)] p-8">
            <h2 className="font-serif text-4xl font-bold text-[var(--color-primary)]">The Story So Far</h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-[var(--color-text-muted)]">
              {aboutData.bio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>

          <aside className="rounded-2xl border border-[var(--color-border)] bg-[color:color-mix(in_srgb,var(--color-tertiary)_35%,white)] p-8">
            <p className="text-2xl font-semibold leading-snug text-[var(--color-primary)]">{aboutData.quote}</p>
          </aside>
        </section>

        <section className="rounded-2xl border border-[var(--color-border)] bg-[color:color-mix(in_srgb,var(--color-surface)_75%,white)] px-6 py-12 text-center sm:px-10">
          <h2 className="font-serif text-4xl font-bold text-[var(--color-primary)]">Let&apos;s Connect</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--color-text-muted)] sm:text-base">
            I&apos;m always open to discussing literature, design, or sharing a virtual cup of tea.
          </p>

          <div className="mt-7 flex items-center justify-center gap-4">
            {socials.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-neutral)] text-sm font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-secondary)]"
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
