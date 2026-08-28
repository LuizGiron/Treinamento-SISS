// ========================================
// VARIÁVEIS PRINCIPAIS
// ========================================

let videosDoMunicipio = [];

let moduloSelecionado = "Todos";

let categoriaSelecionada = "";

let subcategoriaSelecionada = "";


// ========================================
// MUNICÍPIO
// ========================================

const municipioSelecionado =
  localStorage.getItem("municipioSelecionado");


// ========================================
// ELEMENTOS DA PÁGINA
// ========================================

const nomeMunicipio =
  document.getElementById("nomeMunicipio");

const mensagemMunicipio =
  document.getElementById("mensagemMunicipio");

const videosAmbulatorial =
  document.getElementById("videosAmbulatorial");

const videosHospitalar =
  document.getElementById("videosHospitalar");

const btnTrocarMunicipio =
  document.getElementById("btnTrocarMunicipio");

const campoPesquisa =
  document.getElementById("campoPesquisa");

const resultadoPesquisa =
  document.getElementById("resultadoPesquisa");

const catalogoVideos =
  document.getElementById("catalogoVideos");

const navLinks =
  document.querySelectorAll(".nav-link");

const tituloCatalogo =
  document.getElementById("tituloCatalogo");

const sugestoesPesquisa =
  document.getElementById("sugestoesPesquisa");

const btnLimparFiltros =
  document.getElementById("btnLimparFiltros");


// ========================================
// DROPDOWN CATEGORIA
// ========================================

const selectCategoria =
  document.getElementById("selectCategoria");

const triggerCategoria =
  selectCategoria.querySelector(".select-trigger");

const opcoesCategoria =
  document.getElementById("opcoesCategoria");

const categoriaSelecionadaTexto =
  document.getElementById("categoriaSelecionadaTexto");


// ========================================
// DROPDOWN SUBCATEGORIA
// ========================================

const selectSubcategoria =
  document.getElementById("selectSubcategoria");

const triggerSubcategoria =
  selectSubcategoria.querySelector(".select-trigger");

const opcoesSubcategoria =
  document.getElementById("opcoesSubcategoria");

const subcategoriaSelecionadaTexto =
  document.getElementById("subcategoriaSelecionadaTexto");


// ========================================
// VERIFICAR MUNICÍPIO
// ========================================

if (!municipioSelecionado) {

  window.location.href = "index.html";

} else {

  nomeMunicipio.textContent =
    municipioSelecionado;

  mensagemMunicipio.textContent =
    `Conteúdos disponíveis para ${municipioSelecionado}`;

}


// ========================================
// TROCAR MUNICÍPIO
// ========================================

btnTrocarMunicipio.addEventListener("click", () => {

  localStorage.removeItem(
    "municipioSelecionado"
  );

  localStorage.removeItem(
    "videoSelecionadoId"
  );

  window.location.href =
    "index.html";

});


// ========================================
// CARREGAR VÍDEOS
// ========================================

