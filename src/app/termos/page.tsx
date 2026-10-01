import React from 'react';
import FadeIn from '@/components/FadeIn';

export default function TermosPage() {
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto font-sans text-white">
      <FadeIn>
        <div className="border-b border-zinc-900 pb-6 mb-12">
          <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase block mb-1">DIREITOS E DEVERES</span>
          <h1 className="font-serif text-2xl md:text-4xl tracking-[0.2em] uppercase font-bold">TERMOS DE SERVIÇO.</h1>
        </div>

        <div className="space-y-8 font-mono text-xs text-zinc-400 leading-relaxed">
          <p>Ao navegar e adquirir produtos no e-commerce da LaRomme, você concorda com os termos aqui dispostos.</p>
          
          <h3 className="text-white font-bold uppercase mt-6">1. Propriedade Intelectual</h3>
          <p>Todo o conteúdo deste site — incluindo, mas não se limitando a fotografias, logotipos, textos, design e identidade visual — é de propriedade exclusiva da LaRomme. A reprodução, cópia ou uso comercial não autorizado está sujeito a medidas legais cabíveis.</p>

          <h3 className="text-white font-bold uppercase mt-6">2. Disponibilidade e Precificação</h3>
          <p>Nossos artefatos são produzidos em lotes controlados. A adição de uma peça ao carrinho não garante sua reserva ou preço. A compra só é efetivada e garantida após a confirmação do pagamento e baixa no estoque.</p>

          <h3 className="text-white font-bold uppercase mt-6">3. Responsabilidade de Dados</h3>
          <p>O cliente é inteiramente responsável pela exatidão dos dados fornecidos no momento do checkout (CPF e Endereço de Entrega). A LaRomme não se responsabiliza por envios extraviados devido a endereços incompletos ou incorretos fornecidos pelo comprador.</p>
        </div>
      </FadeIn>
    </div>
  );
}