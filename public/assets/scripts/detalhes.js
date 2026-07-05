const API_URL = "http://localhost:3000";

// ---------- GET (buscar 1) ----------
async function fetchItem(id) {
  const response = await fetch(`${API_URL}/jogos/${id}`);
  if (!response.ok) return null;
  const jogo = await response.json();
  return jogo;
}

// ---------- PUT (editar) ----------
async function editarJogo(id, dadosAtualizados) {
  const response = await fetch(`${API_URL}/jogos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dadosAtualizados)
  });
  return response.json();
}

// ---------- DELETE (excluir) ----------
async function excluirJogo(id) {
  await fetch(`${API_URL}/jogos/${id}`, { method: "DELETE" });
}

function renderDetalhe(jogo) {
  const infoGeral = document.getElementById("info-geral");
  if (!infoGeral) return;

  infoGeral.innerHTML = `
    <div class="row">
      <div class="col-md-5 mb-3">
        <img src="${jogo.imagem}" class="img-fluid rounded shadow" alt="${jogo.titulo}">
      </div>
      <div class="col-md-7">
        <h2>${jogo.titulo}</h2>
        <hr>
        <p><strong>Categoria:</strong> ${jogo.categoria}</p>
        <p><strong>Desenvolvedora:</strong> ${jogo.desenvolvedora}</p>
        <p><strong>Ano:</strong> ${jogo.ano}</p>
        <p><strong>Preço:</strong> R$ ${Number(jogo.preco || 0).toFixed(2)}</p>
        <p><strong>Descrição:</strong> ${jogo.descricaoCompleta}</p>
        <a href="index.html" class="btn btn-secondary mt-2">← Voltar</a>
        <button id="btn-mostrar-editar" class="btn btn-primary mt-2">Editar</button>
        <button id="btn-excluir-jogo" class="btn btn-danger mt-2">Excluir</button>
      </div>
    </div>
  `;

  const listaTags = document.getElementById("lista-tags");
  if (listaTags) {
    listaTags.innerHTML = (jogo.tags || [])
      .map(tag => `<span class="badge bg-dark me-2 mb-2 fs-6">${tag}</span>`)
      .join("");
  }

  document.getElementById("btn-excluir-jogo").addEventListener("click", async () => {
    if (confirm(`Excluir "${jogo.titulo}"? Essa ação não pode ser desfeita.`)) {
      await excluirJogo(jogo.id);
      window.location.href = "index.html";
    }
  });

  document.getElementById("btn-mostrar-editar").addEventListener("click", () => {
    preencherFormEdicao(jogo);
    document.getElementById("secao-editar").style.display = "block";
    document.getElementById("secao-editar").scrollIntoView({ behavior: "smooth" });
  });
}

function preencherFormEdicao(jogo) {
  document.getElementById("edit-id").value = jogo.id;
  document.getElementById("edit-titulo").value = jogo.titulo;
  document.getElementById("edit-categoria").value = jogo.categoria;
  document.getElementById("edit-desenvolvedora").value = jogo.desenvolvedora;
  document.getElementById("edit-ano").value = jogo.ano;
  document.getElementById("edit-preco").value = jogo.preco;
  document.getElementById("edit-descricaoCompleta").value = jogo.descricaoCompleta;
}

function setupFormEditar() {
  const form = document.getElementById("form-editar-jogo");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("edit-id").value;

    const dadosAtualizados = {
      titulo: document.getElementById("edit-titulo").value,
      categoria: document.getElementById("edit-categoria").value,
      desenvolvedora: document.getElementById("edit-desenvolvedora").value,
      ano: Number(document.getElementById("edit-ano").value),
      preco: Number(document.getElementById("edit-preco").value),
      descricaoCompleta: document.getElementById("edit-descricaoCompleta").value
    };

    await editarJogo(id, dadosAtualizados);
    await init();
    document.getElementById("secao-editar").style.display = "none";
  });
}

async function init() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    document.getElementById("info-geral").innerHTML =
      '<p class="text-danger">Nenhum jogo selecionado.</p>';
    return;
  }

  const jogo = await fetchItem(id);

  if (!jogo) {
    document.getElementById("info-geral").innerHTML =
      '<p class="text-danger">Jogo não encontrado.</p>';
    return;
  }

  renderDetalhe(jogo);
}

setupFormEditar();
init();