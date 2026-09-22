'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { EASINGS, DURATIONS } from '@/config/motion';
import { PRODUCTS_ORIGO } from '@/data/products';
import { ProductCard } from '@/components/product/ProductCard';
import { siteConfig } from '@/config/site';

export default function Home() {
  // Filtra apenas os produtos marcados como 'featured'
  const featuredProducts = PRODUCTS_ORIGO.filter(p => p.featured);

  return (
    <div className="bg-brand-black min-h-screen selection:bg-brand-red selection:text-white">
      
      {/* 1. HERO SECTION (Impacto Imediato) */}
      <section className="relative h-[90vh] md:h-screen flex flex-col items-center justify-center overflow-hidden border-b border-zinc-900">
        {/* Espaço reservado para a Foto de Campanha IMG_01 */}
        <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center opacity-30">
            <span className="font-serif text-8xl md:text-9xl text-zinc-800 opacity-20">LR</span>
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'url("/noise.png")' }}></div>
        </div>
        
        <div className="relative z-10 text-center space-y-6 px-6 mt-12 md:mt-20 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATIONS.slow, ease: EASINGS.cinematic }}
          >
            <span className="font-mono text-[10px] text-brand-red uppercase tracking-widest block mb-6">
              {siteConfig.slogans.hero}
            </span>
            <h1 className="font-serif text-7xl sm:text-8xl md:text-[10rem] leading-none font-bold uppercase tracking-tight text-white mb-10">
              Origo
            </h1>
            <Link 
              href="/colecao/origo" 
              className="inline-block bg-white text-brand-black px-10 py-5 font-mono text-[10px] uppercase tracking-widest hover:bg-brand-red hover:text-white transition-colors duration-500 shadow-xl"
            >
              Explorar o Drop
            </Link>
          </motion.div>
        </div>
        
        <div className="absolute bottom-10 left-10 font-mono text-[9px] text-zinc-600 uppercase tracking-widest hidden md:block">
          Drop 01 // Lote Zero
        </div>
      </section>

      {/* 2. PAUSA EDITORIAL (O Manifesto) */}
      <section className="py-24 md:py-32 px-6 max-w-4xl mx-auto text-center border-b border-zinc-900">
         <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: DURATIONS.slow, ease: EASINGS.cinematic }}
           className="space-y-8"
         >
           <p className="font-serif text-3xl sm:text-4xl md:text-5xl text-zinc-500 leading-tight uppercase tracking-wide">
             A interseção exata entre a <span className="text-white">disciplina de Roma</span> e a <span className="text-white">liberdade de Fortaleza</span>.
           </p>
         </motion.div>
      </section>

      {/* 3. VITRINE (Os Artefatos) */}
      <section className="py-24 md:py-32 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <span className="font-mono text-[10px] text-brand-red uppercase tracking-widest block mb-3">Coleção Origo</span>
            <h2 className="font-serif text-4xl sm:text-5xl uppercase tracking-wider text-white font-bold">Os Artefatos</h2>
          </div>
          <Link href="/colecao/origo" className="hidden md:block font-mono text-[10px] text-zinc-400 hover:text-brand-red uppercase tracking-widest border-b border-zinc-800 hover:border-brand-red pb-1 transition-all">
            Ver Coleção Completa
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <div key={product.id} className="h-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center md:hidden">
          <Link href="/colecao/origo" className="inline-block font-mono text-[10px] text-zinc-400 hover:text-white uppercase tracking-widest border-b border-zinc-800 pb-1 transition-colors">
            Ver Coleção Completa
          </Link>
        </div>
      </section>

      {/* 4. CAPTURA VIP (O Funil) */}
      <section className="py-32 px-6 bg-zinc-900/30 border-t border-zinc-900 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("/noise.png")' }}></div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: DURATIONS.medium, ease: EASINGS.cinematic }}
          className="max-w-2xl mx-auto space-y-10 relative z-10"
        >
          <span className="font-serif text-5xl text-brand-red opacity-80 block mb-6">LR</span>
          <h2 className="font-serif text-4xl sm:text-5xl uppercase tracking-wider text-white leading-tight">
            O Arquivo<br />Está Sendo Aberto
          </h2>
          <p className="font-sans text-xs text-zinc-400 uppercase tracking-widest leading-relaxed max-w-lg mx-auto">
            Um lote fechado do Drop 01 será alocado para os primeiros membros da nossa base. Solicite acesso antecipado antes da liberação comercial.
          </p>
          <div className="pt-4">
            <Link 
              href="/acesso" 
              className="inline-block font-mono text-[11px] uppercase tracking-widest text-brand-black bg-brand-offwhite px-10 py-5 hover:bg-brand-red hover:text-white transition-all shadow-2xl"
            >
              [ Solicitar Alocação ]
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
}