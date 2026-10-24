import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export async function GET(req: Request) {
  return handleBirthdayRoutine(req);
}

export async function POST(req: Request) {
  return handleBirthdayRoutine(req);
}

async function handleBirthdayRoutine(req: Request) {
  try {
    // Validação de segurança para Vercel Cron (se CRON_SECRET estiver configurado)
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ success: false, error: 'Não autorizado.' }, { status: 401 });
    }

    // Identifica o dia e mês atuais no fuso de Brasília (UTC-3)
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      month: '2-digit',
      day: '2-digit',
    });
    const [{ value: day }, , { value: month }] = formatter.formatToParts(now);
    const targetPattern = `${month}-${day}`; // Formato MM-DD

    // Busca leads com data de nascimento cadastrada
    const { data: leads, error } = await supabase
      .from('lote_zero_leads')
      .select('id, name, email, birth_date')
      .not('birth_date', 'is', null);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Filtra aniversariantes do dia
    const birthdayLeads = (leads || []).filter((lead: any) => {
      if (!lead.birth_date || !lead.email) return false;
      const rawDate = String(lead.birth_date).trim();
      
      // Formato YYYY-MM-DD
      if (rawDate.includes('-')) {
        const parts = rawDate.split('T')[0].split('-');
        if (parts.length === 3) {
          return parts[1] === month && parts[2] === day;
        }
      }
      
      // Formato DD/MM/YYYY
      if (rawDate.includes('/')) {
        const parts = rawDate.split('/');
        if (parts.length === 3) {
          return parts[0] === day && parts[1] === month;
        }
      }

      return false;
    });

    if (birthdayLeads.length === 0) {
      return NextResponse.json({
        success: true,
        message: `Nenhum aniversariante registrado para ${day}/${month}.`,
        disparos: 0,
      });
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'LaRomme <suporte@laromme.com.br>';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.laromme.com.br';
    const sentResults = [];

    for (const patrono of birthdayLeads) {
      const email = patrono.email.trim().toLowerCase();
      const rawName = (patrono.name || '').trim();
      const firstName = rawName ? rawName.split(' ')[0] : 'Patrono';

      const emailResponse = await resend.emails.send({
        from: fromEmail,
        to: [email],
        subject: 'Uma deferência pessoal',
        html: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Uma Deferência Pessoal</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAFAFA; color: #18181B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <div style="display: none; max-height: 0px; overflow: hidden; opacity: 0;">
    Uma deferência da LaRomme à passagem de mais um ciclo pessoal.&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FAFAFA; padding: 40px 0 60px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border: 1px solid #E4E4E7; border-radius: 4px;">
          <tr>
            <td align="center" style="padding: 40px 20px 20px 20px;">
              <a href="${siteUrl}" target="_blank">
                <img src="${siteUrl}/logo-preta.png" alt="LaRomme" width="40" style="display: block; max-width: 40px; border: 0;">
              </a>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 10px 40px 24px 40px;">
              <h1 style="margin: 0; font-family: Georgia, 'Libre Baskerville', serif; font-size: 20px; font-weight: 700; color: #18181B; text-transform: uppercase; letter-spacing: 0.05em;">
                Deferência Pessoal
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 36px 40px; font-size: 14px; line-height: 1.7; color: #3F3F46;">
              <p style="margin: 0 0 18px 0;">Olá, ${firstName}.</p>
              <p style="margin: 0 0 18px 0;">Na LaRomme, enxergamos a passagem do tempo sob a ótica da permanência e da evolução contínua — premissas que orientam tanto o rigor do nosso design quanto a rotina de quem veste a marca.</p>
              <p style="margin: 0 0 18px 0;">Por ocasião da sua data pessoal, manifestamos nossa deferência ao seu ciclo. Como gesto de consideração reservado aos membros do nosso círculo, uma condição exclusiva de prioridade encontra-se vinculada ao seu cadastro durante o período do seu aniversário.</p>
              <p style="margin: 0 0 28px 0;">Que o novo ciclo reafirme clareza, movimento e disciplina.</p>
              
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="${siteUrl}/#origo" target="_blank" style="display: inline-block; background-color: #18181B; color: #FFFFFF; padding: 14px 28px; text-decoration: none; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; border-radius: 2px;">
                      Acessar o Acervo
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
              <p style="margin: 0;">Mensagem institucional exclusiva para membros registrados no Senado VIP.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
      });

      sentResults.push({ id: patrono.id, email, resendId: emailResponse.data?.id });
    }

    return NextResponse.json({
      success: true,
      dataReferencia: `${day}/${month}`,
      processados: sentResults.length,
      detalhes: sentResults,
    });
  } catch (err: any) {
    console.error('Erro na rotina de aniversário:', err);
    return NextResponse.json({ success: false, error: err.message || 'Erro interno.' }, { status: 500 });
  }
}