import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Perguntas Frequentes | LaRomme',
  description: 'Respostas para as principais dúvidas sobre pedidos, entregas e produtos LaRomme.',
};

export default function FAQPage() {
  const faqs = [
    {
      q: 'O que é um Drop?',
      a: 'Nossas coleções são lançadas em formatos de Drops temáticos com produção numerada e limitada. O Drop 01 traz a coleção ORIGO.',
    },
    {
      q: 'Como funcionam os envios e prazos de entrega?',
      a: 'Despachamos para todo o Brasil. O prazo e o valor do frete são calculados diretamente na etapa de checkout.',
    },
    {
      q: 'Qual a política de troca ou devolução?',
      a: 'Você possui até 7 dias corridos após o recebimento para solicitar devolução ou troca do produto, desde que mantidas as etiquetas e sem indícios de uso.',
    },
    {
      q: 'Como cuidar da minha peça LaRomme?',
      a: 'Siga sempre as instruções contidas na etiqueta interna de composição. Recomendamos lavar a frio e secar à sombra para prolongar a vida útil das fibras técnicas.',
    },
  ];

  return (
    <div className="pt-28 pb-24 max-w-4xl mx-auto px-6 space-y-12">
      <div className="border-b border-zinc-300 pb-6 text-center">
        <span className="text-xs uppercase font-bold tracking-editorial text-brand-red block mb-1">
          Atendimento
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold uppercase text-brand-black">
          Perguntas Frequentes (FAQ)
        </h1>
      </div>

      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white border border-zinc-200 p-6 space-y-2">
            <h3 className="font-serif text-base font-bold uppercase text-brand-black">
              {faq.q}
            </h3>
            <p className="text-xs text-zinc-600 uppercase tracking-wider leading-relaxed">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
