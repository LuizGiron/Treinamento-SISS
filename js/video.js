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


if (!municipioSelecionado || !videoSelecionadoId) {

    window.location.href = "index.html";

}


nomeMunicipio.textContent = municipioSelecionado;


btnVoltarCatalogo.addEventListener("click", () => {

    window.location.href = "catalogo.html";

});


function extrairYoutubeId(url) {

    try {

        const urlYoutube = new URL(url);

        if (urlYoutube.hostname.includes("youtube.com")) {
            return urlYoutube.searchParams.get("v");
        }

        if (urlYoutube.hostname.includes("youtu.be")) {
            return urlYoutube.pathname.substring(1);
        }

        return null;

    } catch (erro) {

        console.error("URL inválida:", url);

        return null;

    }

}


async function carregarVideo() {

    try {

        const resposta =
            await fetch("data/videos.json");

        const videos =
            await resposta.json();

        const video =
            videos.find(item =>
                String(item.id) === String(videoSelecionadoId)
            );

        if (!video) {

            alert("Treinamento não encontrado.");

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

    const youtubeId =
        extrairYoutubeId(video.videoUrl);

    if (youtubeId) {

        youtubePlayer.src =
            `https://www.youtube.com/embed/${youtubeId}`;

    }

}


function carregarRelacionados(videos, videoAtual) {

    const relacionados =
        videos.filter(video =>

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


function mostrarRelacionados(videos) {

    videosRelacionados.innerHTML = "";

    if (videos.length === 0) {

        videosRelacionados.innerHTML = `
            <p class="sem-videos">
                Nenhum treinamento relacionado no momento.
            </p>
        `;

        return;

    }

    videos.forEach(video => {

        const youtubeId =
            extrairYoutubeId(video.videoUrl);

        const thumbnail =
            youtubeId
                ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
                : "";

        const card =
            document.createElement("article");

        card.classList.add(
            "video-card"
        );

        card.innerHTML = `
            <div
                class="video-thumbnail"
                style="background-image: url('${thumbnail}')">

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


carregarVideo();