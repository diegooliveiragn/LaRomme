export const metadata = {
  title: 'Córtex OS • Central Neural LaRomme',
  description: 'Sistema Operacional de Inteligência Executiva e Gestão 360',
};

export default function CortexLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-screen bg-black text-white font-sans overflow-x-hidden antialiased">
      {children}
    </div>
  );
}