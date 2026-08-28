const municipioSelecionado =
  localStorage.getItem("municipioSelecionado");

const videoSelecionadoId =
  localStorage.getItem("videoSelecionadoId");

const nomeMunicipio =
  document.getElementById("nomeMunicipio");

const videoTitulo =
  document.getElementById("videoTitulo");

const videoDescricao =
  document.getElementById("videoDescricao");

const breadcrumb =
  document.getElementById("breadcrumb");

const youtubePlayer =
  document.getElementById("youtubePlayer");

const videoModulo =
  document.getElementById("videoModulo");

const videoDuracaoDetalhe =
  document.getElementById("videoDuracaoDetalhe");

const videosRelacionados =
  document.getElementById("videosRelacionados");

const btnVoltarCatalogo =
  document.getElementById("btnVoltarCatalogo");


// ========================================
// VERIFICAR DADOS
// ========================================

if (!municipioSelecionado || !videoSelecionadoId) {
  window.location.href = "index.html";
}


nomeMunicipio.textContent =
  municipioSelecionado;


// ========================================
// VOLTAR AO CATÁLOGO
// ========================================

btnVoltarCatalogo.addEventListener("click", () => {
  window.location.href = "catalogo.html";
});


// ========================================
// EXTRAIR ID DO YOUTUBE
// ========================================

function extrairYoutubeId(url) {

  try {

    const urlYoutube =
      new URL(url);

    if (
      urlYoutube.hostname.includes("youtube.com")
    ) {
      return urlYoutube.searchParams.get("v");
    }

    if (
      urlYoutube.hostname.includes("youtu.be")
    ) {
      return urlYoutube.pathname.substring(1);
    }

    return null;

  } catch (erro) {

    console.error(
      "URL inválida:",
      url
    );

    return null;

  }

}


// ========================================
// IDENTIFICAR PLATAFORMA
// ========================================

function identificarPlataforma(video) {

  // Se estiver informado no JSON,
  // utiliza primeiro esse valor

  if (video.plataforma) {
    return video.plataforma.toLowerCase();
  }


  // Caso ainda existam vídeos antigos
  // sem o campo "plataforma",
  // tentamos identificar pela URL

  const url =
    String(video.videoUrl || "").toLowerCase();


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
// CARREGAR VÍDEO
// ========================================

async function carregarVideo() {

  try {

    const resposta =
      await fetch("data/videos.json");

    if (!resposta.ok) {
      throw new Error(
        "Não foi possível carregar videos.json"
      );
    }

    const videos =
      await resposta.json();


    const video =
      videos.find(
        item =>
          String(item.id) ===
          String(videoSelecionadoId)
      );


    if (!video) {

      alert(
        "Treinamento não encontrado."
      );

      window.location.href =
        "catalogo.html";

      return;

    }


    preencherVideo(video);

    carregarRelacionados(
      videos,
      video
    );

  } catch (erro) {

    console.error(
      "Erro ao carregar treinamento:",
      erro
    );

  }

}


// ========================================
// PREENCHER VÍDEO
// ========================================

function preencherVideo(video) {

  videoTitulo.textContent =
    video.titulo;

  videoDescricao.textContent =
    video.descricao;

  breadcrumb.textContent =
    `${video.modulo} › ${video.categoria} › ${video.subcategoria}`;

  videoModulo.textContent =
    video.modulo;

  videoDuracaoDetalhe.textContent =
    `Duração: ${video.duracao}`;


  const plataforma =
    identificarPlataforma(video);


  // Remove botão externo anterior,
  // caso exista

  const botaoExistente =
    document.getElementById(
      "btnVideoExterno"
    );

  if (botaoExistente) {
    botaoExistente.remove();
  }


  // Limpa o iframe antes
  // de carregar outro conteúdo

  youtubePlayer.src = "";

  youtubePlayer.style.display =
    "block";


  // ========================================
  // YOUTUBE
  // ========================================

  if (plataforma === "youtube") {

    const youtubeId =
      extrairYoutubeId(
        video.videoUrl
      );


    if (youtubeId) {

      youtubePlayer.src =
        `https://www.youtube.com/embed/${youtubeId}`;

      return;

    }

  }


  // ========================================
  // SHAREPOINT / MICROSOFT STREAM
  // ========================================

  if (plataforma === "sharepoint") {

    youtubePlayer.src =
      video.videoUrl;

    return;

  }


  // ========================================
  // OUTRA PLATAFORMA
  // ========================================

  if (video.videoUrl) {

    youtubePlayer.style.display =
      "none";


    const playerContainer =
      youtubePlayer.parentElement;


    const botaoExterno =
      document.createElement("a");


    botaoExterno.id =
      "btnVideoExterno";

    botaoExterno.href =
      video.videoUrl;

    botaoExterno.target =
      "_blank";

    botaoExterno.rel =
      "noopener noreferrer";

    botaoExterno.textContent =
      "▶ Assistir treinamento";

    botaoExterno.classList.add(
      "btn-video-externo"
    );


    playerContainer.appendChild(
      botaoExterno
    );

  }

}


// ========================================
// CARREGAR RELACIONADOS
// ========================================

function carregarRelacionados(
  videos,
  videoAtual
) {

  const relacionados =
    videos.filter(
      video =>

        video.municipio ===
          videoAtual.municipio &&

        video.id !==
          videoAtual.id &&

        (
          video.categoria ===
            videoAtual.categoria ||

          video.subcategoria ===
            videoAtual.subcategoria ||

          video.modulo ===
            videoAtual.modulo
        )

    );


  mostrarRelacionados(
    relacionados.slice(0, 6)
  );

}


// ========================================
// OBTER THUMBNAIL
// ========================================

function obterThumbnail(video) {

  const plataforma =
    identificarPlataforma(video);


  // YouTube:
  // gera thumbnail automaticamente

  if (
    plataforma === "youtube"
  ) {

    const youtubeId =
      extrairYoutubeId(
        video.videoUrl
      );


    if (youtubeId) {

      return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

    }

  }


  // SharePoint ou outra plataforma:
  // utiliza thumbnail definida no JSON

  if (video.thumbnailUrl) {

    return video.thumbnailUrl;

  }


  // Sem imagem

  return "";

}


// ========================================
// MOSTRAR RELACIONADOS
// ========================================

function mostrarRelacionados(videos) {

  videosRelacionados.innerHTML =
    "";


  if (videos.length === 0) {

    videosRelacionados.innerHTML = `
      <p class="sem-videos">
        Nenhum treinamento relacionado no momento.
      </p>
    `;

    return;

  }


  videos.forEach(video => {

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

        <span class="video-categoria">
          ${video.categoria}
          •
          ${video.subcategoria}
        </span>

        <h3>
          ${video.titulo}
        </h3>

      </div>
    `;


    card.addEventListener(
      "click",
      () => {

        localStorage.setItem(
          "videoSelecionadoId",
          video.id
        );

        window.location.reload();

      }
    );


    videosRelacionados.appendChild(
      card
    );

  });

}


// ========================================
// INICIAR
// ========================================

carregarVideo();