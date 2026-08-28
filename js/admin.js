const adminMunicipio =
    document.getElementById("adminMunicipio");

const adminModulo =
    document.getElementById("adminModulo");

const adminCategoria =
    document.getElementById("adminCategoria");

const adminSubcategoria =
    document.getElementById("adminSubcategoria");

const adminTitulo =
    document.getElementById("adminTitulo");

const adminDescricao =
    document.getElementById("adminDescricao");

const adminTags =
    document.getElementById("adminTags");

const adminDuracao =
    document.getElementById("adminDuracao");

const adminVideoUrl =
    document.getElementById("adminVideoUrl");

const btnGerarCadastro =
    document.getElementById("btnGerarCadastro");

const btnLimparCadastro =
    document.getElementById("btnLimparCadastro");

const btnCopiarJson =
    document.getElementById("btnCopiarJson");

const resultadoAdmin =
    document.getElementById("resultadoAdmin");

const jsonGerado =
    document.getElementById("jsonGerado");


let proximoId = 1;


// ========================================
// BUSCAR PRÓXIMO ID
// ========================================

async function carregarProximoId() {

    try {

        const resposta =
            await fetch("data/videos.json");

        const videos =
            await resposta.json();


        if (videos.length === 0) {

            proximoId = 1;

            return;

        }


        const maiorId =
            Math.max(
                ...videos.map(video =>
                    Number(video.id)
                )
            );


        proximoId =
            maiorId + 1;


    } catch (erro) {

        console.error(
            "Erro ao carregar IDs:",
            erro
        );

        proximoId = 1;

    }

}


// ========================================
// GERAR CADASTRO
// ========================================

btnGerarCadastro.addEventListener(
    "click",
    () => {

        if (
            adminMunicipio.value === "" ||
            adminModulo.value === "" ||
            adminCategoria.value.trim() === "" ||
            adminSubcategoria.value.trim() === "" ||
            adminTitulo.value.trim() === "" ||
            adminDescricao.value.trim() === "" ||
            adminDuracao.value.trim() === "" ||
            adminVideoUrl.value.trim() === ""
        ) {

            alert(
                "Preencha todos os campos obrigatórios."
            );

            return;

        }


        const tags =
            adminTags.value
                .split(",")
                .map(tag =>
                    tag.trim()
                )
                .filter(tag =>
                    tag !== ""
                );


        const novoVideo = {

            id: proximoId,

            municipio:
                adminMunicipio.value,

            modulo:
                adminModulo.value,

            categoria:
                adminCategoria.value.trim(),

            subcategoria:
                adminSubcategoria.value.trim(),

            titulo:
                adminTitulo.value.trim(),

            descricao:
                adminDescricao.value.trim(),

            tags: tags,

            duracao:
                adminDuracao.value.trim(),

            videoUrl:
                adminVideoUrl.value.trim()

        };


        jsonGerado.textContent =
            JSON.stringify(
                novoVideo,
                null,
                4
            );


        resultadoAdmin.style.display =
            "block";


        resultadoAdmin.scrollIntoView({
            behavior: "smooth"
        });

    }
);


// ========================================
// COPIAR JSON
// ========================================

btnCopiarJson.addEventListener(
    "click",
    async () => {

        try {

            await navigator.clipboard.writeText(
                jsonGerado.textContent
            );


            const textoOriginal =
                btnCopiarJson.textContent;


            btnCopiarJson.textContent =
                "Copiado ✓";


            setTimeout(() => {

                btnCopiarJson.textContent =
                    textoOriginal;

            }, 1500);


        } catch (erro) {

            alert(
                "Não foi possível copiar automaticamente."
            );

        }

    }
);


// ========================================
// LIMPAR FORMULÁRIO
// ========================================

btnLimparCadastro.addEventListener(
    "click",
    () => {

        adminMunicipio.value = "";

        adminModulo.value = "";

        adminCategoria.value = "";

        adminSubcategoria.value = "";

        adminTitulo.value = "";

        adminDescricao.value = "";

        adminTags.value = "";

        adminDuracao.value = "";

        adminVideoUrl.value = "";


        resultadoAdmin.style.display =
            "none";

    }
);


// ========================================
// INICIAR
// ========================================

carregarProximoId();