export default function Hero() {
    return (
        <section id="essays" className="relative min-h-screen bg-[var(--color-neutral)] px-6 py-2 text-[var(--color-text)]">
            <div
                className="absolute inset-0 z-0 opacity-30"
                style={{
                    backgroundImage: 'radial-gradient(#d8c8bd 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                }}
                aria-hidden="true"
            />

            <div className="relative z-10 mx-auto max-w-9xl py-24 sm:py-32 lg:py-48 px-6 sm:px-12 lg:px-20">
                <div className="mx-auto max-w-5xl text-center">
                    <h1 className="font-serif text-6xl font-extrabold leading-tight tracking-tight text-[var(--color-primary)] sm:text-7xl lg:text-8xl">
                        Welcome to Ryuzora&rsquo;s digital garden.
                    </h1>
                    <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-[var(--color-text-muted)] sm:text-xl/9 font-medium">
                        Koleksi tulisan, pemikiran, opini, dan review dari orang yang bukan siapa-siapa
                    </p>
                </div>
            </div>
        </section>
    );
}
