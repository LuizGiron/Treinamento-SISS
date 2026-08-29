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
  document.getElementById(
    "categoriaSelecionadaTexto"
  );


// ========================================
// DROPDOWN SUBCATEGORIA
// ========================================

const selectSubcategoria =
  document.getElementById("selectSubcategoria");

const triggerSubcategoria =
  selectSubcategoria.querySelector(
    ".select-trigger"
  );

const opcoesSubcategoria =
  document.getElementById(
    "opcoesSubcategoria"
  );

const subcategoriaSelecionadaTexto =
  document.getElementById(
    "subcategoriaSelecionadaTexto"
  );


// ========================================
// VERIFICAR MUNICÍPIO
// ========================================

if (!municipioSelecionado) {

  window.location.href =
    "index.html";

} else {

  nomeMunicipio.textContent =
    municipioSelecionado;

  mensagemMunicipio.textContent =
    `Conteúdos disponíveis para ${municipioSelecionado}`;

}


// ========================================
// TROCAR MUNICÍPIO
// ========================================

btnTrocarMunicipio.addEventListener(
  "click",
  () => {

    localStorage.removeItem(
      "municipioSelecionado"
    );

    localStorage.removeItem(
      "videoSelecionadoId"
    );

    window.location.href =
      "index.html";

  }
);


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

  } catch (erro) {

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


  resultadoPesquisa.innerHTML =
    "";

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


  adicionarSetasCarrossel();

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


      const correspondeCategoria =
        categoriaSelecionada === "" ||
        video.categoria ===
          categoriaSelecionada;


      const correspondeSubcategoria =
        subcategoriaSelecionada === "" ||
        video.subcategoria ===
          subcategoriaSelecionada;


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
        video =>
          video.categoria
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


  opcoesCategoria.innerHTML =
    "";


  criarOpcaoCategoria(
    "",
    "Todas as categorias"
  );


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
    document.createElement(
      "button"
    );


  botao.type =
    "button";

  botao.dataset.value =
    valor;

  botao.textContent =
    texto;


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


      subcategoriaSelecionada =
        "";


      categoriaSelecionadaTexto.textContent =
        texto;


      subcategoriaSelecionadaTexto.textContent =
        "Todas as subcategorias";


      selectCategoria.classList.remove(
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
    document.createElement(
      "button"
    );


  botao.type =
    "button";

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


      subcategoriaSelecionadaTexto.textContent =
        texto;


      selectSubcategoria.classList.remove(
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
// ABRIR DROPDOWN CATEGORIA
// ========================================

triggerCategoria.addEventListener(
  "click",
  () => {

    selectCategoria.classList.toggle(
      "aberto"
    );

    selectSubcategoria.classList.remove(
      "aberto"
    );

  }
);


// ========================================
// ABRIR DROPDOWN SUBCATEGORIA
// ========================================

triggerSubcategoria.addEventListener(
  "click",
  () => {

    selectSubcategoria.classList.toggle(
      "aberto"
    );

    selectCategoria.classList.remove(
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
      campoPesquisa.value.trim() !== ""
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


    if (
      urlYoutube.hostname.includes(
        "youtube.com"
      )
    ) {

      return urlYoutube.searchParams.get(
        "v"
      );

    }


    if (
      urlYoutube.hostname.includes(
        "youtu.be"
      )
    ) {

      return urlYoutube.pathname.substring(
        1
      );

    }


    return null;

  } catch (erro) {

    return null;

  }

}


// ========================================
// IDENTIFICAR PLATAFORMA
// ========================================

function identificarPlataforma(video) {

  if (video.plataforma) {

    return video.plataforma.toLowerCase();

  }


  const url =
    String(
      video.videoUrl || ""
    ).toLowerCase();


  if (
    url.includes("youtube.com") ||
    url.includes("youtu.be")
  ) {

    return "youtube";

  }


  if (
    url.includes("sharepoint.com")
  ) {

    return "sharepoint";

  }


  return "externo";

}


// ========================================
// OBTER THUMBNAIL
// ========================================

function obterThumbnail(video) {

  const plataforma =
    identificarPlataforma(video);

  if (plataforma === "youtube") {

    const youtubeId =
      extrairYoutubeId(video.videoUrl);

    if (youtubeId) {
      return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
    }

  }

  if (video.thumbnailUrl) {
    return video.thumbnailUrl;
  }

  return "img/ThumbPadrao.png";
}


// ========================================
// CRIAR CARDS
// ========================================

function mostrarVideos(
  videos,
  container
) {

  container.innerHTML =
    "";


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

      const thumbnail =
        obterThumbnail(video);


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
          ${
            thumbnail
              ? `style="background-image: url('${thumbnail}')"`
              : ""
          }
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

function normalizarTexto(texto) {

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

    sugestoesPesquisa.classList.remove(
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

    sugestoesPesquisa.classList.remove(
      "ativo"
    );

    return;

  }


  sugestoes.forEach(
    video => {

      const thumbnail =
        obterThumbnail(video);


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
          ${
            thumbnail
              ? `style="background-image: url('${thumbnail}')"`
              : ""
          }
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


      sugestoesPesquisa.appendChild(
        item
      );

    }
  );


  sugestoesPesquisa.classList.add(
    "ativo"
  );

}


// ========================================
// FECHAR ELEMENTOS AO CLICAR FORA
// ========================================

document.addEventListener(
  "click",
  event => {

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

      sugestoesPesquisa.classList.remove(
        "ativo"
      );

    }


    if (
      !selectCategoria.contains(
        event.target
      )
    ) {

      selectCategoria.classList.remove(
        "aberto"
      );

    }


    if (
      !selectSubcategoria.contains(
        event.target
      )
    ) {

      selectSubcategoria.classList.remove(
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
      videos.length > 1
        ? "s"
        : ""
    } encontrado${
      videos.length > 1
        ? "s"
        : ""
    }`;


  resultadoPesquisa.appendChild(
    titulo
  );


  const container =
    document.createElement(
      "div"
    );


  container.classList.add(
    "resultado-grid"
  );


  resultadoPesquisa.appendChild(
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


        if (
          moduloSelecionado ===
          "Ambulatorial"
        ) {

          tituloCatalogo.textContent =
            "Treinamentos Ambulatoriais";

        } else if (
          moduloSelecionado ===
          "Hospitalar"
        ) {

          tituloCatalogo.textContent =
            "Treinamentos Hospitalares";

        } else {

          tituloCatalogo.textContent =
            "Treinamentos";

        }


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


        categoriaSelecionada =
          "";

        subcategoriaSelecionada =
          "";


        categoriaSelecionadaTexto.textContent =
          "Todas as categorias";

        subcategoriaSelecionadaTexto.textContent =
          "Todas as subcategorias";


        preencherFiltroCategorias();

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

    campoPesquisa.value =
      "";


    categoriaSelecionada =
      "";

    categoriaSelecionadaTexto.textContent =
      "Todas as categorias";


    subcategoriaSelecionada =
      "";

    subcategoriaSelecionadaTexto.textContent =
      "Todas as subcategorias";


    selectCategoria.classList.remove(
      "aberto"
    );

    selectSubcategoria.classList.remove(
      "aberto"
    );


    preencherFiltroCategorias();


    sugestoesPesquisa.innerHTML =
      "";

    sugestoesPesquisa.classList.remove(
      "ativo"
    );


    atualizarCatalogo();

  }
);


// ========================================
// CARROSSEL DE VÍDEOS
// ========================================

function adicionarSetasCarrossel() {

  const listas =
    document.querySelectorAll(
      ".video-row"
    );


  listas.forEach(
    lista => {

      if (
        lista.parentElement.classList.contains(
          "carrossel-wrapper"
        )
      ) {

        atualizarSetas(
          lista
        );

        return;

      }


      const wrapper =
        document.createElement(
          "div"
        );


      wrapper.classList.add(
        "carrossel-wrapper"
      );


      lista.parentNode.insertBefore(
        wrapper,
        lista
      );


      wrapper.appendChild(
        lista
      );


      // ========================================
      // SETA ESQUERDA
      // ========================================

      const btnEsquerda =
        document.createElement(
          "button"
        );


      btnEsquerda.type =
        "button";


      btnEsquerda.classList.add(
        "carrossel-seta",
        "carrossel-esquerda"
      );


      btnEsquerda.innerHTML =
        "‹";


      btnEsquerda.setAttribute(
        "aria-label",
        "Ver vídeos anteriores"
      );


      // ========================================
      // SETA DIREITA
      // ========================================

      const btnDireita =
        document.createElement(
          "button"
        );


      btnDireita.type =
        "button";


      btnDireita.classList.add(
        "carrossel-seta",
        "carrossel-direita"
      );


      btnDireita.innerHTML =
        "›";


      btnDireita.setAttribute(
        "aria-label",
        "Ver próximos vídeos"
      );


      wrapper.appendChild(
        btnEsquerda
      );


      wrapper.appendChild(
        btnDireita
      );


      // ========================================
      // DISTÂNCIA DE ROLAGEM
      // ========================================

      function distanciaRolagem() {

        return Math.max(
          lista.clientWidth * 0.8,
          300
        );

      }


      // ========================================
      // CLIQUE ESQUERDA
      // ========================================

      btnEsquerda.addEventListener(
        "click",
        () => {

          lista.scrollBy({
            left:
              -distanciaRolagem(),

            behavior:
              "smooth"
          });

        }
      );


      // ========================================
      // CLIQUE DIREITA
      // ========================================

      btnDireita.addEventListener(
        "click",
        () => {

          lista.scrollBy({
            left:
              distanciaRolagem(),

            behavior:
              "smooth"
          });

        }
      );


      lista.addEventListener(
        "scroll",
        () => {

          atualizarSetas(
            lista
          );

        }
      );


      atualizarSetas(
        lista
      );

    }
  );

}


// ========================================
// ATUALIZAR SETAS DO CARROSSEL
// ========================================

function atualizarSetas(
  lista
) {

  const wrapper =
    lista.parentElement;


  if (
    !wrapper.classList.contains(
      "carrossel-wrapper"
    )
  ) {

    return;

  }


  const esquerda =
    wrapper.querySelector(
      ".carrossel-esquerda"
    );


  const direita =
    wrapper.querySelector(
      ".carrossel-direita"
    );


  if (
    !esquerda ||
    !direita
  ) {

    return;

  }


  const chegouInicio =
    lista.scrollLeft <= 5;


  const chegouFim =
    lista.scrollLeft +
      lista.clientWidth >=
    lista.scrollWidth - 5;


  const possuiRolagem =
    lista.scrollWidth >
    lista.clientWidth + 5;


  esquerda.classList.toggle(
    "oculta",
    chegouInicio ||
      !possuiRolagem
  );


  direita.classList.toggle(
    "oculta",
    chegouFim ||
      !possuiRolagem
  );

}


// ========================================
// ATUALIZAR SETAS AO REDIMENSIONAR
// ========================================

window.addEventListener(
  "resize",
  () => {

    document
      .querySelectorAll(
        ".video-row"
      )
      .forEach(
        lista => {

          atualizarSetas(
            lista
          );

        }
      );

  }
);


// ========================================
// INICIAR
// ========================================

carregarVideos();