import React from 'react';
import FadeIn from '@/components/FadeIn';

export default function PoliticasPage() {
  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto font-sans text-white">
      <FadeIn>
        <div className="border-b border-zinc-900 pb-6 mb-12">
          <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase block mb-1">TRANSPARÊNCIA E GARANTIA</span>
          <h1 className="font-serif text-2xl md:text-4xl tracking-[0.2em] uppercase font-bold">POLÍTICAS DA MAISON.</h1>
        </div>

        <div className="space-y-12">
          <section className="space-y-4">
            <h2 className="font-serif text-lg tracking-widest uppercase border-b border-zinc-900 pb-2">TROCAS E DEVOLUÇÕES</h2>
            <div className="font-mono text-xs text-zinc-400 space-y-4 leading-relaxed">
              <p>A LaRomme preza pela excelência em cada detalhe. Caso seu artefato não atenda às suas expectativas, você possui o direito de solicitar a devolução ou troca dentro do prazo de <strong>7 (sete) dias corridos</strong> após o recebimento, conforme o Art. 49 do Código de Defesa do Consumidor.</p>
              <p><strong>CONDIÇÕES PARA TROCA:</strong> A peça deve retornar intacta, sem indícios de uso, lavagem, odores ou alterações, mantendo todas as tags e a embalagem original. Peças reprovadas em nosso controle de qualidade serão devolvidas ao cliente.</p>
              <p>Para iniciar o processo, entre em contato através do e-mail <strong>suporte@laromme.com.br</strong> com o número do seu pedido.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-lg tracking-widest uppercase border-b border-zinc-900 pb-2">PRIVACIDADE E DADOS (LGPD)</h2>
            <div className="font-mono text-xs text-zinc-400 space-y-4 leading-relaxed">
              <p>Asseguramos o sigilo total de suas informações. Os dados fornecidos (nome, CPF, endereço, e-mail) são utilizados exclusivamente para o processamento, faturamento e envio de seus pedidos.</p>
              <p><strong>PAGAMENTOS:</strong> Não armazenamos dados de cartão de crédito em nossos servidores. Toda transação financeira é tokenizada e processada através do ambiente blindado e criptografado do Mercado Pago, garantindo conformidade com padrões de segurança internacionais (PCI Compliance).</p>
            </div>
          </section>
        </div>
      </FadeIn>
    </div>
  );
}