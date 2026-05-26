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

        // Plain Text Fallback for anti-spam filters
        const emailText = `Hola ${repName},

Tu registro para Carnero.Dev fue confirmado exitosamente.

Equipo: ${teamName}
Representante: ${repName}
Integrantes: ${membersCount}

Nos vemos en el hackathon.
Build The Future.`;

        // Simplified, high-deliverability Table-based HTML Email Template
        // Optimized for Gmail, Outlook, Yahoo Mail, and Mobile Screens
        const emailHtml = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="es">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Registro Confirmado</title>
</head>
<body style="background-color: #07070a; color: #abb2bf; font-family: Arial, sans-serif; margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #07070a; padding: 40px 10px;">
    <tr>
      <td align="center">
        <!-- Main Email Container Table -->
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #0f0f15; border: 1px solid #1f1f2e; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);">
          
          <!-- Header (Burgundy Banner) -->
          <tr>
            <td align="center" style="background-color: #4a0e17; padding: 30px 20px; border-bottom: 2px solid #d9a441;">
              <span style="color: #ffffff; font-family: monospace; font-size: 24px; font-weight: bold; letter-spacing: -1px;">
                &lt;<span style="color: #d9a441;">Carnero</span><span style="color: #ffffff;">.Dev</span>/&gt;
              </span>
              <div style="color: #d9a441; font-family: monospace; font-size: 11px; letter-spacing: 2px; margin-top: 6px; text-transform: uppercase;">
                Build The Future
              </div>
            </td>
          </tr>
          
          <!-- Body Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h1 style="color: #ffffff; font-size: 20px; font-weight: bold; margin-top: 0; margin-bottom: 20px;">
                ¡Tu registro ha sido confirmado!
              </h1>
              
              <p style="color: #abb2bf; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
                Hola <strong style="color: #ffffff;">${repName}</strong>,
              </p>
              
              <p style="color: #abb2bf; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
                Te confirmamos que hemos recibido y registrado correctamente la solicitud de tu equipo para participar en **&lt;Carnero.Dev/&gt; — Build The Future**. Nos da mucho gusto recibir a estudiantes de ingenierías y tecnología para colaborar, proponer soluciones creativas y desarrollar proyectos con impacto real.
              </p>
              
              <!-- Data Table -->
              <table width="100%" border="0" cellspacing="0" cellpadding="10" style="background-color: #050508; border-left: 3px solid #d9a441; border-radius: 6px; margin-bottom: 30px; font-family: monospace; font-size: 13px;">
                <tr>
                  <td width="35%" style="color: #d9a441; font-weight: bold; padding: 8px 12px;">EQUIPO:</td>
                  <td width="65%" style="color: #ffffff; padding: 8px 12px;">${teamName}</td>
                </tr>
                <tr>
                  <td style="color: #d9a441; font-weight: bold; padding: 8px 12px;">REPRESENTANTE:</td>
                  <td style="color: #ffffff; padding: 8px 12px;">${repName}</td>
                </tr>
                <tr>
                  <td style="color: #d9a441; font-weight: bold; padding: 8px 12px;">CORREO:</td>
                  <td style="color: #ffffff; padding: 8px 12px;">${repEmail}</td>
                </tr>
                <tr>
                  <td style="color: #d9a441; font-weight: bold; padding: 8px 12px;">INTEGRANTES:</td>
                  <td style="color: #ffffff; padding: 8px 12px;">${membersCount} integrantes</td>
                </tr>
                <tr>
                  <td style="color: #d9a441; font-weight: bold; padding: 8px 12px;">CATEGORÍA:</td>
                  <td style="color: #ffffff; padding: 8px 12px;">Build The Future</td>
                </tr>
              </table>
              
              <p style="color: #abb2bf; font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
                El hackathon comenzará el **Viernes 16 de Octubre**. En los próximos días recibirás más información sobre los horarios detallados, requerimientos técnicos y recomendaciones para tu llegada. ¡Prepárate para codificar y construir el futuro!
              </p>
              
              <!-- CTA Button Table -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 10px;">
                <tr>
                  <td align="center">
                    <a href="https://carnero-dev.tech" target="_blank" style="background-color: #d9a441; color: #07070a; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; text-decoration: none; padding: 12px 28px; border-radius: 6px; display: inline-block;">
                      Ver información del evento
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #050508; border-top: 1px solid #1f1f2e; padding: 30px 20px; color: #718096; font-size: 11px; line-height: 1.6;">
              Este es un correo automático enviado por el sistema de registro de Carnero.Dev.<br />
              ITR Roque • Departamento de TICs.<br />
              <span style="color: #d9a441;">Build The Future. Code The Paradigm.</span>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

        const mailResult = await resend.emails.send({
          from: 'Carnero.Dev <registro@carnero-dev.tech>',
          to: repEmail,
          subject: 'Tu registro para Carnero.Dev fue confirmado',
          text: emailText,
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
