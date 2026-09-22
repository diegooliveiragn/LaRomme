import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guia de Tamanhos | LaRomme',
  description: 'Tabela de medidas e especificações das modelagens LaRomme.',
};

export default function TamanhoPage() {
  return (
    <div className="pt-28 pb-24 max-w-4xl mx-auto px-6 space-y-12">
      <div className="border-b border-zinc-300 pb-6 text-center">
        <span className="text-xs uppercase font-bold tracking-editorial text-brand-red block mb-1">
          Tabelas de Medidas
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold uppercase text-brand-black">
          Guia de Tamanhos e Caimento
        </h1>
      </div>

      {/* Tabela Camisetas Oversized (VESTIGIUM) */}
      <div className="bg-white border border-zinc-200 p-6 sm:p-8 space-y-4">
        <h2 className="font-serif text-xl font-bold uppercase text-brand-black">
          1. Camiseta Algodão VESTIGIUM (Modelagem Boxy / Oversized)
        </h2>
        <p className="text-xs text-zinc-500 uppercase tracking-wider">
          Modelagem ampla com ombros deslocados e caimento estruturado.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse font-mono">
            <thead>
              <tr className="bg-zinc-100 border-b border-zinc-300 text-brand-black">
                <th className="p-3">Tamanho</th>
                <th className="p-3">Tórax (cm)</th>
                <th className="p-3">Comprimento (cm)</th>
                <th className="p-3">Manga (cm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              <tr>
                <td className="p-3 font-bold">P</td>
                <td className="p-3">108</td>
                <td className="p-3">72</td>
                <td className="p-3">22</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">M</td>
                <td className="p-3">114</td>
                <td className="p-3">75</td>
                <td className="p-3">23</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">G</td>
                <td className="p-3">120</td>
                <td className="p-3">78</td>
                <td className="p-3">24</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">GG</td>
                <td className="p-3">126</td>
                <td className="p-3">81</td>
                <td className="p-3">25</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabela Performance (FORZA / LIBERTAS) */}
      <div className="bg-white border border-zinc-200 p-6 sm:p-8 space-y-4">
        <h2 className="font-serif text-xl font-bold uppercase text-brand-black">
          2. Linha Performance FORZA e LIBERTAS (Modelagem Athletic Relaxed)
        </h2>
        <p className="text-xs text-zinc-500 uppercase tracking-wider">
          Caimento ajustável ao corpo sem compressão, focado em alta mobilidade.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse font-mono">
            <thead>
              <tr className="bg-zinc-100 border-b border-zinc-300 text-brand-black">
                <th className="p-3">Tamanho</th>
                <th className="p-3">Tórax (cm)</th>
                <th className="p-3">Comprimento (cm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              <tr>
                <td className="p-3 font-bold">P</td>
                <td className="p-3">98</td>
                <td className="p-3">70</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">M</td>
                <td className="p-3">104</td>
                <td className="p-3">72</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">G</td>
                <td className="p-3">110</td>
                <td className="p-3">74</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">GG</td>
                <td className="p-3">116</td>
                <td className="p-3">76</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
