import { siteConfig } from '@/config/site';

export const metadata = {
  title: 'Termos e Condições',
};

export default function TermosPage() {
  return (
    <div className="bg-brand-black text-brand-offwhite min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        
        <div className="border-b border-zinc-900 pb-12">
          <span className="font-mono text-[10px] text-brand-red uppercase tracking-widest block mb-4">Documentação Legal</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold uppercase tracking-wider text-white">
            Termos de Serviço
          </h1>
          <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mt-6">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>

        <div className="space-y-10 font-sans text-xs text-zinc-400 uppercase tracking-widest leading-relaxed">
          
          <section className="space-y-4">
            <h2 className="font-serif text-xl tracking-wider text-white mb-2">1. Condições Gerais</h2>
            <p>
              O presente documento estabelece as condições que governam o uso do ambiente digital {siteConfig.name} e a aquisição de seus artefatos. Ao acessar a plataforma ou solicitar alocação de produtos, o usuário concorda com o ecossistema de regras aqui descrito.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl tracking-wider text-white mb-2">2. Lote Zero e Pré-Lançamento</h2>
            <p>
              Durante a fase denominada "Lote Zero", os artefatos são disponibilizados mediante solicitação de acesso VIP. A solicitação de uma estrutura (tamanho) não garante a reserva automática do produto até que o faturamento e a liberação sejam formalizados pela marca.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl tracking-wider text-white mb-2">3. Exatidão de Informações</h2>
            <p>
              Operamos sob o princípio da Verdade do Produto (Product Truth). Trabalhamos para que cores, medidas e especificações técnicas sejam as mais fidedignas possíveis. Discrepâncias de calibragem de monitores e variações milimétricas de fabricação em tecidos de alta densidade podem ocorrer.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl tracking-wider text-white mb-2">4. Trocas e Devoluções</h2>
            <p>
              Garantimos o direito ao arrependimento e a troca por defeito estrutural. O cliente tem até 7 dias corridos após o recebimento para solicitar a devolução do artefato, desde que este não apresente sinais de uso, lavagem ou violação das etiquetas de origem.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl tracking-wider text-white mb-2">5. Propriedade Intelectual</h2>
            <p>
              Toda a arquitetura visual, tipográfica, design de produtos e microcopy presentes neste domínio são propriedade exclusiva da marca {siteConfig.name}. A reprodução não autorizada acarreta sanções legais.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}