import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';

  // Redireciona qualquer acesso vindo do subdomínio da Vercel para o domínio oficial
  if (host.includes('la-romme.vercel.app')) {
    const url = request.nextUrl.clone();
    url.protocol = 'https:';
    url.host = 'www.laromme.com.br';
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
