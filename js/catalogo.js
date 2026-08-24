let videosDoMunicipio = [];

const municipioSelecionado = localStorage.getItem("municipioSelecionado");

const nomeMunicipio = document.getElementById("nomeMunicipio");

const mensagemMunicipio = document.getElementById("mensagemMunicipio");

const videosAmbulatorial = document.getElementById("videosAmbulatorial");

const videosHospitalar = document.getElementById("videosHospitalar");

const btnTrocarMunicipio = document.getElementById("btnTrocarMunicipio");

const campoPesquisa = document.getElementById("campoPesquisa");

const resultadoPesquisa = document.getElementById("resultadoPesquisa");

const catalogoVideos = document.getElementById("catalogoVideos");

const filtroCategoria = document.getElementById("filtroCategoria");

const filtroSubcategoria = document.getElementById("filtroSubcategoria");
const navLinks = document.querySelectorAll(".nav-link");

let moduloSelecionado = "Todos";

const tituloCatalogo = document.getElementById("tituloCatalogo");

const sugestoesPesquisa = document.getElementById("sugestoesPesquisa");

const btnLimparFiltros = document.getElementById("btnLimparFiltros");

// ========================================
// VERIFICAR MUNICÍPIO
// ========================================

if (!municipioSelecionado) {
  window.location.href = "index.html";
} else {
  nomeMunicipio.textContent = municipioSelecionado;

  mensagemMunicipio.textContent = `Conteúdos disponíveis para ${municipioSelecionado}`;
}

// ========================================
// TROCAR MUNICÍPIO
// ========================================

btnTrocarMunicipio.addEventListener("click", () => {
  localStorage.removeItem("municipioSelecionado");

  localStorage.removeItem("videoSelecionadoId");

  window.location.href = "index.html";
});

// ========================================
// CARREGAR VÍDEOS
// ========================================

async function carregarVideos() {
  try {
    const resposta = await fetch("data/videos.json");

    if (!resposta.ok) {
      throw new Error("Não foi possível carregar o arquivo videos.json");
    }

    const videos = await resposta.json();

    // Filtra apenas vídeos do município escolhido
    videosDoMunicipio = videos.filter(
      (video) => video.municipio === municipioSelecionado,
    );

    preencherFiltroCategorias();

    atualizarCatalogo();

    console.log("Vídeos do município:", videosDoMunicipio);
  } catch (erro) {
    console.error("Erro ao carregar os vídeos:", erro);

    catalogoVideos.innerHTML = `
            <div class="nenhum-resultado">
                <h2>Não foi possível carregar os treinamentos</h2>

                <p>
                    Tente atualizar a página.
                </p>
            </div>
        `;
  }
}

// ========================================
// ATUALIZAR CATÁLOGO
// ========================================

function atualizarCatalogo() {
  const videosFiltrados = obterVideosFiltrados();

  const termoPesquisa = campoPesquisa.value.trim();

  // Se existe pesquisa ou algum filtro selecionado,
  // usamos a área de resultados.
  if (
    termoPesquisa !== "" ||
    filtroCategoria.value !== "" ||
    filtroSubcategoria.value !== "" ||
    moduloSelecionado !== "Todos"
  ) {
    catalogoVideos.style.display = "none";

    mostrarResultadosPesquisa(videosFiltrados);

    return;
  }

  // Sem filtros: mostra o catálogo normal
  resultadoPesquisa.innerHTML = "";

  catalogoVideos.style.display = "block";

  const ambulatoriais = videosFiltrados.filter(
    (video) => video.modulo === "Ambulatorial",
  );

  const hospitalares = videosFiltrados.filter(
    (video) => video.modulo === "Hospitalar",
  );

  mostrarVideos(ambulatoriais, videosAmbulatorial);

  mostrarVideos(hospitalares, videosHospitalar);
}

// ========================================
// FILTRAR VÍDEOS
// ========================================

function obterVideosFiltrados() {
  const termo = normalizarTexto(campoPesquisa.value.trim());

  const categoriaSelecionada = filtroCategoria.value;

  const subcategoriaSelecionada = filtroSubcategoria.value;

  return videosDoMunicipio.filter((video) => {
    // Pesquisa textual
    const conteudoPesquisavel = normalizarTexto(`
                    ${video.titulo}
                    ${video.descricao}
                    ${video.modulo}
                    ${video.categoria}
                    ${video.subcategoria}
                    ${(video.tags || []).join(" ")}
                `);

    const correspondePesquisa =
      termo === "" || conteudoPesquisavel.includes(termo);

    // Categoria
    const correspondeCategoria =
      categoriaSelecionada === "" || video.categoria === categoriaSelecionada;

    const correspondeModulo =
      moduloSelecionado === "Todos" || video.modulo === moduloSelecionado;

    // Subcategoria
    const correspondeSubcategoria =
      subcategoriaSelecionada === "" ||
      video.subcategoria === subcategoriaSelecionada;

    return (
      correspondePesquisa &&
      correspondeCategoria &&
      correspondeSubcategoria &&
      correspondeModulo
    );
  });
}

