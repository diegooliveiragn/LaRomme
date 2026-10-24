import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// A chave será puxada automaticamente do arquivo .env.local
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json({ error: 'E-mail obrigatório.' }, { status: 400 });
    }

    const firstName = name ? name.split(' ')[0] : '';
    
    // Disparo do E-mail - Template 1 (Boas-vindas)
    const data = await resend.emails.send({
      from: 'LaRomme <suporte@laromme.com.br>',
      to: [email],
      subject: 'Bem-vindo à LaRomme',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #FAFAFA; color: #18181B; border: 1px solid #E4E4E7;">
          <h1 style="font-family: 'Libre Baskerville', serif; text-transform: uppercase; font-size: 22px; color: #18181B; text-align: center;">Bem-vindo</h1>
          <p>Olá, ${firstName}.</p>
          <p>Sua entrada no Senado VIP foi confirmada. A partir de agora, você tem acesso às nossas coleções, decisões de produto e bastidores antes do público geral.</p>
          <p>A LaRomme parte de uma premissa clara: a intersecção entre a disciplina do esporte e a estética contemporânea. Nossas escolhas de modelagem e matéria-prima priorizam movimento, funcionalidade e permanência.</p>
          <p>O movimento começa agora.</p>
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://www.laromme.com.br/#origo" style="background-color: #18181B; color: #FFFFFF; padding: 14px 28px; text-decoration: none; text-transform: uppercase; font-size: 11px; font-weight: bold; letter-spacing: 0.1em;">Conhecer o acervo</a>
          </div>
          <hr style="border: none; border-top: 1px solid #E4E4E7; margin: 30px 0;" />
          <p style="text-align: center; font-size: 11px; color: #71717A;">
            <strong>LaRomme</strong><br>
            suporte@laromme.com.br
          </p>
        </div>
      `
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erro no disparo do Resend:', error);
    return NextResponse.json({ error: 'Falha ao processar o envio.' }, { status: 500 });
  }
}