import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { NewsletterForm } from '@/components/shared/NewsletterForm';

export function Footer() {
  return (
    <footer className="bg-brand-black text-brand-offwhite pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
        
        {/* Brand Story Column */}
        <div className="space-y-6 md:col-span-4">
          <span className="font-serif text-3xl font-bold tracking-widest uppercase block">
            {siteConfig.name}
          </span>
          <p className="font-sans text-xs text-zinc-400 leading-relaxed uppercase tracking-wider max-w-xs">
            {siteConfig.slogans.manifesto}
          </p>
          <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest space-y-1 pt-4">
            <p>ORIGEM: {siteConfig.location}</p>
            <p>COORDENADAS: {siteConfig.coordinates}</p>
          </div>
        </div>

        {/* Links Column */}
        <div className="grid grid-cols-2 gap-8 md:col-span-4">
          <div className="space-y-6">
            <h4 className="font-mono text-[10px] font-bold tracking-widest uppercase text-brand-red">
              Coleção
            </h4>
            <ul className="space-y-4 font-sans text-xs text-zinc-400 uppercase tracking-wider">
              <li><Link href="/colecao/origo" className="hover:text-white transition-colors">Drop 01 — Origo</Link></li>
              <li><Link href="/sobre" className="hover:text-white transition-colors">A Marca</Link></li>
              <li><Link href="/journal" className="hover:text-white transition-colors">Journal</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-mono text-[10px] font-bold tracking-widest uppercase text-brand-red">
              Suporte
            </h4>
            <ul className="space-y-4 font-sans text-xs text-zinc-400 uppercase tracking-wider">
              <li><Link href="/faq" className="hover:text-white transition-colors">Perguntas Comuns</Link></li>
              <li><Link href="/tamanho" className="hover:text-white transition-colors">Guia de Fit</Link></li>
              <li><Link href="/contato" className="hover:text-white transition-colors">Contato</Link></li>
            </ul>
          </div>
        </div>

        {/* Newsletter Column */}
        <div className="md:col-span-4">
          <NewsletterForm />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center text-[9px] font-mono text-zinc-600 uppercase tracking-widest gap-6">
        <p>© {new Date().getFullYear()} LAROMME. TODOS OS DIREITOS RESERVADOS.</p>
        <div className="flex gap-8">
          <Link href="/politica-de-privacidade" className="hover:text-zinc-400 transition-colors">
            Privacidade
          </Link>
          <Link href="/termos" className="hover:text-zinc-400 transition-colors">
            Termos Legais
          </Link>
        </div>
      </div>
    </footer>
  );
}