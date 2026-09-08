// Proxy da leitura do cartão CNPJ.
// A chave da Anthropic fica em variável de ambiente no Netlify (ANTHROPIC_API_KEY),
// nunca no navegador do BA.

const PROMPT = `Cartão CNPJ. Responda só JSON, sem markdown:
{"razaoSocial":"","cnpj":"XX.XXX.XXX/XXXX-XX","logradouro":"rua e número","bairro":"","cidade":"","estado":"sigla","cep":"XXXXX-XXX","ie":""}`;
const headers = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };
const json = (data, status=200) => new Response(JSON.stringify(data), { status, headers });
const same = (value, expected) => {if (!value || !expected || value.length !== expected.length) return false;let diff=0;for(let i=0;i<value.length;i++)diff|=value.charCodeAt(i)^expected.charCodeAt(i);return diff===0;};

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "JSON inválido" }, 400);
  }

  // handshake usado pelo app para saber se o proxy existe
  if (body.ping) {
    return json({ ok: true });
  }
  const teamPin=process.env.TEAM_ACCESS_PIN;
  if(teamPin&&!same(req.headers.get("x-team-pin")||"",teamPin))return json({error:"PIN do time inválido"},401);

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return json({ error: "ANTHROPIC_API_KEY não configurada" }, 500);
  }
  if (!body.pdf) {
    return json({ error: "PDF ausente" }, 400);
  }
  if(body.pdf.length>11_200_000)return json({error:"PDF excede 8 MB"},413);

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 700,
        messages: [{
          role: "user",
          content: [
            { type: "document", source: { type: "base64", media_type: "application/pdf", data: body.pdf } },
            { type: "text", text: PROMPT },
          ],
        }],
      }),
    });

    const data = await res.json();
    if (data.error) {
      return json({ error: data.error.message }, 502);
    }

    const txt = (data.content || []).find(b => b.type === "text")?.text || "";
    const parsed = JSON.parse(txt.replace(/```json|```/g, "").trim());
    return json(parsed);
  } catch (e) {
    return json({ error: String(e.message || e) }, 502);
  }
};

export const config = { path: "/.netlify/functions/cnpj" };
