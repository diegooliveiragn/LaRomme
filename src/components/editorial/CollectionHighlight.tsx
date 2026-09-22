'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { EASINGS, DURATIONS } from '@/config/motion';

export function CollectionHighlight() {
  const highlights = [
    {
      title: 'VESTIGIUM',
      concept: 'O que permanece.',
      desc: 'Algodão premium. Modelagem boxy inspirada nos anos 2000. Arte que conecta Fortaleza à eternidade romana.',
      slug: 'vestigium-camisa-algodao',
      alignment: 'left', // Imagem na esquerda, texto direita
      image: '/assets/products/vestigium/offwhite-back.jpg',
    },
    {
      title: 'FORZA',
      concept: 'O que nos faz continuar.',
      desc: 'Alta performance, mobilidade e secagem ultrarrápida. Projetada para a arena, sem perder a estética.',
      slug: 'forza-camisa-performance',
      alignment: 'right', // Imagem na direita, texto esquerda
      image: '/assets/products/forza/black-front.jpg',
    },
    {
      title: 'LIBERTAS',
      concept: 'Movimento sem restrição.',
      desc: 'A interseção exata entre 50% lifestyle e 50% performance. Cava projetada para liberdade total.',
      slug: 'libertas-regata-performance',
      alignment: 'left',
      image: '/assets/products/libertas/red-front.jpg',
    }
  ];

  return (
    <section className="py-32 bg-brand-offwhite text-brand-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 space-y-32">
        {highlights.map((item, index) => (
          <div 
            key={item.title} 
            className={`flex flex-col gap-12 lg:gap-20 items-center ${
              item.alignment === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'
            }`}
          >
            {/* Bloco de Imagem Editorial (Reveal Animado) */}
            <motion.div 
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: DURATIONS.cinematic, ease: EASINGS.cinematic }}
              className="w-full lg:w-1/2 aspect-[4/5] bg-zinc-200 relative overflow-hidden group"
            >
              {/* Placeholders visuais elegantes (serão substituídos pelas fotos reais) */}
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-300 flex flex-col justify-center items-center text-center p-8 transition-transform duration-1000 group-hover:scale-105">
                <span className="font-serif text-3xl text-zinc-400 uppercase opacity-30 absolute top-10 right-10">0{index + 1}</span>
                <h3 className="font-serif text-4xl font-bold uppercase tracking-widest text-brand-black mb-2">{item.title}</h3>
                <span className="text-[10px] tracking-editorial font-bold text-brand-red uppercase">[ FOTO DA CAMPANHA ]</span>
              </div>
            </motion.div>

            {/* Bloco de Narrativa (Text Reveal) */}
            <motion.div 
              initial={{ opacity: 0, x: item.alignment === 'right' ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: DURATIONS.slow, ease: EASINGS.cinematic, delay: 0.2 }}
              className="w-full lg:w-1/2 space-y-8 max-w-lg"
            >
              <div className="space-y-4">
                <span className="text-[10px] sm:text-xs uppercase font-bold tracking-editorial text-brand-red block">
                  A Essência
                </span>
                <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight leading-[1]">
                  {item.title}
                </h2>
                <p className="font-serif text-lg text-zinc-500 italic">
                  "{item.concept}"
                </p>
              </div>
              
              <p className="text-xs sm:text-sm text-zinc-600 uppercase tracking-wider leading-relaxed border-l border-brand-red pl-4">
                {item.desc}
              </p>
              
              <div className="pt-4">
                <Link
                  href={`/produto/${item.slug}`}
                  className="inline-flex items-center gap-4 text-xs font-bold uppercase tracking-editorial text-brand-black group"
                >
                  <span>Ver Produto</span>
                  <span className="w-12 h-[1px] bg-brand-black group-hover:w-20 transition-all duration-300" />
                </Link>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}