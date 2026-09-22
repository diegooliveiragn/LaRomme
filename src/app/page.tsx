'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { EASINGS, DURATIONS, fadeInUpVariants } from '@/config/motion';
import { PRODUCTS_ORIGO } from '@/data/products';
import { ProductCard } from '@/components/product/ProductCard';
import { ArchitectureOfMovement } from '@/components/collection/ArchitectureOfMovement';
import { RealTestimonials } from '@/components/editorial/RealTestimonials';

export default function Home() {
  const featuredProducts = PRODUCTS_ORIGO.filter(p => p.featured);

  return (
    <div className="bg-brand-black min-h-screen">
      
      {/* 1. IMPACT (Hero com Vídeo em Loop Direto) */}
      <section className="relative h-screen flex flex-col items-center justify-center border-b border-zinc-900 overflow-hidden">
        
        {/* Background Video Loop (CDN direto e estável) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=2070&auto=format&fit=crop"
          className="absolute inset-0 w-full h-full object-cover grayscale opacity-35 mix-blend-luminosity scale-105"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-dark-stormy-sea-waves-4257-large.mp4" type="video/mp4" />
        </video>

        {/* Gradiente de Sombras para leitura perfeita */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-black/30 via-brand-black/60 to-brand-black" />
        
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariants}
          className="relative z-10 text-center px-6 w-full max-w-4xl"
        >
          <span className="font-mono text-[10px] text-brand-red uppercase tracking-widest block mb-6 drop-shadow-lg">
            A SUA CASA. A SUA FORÇA.
          </span>
          <h1 className="font-serif text-6xl md:text-[8rem] leading-none font-bold uppercase tracking-tight text-white mb-10 drop-shadow-2xl">
            Origo
          </h1>
          <Link
            href="/colecao/origo"
            className="inline-block bg-white text-brand-black px-10 py-5 font-mono text-[10px] uppercase tracking-widest hover:bg-brand-red hover:text-white transition-colors duration-500 shadow-2xl"
          >
            Explorar o Arquivo
          </Link>
        </motion.div>
      </section>

      {/* 2. TERRITORY */}
      <section className="py-20 px-6 text-center border-b border-zinc-900 bg-brand-black">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUpVariants}>
          <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
            03°43'16"S 38°32'41"W
          </p>
          <p className="font-sans text-xs text-zinc-400 uppercase tracking-widest mt-4">
            Fortaleza, Ceará. O Ponto de Partida.
          </p>
        </motion.div>
      </section>

      {/* 3. ORIGO */}
      <section className="relative py-40 px-6 border-b border-zinc-900 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center grayscale opacity-15"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1549887552-cb1071d3e5ca?q=80&w=2000&auto=format&fit=crop')", backgroundAttachment: 'fixed' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/80 to-brand-black" />
        
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUpVariants} className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="font-serif text-3xl sm:text-4xl md:text-5xl text-zinc-500 leading-tight uppercase tracking-wide">
            A interseção exata entre a <span className="text-white">disciplina</span> da pedra e a <span className="text-white">liberdade</span> do mar.
          </p>
        </motion.div>
      </section>

      {/* 4. ARTEFACTS */}
      <section className="py-32 px-6 max-w-7xl mx-auto border-b border-zinc-900 bg-brand-black">
        <div className="mb-16">
          <span className="font-mono text-[10px] text-brand-red uppercase tracking-widest block mb-3">Drop 01</span>
          <h2 className="font-serif text-4xl uppercase tracking-wider text-white">Os Artefatos</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map(product => (
            <div key={product.id} className="h-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* 5. ARCHITECTURE OF MOVEMENT */}
      <section className="py-32 border-b border-zinc-900 bg-brand-black">
        <ArchitectureOfMovement />
      </section>

      {/* 6. MANIFESTO & ORIGIN */}
      <section className="relative py-40 px-6 border-b border-zinc-900 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center grayscale opacity-10"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-brand-black/80" />
        
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUpVariants} className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
          <h3 className="font-serif text-3xl uppercase tracking-wider text-white">A Força de Roma.<br/>O Movimento de Fortaleza.</h3>
          <p className="font-sans text-xs text-zinc-400 uppercase tracking-widest leading-relaxed">
            Nós não usamos o Império Romano como decoração. Ele é o nosso código estrutural. Disciplina, permanência e engenharia, adaptados para a fluidez, a luz e o ritmo do litoral contemporâneo. A roupa deve servir à vida na arena e fora dela.
          </p>
          <Link href="/sobre" className="inline-block font-mono text-[10px] text-zinc-400 hover:text-white uppercase tracking-widest border-b border-zinc-800 pb-1 mt-4">
            Ler o Manifesto Completo
          </Link>
        </motion.div>
      </section>

      {/* 7. PROVA SOCIAL */}
      <RealTestimonials />

      {/* 8. ARCHIVE */}
      <section className="py-32 px-6 max-w-7xl mx-auto border-b border-zinc-900 text-center bg-brand-black">
        <span className="font-mono text-[10px] text-brand-red uppercase tracking-widest block mb-6">Acervo Visual</span>
        <h3 className="font-serif text-3xl uppercase tracking-wider text-white mb-8">Journal & Process</h3>
        <Link href="/journal" className="inline-block border border-zinc-800 text-zinc-300 px-8 py-4 font-mono text-[10px] uppercase tracking-widest hover:border-brand-offwhite hover:text-brand-black hover:bg-brand-offwhite transition-colors">
          Explorar Categorias
        </Link>
      </section>

      {/* 9. ACCESS */}
      <section className="py-32 px-6 bg-brand-black text-center relative overflow-hidden">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUpVariants} className="max-w-2xl mx-auto space-y-8 relative z-10">
          <span className="font-serif text-5xl text-brand-red opacity-80 block mb-6">LR</span>
          <h2 className="font-serif text-4xl uppercase tracking-wider text-white">O Lote Zero</h2>
          <p className="font-sans text-xs text-zinc-400 uppercase tracking-widest leading-relaxed">
            Antes da abertura oficial, uma alocação restrita dos artefatos será liberada. Registre sua estrutura para ser notificado.
          </p>
          <div className="pt-4">
            <Link href="/acesso" className="inline-block font-mono text-[11px] uppercase tracking-widest text-brand-black bg-white px-10 py-5 hover:bg-brand-red hover:text-white transition-all shadow-xl">
              [ Solicitar Alocação ]
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
}