async function carregarVideos() {

  try {

    const resposta =
      await fetch("data/videos.json");

    if (!resposta.ok) {

      throw new Error(
        "Não foi possível carregar o arquivo videos.json"
      );

    }

    const videos =
      await resposta.json();


    // Filtra somente os vídeos
    // do município selecionado

    videosDoMunicipio =
      videos.filter(
        video =>
          video.municipio ===
          municipioSelecionado
      );


    preencherFiltroCategorias();

    atualizarCatalogo();


    console.log(
      "Vídeos do município:",
      videosDoMunicipio
    );

  }

  catch (erro) {

    console.error(
      "Erro ao carregar os vídeos:",
      erro
    );

    catalogoVideos.innerHTML = `
      <div class="nenhum-resultado">

        <h2>
          Não foi possível carregar os treinamentos
        </h2>

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

  const videosFiltrados =
    obterVideosFiltrados();

  const termoPesquisa =
    campoPesquisa.value.trim();


  // Se houver pesquisa ou filtros,
  // usa a área de resultados

  if (
    termoPesquisa !== "" ||
    categoriaSelecionada !== "" ||
    subcategoriaSelecionada !== "" ||
    moduloSelecionado !== "Todos"
  ) {

    catalogoVideos.style.display =
      "none";

    mostrarResultadosPesquisa(
      videosFiltrados
    );

    return;

  }


  // Sem filtros:
  // mostra o catálogo normal

  resultadoPesquisa.innerHTML = "";

  catalogoVideos.style.display =
    "block";


  const ambulatoriais =
    videosFiltrados.filter(
      video =>
        video.modulo ===
        "Ambulatorial"
    );


  const hospitalares =
    videosFiltrados.filter(
      video =>
        video.modulo ===
        "Hospitalar"
    );


  mostrarVideos(
    ambulatoriais,
    videosAmbulatorial
  );

  mostrarVideos(
    hospitalares,
    videosHospitalar
  );

}


// ========================================
// FILTRAR VÍDEOS
// ========================================

function obterVideosFiltrados() {

  const termo =
    normalizarTexto(
      campoPesquisa.value.trim()
    );


  return videosDoMunicipio.filter(
    video => {

      // Pesquisa textual

      const conteudoPesquisavel =
        normalizarTexto(`
          ${video.titulo}
          ${video.descricao}
          ${video.modulo}
          ${video.categoria}
          ${video.subcategoria}
          ${(video.tags || []).join(" ")}
        `);


      const correspondePesquisa =
        termo === "" ||
        conteudoPesquisavel.includes(
          termo
        );


      // Categoria

      const correspondeCategoria =
        categoriaSelecionada === "" ||
        video.categoria ===
          categoriaSelecionada;


      // Subcategoria

      const correspondeSubcategoria =
        subcategoriaSelecionada === "" ||
        video.subcategoria ===
          subcategoriaSelecionada;


      // Módulo

      const correspondeModulo =
        moduloSelecionado === "Todos" ||
        video.modulo ===
          moduloSelecionado;


      return (
        correspondePesquisa &&
        correspondeCategoria &&
        correspondeSubcategoria &&
        correspondeModulo
      );

    }
  );

}


// ========================================
// PREENCHER CATEGORIAS
// ========================================

function preencherFiltroCategorias() {

  let videosBase =
    videosDoMunicipio;


  // Se houver módulo selecionado,
  // usa somente aquele módulo

  if (
    moduloSelecionado !== "Todos"
  ) {

    videosBase =
      videosBase.filter(
        video =>
          video.modulo ===
          moduloSelecionado
      );

  }


  const categorias = [
    ...new Set(
      videosBase.map(
        video => video.categoria
      )
    )
  ]
    .filter(Boolean)
    .sort(
      (a, b) =>
        a.localeCompare(
          b,
          "pt-BR"
        )
    );


  opcoesCategoria.innerHTML = "";


  // Opção padrão

  criarOpcaoCategoria(
    "",
    "Todas as categorias"
  );


  // Categorias encontradas

  categorias.forEach(
    categoria => {

      criarOpcaoCategoria(
        categoria,
        categoria
      );

    }
  );


  preencherFiltroSubcategorias();

}


// ========================================
// CRIAR OPÇÃO DE CATEGORIA
// ========================================

function criarOpcaoCategoria(
  valor,
  texto
) {

  const botao =
    document.createElement("button");

  botao.type = "button";

  botao.dataset.value = valor;

  botao.textContent = texto;


  // Marca visualmente
  // a categoria atual

  if (
    valor ===
    categoriaSelecionada
  ) {

    botao.classList.add(
      "selecionado"
    );

  }


  botao.addEventListener(
    "click",
    () => {

      categoriaSelecionada =
        valor;


      // Ao trocar categoria,
      // sempre limpa subcategoria

      subcategoriaSelecionada =
        "";


      categoriaSelecionadaTexto
        .textContent = texto;


      subcategoriaSelecionadaTexto
        .textContent =
        "Todas as subcategorias";


      selectCategoria
        .classList.remove(
          "aberto"
        );


      preencherFiltroCategorias();

      atualizarCatalogo();

    }
  );


  opcoesCategoria.appendChild(
    botao
  );

}


// ========================================
// PREENCHER SUBCATEGORIAS
// ========================================

function preencherFiltroSubcategorias() {

  let videosBase =
    videosDoMunicipio;


  // Primeiro filtra pelo módulo

  if (
    moduloSelecionado !== "Todos"
  ) {

    videosBase =
      videosBase.filter(
        video =>
          video.modulo ===
          moduloSelecionado
      );

  }


  // Depois pela categoria

  if (
    categoriaSelecionada !== ""
  ) {

    videosBase =
      videosBase.filter(
        video =>
          video.categoria ===
          categoriaSelecionada
      );

  }


  const subcategorias = [
    ...new Set(
      videosBase.map(
        video =>
          video.subcategoria
      )
    )
  ]
    .filter(Boolean)
    .sort(
      (a, b) =>
        a.localeCompare(
          b,
          "pt-BR"
        )
    );


  opcoesSubcategoria.innerHTML =
    "";


  criarOpcaoSubcategoria(
    "",
    "Todas as subcategorias"
  );


  subcategorias.forEach(
    subcategoria => {

      criarOpcaoSubcategoria(
        subcategoria,
        subcategoria
      );

    }
  );

}


// ========================================
// CRIAR OPÇÃO DE SUBCATEGORIA
// ========================================

function criarOpcaoSubcategoria(
  valor,
  texto
) {

  const botao =
    document.createElement("button");

  botao.type = "button";

  botao.dataset.value =
    valor;

  botao.textContent =
    texto;


  if (
    valor ===
    subcategoriaSelecionada
  ) {

    botao.classList.add(
      "selecionado"
    );

  }


  botao.addEventListener(
    "click",
    () => {

      subcategoriaSelecionada =
        valor;


      subcategoriaSelecionadaTexto
        .textContent =
        texto;


      selectSubcategoria
        .classList.remove(
          "aberto"
        );


      preencherFiltroSubcategorias();

      atualizarCatalogo();

    }
  );


  opcoesSubcategoria.appendChild(
    botao
  );

}


// ========================================
// ABRIR DROPDOWN DE CATEGORIA
// ========================================

triggerCategoria.addEventListener(
  "click",
  () => {

    selectCategoria
      .classList.toggle(
        "aberto"
      );


    selectSubcategoria
      .classList.remove(
        "aberto"
      );

  }
);


// ========================================
// ABRIR DROPDOWN DE SUBCATEGORIA
// ========================================

triggerSubcategoria.addEventListener(
  "click",
  () => {

    selectSubcategoria
      .classList.toggle(
        "aberto"
      );


    selectCategoria
      .classList.remove(
        "aberto"
      );

  }
);


// ========================================
// PESQUISA
// ========================================

campoPesquisa.addEventListener(
  "input",
  () => {

    mostrarSugestoes();

    atualizarCatalogo();

  }
);


campoPesquisa.addEventListener(
  "focus",
  () => {

    if (
      campoPesquisa
        .value
        .trim() !== ""
    ) {

      mostrarSugestoes();

    }

  }
);


// ========================================
// EXTRAIR ID DO YOUTUBE
// ========================================

function extrairYoutubeId(url) {

  try {

    const urlYoutube =
      new URL(url);


    // youtube.com/watch?v=XXXX

    if (
      urlYoutube.hostname.includes(
        "youtube.com"
      )
    ) {

      return urlYoutube
        .searchParams
        .get("v");

    }


    // youtu.be/XXXX

    if (
      urlYoutube.hostname.includes(
        "youtu.be"
      )
    ) {

      return urlYoutube
        .pathname
        .substring(1);

    }


    return null;

  }

  catch (erro) {

    console.error(
      "URL do YouTube inválida:",
      url
    );

    return null;

  }

}


// ========================================
// CRIAR CARDS
// ========================================

function mostrarVideos(
  videos,
  container
) {

  container.innerHTML = "";


  if (
    videos.length === 0
  ) {

    container.innerHTML = `
      <p class="sem-videos">
        Nenhum treinamento disponível no momento.
      </p>
    `;

    return;

  }


  videos.forEach(
    video => {

      const youtubeId =
        extrairYoutubeId(
          video.videoUrl
        );


      const thumbnail =
        youtubeId
          ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
          : "";


      const card =
        document.createElement(
          "article"
        );


      card.classList.add(
        "video-card"
      );


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
              ${video.categoria}
              ›
              ${video.subcategoria}
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


      card.addEventListener(
        "click",
        () => {

          localStorage.setItem(
            "videoSelecionadoId",
            video.id
          );

          window.location.href =
            "video.html";

        }
      );


      container.appendChild(
        card
      );

    }
  );

}


// ========================================
// NORMALIZAR TEXTO
// ========================================

function normalizarTexto(
  texto
) {

  return String(
    texto || ""
  )
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    );

}


// ========================================
// SUGESTÕES DE PESQUISA
// ========================================

function mostrarSugestoes() {

  const termo =
    normalizarTexto(
      campoPesquisa.value.trim()
    );


  sugestoesPesquisa.innerHTML =
    "";


  if (
    termo === ""
  ) {

    sugestoesPesquisa
      .classList.remove(
        "ativo"
      );

    return;

  }


  let videosBase =
    videosDoMunicipio;


  if (
    moduloSelecionado !== "Todos"
  ) {

    videosBase =
      videosBase.filter(
        video =>
          video.modulo ===
          moduloSelecionado
      );

  }


  const sugestoes =
    videosBase
      .filter(
        video => {

          const conteudo =
            normalizarTexto(`
              ${video.titulo}
              ${video.categoria}
              ${video.subcategoria}
              ${(video.tags || []).join(" ")}
            `);


          return conteudo.includes(
            termo
          );

        }
      )
      .slice(0, 5);


  if (
    sugestoes.length === 0
  ) {

    sugestoesPesquisa
      .classList.remove(
        "ativo"
      );

    return;

  }


  sugestoes.forEach(
    video => {

      const youtubeId =
        extrairYoutubeId(
          video.videoUrl
        );


      const thumbnail =
        youtubeId
          ? `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`
          : "";


      const item =
        document.createElement(
          "button"
        );


      item.type =
        "button";


      item.classList.add(
        "sugestao-item"
      );


      item.innerHTML = `
        <div
          class="sugestao-thumbnail"
          style="background-image: url('${thumbnail}')"
        >
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


      item.addEventListener(
        "click",
        () => {

          localStorage.setItem(
            "videoSelecionadoId",
            video.id
          );

          window.location.href =
            "video.html";

        }
      );


      sugestoesPesquisa
        .appendChild(
          item
        );

    }
  );


  sugestoesPesquisa
    .classList.add(
      "ativo"
    );

}


