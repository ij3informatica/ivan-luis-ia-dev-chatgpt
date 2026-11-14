const STORAGE_KEY = "serviceDeskTickets";
const ticketCategories = ["Hardware", "Software", "Rede", "Acesso", "Outro"];

const seedTickets = [
  {
    id: 1001,
    requester: "Marina Costa",
    email: "marina.costa@empresa.com",
    category: "Acesso",
    priority: "Alta",
    status: "Aberto",
    title: "Senha expirada no sistema de vendas",
    description: "Ao tentar entrar no sistema de vendas, recebo a mensagem de senha expirada e não consigo redefinir pelo portal.",
    correction: "",
    createdAt: "2026-06-18T11:20:00.000Z",
    updatedAt: "2026-06-18T11:20:00.000Z",
    events: [
      "Chamado aberto por Marina Costa."
    ]
  },
  {
    id: 1002,
    requester: "Rafael Lima",
    email: "rafael.lima@empresa.com",
    category: "Hardware",
    priority: "Média",
    status: "Em atendimento",
    title: "Notebook reiniciando sozinho",
    description: "O notebook reinicia durante reuniões e apresentações. Isso ocorreu quatro vezes nesta semana.",
    correction: "Equipamento em análise para troca preventiva de memória.",
    createdAt: "2026-06-17T14:40:00.000Z",
    updatedAt: "2026-06-18T09:15:00.000Z",
    events: [
      "Chamado aberto por Rafael Lima.",
      "Status alterado para Em atendimento."
    ]
  }
];

const knowledgeBase = [
  {
    title: "Wi-Fi de visitantes",
    keywords: ["wi-fi de visitantes", "wifi de visitantes", "ij3-visitantes", "portal de boas-vindas"],
    solution: "No menu de redes, selecione IJ3-Visitantes. Abra o navegador e siga o portal de boas-vindas. Se a rede não aparecer, acione a TI."
  },
  {
    title: "Impressão — impressora já instalada",
    keywords: ["impressora", "impressão", "imprimir", "página de teste"],
    solution: "No Windows, abra Configurações > Bluetooth e dispositivos > Impressoras e scanners. Escolha a impressora já instalada e selecione Imprimir página de teste. Se o equipamento estiver offline, acione a TI."
  },
  {
    title: "Telefone IP — sem conexão ou sem linha",
    keywords: ["telefone ip", "sem linha", "telefone sem conexão", "telefone sem conexao"],
    solution: "Confira no visor se o ícone de rede indica que o telefone está conectado. Se possível, verifique também se um computador próximo consegue acessar a internet. Para reiniciar o telefone, use a seta para baixo até selecionar Reiniciar e confirme no aparelho. Aguarde o visor voltar. Se o ícone continuar indicando falta de conexão ou o telefone continuar sem linha, acione a TI. Não desconecte cabos nem restaure as configurações."
  },
  {
    title: "Computador sem acesso à internet",
    keywords: ["computador sem acesso a internet", "sem internet no computador", "internet do computador"],
    solution: "Confira se o Wi-Fi está ligado e se o computador está conectado à rede correta. Abra um site conhecido. Se outros dispositivos também estiverem sem acesso, ou se o problema continuar, acione a TI. Não altere configurações avançadas de rede."
  },
  {
    title: "VPN — não conecta",
    keywords: ["vpn", "vpn não conecta", "vpn nao conecta"],
    solution: "Confirme se o computador está conectado à internet e tente novamente pelo aplicativo de VPN já instalado. Se aparecer uma mensagem de erro, anote o texto para informar à TI. Não compartilhe sua senha ou códigos e não altere as configurações da VPN."
  },
  {
    title: "Reunião — sem som nos alto-falantes",
    keywords: ["sem som", "alto-falantes", "som na reunião", "som na reuniao"],
    solution: "Confira se o volume do computador está ligado e se o som não está silenciado. Nas configurações de áudio da reunião, verifique se a saída selecionada é o alto-falante ou fone que você está usando. Se continuar sem som, saia e entre novamente na reunião; se não resolver, acione a TI."
  },
  {
    title: "Teclado ou mouse sem resposta",
    keywords: ["teclado", "mouse", "sem resposta no mouse", "sem resposta no teclado"],
    solution: "Se forem sem fio, confira se estão ligados e, quando aplicável, se a bateria pode estar descarregada. Se forem conectados por cabo ou receptor USB, confira se estão firmemente conectados. Aguarde alguns segundos e teste novamente. Se continuarem sem responder, acione a TI; não desconecte equipamentos que não reconhece."
  }
];

