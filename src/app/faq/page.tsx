import React from 'react';
import FadeIn from '@/components/FadeIn';

export default function FAQPage() {
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto font-sans text-white">
      <FadeIn>
        <div className="border-b border-zinc-900 pb-6 mb-12">
          <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase block mb-1">ATENDIMENTO AO CLIENTE</span>
          <h1 className="font-serif text-2xl md:text-4xl tracking-[0.2em] uppercase font-bold">DÚVIDAS FREQUENTES.</h1>
        </div>

        <div className="space-y-12">
          <section className="space-y-4">
            <h2 className="font-serif text-lg tracking-widest uppercase border-b border-zinc-900 pb-2">1. CUIDADOS COM O ARTEFATO</h2>
            <div className="font-mono text-xs text-zinc-400 space-y-4 leading-relaxed">
              <p><strong className="text-white">COMO DEVO HIGIENIZAR MEU BONÉ LAROMME?</strong><br/>Recomendamos estritamente a limpeza a seco ou com um pano levemente umedecido. Nunca coloque a peça em máquinas de lavar ou secadoras, pois isso comprometerá a estrutura da copa e a integridade dos materiais premium.</p>
              <p><strong className="text-white">COMO DEVO GUARDAR?</strong><br/>Mantenha sua peça em local seco e arejado, preferencialmente longe da luz solar direta prolongada quando não estiver em uso, para preservar a vivacidade das cores.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-lg tracking-widest uppercase border-b border-zinc-900 pb-2">2. ENVIOS E LOGÍSTICA</h2>
            <div className="font-mono text-xs text-zinc-400 space-y-4 leading-relaxed">
              <p><strong className="text-white">QUAL O PRAZO DE DESPACHO?</strong><br/>Após a aprovação do pagamento, nossos artesãos preparam e embalam sua peça com o máximo cuidado. O despacho ocorre em até 2 dias úteis.</p>
              <p><strong className="text-white">COMO ACOMPANHAR MEU PEDIDO?</strong><br/>Assim que a peça for despachada, você receberá um e-mail com o código de rastreamento. Você também pode acompanhar o status inserindo seu código na página do seu pedido.</p>
            </div>
          </section>
        </div>
      </FadeIn>
    </div>
  );
}