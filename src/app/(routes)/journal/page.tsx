'use client';

import { motion } from 'framer-motion';
import { EASINGS, DURATIONS } from '@/config/motion';
import { siteConfig } from '@/config/site';

export default function JournalPage() {
  const articles = [
    {
      id: '01',
      title: 'A Arquitetura do Movimento',
      excerpt: 'Como a disciplina de Roma e o calor de Fortaleza moldam as estruturas dos nossos artefatos.',
      category: 'Design & Processo'
    },
    {
      id: '02',
      title: 'Matéria-Prima: O Peso do Algodão',
      excerpt: 'A escolha rigorosa da gramatura 300g para construir não apenas uma camiseta, mas uma armadura urbana.',
      category: 'Materialidade'
    },
    {
      id: '03',
      title: 'A Luz do Território',
      excerpt: 'Ensaios sobre o contraste entre sombras profundas e a luz inclemente da costa.',
      category: 'Editorial'
    }
  ];

  return (
    <div className="bg-brand-black text-brand-offwhite min-h-screen pt-36 pb-32">
      <div className="max-w-5xl mx-auto px-6 space-y-24">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATIONS.slow, ease: EASINGS.cinematic }}
          className="text-center space-y-6 max-w-2xl mx-auto"
        >
          <span className="font-mono text-[10px] text-brand-red uppercase tracking-widest block">
            {siteConfig.coordinates}
          </span>
          <h1 className="font-serif text-5xl sm:text-7xl font-bold uppercase tracking-wider">
            Archive
          </h1>
          <p className="font-sans text-xs text-zinc-400 uppercase tracking-widest leading-relaxed">
            Um acervo em construção. Processos, materialidade e o ecossistema cultural da LaRomme.
          </p>
        </motion.div>

        <div className="space-y-12 border-t border-zinc-900 pt-16">
          {articles.map((article, i) => (
            <motion.article 
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: DURATIONS.medium, delay: i * 0.1, ease: EASINGS.cinematic }}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 group cursor-pointer"
            >
              <div className="md:col-span-3 font-mono text-[10px] text-zinc-500 uppercase tracking-widest flex flex-col justify-between">
                <span>[ {article.id} ]</span>
                <span className="text-brand-red mt-2 md:mt-0">{article.category}</span>
              </div>
              <div className="md:col-span-9 space-y-4">
                <h2 className="font-serif text-2xl sm:text-4xl font-bold uppercase tracking-wide group-hover:text-brand-red transition-colors duration-500">
                  {article.title}
                </h2>
                <p className="font-sans text-xs text-zinc-400 uppercase tracking-wider leading-relaxed max-w-xl">
                  {article.excerpt}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
        
        <div className="pt-24 pb-12 flex justify-center border-t border-zinc-900">
            <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest">
                Novos registros em breve
            </span>
        </div>
      </div>
    </div>
  );
}