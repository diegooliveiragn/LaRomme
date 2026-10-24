'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/cortex')) return null;
  return (
    <footer className="bg-zinc-950 pt-24 pb-12 border-t border-zinc-900 font-sans text-zinc-400">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24 mb-24">
          
          {/* Coluna 1: Origem */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold font-serif uppercase tracking-[0.2em] text-white">Origem & Território</h4>
            <div className="space-y-3 text-xs tracking-wider leading-relaxed">
              <p>FORTALEZA - CE • BRASIL</p>
              <p className="font-mono text-zinc-500">03°43'16"S 38°32'41"W</p>
            </div>
          </div>

          {/* Coluna 2: Canais */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold font-serif uppercase tracking-[0.2em] text-white">Canais Oficiais</h4>
            <ul className="space-y-4 text-xs tracking-wider">
              <li>
                <a href="https://instagram.com/uselaromme" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300">
                  INSTAGRAM: @uselaromme
                </a>
              </li>
              <li>
                <a href="https://tiktok.com/@laromme" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300">
                  TIKTOK: @laromme
                </a>
              </li>
              <li>
                <a href="https://open.spotify.com/user/31voi2u5nwaugj46lxf2pectkcha" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300">
                  SPOTIFY: LaRomme Sound
                </a>
              </li>
              <li>
                <a href="mailto:suporte@laromme.com.br" className="hover:text-white transition-colors duration-300">
                  CONTATO: suporte@laromme.com.br
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Suporte */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold font-serif uppercase tracking-[0.2em] text-white">Suporte & Termos</h4>
            <ul className="space-y-4 text-xs tracking-wider">
              <li>
                <Link href="/faq" className="hover:text-white transition-colors duration-300">
                  FAQ / DÚVIDAS FREQUENTES.
                </Link>
              </li>
              <li>
                <Link href="/termos" className="hover:text-white transition-colors duration-300">
                  TROCAS & PRIVACIDADE.
                </Link>
              </li>
              <li>
                <Link href="/termos" className="hover:text-white transition-colors duration-300">
                  TERMOS DE SERVIÇO.
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Linha Inferior: Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-zinc-900/50 text-[10px] tracking-widest text-zinc-600 uppercase">
          <p>© 2020–2026 LaRomme. Todos os direitos reservados.</p>
          <p className="mt-4 md:mt-0 font-bold">Força em Movimento.</p>
        </div>
      </div>
    </footer>
  );
}