// ========================================
// FILTRO DE CATEGORIAS
// ========================================

function preencherFiltroCategorias() {
  if (!filtroCategoria) {
    return;
  }

  let videosBase = videosDoMunicipio;

  // Se um módulo estiver selecionado,
  // usamos apenas os vídeos daquele módulo
  if (moduloSelecionado !== "Todos") {
    videosBase = videosDoMunicipio.filter(
      (video) => video.modulo === moduloSelecionado,
    );
  }

  const categorias = [...new Set(videosBase.map((video) => video.categoria))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, "pt-BR"));

  filtroCategoria.innerHTML = `
        <option value="">
            Todas as categorias
        </option>
    `;

  categorias.forEach((categoria) => {
    const option = document.createElement("option");

    option.value = categoria;

    option.textContent = categoria;

    filtroCategoria.appendChild(option);
  });

  preencherFiltroSubcategorias();
}

// ========================================
// FILTRO DE SUBCATEGORIAS
// ========================================

function preencherFiltroSubcategorias() {
  if (!filtroSubcategoria) {
    return;
  }

  const categoriaSelecionada = filtroCategoria.value;

  let videosBase = videosDoMunicipio;

  // Filtra primeiro pelo módulo
  if (moduloSelecionado !== "Todos") {
    videosBase = videosBase.filter(
      (video) => video.modulo === moduloSelecionado,
    );
  }

  // Depois pela categoria
  if (categoriaSelecionada !== "") {
    videosBase = videosBase.filter(
      (video) => video.categoria === categoriaSelecionada,
    );
  }

  const subcategorias = [
    ...new Set(videosBase.map((video) => video.subcategoria)),
  ]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, "pt-BR"));

  filtroSubcategoria.innerHTML = `
        <option value="">
            Todas as subcategorias
        </option>
    `;

  subcategorias.forEach((subcategoria) => {
    const option = document.createElement("option");

    option.value = subcategoria;

    option.textContent = subcategoria;

    filtroSubcategoria.appendChild(option);
  });
}

// ========================================
// EVENTOS DOS FILTROS
// ========================================

campoPesquisa.addEventListener("input", () => {
  mostrarSugestoes();

  atualizarCatalogo();
});

campoPesquisa.addEventListener("focus", () => {
  if (campoPesquisa.value.trim() !== "") {
    mostrarSugestoes();
  }
});

if (filtroCategoria) {
  filtroCategoria.addEventListener("change", () => {
    // Sempre limpa a subcategoria
    // quando a categoria muda
    filtroSubcategoria.value = "";

    preencherFiltroSubcategorias();

    atualizarCatalogo();
  });
}

if (filtroSubcategoria) {
  filtroSubcategoria.addEventListener("change", atualizarCatalogo);
}

// ========================================
// EXTRAIR ID DO YOUTUBE
// ========================================

function extrairYoutubeId(url) {
  try {
    const urlYoutube = new URL(url);

    // Exemplo:
    // youtube.com/watch?v=XXXX
    if (urlYoutube.hostname.includes("youtube.com")) {
      return urlYoutube.searchParams.get("v");
    }

    // Exemplo:
    // youtu.be/XXXX
    if (urlYoutube.hostname.includes("youtu.be")) {
      return urlYoutube.pathname.substring(1);
    }

    return null;
  } catch (erro) {
    console.error("URL do YouTube inválida:", url);

    return null;
  }
}

// ========================================
// CRIAR CARDS
// ========================================

function mostrarVideos(videos, container) {
  container.innerHTML = "";

  if (videos.length === 0) {
    container.innerHTML = `
            <p class="sem-videos">
                Nenhum treinamento disponível no momento.
            </p>
        `;

    return;
  }

  videos.forEach((video) => {
    const youtubeId = extrairYoutubeId(video.videoUrl);

    const thumbnail = youtubeId
      ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
      : "";

    const card = document.createElement("article");

    card.classList.add("video-card");

    card.innerHTML = `
            <div
                class="video-thumbnail"
                style="background-image: url('${thumbnail}')"
            >

                <span class="video-time">
                    ${video.duracao}
                </span>

                <span class="play-icon">
                    ▶
                </span>

            </div>

            <div class="video-info">

                <div class="video-classificacao">

    <span class="video-modulo">
        ${video.modulo}
    </span>

    <span class="video-categoria">
        ${video.categoria} › ${video.subcategoria}
    </span>

</div>

                <h3>
                    ${video.titulo}
                </h3>

                <p>
                    ${video.descricao}
                </p>

            </div>
        `;

    // Abre o treinamento dentro
    // da própria plataforma
    card.addEventListener("click", () => {
      localStorage.setItem("videoSelecionadoId", video.id);

      window.location.href = "video.html";
    });

    container.appendChild(card);
  });
}

