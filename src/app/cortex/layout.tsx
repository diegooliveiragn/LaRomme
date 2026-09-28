export const metadata = {
  title: 'Córtex OS • Executive Suite Standalone',
  description: 'Central Neural de Gestão LaRomme',
};

export default function CortexLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-screen bg-[#030303] text-white font-sans overflow-hidden antialiased z-50 fixed inset-0">
      {children}
    </div>
  );
}