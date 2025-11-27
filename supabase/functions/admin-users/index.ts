import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = ["http://localhost:8000",
    "http://localhost:8080", "https://4torojo.com"];

serve(async (req) => {
  const origin = req.headers.get("origin") ?? "";
  const headers = {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS, DELETE",
    "Content-Type": "application/json",
  };
  if (req.method === "OPTIONS") return new Response("ok", { headers });

    const PROJECT_URL = Deno.env.get("PROJECT_URL")!;
    const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!;

    

    const supabase = createClient(PROJECT_URL, SERVICE_ROLE_KEY);

  try {
    // ✅ Handle DELETE BEFORE reading the body
    if (req.method === "DELETE") {
      const url = new URL(req.url);
      const id = url.searchParams.get("id");
      if (!id) {
        return new Response(JSON.stringify({ error: "Missing id" }), { status: 400, headers });
      }

      const { error } = await supabase.auth.admin.deleteUser(id);
      if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
      }

      // Optional: cleanup related tables if needed
      // await supabase.from("profiles").delete().eq("id", id);

      return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    }

    // ✅ Only parse JSON for POST
    if (req.method === "POST") {
      const { type, payload } = await req.json();

      if (type === "create") {
        const { name, email, password, is_active = true } = payload as {
          name: string; email: string; password: string; is_active?: boolean;
        };

        const { data, error } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { name, is_active },
        });
        if (error) throw error;

        const userId = data.user.id;
        await supabase.from("profiles").upsert({ id: userId, name });

        return new Response(JSON.stringify({ user: data.user }), { headers });
      }

      return new Response(JSON.stringify({ error: "Bad request" }), { status: 400, headers });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), { status: 500, headers });
  }
});


serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const payload = await req.json();

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

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Faltan campos obligatorios" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not set");
      return new Response(
        JSON.stringify({ error: "Email provider not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    const html = `
      <h2>Nuevo mensaje desde el formulario de contacto</h2>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Correo:</strong> ${email}</p>
      <p><strong>Teléfono:</strong> ${phone || "No especificado"}</p>
      <p><strong>Fecha del evento:</strong> ${eventDate || "No especificada"}</p>
      <p><strong>Lugar/Ciudad:</strong> ${venue || "No especificado"}</p>
      <p><strong>Tipo de servicio:</strong> ${serviceType || "No especificado"}</p>
      <p><strong>Rango de presupuesto:</strong> ${budgetRange || "No especificado"}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${(message || "").replace(/\n/g, "<br>")}</p>
    `;

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Cuarto Rojo <no-reply@4torojo.com>", // ajusta el dominio
        to: ["ventas@4torojo.com"],                 // destinatario(s)
        subject: `Nuevo contacto: ${name} - ${serviceType || "Sin tipo"}`,
        html,
      }),
    });

    if (!emailRes.ok) {
      const text = await emailRes.text();
      console.error("Error sending email via Resend:", text);
      return new Response(
        JSON.stringify({ error: "Error enviando el correo" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unexpected error in send-contact-email:", err);
    return new Response(
      JSON.stringify({ error: "Unexpected error" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});