let tickets = loadTickets();
let selectedTicketId = tickets[0]?.id ?? null;

const views = document.querySelectorAll(".view");
const tabs = document.querySelectorAll(".tab");
const ticketForm = document.querySelector("#ticketForm");
const knowledgeSuggestions = document.querySelector("#knowledgeSuggestions");
const ticketList = document.querySelector("#ticketList");
const ticketDetails = document.querySelector("#ticketDetails");
const ticketCounter = document.querySelector("#ticketCounter");
const queueStatusFilter = document.querySelector("#queueStatusFilter");
const historyTable = document.querySelector("#historyTable");
const searchInput = document.querySelector("#searchInput");
const clearData = document.querySelector("#clearData");
const toast = document.querySelector("#toast");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => item.classList.remove("is-active"));
    views.forEach((view) => view.classList.remove("is-active"));
    tab.classList.add("is-active");
    document.querySelector(`#${tab.dataset.view}`).classList.add("is-active");
    render();
  });
});

ticketForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formTicket = {
    id: nextId(),
    requester: document.querySelector("#requester").value.trim(),
    email: document.querySelector("#email").value.trim(),
    category: document.querySelector("#category").value,
    priority: document.querySelector("#priority").value,
    status: "Aberto",
    title: document.querySelector("#title").value.trim(),
    description: document.querySelector("#description").value.trim(),
    correction: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    events: [
      `Chamado aberto por ${document.querySelector("#requester").value.trim()}.`
    ]
  };

  tickets.unshift(formTicket);
  selectedTicketId = formTicket.id;
  saveTickets();
  ticketForm.reset();
  showToast(`Chamado #${formTicket.id} aberto com sucesso.`);
  render();
});

searchInput.addEventListener("input", renderTicketList);
queueStatusFilter.addEventListener("change", render);

["#title", "#description"].forEach((selector) => {
  document.querySelector(selector).addEventListener("input", renderKnowledgeSuggestions);
});

ticketForm.addEventListener("reset", () => {
  knowledgeSuggestions.hidden = true;
  knowledgeSuggestions.innerHTML = "";
});

clearData.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  tickets = [...seedTickets];
  selectedTicketId = tickets[0].id;
  saveTickets();
  showToast("Base local restaurada.");
  render();
});

function loadTickets() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedTickets));
    return [...seedTickets];
  }

  try {
    return JSON.parse(stored);
  } catch {
    return [...seedTickets];
  }
}

function saveTickets() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
}

function nextId() {
  return Math.max(...tickets.map((ticket) => ticket.id)) + 1;
}

function render() {
  const selectedTicket = tickets.find((ticket) => ticket.id === selectedTicketId);
  if (selectedTicket && !matchesQueueStatus(selectedTicket)) {
    selectedTicketId = null;
  }

  renderTicketList();
  renderTicketDetails();
  renderHistory();
}

function matchesQueueStatus(ticket) {
  const selectedStatus = queueStatusFilter.value;
  if (selectedStatus === "active") return ticket.status !== "Resolvido";
  if (selectedStatus === "all") return true;
  return ticket.status === selectedStatus;
}

