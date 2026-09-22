import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termos de Uso | LaRomme',
};

export default function TermosPage() {
  return (
    <div className="pt-28 pb-24 max-w-4xl mx-auto px-6 space-y-8">
      <h1 className="font-serif text-3xl font-bold uppercase text-brand-black">
        Termos de Uso
      </h1>
      <div className="bg-white border border-zinc-200 p-8 text-xs text-zinc-600 uppercase tracking-wider leading-relaxed">
        [ CONTEÚDO JURÍDICO PENDENTE ]
      </div>
    </div>
  );
}
