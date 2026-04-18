export default function Hero() {
    return (
        <section id="essays" className="relative bg-stone-50 min-h-screen text-stone-900 px-6 py-2">
            <div
                className="absolute inset-0 z-0 opacity-10"
                style={{
                    backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                }}
                aria-hidden="true"
            />

            <div className="relative z-10 mx-auto max-w-9xl py-24 sm:py-32 lg:py-48 px-6 sm:px-12 lg:px-20">
                <div className="mx-auto max-w-5xl text-center">
                    <h1 className="font-serif text-6xl font-extrabold leading-tight tracking-tight text-stone-950 sm:text-7xl lg:text-8xl">
                        Welcome to Ryuzora&rsquo;s digital garden.
                    </h1>
                    <p className="mt-8 text-lg font-medium text-stone-700 sm:text-xl/9 leading-relaxed max-w-3xl mx-auto">
                        Koleksi tulisan, pemikiran, opini, dan review dari orang yang bukan siapa-siapa
                    </p>
                </div>
            </div>
        </section>
    );
}
