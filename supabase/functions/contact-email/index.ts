import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  eventDate?: string;
  venue?: string;
  serviceType?: string;
  budgetRange?: string;
  message?: string;
};

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const payload = (await req.json()) as ContactPayload;

    const {
      name,
      email,
      phone,
      eventDate,
      venue,
      serviceType,
      budgetRange,
      message,
    } = payload ?? {};

    // Validación básica
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Faltan campos obligatorios" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 🔐 API key de Resend desde variables de entorno
    const RESEND_API_KEY = "re_BYzDn7Ra_NJcHvHbLcJUw4ShySQBSXdat";//Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      // ⚠️ Si ves este error, revisa la config de env vars de la función en Supabase
      return new Response(
        JSON.stringify({ error: "RESEND_API_KEY not set" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 🎨 HTML bonito del correo
    const html = `
      <div style="
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: #fafafa;
        padding: 24px;
        color: #333;
      ">
        <div style="
          max-width: 600px;
          margin: auto;
          background: white;
          padding: 32px;
          border-radius: 12px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          border: 1px solid #eee;
        ">

          <!-- Header -->
          <h2 style="
            margin-top: 0;
            font-size: 26px;
            font-weight: 700;
            color: #BF1E2E;
          ">
            Nuevo Mensaje de Contacto — Cuarto Rojo
          </h2>

          <p style="margin-top: 4px; font-size: 16px; color: #555;">
            Se ha recibido una nueva solicitud de cotización desde el sitio web.
          </p>

          <hr style="border: 0; border-top: 1px solid #eee; margin: 24px 0;" />

          <!-- Client Info -->
          <h3 style="font-size: 20px; margin-bottom: 8px; color: #222;">Información del Cliente</h3>
          <p style="margin: 6px 0;"><strong>Nombre:</strong> ${name}</p>
          <p style="margin: 6px 0;"><strong>Correo:</strong> ${email}</p>
          <p style="margin: 6px 0;"><strong>Teléfono:</strong> ${phone || "No especificado"}</p>

          <hr style="border: 0; border-top: 1px solid #eee; margin: 24px 0;" />

          <!-- Event Info -->
          <h3 style="font-size: 20px; margin-bottom: 8px; color: #222;">Detalles del Evento</h3>

          <p style="margin: 6px 0;"><strong>Fecha del Evento:</strong> ${
            eventDate || "No especificada"
          }</p>
          <p style="margin: 6px 0;"><strong>Lugar:</strong> ${
            venue || "No especificado"
          }</p>
          <p style="margin: 6px 0;"><strong>Tipo de Servicio:</strong> ${
            serviceType || "No especificado"
          }</p>
          <p style="margin: 6px 0;"><strong>Rango de Presupuesto:</strong> ${
            budgetRange || "No especificado"
          }</p>

          <hr style="border: 0; border-top: 1px solid #eee; margin: 24px 0;" />

          <!-- Message -->
          <h3 style="font-size: 20px; margin-bottom: 8px; color: #222;">Mensaje del Cliente</h3>

          <div style="
            background: #f8f8f8;
            padding: 16px;
            border-radius: 8px;
            border: 1px solid #eee;
            line-height: 1.6;
            white-space: pre-wrap;
          ">
            ${(message || "").replace(/\n/g, "<br>")}
          </div>

          <p style="margin-top: 32px; font-size: 13px; color: #777; text-align: center;">
            Este mensaje fue generado automáticamente por el sitio web de Cuarto Rojo.
          </p>
        </div>
      </div>
    `;

    // 📤 Llamada a Resend
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Mientras tu dominio no esté verificado en Resend, usa el sender de prueba:
        from: "Cuarto Rojo <onboarding@resend.dev>",
        // Cuando verifiques 4torojo.com, puedes cambiar a:
        // from: "Cuarto Rojo <no-reply@4torojo.com>",
        to: ["kabrandtf@gmail.com"], // o ventas@4torojo.com
        subject: `Nuevo contacto: ${name} ${
          serviceType ? `– ${serviceType}` : ""
        }`,
        html,
      }),
    });

    if (!emailRes.ok) {
      const errorText = await emailRes.text();
      return new Response(
        JSON.stringify({
          error: "Email failed",
          status: emailRes.status,
          body: errorText,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unexpected error in contact-email:", err);
    return new Response(
      JSON.stringify({ error: "Unexpected error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
