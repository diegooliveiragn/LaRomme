import { siteConfig } from '@/config/site';

export function ManifestoSection() {
  const pillars = [
    { title: 'Força', description: 'Atitude na arena e na vida.' },
    { title: 'Disciplina', description: 'A constância que gera liberdade.' },
    { title: 'Performance', description: 'Materiais de alta resposta técnica.' },
    { title: 'Exclusividade', description: 'Drops com produção controlada.' },
    { title: 'Pertencimento', description: 'A união entre esporte e cultura.' },
  ];

  return (
    <section className="bg-brand-black text-brand-offwhite py-24 border-y border-zinc-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-editorial font-bold text-brand-red block">
              Manifesto LaRomme
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-tight leading-tight">
              {siteConfig.slogans.manifesto}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 uppercase tracking-wider leading-relaxed">
              {siteConfig.slogans.essence} A LaRomme ocupa o território exato entre o esporte de alta resposta e o estilo de vida contemporâneo. Menos produto, mais pertencimento.
            </p>
            <div className="text-xs font-mono text-zinc-500 tracking-widest pt-2">
              ORIGEM: {siteConfig.coordinates}
            </div>
          </div>

          {/* Grade dos 5 Pilares */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="bg-zinc-900/60 border border-zinc-800 p-6 space-y-2">
                <h3 className="font-serif text-lg font-bold uppercase tracking-wider text-brand-red">
                  {pillar.title}
                </h3>
                <p className="text-xs text-zinc-400 uppercase tracking-wider">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
