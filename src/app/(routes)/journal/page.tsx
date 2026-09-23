'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const articles = [
  {
    id: '001',
    slug: 'a-geometria-do-brutalismo',
    date: '2026.09.12',
    category: 'ARQUITETURA & DESIGN',
    title: 'A Geometria do Brutalismo na Moda Contemporânea',
    excerpt: 'Como linhas duras, estruturas expostas e a ausência de ornamento definem o novo vestuário de luxo urbano.',
    readTime: '04 MIN // LEITURA',
    image: '/images/hero.jpg'
  },
  {
    id: '002',
    slug: 'arquitetura-do-tecido',
    date: '2026.08.28',
    category: 'MATERIAIS & DENSIDADE',
    title: 'Algodão de Alta Gramatura: A Construção da Armadura',
    excerpt: 'Estudo sobre a densidade têxtil de 400g/m² e a física por trás de peças que mantêm sua estrutura no corpo sem deformação.',
    readTime: '06 MIN // LEITURA',
    image: '/images/material.jpg'
  },
  {
    id: '003',
    slug: 'ensaio-origo-lote-zero',
    date: '2026.08.05',
    category: 'EDITORIAL // ORIGO',
    title: 'Lote Zero: Ensaio Visual em Concreto Sombra',
    excerpt: 'Registros fotográficos do primeiro protótipo da coleção Origo em ambientes brutalistas de alvenaria e asfalto.',
    readTime: '03 MIN // GALERIA',
    image: '/images/lookbook.jpg'
  }
];

export default function JournalPage() {
  return (
    <div className="bg-brand-black min-h-screen text-brand-offwhite pt-32 pb-32 px-6">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Cabeçalho */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="border-b border-zinc-900 pb-12"
        >
          <span className="font-mono text-[10px] text-brand-red uppercase tracking-widest block mb-4">
            Publicações Editoriais // Journal
          </span>
          <h1 className="font-serif text-5xl sm:text-7xl uppercase tracking-wider text-white">
            Registros
          </h1>
          <p className="font-sans text-xs text-zinc-400 uppercase tracking-widest max-w-xl mt-4 leading-relaxed">
            Archivos conceituais, ensaios de materiais e investigações estéticas sobre o ecossistema LaRomme.
          </p>
        </motion.div>

        {/* Destaque 01 (Artigo Principal) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 border-b border-zinc-900 pb-16 items-center">
          <div className="lg:col-span-7 aspect-[16/10] bg-zinc-900 border border-zinc-800 relative overflow-hidden group">
            <img 
              src={articles[0].image} 
              alt={articles[0].title} 
              className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
            />
          </div>
          <div className="lg:col-span-5 space-y-6">
            <div className="flex justify-between items-center font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
              <span>{articles[0].category}</span>
              <span>{articles[0].date}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl uppercase tracking-wider text-white leading-snug">
              {articles[0].title}
            </h2>
            <p className="font-sans text-xs text-zinc-400 leading-relaxed uppercase tracking-wider">
              {articles[0].excerpt}
            </p>
            <div className="pt-2 flex justify-between items-center">
              <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest">{articles[0].readTime}</span>
              <span className="font-mono text-[10px] text-white hover:text-brand-red uppercase tracking-widest transition-colors cursor-pointer">
                [ Ler Registro ]
              </span>
            </div>
          </div>
        </div>

        {/* Lista Secundária */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {articles.slice(1).map((article) => (
            <div key={article.id} className="bg-zinc-950 border border-zinc-900 p-6 sm:p-8 space-y-6 flex flex-col justify-between group">
              <div className="space-y-6">
                <div className="aspect-[16/9] bg-zinc-900 border border-zinc-800 relative overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover grayscale opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                  />
                </div>
                <div className="flex justify-between items-center font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
                  <span>{article.category}</span>
                  <span>{article.date}</span>
                </div>
                <h3 className="font-serif text-2xl uppercase tracking-wider text-white group-hover:text-brand-red transition-colors">
                  {article.title}
                </h3>
                <p className="font-sans text-xs text-zinc-400 leading-relaxed uppercase tracking-wider">
                  {article.excerpt}
                </p>
              </div>
              <div className="border-t border-zinc-900 pt-4 flex justify-between items-center font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
                <span>{article.readTime}</span>
                <span className="text-white group-hover:text-brand-red transition-colors">[ Ler Registro ]</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}