function renderKnowledgeSuggestions() {
  const query = [
    document.querySelector("#title").value,
    document.querySelector("#description").value
  ].join(" ").trim();

  if (query.length < 3) {
    knowledgeSuggestions.hidden = true;
    knowledgeSuggestions.innerHTML = "";
    return;
  }

  const normalizedQuery = normalizeText(query);
  const matches = knowledgeBase.filter((article) =>
    article.keywords.some((keyword) => normalizedQuery.includes(normalizeText(keyword)))
  );

  knowledgeSuggestions.hidden = false;
  if (matches.length === 0) {
    knowledgeSuggestions.innerHTML = `
      <strong>Nenhuma orientação específica encontrada.</strong>
      <p>Revise a categoria ou acione a equipe de TI para obter ajuda.</p>
    `;
    return;
  }

  knowledgeSuggestions.innerHTML = `
    <strong>Sugestões da base de conhecimento</strong>
    ${matches.map((article) => `
      <article>
        <h3>${escapeHtml(article.title)}</h3>
        <p>${escapeHtml(article.solution)}</p>
      </article>
    `).join("")}
    <p class="ticket-meta">Se o problema continuar, acione a equipe de TI.</p>
  `;
}

function renderTicketList() {
  const term = searchInput.value.trim().toLowerCase();
  const filteredTickets = tickets.filter((ticket) => {
    return (
      matchesQueueStatus(ticket) &&
      (
        String(ticket.id).includes(term) ||
        ticket.title.toLowerCase().includes(term)
      )
    );
  });

  ticketCounter.textContent = `${filteredTickets.length} chamado${filteredTickets.length === 1 ? "" : "s"}`;

  if (filteredTickets.length === 0) {
    ticketList.innerHTML = '<div class="empty-state"><p>Nenhum chamado encontrado.</p></div>';
    return;
  }

  ticketList.innerHTML = filteredTickets.map((ticket) => `
    <button class="ticket-card ${ticket.id === selectedTicketId ? "is-selected" : ""}" data-ticket-id="${ticket.id}">
      <span class="ticket-title">#${ticket.id} - ${escapeHtml(ticket.title)}</span>
      <span class="ticket-meta">${escapeHtml(ticket.requester)} • ${formatDate(ticket.updatedAt)}</span>
      <span class="badge-row">
        <span class="badge ${statusClass(ticket.status)}">${ticket.status}</span>
        <span class="badge ${priorityClass(ticket.priority)}">${ticket.priority}</span>
      </span>
    </button>
  `).join("");

  document.querySelectorAll(".ticket-card").forEach((card) => {
    card.addEventListener("click", () => {
      selectedTicketId = Number(card.dataset.ticketId);
      renderTicketList();
      renderTicketDetails();
    });
  });
}

