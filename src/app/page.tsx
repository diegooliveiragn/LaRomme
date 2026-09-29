import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase Client para Server Components (Apenas Leitura)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Força a página a buscar dados novos sempre que for carregada (Sem Cache Estático)
export const revalidate = 0;

export default async function Home() {
  // Busca os artefatos cadastrados no Córtex OS diretamente do banco
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-[#030303] text-white font-sans selection:bg-amber-500/30">
      
      {/* NAVEGAÇÃO PRINCIPAL (HEADER) */}
      <header className="flex justify-between items-center p-6 md:p-10 border-b border-zinc-900/80 sticky top-0 bg-[#030303]/90 backdrop-blur-md z-50">
        <div className="font-serif text-2xl tracking-[0.2em] uppercase">LaRomme</div>
        <nav className="hidden md:flex gap-8 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
          <Link href="/" className="text-white">Lote Zero</Link>
          <Link href="/sobre" className="hover:text-white transition-colors">Manifesto</Link>
          <Link href="/conta" className="hover:text-amber-400 transition-colors">Senado VIP</Link>
        </nav>
        <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold">
          <Link href="/carrinho" className="hover:text-amber-400 transition-colors">Carrinho (0)</Link>
        </div>
      </header>

      {/* HERO SECTION (DOBRA PRINCIPAL) */}
      <section className="px-6 md:px-10 py-24 md:py-32 flex flex-col items-center justify-center text-center border-b border-zinc-900/80 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/10 via-[#030303] to-[#030303]">
        <span className="text-amber-400 font-mono text-[10px] uppercase tracking-[0.3em] mb-4 block font-bold">Drop Exclusivo</span>
        <h1 className="text-5xl md:text-7xl font-serif uppercase tracking-widest mb-6">Lote Zero</h1>
        <p className="text-zinc-400 max-w-xl mx-auto text-xs md:text-sm leading-relaxed tracking-widest uppercase">
          O marco zero da arquitetura de vestuário. Algodão estruturado premium, caimento boxy e produção limitadíssima. 
          Acesso prioritário para membros.
        </p>
      </section>

      {/* VITRINE DINÂMICA (PRODUTOS DO SUPABASE) */}
      <section className="px-6 md:px-10 py-20 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12 border-b border-zinc-900/80 pb-4">
          <h2 className="text-sm md:text-base uppercase tracking-widest font-bold">Artefatos Disponíveis</h2>
          <span className="text-[10px] text-zinc-500 font-mono uppercase font-bold">
            {products?.length || 0} {products?.length === 1 ? 'Peça catalogada' : 'Peças catalogadas'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {products && products.length > 0 ? (
            products.map((product) => (
              <Link href={`/produto/${product.id}`} key={product.id} className="group block cursor-pointer">
                
                {/* Imagem Placeholder (Design Brutalista) */}
                <div className="aspect-[3/4] bg-[#070707] border border-zinc-900 flex flex-col items-center justify-center mb-5 group-hover:border-amber-500/30 transition-all relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                  
                  {/* Logo/Monograma Central */}
                  <span className="font-serif text-5xl text-zinc-800 tracking-widest group-hover:scale-110 transition-transform duration-700">LR</span>
                  
                  {/* Botão Hover */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 w-11/12">
                    <div className="bg-white text-black text-[10px] font-bold uppercase tracking-widest py-3 text-center w-full hover:bg-amber-400 transition-colors">
                      Inspecionar Artefato
                    </div>
                  </div>
                </div>
                
                {/* Informações do Produto (Puxadas do Banco) */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm uppercase tracking-widest group-hover:text-amber-400 transition-colors">{product.name}</h3>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">{product.fabric_spec}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-sm block">R$ {Number(product.sale_price).toFixed(2)}</span>
                    <span className="text-[9px] text-amber-500/80 font-mono uppercase">{product.sku}</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-32 border border-dashed border-zinc-800 bg-[#050505]">
              <span className="font-serif text-2xl text-zinc-600 block mb-2">ARQUIVO VAZIO</span>
              <p className="text-zinc-500 uppercase tracking-widest text-[10px]">Nenhum artefato foi liberado pelo Córtex OS ainda.</p>
            </div>
          )}
        </div>
      </section>

      {/* RODAPÉ (FOOTER) */}
      <footer className="border-t border-zinc-900/80 p-6 md:p-10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-zinc-500 uppercase tracking-widest font-bold bg-[#010101]">
        <div>&copy; 2026 LaRomme. Todos os direitos reservados.</div>
        <div className="flex gap-6">
          <Link href="/sobre" className="hover:text-white transition-colors">A Marca</Link>
          <Link href="/termos" className="hover:text-white transition-colors">Termos</Link>
          <Link href="/cortex" className="hover:text-amber-400 transition-colors">Córtex OS</Link>
        </div>
      </footer>
    </main>
  );
}