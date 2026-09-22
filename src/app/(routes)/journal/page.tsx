'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { EASINGS, DURATIONS } from '@/config/motion';
import { ArrowRight } from 'lucide-react';

export default function JournalPage() {
  const articles = [
    {
      id: '01',
      title: 'A Interseção: Onde a Herança Encontra o Mar',
      category: 'Cultura',
      date: '21.09.2026',
      excerpt: 'A força bruta não existe sem a liberdade de aplicá-la. Como a disciplina dos antigos impérios moldou a nossa visão sobre o movimento contemporâneo em Fortaleza.',
      image: 'https://images.unsplash.com/photo-1518991669955-9c7e78ec80ca?q=80&w=2000&auto=format&fit=crop',
    },
    {
      id: '02',
      title: 'A Materialidade de VESTIGIUM',
      category: 'Design System',
      date: '15.09.2026',
      excerpt: 'A busca pela gramatura perfeita. Uma análise profunda sobre o peso, a textura tátil e a modelagem boxy que define o primeiro artefato da coleção Origo.',
      image: 'https://images.unsplash.com/photo-1528319725582-ddc096101511?q=80&w=2000&auto=format&fit=crop',
    },
    {
      id: '03',
      title: 'O Código de Roma',
      category: 'Filosofia',
      date: '02.09.2026',
      excerpt: 'Roma não é estética, é comportamento. Por que escolhemos a monumentalidade controlada para representar a nossa visão de resistência e pertencimento.',
      image: 'https://images.unsplash.com/photo-1552084117-56a987666449?q=80&w=2000&auto=format&fit=crop',
    }
  ];

  return (
    <div className="bg-brand-black min-h-screen text-brand-offwhite pt-32 pb-24">
      {/* Header do Journal */}
      <div className="max-w-7xl mx-auto px-6 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATIONS.slow, ease: EASINGS.cinematic }}
          className="max-w-2xl"
        >
          <span className="font-mono text-[10px] text-brand-red uppercase tracking-widest block mb-4">
            LR / Arquivo Cultural
          </span>
          <h1 className="font-serif text-5xl sm:text-7xl font-bold uppercase tracking-wider mb-6">
            Journal
          </h1>
          <p className="font-sans text-xs sm:text-sm text-zinc-400 uppercase tracking-widest leading-relaxed">
            Manifestos, ensaios e a documentação do nosso processo criativo. Onde o esporte, o design e o estilo de vida se encontram.
          </p>
        </motion.div>
      </div>

      {/* Lista de Artigos */}
      <div className="max-w-7xl mx-auto px-6 space-y-32">
        {articles.map((article, index) => (
          <motion.article
            key={article.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: DURATIONS.slow, ease: EASINGS.cinematic }}
            className={`flex flex-col gap-8 lg:gap-16 items-center ${
              index % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'
            }`}
          >
            {/* Imagem do Artigo */}
            <div className="w-full lg:w-3/5 aspect-[16/9] lg:aspect-[4/3] bg-zinc-900 relative overflow-hidden group">
              <div 
                className="absolute inset-0 bg-cover bg-center grayscale opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out"
                style={{ backgroundImage: `url(${article.image})` }}
              />
              {/* Overlay de Categoria */}
              <div className="absolute top-4 left-4 bg-brand-black/90 backdrop-blur-sm text-white text-[9px] uppercase font-mono tracking-widest px-4 py-2">
                {article.category}
              </div>
            </div>

            {/* Conteúdo do Artigo */}
            <div className="w-full lg:w-2/5 space-y-6">
              <div className="flex items-center gap-4 font-mono text-[10px] text-zinc-500 tracking-widest uppercase">
                <span>VOL. {article.id}</span>
                <span className="w-8 h-[1px] bg-zinc-700" />
                <span>{article.date}</span>
              </div>
              
              <h2 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-wide leading-tight group-hover:text-brand-red transition-colors">
                <Link href="#">{article.title}</Link>
              </h2>
              
              <p className="font-sans text-xs text-zinc-400 uppercase tracking-wider leading-relaxed">
                {article.excerpt}
              </p>
              
              <div className="pt-4">
                <Link
                  href="#"
                  className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-editorial text-brand-offwhite hover:text-brand-red transition-colors group"
                >
                  <span>Ler Ensaio</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}