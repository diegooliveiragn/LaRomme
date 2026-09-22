'use client';

import { motion } from 'framer-motion';
import { EASINGS, DURATIONS, fadeInUpVariants } from '@/config/motion';

export default function JournalPage() {
  const categories = [
    { 
      title: 'MATERIAL', 
      desc: 'Tecidos, texturas, gramaturas e a física por trás do toque.',
      img: 'https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?q=80&w=1200&auto=format&fit=crop'
    },
    { 
      title: 'MOVEMENT', 
      desc: 'O corpo no espaço. A roupa em estado de performance e tensão.',
      img: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?q=80&w=1200&auto=format&fit=crop'
    },
    { 
      title: 'TERRITORY', 
      desc: 'A arquitetura, a luz e o chão de Fortaleza. Nosso contexto.',
      img: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?q=80&w=1200&auto=format&fit=crop'
    },
    { 
      title: 'CULTURE', 
      desc: 'As referências romanas decodificadas para o presente.',
      img: 'https://images.unsplash.com/photo-1549887552-cb1071d3e5ca?q=80&w=1200&auto=format&fit=crop'
    },
    { 
      title: 'PROCESS', 
      desc: 'O desenvolvimento, a costura e as decisões de design.',
      img: 'https://images.unsplash.com/photo-1618218168350-6e7c81151b64?q=80&w=1200&auto=format&fit=crop'
    }
  ];

  return (
    <div className="bg-brand-black text-brand-offwhite min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto space-y-20">
        
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
              transition={{ delay: idx * 0.15, duration: DURATIONS.slow, ease: EASINGS.cinematic }}
              variants={fadeInUpVariants}
              className="group relative overflow-hidden border border-zinc-900 min-h-[400px] flex flex-col justify-end p-8 cursor-pointer"
            >
              {/* Imagem de Fundo c/ Transição */}
              <div 
                className="absolute inset-0 bg-cover bg-center grayscale opacity-20 group-hover:opacity-50 group-hover:scale-105 transition-all duration-[1.5s] ease-out" 
                style={{ backgroundImage: `url('${cat.img}')` }}
              />
              {/* Gradiente Escuro p/ Leitura */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/80 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-700" />
              
              {/* Conteúdo */}
              <div className="relative z-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                <h2 className="font-serif text-2xl uppercase tracking-wider text-white mb-4 group-hover:text-brand-red transition-colors duration-500">
                  {cat.title}
                </h2>
                <p className="font-sans text-[10px] text-zinc-400 uppercase tracking-widest leading-relaxed">
                  {cat.desc}
                </p>
                <div className="mt-6 font-mono text-[9px] text-zinc-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                  [ Arquivos pendentes ]
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}