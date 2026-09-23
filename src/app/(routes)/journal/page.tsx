'use client';

import Link from 'next/link';
import { motion, Variants } from 'framer-motion';

const codices = [
  {
    id: 'CÓDICE III',
    numeral: 'III',
    date: 'MMXXVI // IX',
    category: 'ARQUITETURA & DESIGN',
    title: 'A Geometria do Brutalismo na Moda Contemporânea',
    excerpt: 'Como linhas duras, estruturas expostas e a ausência de ornamento definem o novo vestuário de luxo urbano.',
    readTime: '04 MIN',
  },
  {
    id: 'CÓDICE II',
    numeral: 'II',
    date: 'MMXXVI // VIII',
    category: 'MATERIAIS & DENSIDADE',
    title: 'Algodão de Alta Gramatura: A Construção da Armadura',
    excerpt: 'Estudo sobre a densidade têxtil de 400g/m² e a física por trás de peças que mantêm sua estrutura no corpo sem deformação.',
    readTime: '06 MIN',
  },
  {
    id: 'CÓDICE I',
    numeral: 'I',
    date: 'MMXXVI // VII',
    category: 'SISTEMA // ORIGO',
    title: 'O Manifesto de Cor: O Porquê do Escuro Absoluto',
    excerpt: 'O escuro (#111111) não é apenas uma paleta cromática de escolha, mas um escudo físico e psicológico contra a superficialidade estética.',
    readTime: '03 MIN',
  }
];

// Configuração de Animações com Tipagem Estrita
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.9, 
      ease: 'easeOut' 
    } 
  }
};

export default function JournalPage() {
  return (
    <div className="bg-brand-black min-h-screen text-brand-offwhite pt-32 pb-32 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-24">
        
        {/* Header Arquitetônico */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="border-b border-zinc-900 pb-12 flex flex-col sm:flex-row justify-between sm:items-end gap-8"
        >
          <div>
            <span className="font-mono text-[10px] text-brand-red uppercase tracking-widest block mb-4">
              Opus Caementicium // Registros
            </span>
            <h1 className="font-serif text-6xl sm:text-8xl uppercase tracking-wider text-white leading-none">
              Códice
            </h1>
            <p className="font-sans text-xs text-zinc-400 uppercase tracking-widest max-w-xl mt-6 leading-relaxed">
              Manifestos, estudos de densidade têxtil e arquitetura aplicados ao ecossistema LaRomme.
            </p>
          </div>
          <div className="text-left sm:text-right space-y-2 border-l sm:border-l-0 sm:border-r border-zinc-900 pl-4 sm:pl-0 sm:pr-4 py-1">
            <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest block">Acta Non Verba</span>
            <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest block">Ex Nihilo</span>
            <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest block">Anno MMXXVI</span>
          </div>
        </motion.div>

        {/* Lista de Registros Tipográficos */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-0 border-t border-zinc-900"
        >
          {codices.map((codice, index) => (
            <motion.div 
              key={codice.id} 
              variants={itemVariants}
              className={`relative border-b border-zinc-900 p-8 sm:p-12 hover:bg-zinc-950/50 transition-colors duration-700 group overflow-hidden ${index === 0 ? 'bg-zinc-950/30' : ''}`}
            >
              {/* Numeral Romano Fantasma Gigante no fundo */}
              <div className="absolute -right-4 -bottom-10 md:right-10 md:-bottom-20 text-[180px] md:text-[300px] font-serif font-bold text-zinc-900 opacity-20 pointer-events-none group-hover:text-brand-red group-hover:opacity-5 transition-all duration-1000 z-0 select-none">
                {codice.numeral}
              </div>

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
                
                {/* Meta Dados Esculpidos */}
                <div className="lg:col-span-3 space-y-6 flex flex-col justify-between h-full">
                  <div>
                    <span className="font-mono text-[10px] text-zinc-600 block mb-1">DATA DE PROTOCOLO</span>
                    <span className="font-mono text-[11px] text-white tracking-widest">{codice.date}</span>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-zinc-600 block mb-1">DISCIPLINA</span>
                    <span className="font-mono text-[11px] text-white tracking-widest uppercase">{codice.category}</span>
                  </div>
                </div>

                {/* Bloco de Texto Principal */}
                <div className="lg:col-span-9 space-y-6">
                  <span className="font-mono text-[10px] text-brand-red uppercase tracking-widest block">
                    [ {codice.id} ]
                  </span>
                  <h2 className="font-serif text-3xl sm:text-5xl uppercase tracking-wider text-white leading-tight group-hover:text-zinc-300 transition-colors duration-500">
                    {codice.title}
                  </h2>
                  <p className="font-sans text-xs sm:text-sm text-zinc-400 leading-relaxed uppercase tracking-wider max-w-2xl">
                    {codice.excerpt}
                  </p>
                  
                  <div className="pt-8 flex items-center gap-6">
                    <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest">
                      TEMPO DE LEITURA // {codice.readTime}
                    </span>
                    <Link href="#" className="font-mono text-[10px] text-white hover:text-brand-red uppercase tracking-widest transition-colors duration-300 relative overflow-hidden group/link">
                      <span className="relative z-10">[ DECODIFICAR MANIFESTO ]</span>
                      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-brand-red transform scale-x-0 group-hover/link:scale-x-100 transition-transform origin-left duration-300"></span>
                    </Link>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Rodapé Arquitetônico do Códice */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center pt-16"
        >
          <img src="/logo-white.png" alt="LaRomme" className="w-16 h-auto mx-auto opacity-20 mb-8" />
          <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest block">
            Fim dos Registros // Restrito ao Senado
          </span>
        </motion.div>

      </div>
    </div>
  );
}