// ========================================
// FECHAR ELEMENTOS AO CLICAR FORA
// ========================================

document.addEventListener(
  "click",
  event => {

    // Pesquisa

    const clicouNaBusca =
      campoPesquisa.contains(
        event.target
      );

    const clicouNasSugestoes =
      sugestoesPesquisa.contains(
        event.target
      );


    if (
      !clicouNaBusca &&
      !clicouNasSugestoes
    ) {

      sugestoesPesquisa
        .classList.remove(
          "ativo"
        );

    }


    // Categoria

    if (
      !selectCategoria.contains(
        event.target
      )
    ) {

      selectCategoria
        .classList.remove(
          "aberto"
        );

    }


    // Subcategoria

    if (
      !selectSubcategoria.contains(
        event.target
      )
    ) {

      selectSubcategoria
        .classList.remove(
          "aberto"
        );

    }

  }
);


// ========================================
// RESULTADOS DA PESQUISA / FILTROS
// ========================================

function mostrarResultadosPesquisa(
  videos
) {

  resultadoPesquisa.innerHTML =
    "";


  if (
    videos.length === 0
  ) {

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


  const titulo =
    document.createElement(
      "h2"
    );


  titulo.classList.add(
    "titulo-resultados"
  );


  titulo.textContent =
    `${videos.length} treinamento${
      videos.length > 1 ? "s" : ""
    } encontrado${
      videos.length > 1 ? "s" : ""
    }`;


  resultadoPesquisa
    .appendChild(
      titulo
    );


  const container =
    document.createElement(
      "div"
    );


  container.classList.add(
    "resultado-grid"
  );


  resultadoPesquisa
    .appendChild(
      container
    );


  mostrarVideos(
    videos,
    container
  );

}


// ========================================
// NAVBAR
// ========================================

navLinks.forEach(
  link => {

    link.addEventListener(
      "click",
      () => {

        moduloSelecionado =
          link.dataset.modulo;


        // Título

        if (
          moduloSelecionado ===
          "Ambulatorial"
        ) {

          tituloCatalogo.textContent =
            "Treinamentos Ambulatoriais";

        }

        else if (
          moduloSelecionado ===
          "Hospitalar"
        ) {

          tituloCatalogo.textContent =
            "Treinamentos Hospitalares";

        }

        else {

          tituloCatalogo.textContent =
            "Treinamentos";

        }


        // Destaque visual

        navLinks.forEach(
          item => {

            item.classList.remove(
              "ativo"
            );

          }
        );


        link.classList.add(
          "ativo"
        );


        // Limpa categoria
        // e subcategoria

        categoriaSelecionada =
          "";

        subcategoriaSelecionada =
          "";


        categoriaSelecionadaTexto
          .textContent =
          "Todas as categorias";


        subcategoriaSelecionadaTexto
          .textContent =
          "Todas as subcategorias";


        // Reconstrói filtros
        // conforme o módulo

        preencherFiltroCategorias();


        // Atualiza vídeos

        atualizarCatalogo();

      }
    );

  }
);


// ========================================
// LIMPAR FILTROS
// ========================================

btnLimparFiltros.addEventListener(
  "click",
  () => {

    // Pesquisa

    campoPesquisa.value =
      "";


    // Categoria

    categoriaSelecionada =
      "";


    categoriaSelecionadaTexto
      .textContent =
      "Todas as categorias";


    // Subcategoria

    subcategoriaSelecionada =
      "";


    subcategoriaSelecionadaTexto
      .textContent =
      "Todas as subcategorias";


    // Fecha dropdowns

    selectCategoria
      .classList.remove(
        "aberto"
      );

    selectSubcategoria
      .classList.remove(
        "aberto"
      );


    // Reconstrói filtros

    preencherFiltroCategorias();


    // Fecha sugestões

    sugestoesPesquisa.innerHTML =
      "";

    sugestoesPesquisa
      .classList.remove(
        "ativo"
      );


    // Atualiza catálogo

    atualizarCatalogo();

  }
);


// ========================================
// INICIAR
// ========================================

carregarVideos();