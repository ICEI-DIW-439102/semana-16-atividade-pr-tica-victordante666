const API_URL = "http://localhost:3000";

// ---------- GET (listar) ----------
async function fetchItems() {
  const response = await fetch(`${API_URL}/jogos`);
  const jogos = await response.json();
  return jogos;
}

// ---------- POST (criar) ----------
async function criarJogo(novoJogo) {
  const response = await fetch(`${API_URL}/jogos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(novoJogo)
  });
  return response.json();
}

// ---------- DELETE (excluir) ----------
async function excluirJogo(id) {
  await fetch(`${API_URL}/jogos/${id}`, { method: "DELETE" });
}

function createCard(jogo) {
  const col = document.createElement("div");
  col.classList.add("col-sm-6", "col-md-4", "col-lg-4", "mb-4");

  col.innerHTML = `
    <div class="card h-100 card-jogo">
      <img src="${jogo.imagem}" class="card-img-top card-img-jogo" alt="${jogo.titulo}" style="cursor:pointer" onclick="window.location.href='detalhes.html?id=${jogo.id}'">
      <div class="card-body" style="cursor:pointer" onclick="window.location.href='detalhes.html?id=${jogo.id}'">
        <h5 class="card-title">${jogo.titulo}</h5>
        <p class="card-text text-muted small">${jogo.categoria} • ${jogo.ano}</p>
        <p class="card-text">${jogo.descricaoCurta}</p>
      </div>
      <div class="card-footer text-muted small d-flex justify-content-between align-items-center">
        <span>R$ ${Number(jogo.preco || 0).toFixed(2)} — ${jogo.desenvolvedora}</span>
        <button class="btn btn-sm btn-outline-danger btn-excluir" data-id="${jogo.id}">Excluir</button>
      </div>
    </div>
  `;

  col.querySelector(".btn-excluir").addEventListener("click", async (e) => {
    e.stopPropagation();
    if (confirm(`Excluir "${jogo.titulo}"?`)) {
      await excluirJogo(jogo.id);
      await init();
    }
  });

  return col;
}

function renderCards(jogos) {
  const lista = document.getElementById("lista-jogos");
  lista.innerHTML = "";
  jogos.forEach(jogo => lista.appendChild(createCard(jogo)));
}

function renderCarrossel(jogos) {
  const inner = document.getElementById("carousel-inner");
  if (!inner) return;
  inner.innerHTML = "";

  const destaques = jogos.filter(j => j.destaque);
  destaques.forEach((jogo, index) => {
    const item = document.createElement("div");
    item.classList.add("carousel-item");
    if (index === 0) item.classList.add("active");

    item.innerHTML = `
      <img src="${jogo.imagem}" class="d-block w-100 carousel-img" alt="${jogo.titulo}">
      <div class="carousel-caption d-none d-md-block">
        <h5>${jogo.titulo}</h5>
        <p>${jogo.descricaoCurta}</p>
      </div>
    `;

    item.style.cursor = "pointer";
    item.addEventListener("click", () => {
      window.location.href = `detalhes.html?id=${jogo.id}`;
    });

    inner.appendChild(item);
  });
}

function setupFormNovoJogo() {
  const form = document.getElementById("form-novo-jogo");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const tagsRaw = document.getElementById("tags").value;
    const novoJogo = {
      titulo: document.getElementById("titulo").value,
      categoria: document.getElementById("categoria").value,
      desenvolvedora: document.getElementById("desenvolvedora").value,
      ano: Number(document.getElementById("ano").value),
      preco: Number(document.getElementById("preco").value),
      imagem: document.getElementById("imagem").value,
      descricaoCurta: document.getElementById("descricaoCurta").value,
      descricaoCompleta: document.getElementById("descricaoCompleta").value,
      destaque: document.getElementById("destaque").checked,
      tags: tagsRaw ? tagsRaw.split(",").map(t => t.trim()).filter(Boolean) : []
    };

    await criarJogo(novoJogo);
    form.reset();
    await init();
  });
}

async function init() {
  const jogos = await fetchItems();
  renderCarrossel(jogos);
  renderCards(jogos);
}

setupFormNovoJogo();
init();