// ========================================
// NORMALIZAR TEXTO
// ========================================

function normalizarTexto(texto) {
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function mostrarSugestoes() {
  const termo = normalizarTexto(campoPesquisa.value.trim());

  sugestoesPesquisa.innerHTML = "";

  // Não mostra sugestões sem texto
  if (termo === "") {
    sugestoesPesquisa.classList.remove("ativo");

    return;
  }

  let videosBase = videosDoMunicipio;

  // Respeita o módulo escolhido no navbar
  if (moduloSelecionado !== "Todos") {
    videosBase = videosBase.filter(
      (video) => video.modulo === moduloSelecionado,
    );
  }

  const sugestoes = videosBase
    .filter((video) => {
      const conteudo = normalizarTexto(`
                        ${video.titulo}
                        ${video.categoria}
                        ${video.subcategoria}
                        ${(video.tags || []).join(" ")}
                    `);

      return conteudo.includes(termo);
    })
    .slice(0, 5);

  if (sugestoes.length === 0) {
    sugestoesPesquisa.classList.remove("ativo");

    return;
  }

  sugestoes.forEach((video) => {
    const youtubeId = extrairYoutubeId(video.videoUrl);

    const thumbnail = youtubeId
      ? `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`
      : "";

    const item = document.createElement("button");

    item.type = "button";

    item.classList.add("sugestao-item");

    item.innerHTML = `
            <div
                class="sugestao-thumbnail"
                style="background-image: url('${thumbnail}')">
            </div>

            <div class="sugestao-info">

                <strong>
                    ${video.titulo}
                </strong>

                <span>
                    ${video.modulo}
                    ›
                    ${video.categoria}
                    ›
                    ${video.subcategoria}
                </span>

            </div>

            <span class="sugestao-play">
                ▶
            </span>
        `;

    item.addEventListener("click", () => {
      localStorage.setItem("videoSelecionadoId", video.id);

      window.location.href = "video.html";
    });

    sugestoesPesquisa.appendChild(item);
  });

  sugestoesPesquisa.classList.add("ativo");
}

document.addEventListener("click", (event) => {
  const clicouNaBusca = campoPesquisa.contains(event.target);

  const clicouNasSugestoes = sugestoesPesquisa.contains(event.target);

  if (!clicouNaBusca && !clicouNasSugestoes) {
    sugestoesPesquisa.classList.remove("ativo");
  }
});

// ========================================
// RESULTADOS DA PESQUISA / FILTROS
// ========================================

function mostrarResultadosPesquisa(videos) {
  resultadoPesquisa.innerHTML = "";

  if (videos.length === 0) {
    resultadoPesquisa.innerHTML = `
            <div class="nenhum-resultado">

                <h2>
                    Nenhum treinamento encontrado
                </h2>

                <p>
                    Tente pesquisar usando outras palavras
                    ou alterar os filtros selecionados.
                </p>

            </div>
        `;

    return;
  }

  const titulo = document.createElement("h2");

  titulo.classList.add("titulo-resultados");

  titulo.textContent = `${videos.length} treinamento${
    videos.length > 1 ? "s" : ""
  } encontrado${videos.length > 1 ? "s" : ""}`;

  resultadoPesquisa.appendChild(titulo);

  const container = document.createElement("div");

  container.classList.add("resultado-grid");

  resultadoPesquisa.appendChild(container);

  mostrarVideos(videos, container);
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    moduloSelecionado = link.dataset.modulo;

    if (moduloSelecionado === "Ambulatorial") {
      tituloCatalogo.textContent = "Treinamentos Ambulatoriais";
    } else if (moduloSelecionado === "Hospitalar") {
      tituloCatalogo.textContent = "Treinamentos Hospitalares";
    } else {
      tituloCatalogo.textContent = "Treinamentos";
    }

    // Atualiza destaque visual
    navLinks.forEach((item) => {
      item.classList.remove("ativo");
    });

    link.classList.add("ativo");

    // Limpa filtros anteriores
    filtroCategoria.value = "";
    filtroSubcategoria.value = "";

    // Reconstrói os filtros
    // conforme o módulo escolhido
    preencherFiltroCategorias();

    // Atualiza os vídeos
    atualizarCatalogo();
  });
});

// ========================================
// INICIAR
// ========================================

btnLimparFiltros.addEventListener("click", () => {

    // Limpa pesquisa
    campoPesquisa.value = "";

    // Limpa categoria
    filtroCategoria.value = "";

    // Reconstrói as subcategorias
    preencherFiltroSubcategorias();

    // Limpa subcategoria
    filtroSubcategoria.value = "";

    // Fecha sugestões
    sugestoesPesquisa.innerHTML = "";
    sugestoesPesquisa.classList.remove("ativo");

    // Atualiza o catálogo
    atualizarCatalogo();

});

carregarVideos();
