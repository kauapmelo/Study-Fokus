document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // TEMA (cor da matéria)
  // =========================

  const header = document.querySelector(".header");
  const tituloMateria = document.getElementById("tituloMateria");

  const materiaSalva = localStorage.getItem("materiaSelecionada");

  if (materiaSalva) {
    tituloMateria.textContent = materiaSalva;
  };
  
  

  // Cor salva quando você cria a matéria (ex.: "Azul", "Verde"...)
  const corMateriaRaw = localStorage.getItem("corMateria") || "Azul";
  const corMateria = corMateriaRaw.charAt(0).toUpperCase() + corMateriaRaw.slice(1).toLowerCase();

  // Paleta (cor principal + cor escura para hover/gradiente)
  const tema = {
    Azul: { c1: "#2563eb", c2: "#1e40af" },
    Verde: { c1: "#22c55e", c2: "#15803d" },
    Roxo: { c1: "#7c3aed", c2: "#5b21b6" },
    Laranja: { c1: "#f97316", c2: "#c2410c" },
    Rosa: { c1: "#ec4899", c2: "#9d174d" },
    Ciano: { c1: "#06b6d4", c2: "#0e7490" },
  };

  const t = tema[corMateria] || tema.Azul;

  // 1) Header com classe (seu CSS já tem .header.Azul etc.)
  if (header) {
    header.classList.remove("Azul", "Verde", "Roxo", "Laranja", "Rosa", "Ciano", "azul", "verde", "roxo", "laranja", "rosa", "ciano");
    header.classList.add(corMateria); // "Azul", "Verde"...
  }

  // 2) Variáveis CSS para colorir cronômetro e botões (caso seu CSS use --tema-1/--tema-2)
  document.documentElement.style.setProperty("--tema-1", t.c1);
  document.documentElement.style.setProperty("--tema-2", t.c2);

  // 3) Aplica cor diretamente em elementos (mesmo se não usar variáveis no CSS)
  const progressoFill = document.querySelector(".progresso > div");
  if (progressoFill) progressoFill.style.backgroundColor = t.c1;

  const botaoAssunto = document.querySelector(".botaoAssunto");
  if (botaoAssunto) botaoAssunto.style.backgroundColor = t.c1;

  document.querySelectorAll(".acoes button").forEach((b) => (b.style.backgroundColor = t.c1));

  const circulo = document.querySelector(".circulo");
  if (circulo) {
    circulo.style.background = `linear-gradient(135deg, ${t.c1}, ${t.c2})`;
    circulo.style.border = `3px solid ${t.c1}`;
  }

  const timeEl = document.querySelector(".time");
  if (timeEl) timeEl.style.color = t.c1;

  const icone = document.querySelector(".icone");
  if (icone) {
    icone.style.backgroundColor = "rgba(255,255,255,0.18)"; // fica bonito no header
    icone.style.borderRadius = "14px";
    icone.style.padding = "8px 10px";
    icone.style.display = "inline-flex";
    icone.style.alignItems = "center";
    icone.style.justifyContent = "center";
  }

  // =========================
  // CHECKLIST (To-do)
  // =========================
  const inputAssunto = document.querySelector(".addAssunto input");
  const btnAdd = document.querySelector(".botaoAssunto");
  const lista = document.querySelector(".lista");
  const contador = document.querySelector(".card .card-header span"); // primeiro card (Assuntos)

  function obterItens() {
    return Array.from(lista.querySelectorAll(".item"));
  }

  function atualizarChecklistUI() {
    const itens = obterItens();
    const total = itens.length;
    const concluidos = itens.filter((li) => li.querySelector('input[type="checkbox"]').checked).length;

    if (contador) contador.textContent = `${concluidos}/${total} concluídos`;

    const pct = total === 0 ? 0 : Math.round((concluidos / total) * 100);
    if (progressoFill) progressoFill.style.width = `${pct}%`;
  }

  function ligarEventosItem(li) {
    const checkbox = li.querySelector('input[type="checkbox"]');
    if (!checkbox) return;

    checkbox.addEventListener("change", () => {
      li.style.opacity = checkbox.checked ? "0.7" : "1";
      li.style.textDecoration = checkbox.checked ? "line-through" : "none";
      atualizarChecklistUI();
    });
  }

  // Ligar nos itens que já existem no HTML
  obterItens().forEach(ligarEventosItem);

  function criarItem(texto) {
    const li = document.createElement("li");
    li.classList.add("item");
    li.innerHTML = `
      <input type="checkbox">
      <span></span>
    `;
    li.querySelector("span").textContent = texto;
    ligarEventosItem(li);
    return li;
  }

  btnAdd.addEventListener("click", () => {
    const texto = inputAssunto.value.trim();
    if (!texto) return;

    lista.appendChild(criarItem(texto));
    inputAssunto.value = "";
    atualizarChecklistUI();
  });

  inputAssunto.addEventListener("keydown", (e) => {
    if (e.key === "Enter") btnAdd.click();
  });

  atualizarChecklistUI();

  // =========================
  // CRONÔMETRO
  // =========================
  const timeDisplay = document.querySelector(".time");
  const statusDisplay = document.querySelector(".status");
  const btnPlay = document.querySelector(".acoes button:nth-child(1)");
  const btnReset = document.querySelector(".acoes button:nth-child(2)");

  let tempoTotal = 25 * 60;
  let tempoAtual = tempoTotal;
  let intervalo = null;
  let rodando = false;

  function formatarTempo(segundos) {
    const min = Math.floor(segundos / 60);
    const sec = segundos % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }

  function renderTempo() {
    timeDisplay.textContent = formatarTempo(tempoAtual);
  }

  function setStatus(texto) {
    statusDisplay.textContent = texto;
  }

  function parar() {
    clearInterval(intervalo);
    intervalo = null;
    rodando = false;
    btnPlay.textContent = "▶";
  }

  function iniciar() {
    if (rodando) return;

    rodando = true;
    setStatus("Em andamento");
    btnPlay.textContent = "⏸";

    intervalo = setInterval(() => {
      if (tempoAtual > 0) {
        tempoAtual--;
        renderTempo();
      } else {
        parar();
        setStatus("Finalizado");
      }
    }, 1000);
  }

  function pausar() {
    if (!rodando) return;
    parar();
    setStatus("Pausado");
  }

  btnPlay.addEventListener("click", () => {
    if (!rodando) iniciar();
    else pausar();
  });

  btnReset.addEventListener("click", () => {
    parar();
    tempoAtual = tempoTotal;
    renderTempo();
    setStatus("Pausado");
  });

  renderTempo();
  setStatus("Pausado");
});