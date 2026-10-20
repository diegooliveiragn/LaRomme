import React from 'react';
import FadeIn from '@/components/FadeIn';

export default function TermosPage() {
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto font-sans text-white">
      <FadeIn>
        <div className="border-b border-zinc-900 pb-6 mb-12">
          <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase block mb-1">CONDIÇÕES DE USO & NAVEGAÇÃO</span>
          <h1 className="font-serif text-2xl md:text-4xl tracking-[0.2em] uppercase font-bold">TERMOS DE SERVIÇO.</h1>
        </div>

        <div className="space-y-8 font-mono text-xs text-zinc-400 leading-relaxed">
          <p>
            Ao navegar pelo ecossistema digital da LaRomme e adquirir nossos artefatos, você concorda com as diretrizes e termos estabelecidos abaixo, formulados com transparência e respeito mútuo.
          </p>

          <section className="space-y-2">
            <h3 className="text-white font-bold uppercase text-sm font-serif">1. Disponibilidade de Lotes & Reservas</h3>
            <p>
              Nossas produções seguem tiragens técnicas limitadas. A inclusão de um artefato na sacola assegura reserva temporária durante o fluxo de checkout. A conclusão formal da compra ocorre mediante a confirmação da liquidação do PIX.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-white font-bold uppercase text-sm font-serif">2. Precisão de Dados de Destino</h3>
            <p>
              O cliente é responsável pelo preenchimento exato dos dados de entrega (CEP, logradouro e numeração). Envios com dados divergentes ou incompletos poderão sofrer retenção pelo operador logístico até a retificação cadastral.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-white font-bold uppercase text-sm font-serif">3. Propriedade Intelectual & Identidade</h3>
            <p>
              Todos os símbolos, inscrições, tipografias, fotografias e códigos visuais presentes neste ambiente pertencem exclusivamente à LaRomme. É vedada qualquer reprodução, distribuição ou apropriação sem autorização formal expressa.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-white font-bold uppercase text-sm font-serif">4. Atendimento & Contato Oficial</h3>
            <p>
              Quaisquer solicitações sobre pedidos, trocas ou termos devem ser encaminhadas ao canal oficial: <strong className="text-white">suporte@laromme.com.br</strong>.
            </p>
          </section>
        </div>
      </FadeIn>
    </div>
  );
}
