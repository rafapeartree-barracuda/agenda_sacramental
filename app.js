const API_URL = "https://script.google.com/macros/s/AKfycbyFzg_byTiq3X2n5oHg6SMBIafwSwxiE9RJ1HE5coXzc5glvk0-2aelqN0qA4FSMkpGlg/exec";

const $ = (s) => document.querySelector(s);
const esc = (s = "") => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
function formatDate(iso) { if (!iso) return ""; const [y,m,d] = iso.split("-"); return `${d}/${m}/${y}`; }
function dateObj(iso) { const [y,m,d] = iso.split("-").map(Number); return new Date(y,m-1,d); }
function weekday(iso) { return new Intl.DateTimeFormat("pt-BR", {weekday:"long"}).format(dateObj(iso)); }
function cleanDate(v) {
  if (!v) return null;
  if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  const m = String(v).match(/(\d{4})[-/](\d{2})[-/](\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : null;
}
function normalizeDates(payload) {
  const candidates = [
    payload?.dados?.datas,
    payload?.dados?.reunioes,
    payload?.dados,
    payload?.datas,
    payload?.data?.datas
  ];
  for (const c of candidates) {
    if (!Array.isArray(c)) continue;
    const dates = c.map(x => typeof x === "string" ? cleanDate(x) : cleanDate(x?.data || x?.date || x?.dia || x?.Data)).filter(Boolean);
    if (dates.length) return [...new Set(dates)].sort();
  }
  return [];
}

async function api(path = "") {
  const r = await fetch(API_URL + path, {cache:"no-store"});
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const p = await r.json();
  if (p.sucesso === false) throw new Error(p.mensagem || p.erro || "A API não conseguiu carregar os dados.");
  return p;
}

function musicText(m) {
  if (m == null) return null;
  if (typeof m === "string" || typeof m === "number") return String(m).trim() || null;
  if (typeof m === "object") {
    const value = m.texto ?? m.nome ?? m.descricao ?? m.valor ?? m.musica;
    if (value != null && typeof value !== "object") return String(value).trim() || null;
  }
  return null;
}

function hymn(h, label) {
  if (!h || (!h.numero && !h.nome)) return `<div class="mini-row"><b>${esc(label)}</b><span class="missing">Não definido</span></div>`;
  return `<div class="mini-row"><b>${esc(label)}</b><span>${h.numero ? `#${esc(h.numero)} · ` : ""}${esc(h.nome || "")}</span></div>`;
}
function person(p, label) {
  if (!p) return `<div class="mini-row"><b>${esc(label)}</b><span class="missing">Não definido</span></div>`;
  return `<div class="mini-row"><b>${esc(label)}</b><span>${esc(p.nome || p)}</span></div>`;
}
function listRows(items, empty) {
  if (!items?.length) return `<div class="empty">${esc(empty)}</div>`;
  return `<div class="list">${items.map((x,i) => `<div class="list-row"><span class="list-index">${x.ordem || i+1}</span><div><strong>${esc(x.nome || "Nome não informado")}</strong>${x.acao ? `<small>${esc(x.acao)}</small>` : ""}${x.chamado ? `<span>${esc(x.chamado)}</span>` : ""}${x.tema ? `<span>Tema: ${esc(x.tema)}</span>` : ""}</div></div>`).join("")}</div>`;
}
function announcementRows(items) {
  if (!items?.length) return `<div class="empty">Nenhum anúncio cadastrado.</div>`;
  return `<div class="list">${items.map(a => `<div class="notice"><strong>${esc(a.titulo || a.texto || "Anúncio")}</strong>${a.texto && a.texto !== a.titulo ? `<span>${esc(a.texto)}</span>` : ""}${a.data || a.observacao ? `<small>${a.data ? esc(formatDate(a.data)) : ""}${a.data && a.observacao ? " · " : ""}${a.observacao ? esc(a.observacao) : ""}</small>` : ""}</div>`).join("")}</div>`;
}
function speaker(o, label) {
  if (!o) return `<div class="speaker missing-card"><b>${esc(label)}</b><span>Orador ainda não cadastrado.</span></div>`;
  return `<div class="speaker"><div class="speaker-top"><span>${esc(label)}</span>${o.minutos != null ? `<b>${esc(o.minutos)} min</b>` : ""}</div><strong>${esc(o.nome)}</strong>${o.tema ? `<span class="theme">${esc(o.tema)}</span>` : ""}${o.recurso ? `<details><summary>Recurso do discurso</summary><p>${esc(o.recurso)}</p></details>` : ""}</div>`;
}

function renderAgenda(d) {
  const b = d.boasVindas || {}, a = d.abertura || {}, s = d.sacramento || {}, e = d.encerramento || {};
  const oradores = d.oradores || [];
  const agenda = $("#agenda");
  $("#meetingTitle").textContent = d.reuniao?.titulo || "Agenda Sacramental";
  $("#meetingMeta").textContent = `${d.reuniao?.ala || ""} · ${formatDate(d.reuniao?.data)} · ${d.reuniao?.cidade || ""}`;
  $("#selectedDate").textContent = formatDate(d.reuniao?.data);

  const cards = [
    {num:"01", title:"Boas-vindas", cls:"blue", content:`${person(b.preside,"Preside")}${person(b.dirige,"Dirige")}${listRows(b.reconhecimentos,"Nenhum reconhecimento cadastrado.")}${listRows(b.visitantes,"Nenhum visitante ou autoridade cadastrado.")}${musicText(b.musica) ? `<div class="mini-row"><b>Música</b><span>${esc(musicText(b.musica))}</span></div>` : `<div class="mini-row"><b>Música</b><span class="missing">Não definida</span></div>`}${b.recepcao ? `<div class="mini-row"><b>Recepção</b><span>${esc(b.recepcao)}</span></div>` : ""}${announcementRows(b.anuncios)}`},
    {num:"02", title:"Abertura", cls:"purple", content:`${hymn(a.hino,"Hino inicial")}${a.oracao ? `<div class="mini-row"><b>Oração inicial</b><span>${esc(a.oracao)}</span></div>` : `<div class="mini-row"><b>Oração inicial</b><span class="missing">Não definida</span></div>`}`},
    {num:"03", title:"Apoios e desobrigações", cls:"orange", content:`<div class="subhead">Apoios</div>${listRows(d.apoios,"Nenhum apoio cadastrado.")}<div class="subhead">Desobrigações</div>${listRows(d.desobrigacoes,"Nenhuma desobrigação cadastrada.")}`},
    {num:"04", title:"Sacramento", cls:"red", content:hymn(s.hino,"Hino sacramental")},
    {num:"05", title:"Oradores", cls:"teal", content:`${speaker(oradores[0],"1º Orador")}${speaker(oradores[1],"2º Orador")}${hymn(d.hinoIntermediario,"Hino intermediário")}${speaker(oradores[2],"Último Orador")}`},
    {num:"06", title:"Encerramento", cls:"purple", content:`${hymn(e.hino,"Hino de encerramento")}${e.oracao ? `<div class="mini-row"><b>Oração final</b><span>${esc(e.oracao)}</span></div>` : `<div class="mini-row"><b>Oração final</b><span class="missing">Não definida</span></div>`}${d.lembrete ? `<div class="reminder"><b>Lembrete</b><span>${esc(d.lembrete)}</span></div>` : ""}`}
  ];

  agenda.innerHTML = `<button class="conduct-btn conduct-top" id="conductBtn">▶&nbsp; Modo Conduzir</button>` + cards.map(c => `<section class="card"><div class="section-head"><div class="number ${c.cls}">${c.num}</div><h2>${esc(c.title)}</h2><span class="chevron">⌄</span></div><div class="content">${c.content}</div></section>`).join("");
  $("#conductBtn").onclick = () => location.href = `conduzir/index.html?data=${encodeURIComponent(d.reuniao.data)}`;
}

async function loadAgenda(date) {
  showView("agenda");
  $("#agenda").innerHTML = `<div class="loading">Carregando a agenda…</div>`;
  try { const p = await api(`?data=${encodeURIComponent(date)}`); if (!p.dados) throw new Error("A API não retornou a reunião."); renderAgenda(p.dados); }
  catch (e) { $("#agenda").innerHTML = `<div class="error"><strong>Não foi possível carregar esta reunião.</strong><span>${esc(e.message)}</span></div>`; }
}

function showView(view) {
  ["selector","agenda"].forEach(v => $(`#view-${v}`).classList.toggle("hidden", v !== view));
  $(".nav-agenda").classList.toggle("active", view === "agenda");
  $(".nav-dates").classList.toggle("active", view === "selector");
}

function renderDates(dates) {
  const today = new Date(); today.setHours(0,0,0,0);
  const parsed = dates.map(iso => ({iso, date:dateObj(iso)}));
  const future = parsed.filter(x => x.date >= today).sort((a,b) => a.date-b.date);
  const past = parsed.filter(x => x.date < today).sort((a,b) => b.date-a.date);
  const next = future[0];

  $("#nextMeeting").innerHTML = next
    ? `<div class="next-label">PRÓXIMA REUNIÃO</div><div class="next-date">${esc(formatDate(next.iso))}</div><div class="next-weekday">${esc(weekday(next.iso))}</div><button id="openNext">Abrir agenda</button>`
    : `<div class="next-label">PRÓXIMA REUNIÃO</div><div class="empty">Nenhuma data futura encontrada.</div>`;
  if (next) $("#openNext").onclick = () => loadAgenda(next.iso);

  const select = $("#dateSelect");
  select.innerHTML = "";
  if (!dates.length) {
    select.innerHTML = `<option value="">Nenhuma reunião encontrada</option>`;
    select.disabled = true;
    return;
  }
  const makeOptions = (items, label) => {
    const group = document.createElement("optgroup");
    group.label = label;
    items.forEach(x => {
      const option = document.createElement("option");
      option.value = x.iso;
      option.textContent = `${formatDate(x.iso)} · ${weekday(x.iso)}`;
      group.appendChild(option);
    });
    if (items.length) select.appendChild(group);
  };
  makeOptions(future, "Próximos domingos");
  makeOptions(past, "Domingos anteriores");
  select.disabled = false;
  select.onchange = () => { if (select.value) loadAgenda(select.value); };
  if (next) select.value = next.iso;
}

async function loadDates() {
  showView("selector");
  $("#dateSelect").disabled = true;
  $("#dateSelect").innerHTML = `<option>Carregando datas…</option>`;
  try { const p = await api("?acao=datas"); const dates = normalizeDates(p); if (!dates.length) throw new Error("A API não retornou datas de reuniões."); renderDates(dates); }
  catch(e) { $("#dateSelect").innerHTML = `<option>Erro ao carregar datas</option>`; $("#dateSelect").disabled = true; $("#nextMeeting").innerHTML = `<div class="error"><strong>Não foi possível carregar as datas.</strong><span>${esc(e.message)}</span></div>`; }
}

$("#navDates").onclick = loadDates;
$("#navAgenda").onclick = () => { const date = new URLSearchParams(location.search).get("data"); if (date) loadAgenda(date); else loadDates(); };
$("#backDates").onclick = loadDates;

const initialDate = new URLSearchParams(location.search).get("data");
if (initialDate) loadAgenda(initialDate); else loadDates();
