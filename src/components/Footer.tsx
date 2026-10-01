import Link from 'next/link';

export default function Footer() {
  return (
    <footer id="senado" className="border-t border-zinc-800 bg-[#030303] py-16 px-6 md:px-12 text-xs font-mono tracking-wider text-zinc-400 space-y-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-zinc-900">
        <div className="space-y-3">
          <span className="text-white font-bold uppercase block tracking-widest font-sans">ORIGEM & TERRITÓRIO</span>
          <p className="text-zinc-500">FORTALEZA - CE • BRASIL</p>
          <p className="text-zinc-500">03°43'16"S &nbsp; 38°32'41"W</p>
        </div>

        <div className="space-y-3">
          <span className="text-white font-bold uppercase block tracking-widest font-sans">CANAIS OFICIAIS</span>
          <p className="text-zinc-400">INSTAGRAM: <a href="https://instagram.com/uselaromme" target="_blank" rel="noreferrer" className="text-white hover:underline">@uselaromme</a></p>
          <p className="text-zinc-400">TIKTOK: <a href="https://tiktok.com/@laromme" target="_blank" rel="noreferrer" className="text-white hover:underline">@laromme</a></p>
          <p className="text-zinc-400">CONTATO: <a href="mailto:rommanuscompany@gmail.com" className="text-white hover:underline">rommanuscompany@gmail.com</a></p>
        </div>

        <div className="space-y-3">
          <span className="text-white font-bold uppercase block tracking-widest font-sans">SUPORTE & TERMOS</span>
          <div className="flex flex-col space-y-1.5 text-zinc-400 font-sans">
            <Link href="/faq" className="hover:text-white">FAQ / DÚVIDAS FREQUENTES.</Link>
            <Link href="/politicas" className="hover:text-white">TROCAS & PRIVACIDADE.</Link>
            <Link href="/termos" className="hover:text-white">TERMOS DE SERVIÇO.</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-[10px] text-zinc-600 gap-4">
        <span>© 2020–2026 LaRomme. TODOS OS DIREITOS RESERVADOS.</span>
        <span className="uppercase font-serif text-zinc-400 text-xs">FORÇA EM MOVIMENTO.</span>
      </div>
    </footer>
  );
}