function renderTicketDetails() {
  const ticket = tickets.find((item) => item.id === selectedTicketId);

  if (!ticket) {
    ticketDetails.innerHTML = `
      <div class="empty-state">
        <h3>Selecione um chamado</h3>
        <p>Ao escolher um item da fila, os campos de status, prioridade e correção aparecem aqui.</p>
      </div>
    `;
    return;
  }

  ticketDetails.innerHTML = `
    <div class="details-header">
      <div>
        <p class="eyebrow">Chamado #${ticket.id}</p>
        <div class="details-title-row">
          <h3>${escapeHtml(ticket.title)}</h3>
          <span class="badge ${statusClass(ticket.status)}">${ticket.status}</span>
        </div>
        <p class="ticket-meta">Aberto por ${escapeHtml(ticket.requester)} em ${formatDate(ticket.createdAt)}</p>
      </div>
    </div>

    <div class="details-grid">
      <label>
        Status
        <select id="detailStatus">
          <option ${ticket.status === "Aberto" ? "selected" : ""}>Aberto</option>
          <option ${ticket.status === "Em atendimento" ? "selected" : ""}>Em atendimento</option>
          <option ${ticket.status === "Aguardando usuário" ? "selected" : ""}>Aguardando usuário</option>
          <option ${ticket.status === "Resolvido" ? "selected" : ""}>Resolvido</option>
        </select>
      </label>
      <label>
        Prioridade
        <select id="detailPriority">
          <option ${ticket.priority === "Baixa" ? "selected" : ""}>Baixa</option>
          <option ${ticket.priority === "Média" ? "selected" : ""}>Média</option>
          <option ${ticket.priority === "Alta" ? "selected" : ""}>Alta</option>
          <option ${ticket.priority === "Crítica" ? "selected" : ""}>Crítica</option>
        </select>
      </label>
      <label>
        Categoria
        <select id="detailCategory">
          ${ticketCategories.map((category) => `<option ${ticket.category === category ? "selected" : ""}>${category}</option>`).join("")}
        </select>
      </label>
    </div>

    <label>
      Descrever correção
      <textarea id="detailCorrection" rows="5" placeholder="Informe a solução aplicada ou próxima ação.">${escapeHtml(ticket.correction)}</textarea>
    </label>

    <div class="description-box">
      <strong>Descrição do usuário</strong>
      <p>${escapeHtml(ticket.description)}</p>
      <p class="ticket-meta">${escapeHtml(ticket.category)} • ${escapeHtml(ticket.email)}</p>
    </div>

    <div class="form-actions">
      <button class="primary" id="saveTicket">Salvar alterações</button>
    </div>

    <div class="history-box">
      <strong>Histórico deste chamado</strong>
      <ul>
        ${ticket.events.map((event) => `<li class="history-line">${escapeHtml(event)}</li>`).join("")}
      </ul>
    </div>
  `;

  document.querySelector("#saveTicket").addEventListener("click", () => updateSelectedTicket(ticket.id));
}

function updateSelectedTicket(ticketId) {
  const ticket = tickets.find((item) => item.id === ticketId);
  if (!ticket) return;

  const newStatus = document.querySelector("#detailStatus").value;
  const newPriority = document.querySelector("#detailPriority").value;
  const newCategory = document.querySelector("#detailCategory").value;
  const newCorrection = document.querySelector("#detailCorrection").value.trim();
  const eventList = [];

  if (ticket.status !== newStatus) {
    eventList.push(`Status alterado de ${ticket.status} para ${newStatus}.`);
  }

  if (ticket.priority !== newPriority) {
    eventList.push(`Prioridade alterada de ${ticket.priority} para ${newPriority}.`);
  }

  if (ticket.category !== newCategory) {
    eventList.push(`Categoria alterada de ${ticket.category} para ${newCategory}.`);
  }

  if (ticket.correction !== newCorrection && newCorrection) {
    eventList.push(`Correção registrada: ${newCorrection}`);
  }

  ticket.status = newStatus;
  ticket.priority = newPriority;
  ticket.category = newCategory;
  ticket.correction = newCorrection;
  ticket.updatedAt = new Date().toISOString();
  ticket.events = ticket.events.concat(eventList);

  showToast(`Chamado #${ticket.id} atualizado.`);
  render();
}

function renderHistory() {
  historyTable.innerHTML = tickets.map((ticket) => `
    <tr>
      <td>#${ticket.id}</td>
      <td>${escapeHtml(ticket.title)}</td>
      <td>${escapeHtml(ticket.requester)}</td>
      <td><span class="badge ${statusClass(ticket.status)}">${ticket.status}</span></td>
      <td><span class="badge ${priorityClass(ticket.priority)}">${ticket.priority}</span></td>
      <td>${formatDate(ticket.updatedAt)}</td>
    </tr>
  `).join("");
}

function statusClass(status) {
  return `status-${status.toLowerCase().replaceAll(" ", "-")}`;
}

function priorityClass(priority) {
  return `priority-${priority.toLowerCase()}`;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeText(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

render();
