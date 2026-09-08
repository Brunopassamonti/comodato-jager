import { getStore } from "@netlify/blobs";

const STATUSES = ["Rascunho","Solicitado","Em aprovação","Aprovado","Máquina reservada","Contrato enviado","Assinado","Instalação agendada","Instalado","Ativo"];
const ALLOWED = ["requestId","status","nomeFantasia","razaoSocial","cnpj","nomeBa","prioridade","pilar","justificativa","volumeEstimado","poAtual","localInstalacao","equipTipo","equipModelo","equipSerie","equipPatrimonio","equipVolt","dataInstalacao","fotoInstalacao","bamAtualizado","observacao","updatedAt"];
const headers = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };
const json = (data, status=200) => new Response(JSON.stringify(data), { status, headers });

function same(value, expected) {
  if (!value || !expected || value.length !== expected.length) return false;
  let diff = 0;
  for (let i=0;i<value.length;i++) diff |= value.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

function clean(input) {
  const out = {};
  for (const key of ALLOWED) if (input[key] !== undefined) out[key] = typeof input[key] === "string" ? input[key].trim().slice(0, key === "justificativa" || key === "observacao" ? 1200 : 240) : input[key];
  return out;
}

export default async (req) => {
  let parsedBody = null;
  if (req.method === "POST") {
    try { parsedBody = await req.json(); } catch { return json({ error: "JSON inválido" }, 400); }
    if (parsedBody.ping) return json({ ok: true, shared: true });
  }

  const teamSecret = process.env.TEAM_ACCESS_PIN;
  const managerSecret = process.env.MANAGER_PIN;
  if (!teamSecret || !managerSecret) return json({ error: "Acesso do time não configurado" }, 503);
  if (!same(req.headers.get("x-team-pin") || "", teamSecret)) return json({ error: "PIN do time inválido" }, 401);

  const store = getStore("comodato-processos");

  if (req.method === "GET") {
    const { blobs } = await store.list({ prefix: "processo/" });
    const records = (await Promise.all(blobs.slice(0, 300).map(x => store.get(x.key, { type: "json", consistency: "strong" })))).filter(Boolean).sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0));
    return json({ records });
  }

  if (req.method !== "POST") return json({ error: "Método não permitido" }, 405);

  const body = parsedBody;
  if (body.action !== "upsert" || !body.record) return json({ error: "Ação inválida" }, 400);

  const record = clean(body.record);
  if (!/^COM-\d{4}-\d{6}$/.test(record.requestId || "")) return json({ error: "ID inválido" }, 400);
  if (!STATUSES.includes(record.status)) return json({ error: "Status inválido" }, 400);
  if (!record.nomeFantasia || !record.nomeBa || !record.cnpj) return json({ error: "Dados operacionais incompletos" }, 400);

  const key = `processo/${record.requestId}`;
  const current = await store.get(key, { type: "json", consistency: "strong" });
  const managerOnly = record.status === "Aprovado" || (current?.status === "Em aprovação" && record.status === "Rascunho");
  if (managerOnly && !same(req.headers.get("x-manager-pin") || "", managerSecret)) return json({ error: "Ação exclusiva do gestor" }, 403);

  if (!current && !["Rascunho","Solicitado"].includes(record.status)) return json({ error: "Registre a solicitação antes de avançar" }, 409);
  if (current) {
    const from = STATUSES.indexOf(current.status), to = STATUSES.indexOf(record.status);
    const managerReturn = current.status === "Em aprovação" && record.status === "Rascunho";
    if (!managerReturn && (to < from || to > from + 1)) return json({ error: "Transição de status inválida" }, 409);
  }
  if (STATUSES.indexOf(record.status) >= STATUSES.indexOf("Máquina reservada") && !record.equipSerie) return json({ error: "Número de série obrigatório" }, 400);
  if (["Instalado","Ativo"].includes(record.status) && (!record.dataInstalacao || !record.fotoInstalacao || !record.bamAtualizado)) return json({ error: "Foto, data e BAM são obrigatórios" }, 400);

  const saved = { ...current, ...record, updatedAt: Date.now() };
  await store.setJSON(key, saved);
  return json({ ok: true, record: saved });
};

export const config = { path: "/.netlify/functions/workflow" };
