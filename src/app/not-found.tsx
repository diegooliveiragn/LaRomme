import Link from 'next/link';
import { siteConfig } from '@/config/site';

export default function NotFound() {
  return (
    <div className="bg-brand-black text-brand-offwhite min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Ruído de fundo */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("/noise.png")' }}></div>
      
      <div className="relative z-10 text-center space-y-8 max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full border border-brand-red flex items-center justify-center mx-auto mb-6 text-brand-red">
          <span className="font-serif text-2xl opacity-50">!</span>
        </div>
        
        <div>
          <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block mb-4">
            [ Erro 404 ]
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold uppercase tracking-wider text-white">
            Coordenada<br />Inexistente
          </h1>
        </div>
        
        <p className="font-sans text-xs text-zinc-400 uppercase tracking-widest leading-relaxed">
          O registro que você procura não está presente neste arquivo ou foi realocado. 
          Retorne à base ou reconfigure sua navegação.
        </p>
        
        <div className="pt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link 
            href="/" 
            className="w-full sm:w-auto font-mono text-[10px] uppercase tracking-widest text-brand-black bg-white px-8 py-4 hover:bg-zinc-300 transition-colors"
          >
            Retornar à Base
          </Link>
          <Link 
            href="/acesso" 
            className="w-full sm:w-auto font-mono text-[10px] uppercase tracking-widest text-brand-red border border-zinc-800 bg-zinc-900/50 px-8 py-4 hover:border-brand-red transition-colors"
          >
            Acesso VIP
          </Link>
        </div>
      </div>
      
      <div className="absolute bottom-10 font-mono text-[9px] text-zinc-700 uppercase tracking-widest">
        Posição Atual: Fora de Alcance
      </div>
    </div>
  );
}