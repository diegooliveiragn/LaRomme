'use client';

import { motion } from 'framer-motion';
import { EASINGS, DURATIONS, fadeInUpVariants } from '@/config/motion';

export default function JournalPage() {
  const categories = [
    { 
      title: 'MATERIAL', 
      desc: 'Texturas, gramaturas e a física por trás do toque.',
      img: '/images/material.jpg'
    },
    { 
      title: 'MOVEMENT', 
      desc: 'O corpo no espaço. A roupa em estado de tensão.',
      img: '/images/movement.jpg'
    },
    { 
      title: 'TERRITORY', 
      desc: 'A arquitetura, a luz e o chão de Fortaleza.',
      img: '/images/territory.jpg'
    },
    { 
      title: 'CULTURE', 
      desc: 'As referências romanas decodificadas para o presente.',
      img: '/images/culture.jpg'
    },
    { 
      title: 'PROCESS', 
      desc: 'O desenvolvimento, a modelagem e as decisões de design.',
      img: '/images/process.jpg'
    },
    { 
      title: 'HERITAGE', 
      desc: 'Simbolismo, pedras seculares e a permanência do código.',
      img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1200&auto=format&fit=crop'
    }
  ];

  return (
    <div className="bg-brand-black text-brand-offwhite min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={fadeInUpVariants}
          className="border-b border-zinc-900 pb-12 max-w-4xl"
        >
          <span className="font-mono text-[10px] text-brand-red uppercase tracking-widest block mb-4">
            LaRomme Visual Archive
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold uppercase tracking-wider text-white">
            Journal
          </h1>
          <p className="font-sans text-xs text-zinc-500 uppercase tracking-widest mt-6 max-w-lg leading-relaxed">
            Registros, referências e materialidade. O acervo visual oficial da marca classificado por código de origem.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <motion.div 
              key={cat.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1, duration: DURATIONS.slow, ease: EASINGS.cinematic }}
              variants={fadeInUpVariants}
              className="group relative overflow-hidden border border-zinc-900 min-h-[380px] flex flex-col justify-end p-8 cursor-pointer bg-zinc-950"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center grayscale opacity-40 group-hover:opacity-80 group-hover:scale-105 transition-all duration-[1.2s] ease-out" 
                style={{ backgroundImage: `url('${cat.img}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
              
              <div className="relative z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <span className="font-mono text-[9px] text-brand-red uppercase tracking-widest block mb-2 opacity-80">
                  0{idx + 1} // ARCHIVE
                </span>
                <h2 className="font-serif text-2xl uppercase tracking-wider text-white mb-3 group-hover:text-brand-red transition-colors duration-300">
                  {cat.title}
                </h2>
                <p className="font-sans text-[10px] text-zinc-300 uppercase tracking-widest leading-relaxed drop-shadow-md">
                  {cat.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}