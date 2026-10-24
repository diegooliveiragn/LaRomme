import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, instagram } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Forneça um e-mail válido para o protocolo de acesso.' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('seu-projeto')) {
      return NextResponse.json(
        { error: 'Credenciais do banco de dados não configuradas na Vercel/.env.local.' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error } = await supabase
      .from('lote_zero_leads')
      .insert([{ name, email, phone, instagram }]);

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Este e-mail já está registrado na lista VIP do Lote Zero.' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: 'Falha ao registrar coordenadas no banco de dados.' },
        { status: 500 }
      );
    }

    // Disparo do E-mail de Boas-vindas (Template 1)
    try {
      const trimmedName = typeof name === 'string' ? name.trim() : '';
      const firstName = trimmedName ? trimmedName.split(' ')[0] : '';
      const greeting = firstName ? `Olá, ${firstName}.` : 'Olá.';
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'LaRomme <suporte@laromme.com.br>';

      await resend.emails.send({
        from: fromEmail,
        to: [email],
        subject: 'Bem-vindo à LaRomme',
        html: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem-vindo à LaRomme</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAFAFA; color: #18181B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <div style="display: none; max-height: 0px; overflow: hidden; opacity: 0;">
    Conheça a marca, nossos produtos e o que orienta cada escolha.&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FAFAFA; padding: 40px 0 60px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border: 1px solid #E4E4E7; border-radius: 4px;">
          <tr>
            <td align="center" style="padding: 40px 20px 20px 20px;">
              <a href="https://www.laromme.com.br" target="_blank">
                <img src="https://www.laromme.com.br/logo-preta.png" alt="LaRomme" width="40" style="display: block; max-width: 40px; border: 0;">
              </a>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 10px 40px 24px 40px;">
              <h1 style="margin: 0; font-family: Georgia, 'Libre Baskerville', serif; font-size: 22px; font-weight: 700; color: #18181B; text-transform: uppercase; letter-spacing: 0.05em;">
                Bem-vindo
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 36px 40px; font-size: 14px; line-height: 1.7; color: #3F3F46;">
              <p style="margin: 0 0 18px 0;">${greeting}</p>
              <p style="margin: 0 0 18px 0;">Sua entrada no Senado VIP foi confirmada. A partir de agora, você tem acesso às nossas coleções, decisões de produto e bastidores antes do público geral.</p>
              <p style="margin: 0 0 18px 0;">A LaRomme parte de uma premissa clara: a intersecção entre a disciplina do esporte e a estética contemporânea. Nossas escolhas de modelagem e matéria-prima priorizam movimento, funcionalidade e permanência.</p>
              <p style="margin: 0 0 18px 0;">Não espere excesso de ruído ou comunicações irrelevantes. Nosso contato respeita o seu tempo e a nossa identidade.</p>
              <p style="margin: 0 0 28px 0;">O movimento começa agora.</p>
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="https://www.laromme.com.br/#origo" target="_blank" style="display: inline-block; background-color: #18181B; color: #FFFFFF; padding: 14px 28px; text-decoration: none; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; border-radius: 2px;">
                      Conhecer o acervo
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 24px 40px; background-color: #F4F4F5; font-size: 11px; line-height: 1.6; color: #71717A; border-top: 1px solid #E4E4E7; border-bottom-left-radius: 4px; border-bottom-right-radius: 4px;">
              <p style="margin: 0 0 6px 0; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: #18181B;">LaRomme</p>
              <p style="margin: 0 0 8px 0;">
                <a href="mailto:suporte@laromme.com.br" style="color: #71717A; text-decoration: underline;">suporte@laromme.com.br</a> &nbsp;|&nbsp;
                <a href="https://open.spotify.com/user/31voi2u5nwaugj46lxf2pectkcha" target="_blank" style="color: #71717A; text-decoration: underline;">Spotify Oficial</a>
              </p>
              <p style="margin: 0;">Você está recebendo este e-mail por ter se cadastrado na lista VIP da LaRomme.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
      });
    } catch (emailErr) {
      console.error('Aviso: Falha ao enviar e-mail de boas-vindas:', emailErr);
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json(
      { error: 'Erro interno ao processar requisição.' },
      { status: 500 }
    );
  }
}