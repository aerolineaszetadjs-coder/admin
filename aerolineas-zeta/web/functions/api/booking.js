
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

    // Camp ocult per detectar enviaments automàtics
    if (body.website) {
      return reply({ ok: true });
    }

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const organization = String(body.organization || "").trim();
    const date = String(body.date || "").trim();
    const place = String(body.place || "").trim();
    const message = String(body.message || "").trim();

    if (
      !name || name.length > 200 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      email.length > 200 ||
      organization.length > 200 ||
      (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) ||
      place.length > 200 ||
      !message || message.length > 5000
    ) {
      return reply({ ok: false, error: "Invalid form data" }, 400);
    }

    const text = [
      `Nom: ${name}`,
      `Correu: ${email}`,
      `Organització: ${organization || "No indicada"}`,
      `Data de l'esdeveniment: ${date || "No indicada"}`,
      `Lloc: ${place || "No indicat"}`,
      "",
      "Missatge:",
      message
    ].join("\n");

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
        text
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
