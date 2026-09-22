'use client';

import Link from 'next/link';
import { siteConfig } from '@/config/site';

export function Footer() {
  return (
    <footer className="bg-brand-black text-brand-offwhite border-t border-zinc-900 pt-20 pb-10 px-6 selection:bg-brand-red selection:text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
        
        {/* Brand / Manifesto */}
        <div className="md:col-span-5 space-y-6">
          <span className="font-serif text-3xl font-bold uppercase tracking-widest text-white block">LaRomme</span>
          <p className="font-sans text-xs text-zinc-500 uppercase tracking-widest leading-relaxed max-w-sm">
            A interseção exata entre a força de Roma e a energia de Fortaleza. Estilo, Performance e Pertencimento.
          </p>
          <div className="font-mono text-[9px] text-brand-red uppercase tracking-widest pt-2">
            {siteConfig.coordinates}
          </div>
        </div>

        {/* Links Principais */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="font-mono text-[10px] text-zinc-700 uppercase tracking-widest mb-6">Sistema</h4>
          <ul className="space-y-4 font-sans text-[11px] font-semibold tracking-editorial uppercase text-zinc-400">
            <li><Link href="/colecao/origo" className="hover:text-white transition-colors">Drop 01 — Origo</Link></li>
            <li><Link href="/sobre" className="hover:text-white transition-colors">A Marca</Link></li>
            <li><Link href="/journal" className="hover:text-white transition-colors">Archive</Link></li>
            <li><Link href="/tamanho" className="hover:text-white transition-colors">Estrutura & Medidas</Link></li>
          </ul>
        </div>

        {/* VIP Access / Contact */}
        <div className="md:col-span-4 space-y-6">
          <h4 className="font-mono text-[10px] text-zinc-700 uppercase tracking-widest mb-6">Lote Zero</h4>
          <p className="font-sans text-[10px] text-zinc-500 uppercase tracking-widest leading-relaxed mb-4 max-w-xs">
            Inscreva-se para obter acesso antecipado aos nossos artefatos antes da abertura pública.
          </p>
          <Link 
            href="/acesso" 
            className="inline-block border border-zinc-800 hover:border-brand-offwhite text-zinc-300 hover:text-brand-black hover:bg-brand-offwhite px-6 py-3 font-mono text-[9px] uppercase tracking-widest transition-all"
          >
            [ Solicitar Acesso ]
          </Link>
          
          <div className="pt-8 space-y-2 font-mono text-[9px] text-zinc-600 uppercase tracking-widest">
            <p className="hover:text-zinc-400 transition-colors cursor-default">Contato: {siteConfig.contact.email}</p>
            <div className="flex gap-6 pt-2">
              <a href={siteConfig.social.instagram} target="_blank" rel="noreferrer" className="hover:text-brand-red transition-colors">Instagram</a>
              <a href={siteConfig.social.tiktok} target="_blank" rel="noreferrer" className="hover:text-brand-red transition-colors">TikTok</a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-[8px] text-zinc-700 uppercase tracking-widest">
        <p>© {new Date().getFullYear()} LaRomme. Todos os direitos reservados.</p>
        <div className="flex gap-6">
          <Link href="/termos" className="hover:text-zinc-400 transition-colors">Termos</Link>
          <Link href="/politica-de-privacidade" className="hover:text-zinc-400 transition-colors">Privacidade</Link>
        </div>
      </div>
    </footer>
  );
}