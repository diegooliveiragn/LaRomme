import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Journal | LaRomme',
  description: 'Artigos, cultura, esporte, praia e bastidores do universo LaRomme.',
};

export default function JournalPage() {
  const articles = [
    {
      slug: 'bastidores-drop-01-origo',
      category: 'Bastidores',
      title: 'ORIGO: A Construção do Primeiro Capítulo',
      excerpt: 'Como desenvolvemos as modelagens oversized da Vestigium e a alta resposta técnica da linha Forza e Libertas.',
      date: 'Setembro, 2026',
    },
    {
      slug: 'disciplina-e-liberdade-na-arena',
      category: 'Cultura & Esporte',
      title: 'A Transição Entre O Esporte e O Lifestyle Praiano',
      excerpt: 'Uma reflexão sobre como o vestuário esportivo contemporâneo transcende o treino e ocupa espaços de convívio e arte.',
      date: 'Setembro, 2026',
    },
  ];

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-6 space-y-12">
      <div className="border-b border-zinc-300 pb-6">
        <span className="text-xs uppercase font-bold tracking-editorial text-brand-red block mb-1">
          Cultura & Narrativa
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-tight text-brand-black">
          LaRomme Journal
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {articles.map((article) => (
          <article key={article.slug} className="bg-white border border-zinc-200 p-8 space-y-4 hover:border-brand-black transition-all">
            <div className="flex justify-between items-center text-[10px] uppercase font-mono tracking-widest text-zinc-400">
              <span className="text-brand-red font-bold">{article.category}</span>
              <span>{article.date}</span>
            </div>
            <h2 className="font-serif text-2xl font-bold uppercase text-brand-black leading-tight">
              {article.title}
            </h2>
            <p className="text-xs text-zinc-600 uppercase tracking-wider leading-relaxed">
              {article.excerpt}
            </p>
            <div className="pt-2">
              <Link
                href={`/journal/${article.slug}`}
                className="text-xs font-bold uppercase tracking-editorial text-brand-black hover:text-brand-red transition-colors"
              >
                Ler Artigo Completo →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
