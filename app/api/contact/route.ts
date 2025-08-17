export const runtime = "nodejs";

import { NextResponse } from "next/server";

type Payload = {
  name: string;
  email: string;
  message: string;
  service: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<Payload>;
    const name = (body.name || "").trim();
    const email = (body.email || "").trim();
    const message = (body.message || "").trim();
    const service = (body.service || "").trim();

    if (!name || !email || !message || !service) {
      return NextResponse.json({ ok: false, error: "VALIDATION_ERROR" }, { status: 400 });
    }

    const data = {
      name,
      email,
      message,
      service,
      submittedAt: new Date().toISOString(),
      source: "ai-site-web",
    };

    // 1) Try SendGrid REST API if configured
    const sgKey = process.env.SENDGRID_API_KEY;
    const sgFrom = process.env.SENDGRID_FROM;
    const sgTo = process.env.SENDGRID_TO;

    if (sgKey && sgFrom && sgTo) {
      const sgResp = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${sgKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: sgTo }], subject: `Заявка с сайта: ${service}` }],
          from: { email: sgFrom, name: "AI Site Web" },
          content: [{
            type: "text/plain",
            value: `Имя: ${name}\nEmail: ${email}\nУслуга: ${service}\nСообщение:\n${message}\n`
          }]
        })
      });
      if (!sgResp.ok) {
        const text = await sgResp.text();
        console.error("SendGrid error:", text);
      }
    } else {
      // 2) Try Mailgun REST API if configured
      const mgKey = process.env.MAILGUN_API_KEY;
      const mgDomain = process.env.MAILGUN_DOMAIN;
      const mgTo = process.env.MAILGUN_TO;
      const mgFrom = process.env.MAILGUN_FROM || "no-reply@ai-site-web.local";

      if (mgKey && mgDomain && mgTo) {
        const basic = Buffer.from(`api:${mgKey}`).toString("base64");
        const form = new URLSearchParams();
        form.append("from", mgFrom);
        form.append("to", mgTo);
        form.append("subject", `Заявка с сайта: ${service}`);
        form.append("text", `Имя: ${name}\nEmail: ${email}\nУслуга: ${service}\nСообщение:\n${message}\n`);

        const mgResp = await fetch(`https://api.mailgun.net/v3/${mgDomain}/messages`, {
          method: "POST",
          headers: { "Authorization": `Basic ${basic}` },
          body: form
        });
        if (!mgResp.ok) {
          const text = await mgResp.text();
          console.error("Mailgun error:", text);
        }
      } else {
        // 3) Fallback: generic webhook
        const url = process.env.CONTACT_WEBHOOK_URL;
        if (url) {
          await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
          });
        } else {
          // 4) If nothing configured — log on server
          console.log("Contact form submission:", data);
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
