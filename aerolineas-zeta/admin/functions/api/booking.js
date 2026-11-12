
export async function onRequestPost({ request, env }) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  };

  const reply = (data, status = 200) =>
    new Response(JSON.stringify(data), { status, headers });

  try {
    if (!env.RESEND_API_KEY) {
      return reply({ ok: false, error: "Service unavailable" }, 503);
    }

    const type = request.headers.get("content-type") || "";
    if (!type.includes("application/json")) {
      return reply({ ok: false, error: "Invalid content type" }, 415);
    }

    const body = await request.json();

    // Camp antispam ocult
    if (body.website) {
      return reply({ ok: true });
    }

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const message = String(body.message || "").trim();

    if (
      !name || name.length > 150 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      email.length > 254 ||
      !message || message.length > 5000
    ) {
      return reply({ ok: false, error: "Invalid form data" }, 400);
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Aerolíneas Zeta Web <booking@aerolineaszeta.com>",
        to: ["booking@aerolineaszeta.com"],
        reply_to: email,
        subject: "Nova consulta de booking — Aerolíneas Zeta",
        text:
          `Nom: ${name}\n` +
          `Correu: ${email}\n\n` +
          `Missatge:\n${message}`
      })
    });

    if (!response.ok) {
      console.error("Resend error:", response.status);
      return reply({ ok: false, error: "Email delivery failed" }, 502);
    }

    return reply({ ok: true });
  } catch (error) {
    console.error("Booking function error:", error);
    return reply({ ok: false, error: "Unexpected error" }, 500);
  }
}
