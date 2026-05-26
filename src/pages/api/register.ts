import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
import { Resend } from 'resend';

// Tell Astro that this API endpoint should be processed dynamically on the server
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse JSON payload
    const body = await request.json();
    const { teamName, repName, repEmail, membersCount } = body;

    // Server-side validation
    if (!teamName || !repName || !repEmail || !membersCount) {
      return new Response(
        JSON.stringify({ error: '[ERROR_DE_VALIDACION]: Faltan campos requeridos en el servidor.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(repEmail)) {
      return new Response(
        JSON.stringify({ error: '[ERROR_DE_VALIDACION]: Correo electrónico no válido en el servidor.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const parsedCount = parseInt(membersCount, 10);
    if (isNaN(parsedCount) || parsedCount < 1 || parsedCount > 4) {
      return new Response(
        JSON.stringify({ error: '[ERROR_DE_VALIDACION]: Tamaño de equipo no permitido.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 1. Store the data in Supabase registrations table
    const { error: dbError } = await supabase
      .from('registrations')
      .insert([
        {
          team_name: teamName,
          representative_name: repName,
          email: repEmail,
          members_count: parsedCount
        }
      ]);

    if (dbError) {
      console.error('[SUPABASE_DB_INSERT_ERROR]', dbError);
      return new Response(
        JSON.stringify({ error: `[ERROR_DE_SISTEMA]: No se pudo guardar la información en base de datos: ${dbError.message}` }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Send the confirmation email via Resend
    let emailSent = false;
    let emailErrorMsg = '';

    const resendApiKey = import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY;
    if (!resendApiKey || resendApiKey === 're_your_resend_api_key_placeholder') {
      console.warn('[RESEND_WARNING]: RESEND_API_KEY no configurado o mantiene valor por defecto. Saltando envío de correo.');
      emailErrorMsg = 'Servicio de correo temporalmente desconectado.';
    } else {
      try {
        const resend = new Resend(resendApiKey);

        // Responsive, high-contrast HTML Email Template with a premium dark sci-fi developer aesthetic
        const emailHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registro Confirmado</title>
  <style>
    body {
      background-color: #07070a;
      color: #e2e8f0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      margin: 0;
      padding: 0;
    }
    .wrapper {
      background-color: #07070a;
      padding: 40px 20px;
    }
    .container {
      background-color: #0f0f15;
      border: 1px solid rgba(217, 164, 65, 0.15);
      border-radius: 16px;
      max-width: 600px;
      margin: 0 auto;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }
    .header {
      background: linear-gradient(135deg, #4c0519 0%, #0f0f15 100%);
      padding: 40px 30px;
      text-align: center;
      border-bottom: 2px solid #d9a441;
    }
    .logo {
      color: #ffffff;
      font-family: monospace;
      font-size: 28px;
      font-weight: bold;
      letter-spacing: -1px;
    }
    .logo-carnero { color: #d9a441; }
    .logo-dev { color: #92142e; }
    .subtitle {
      color: #d9a441;
      font-family: monospace;
      font-size: 11px;
      letter-spacing: 2px;
      margin-top: 10px;
      text-transform: uppercase;
    }
    .content {
      padding: 40px 30px;
    }
    h1 {
      color: #ffffff;
      font-size: 22px;
      font-weight: 800;
      margin-top: 0;
      margin-bottom: 20px;
    }
    p {
      color: #a0aec0;
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .terminal-box {
      background-color: #050508;
      border-left: 3px solid #d9a441;
      border-radius: 8px;
      font-family: monospace;
      font-size: 13px;
      padding: 20px;
      margin-bottom: 30px;
      text-align: left;
    }
    .terminal-line {
      margin-bottom: 8px;
      font-size: 13px;
    }
    .terminal-line:last-child {
      margin-bottom: 0;
    }
    .label {
      color: #d9a441;
      font-weight: bold;
    }
    .value {
      color: #ffffff;
    }
    .badge {
      background-color: rgba(146, 20, 46, 0.15);
      border: 1px solid rgba(146, 20, 46, 0.3);
      color: #f43f5e;
      display: inline-block;
      font-family: monospace;
      font-size: 11px;
      padding: 4px 10px;
      border-radius: 12px;
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .footer {
      background-color: #050508;
      border-top: 1px solid rgba(217, 164, 65, 0.05);
      padding: 30px;
      text-align: center;
    }
    .footer-text {
      color: #718096;
      font-size: 11px;
      line-height: 1.5;
    }
    .accent {
      color: #d9a441;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="logo">
          &lt;<span class="logo-carnero">Carnero</span><span class="logo-dev">.Dev</span>/&gt;
        </div>
        <div class="subtitle">Build The Future</div>
      </div>
      <div class="content">
        <span class="badge">REGISTRO_CONFIRMADO</span>
        <h1>¡Tu lugar está asegurado, representante!</h1>
        <p>
          Hola <strong class="value">${repName}</strong>, queremos confirmarte que tu equipo ha sido registrado exitosamente en el hackathon universitario de desarrollo de software más esperado. 
        </p>
        <p>
          Prepárate para vivir 36 horas ininterrumpidas de pura programación, diseño de arquitectura y desarrollo de impacto real.
        </p>
        
        <div class="terminal-box">
          <div class="terminal-line"><span class="label">EQUIPO:</span> <span class="value">${teamName}</span></div>
          <div class="terminal-line"><span class="label">REPRESENTANTE:</span> <span class="value">${repName}</span></div>
          <div class="terminal-line"><span class="label">EMAIL:</span> <span class="value">${repEmail}</span></div>
          <div class="terminal-line"><span class="label">INTEGRANTES:</span> <span class="value">${membersCount}</span></div>
          <div class="terminal-line"><span class="label">CATEGORÍA:</span> <span class="value">Build The Future</span></div>
          <div class="terminal-line"><span class="label">STATUS:</span> <span class="value" style="color: #10b981;">[REGISTRATION_SECURED]</span></div>
        </div>
        
        <p>
          El evento dará inicio oficial el <span class="accent">Viernes 16 de Octubre a las 09:00 AM</span>. 
          Asegúrate de llevar tus laptops, cargadores y toda tu energía. ¡Nos vemos en el hack!
        </p>
      </div>
      <div class="header" style="padding: 20px 30px; background: #0b0b10; border-top: 1px solid rgba(217,164,65,0.05); border-bottom: none;">
        <span style="color: #d9a441; font-family: monospace; font-size: 12px; font-weight: bold; letter-spacing: 1px;">"Build The Future"</span>
      </div>
      <div class="footer">
        <div class="footer-text">
          Este es un correo automático del sistema Carnero.Dev.<br>
          ITR Roque • Departamento de TICs.<br>
          <span class="accent">Build The Future. Code The Paradigm.</span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

        const mailResult = await resend.emails.send({
          from: 'Carnero.Dev <onboarding@resend.dev>',
          to: repEmail,
          subject: 'Registro Confirmado — <Carnero.Dev/>',
          html: emailHtml
        });

        if (mailResult.error) {
          console.error('[RESEND_EMAIL_ERROR]', mailResult.error);
          emailErrorMsg = mailResult.error.message;
        } else {
          emailSent = true;
        }
      } catch (err: any) {
        // Safe handling of email error, keeping the registration saved as requested
        console.error('[RESEND_EMAIL_EXCEPTION]', err);
        emailErrorMsg = err && err.message ? err.message : 'Error en la conexión con el servidor de correos.';
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: '¡Registro exitoso!', 
        email_sent: emailSent, 
        email_error: emailErrorMsg 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (err: any) {
    console.error('[SERVER_API_ERROR]', err);
    return new Response(
      JSON.stringify({ error: `[ERROR_INTERNO_DEL_SERVIDOR]: ${err.message || 'Error inesperado.'}` }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
