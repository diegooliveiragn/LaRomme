import React from 'react';
import FadeIn from '@/components/FadeIn';

export default function FAQPage() {
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto font-sans text-white">
      <FadeIn>
        <div className="border-b border-zinc-900 pb-6 mb-12">
          <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase block mb-1">SUPORTE TÉCNICO & ATENDIMENTO</span>
          <h1 className="font-serif text-2xl md:text-4xl tracking-[0.2em] uppercase font-bold">DÚVIDAS FREQUENTES.</h1>
        </div>

        <div className="space-y-12">
          <section className="space-y-4">
            <h2 className="font-serif text-lg tracking-widest uppercase border-b border-zinc-900 pb-2">1. MATÉRIA-PRIMA & CUIDADOS PÓS-TREINO</h2>
            <div className="font-mono text-xs text-zinc-400 space-y-4 leading-relaxed">
              <p>
                <strong className="text-white">COMO HIGIENIZAR AS PEÇAS DE PERFORMANCE APÓS O CONTATO COM AREIA E MAR?</strong><br />
                Enxágue a peça em água corrente fria logo após a prática para remover o salitre e os grãos de areia. Lave à mão ou em ciclo suave com sabão neutro. Nunca utilize amaciantes, pois eles obstruem os microporos de respiração da poliamida.
              </p>
              <p>
                <strong className="text-white">COMO CUIDAR DO BONÉ UMBRA 5-PANEL?</strong><br />
                Por ser construído em poliamida ripstop com fivela de engate rápido, basta lavá-lo em água corrente fria e deixá-lo secar à sombra. Não utilize lavadoras nem secadoras mecânicas para manter a curvatura e a integridade da aba.
              </p>
              <p>
                <strong className="text-white">COMO PRESERVAR A CAMISA VESTIGIUM BOXY?</strong><br />
                O algodão penteado nobre possui toque fresco e estrutura encorpada. Seque sempre pendurada à sombra e passe pelo avesso em temperatura moderada para preservar a etiqueta externa.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-lg tracking-widest uppercase border-b border-zinc-900 pb-2">2. SISTEMA DE PROPORÇÃO & MEDIDAS</h2>
            <div className="font-mono text-xs text-zinc-400 space-y-4 leading-relaxed">
              <p>
                <strong className="text-white">QUAL A DIFERENÇA ENTRE OS CORTES LIFESTYLE E PERFORMANCE?</strong><br />
                As peças Lifestyle (Vestigium) seguem proporção Boxy com ombros caídos e caimento estruturado que não cola ao corpo no pós-treino. As peças de Performance (Tenax e Libertas) têm corte ergonômico com cavas desenhadas para amplitude completa de movimento na quadra.
              </p>
              <p>
                <strong className="text-white">COMO UTILIZAR O SISTEMA DE PROPORÇÃO NA PÁGINA DO PRODUTO?</strong><br />
                Basta informar sua altura, peso e caimento preferido (Anatômico, Padrão ou Amplo) na página da peça para receber a indicação calculada com base na modelagem oficial da marca.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-lg tracking-widest uppercase border-b border-zinc-900 pb-2">3. ENVIOS, LOGÍSTICA & ENTREGAS</h2>
            <div className="font-mono text-xs text-zinc-400 space-y-4 leading-relaxed">
              <p>
                <strong className="text-white">COMO FUNCIONA A ENTREGA EM FORTALEZA?</strong><br />
                Para Fortaleza e Região Metropolitana, oferecemos entrega expressa via mensageiro dedicado, com prazo habitual de até 1 dia útil após a confirmação do pedido.
              </p>
              <p>
                <strong className="text-white">QUAL O PRAZO PARA OUTRAS REGIÕES DO BRASIL?</strong><br />
                O despacho ocorre em até 2 dias úteis a partir da nossa base em Fortaleza. O código de rastreamento é enviado automaticamente para o seu e-mail para acompanhamento em tempo real.
              </p>
            </div>
          </section>
        </div>
      </FadeIn>
    </div>
  );
}
