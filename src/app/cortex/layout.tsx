export const metadata = {
  title: 'Córtex OS • Central Neural LaRomme',
  description: 'Executive Suite Standalone',
};

export default function CortexLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-screen bg-[#030303] text-white font-['Montserrat',sans-serif] overflow-hidden antialiased z-50 fixed inset-0">
      {children}
    </div>
  );
}