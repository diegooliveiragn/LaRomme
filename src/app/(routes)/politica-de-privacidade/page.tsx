import { siteConfig } from '@/config/site';

export const metadata = {
  title: 'Política de Privacidade',
};

export default function PrivacidadePage() {
  return (
    <div className="bg-brand-black text-brand-offwhite min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        
        <div className="border-b border-zinc-900 pb-12">
          <span className="font-mono text-[10px] text-brand-red uppercase tracking-widest block mb-4">Governança de Dados</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold uppercase tracking-wider text-white">
            Política de Privacidade
          </h1>
          <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mt-6">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>

        <div className="space-y-10 font-sans text-xs text-zinc-400 uppercase tracking-widest leading-relaxed">
          
          <section className="space-y-4">
            <h2 className="font-serif text-xl tracking-wider text-white mb-2">1. Coleta de Informações</h2>
            <p>
              A {siteConfig.name} coleta informações essenciais de forma direta, como Nome, E-mail e Estrutura Corporal (Tamanho) quando o usuário solicita o Acesso VIP ao Lote Zero. Não coletamos dados ocultos para comercialização externa.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl tracking-wider text-white mb-2">2. Uso dos Dados</h2>
            <p>
              As informações fornecidas são utilizadas unicamente para:
              <br/>- Conceder acesso ao ecossistema de pré-lançamento.
              <br/>- Envio de comunicados oficias sobre o faturamento do Drop 01.
              <br/>- Mapeamento estatístico interno para planejamento de grade de produção.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl tracking-wider text-white mb-2">3. Proteção e Segurança</h2>
            <p>
              Implementamos protocolos de segurança compatíveis com os padrões contemporâneos para proteger suas informações pessoais contra acesso não autorizado, alteração ou destruição. Seus dados de navegação e preenchimento operam sob criptografia ativa (SSL/HTTPS).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl tracking-wider text-white mb-2">4. Ferramentas de Análise (Analytics)</h2>
            <p>
              Utilizamos ferramentas de rastreamento anônimas para mensurar fluxos de visitação e cliques. O objetivo é aprimorar a usabilidade do nosso sistema. Estes dados comportamentais não identificam o usuário de forma nominal.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl tracking-wider text-white mb-2">5. Seus Direitos (LGPD)</h2>
            <p>
              Em total conformidade com a Lei Geral de Proteção de Dados (LGPD), você pode solicitar a exibição, alteração ou exclusão definitiva de seu e-mail do nosso banco de dados a qualquer momento entrando em contato conosco via {siteConfig.contact.email}.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}