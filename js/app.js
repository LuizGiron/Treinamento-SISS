const selectMunicipio = document.getElementById("selectMunicipio");
const selectTrigger = selectMunicipio.querySelector(".select-trigger");
const opcoesMunicipio = selectMunicipio.querySelectorAll(".select-opcoes button");
const textoMunicipio = document.getElementById("municipioSelecionadoTexto");
const btnContinuar = document.getElementById("btnContinuar");

let municipioSelecionado = "";


/* ==============================
   ABRIR / FECHAR SELECT
================================ */

selectTrigger.addEventListener("click", () => {
    selectMunicipio.classList.toggle("aberto");
});


/* ==============================
   SELECIONAR MUNICÍPIO
================================ */

opcoesMunicipio.forEach(opcao => {

    opcao.addEventListener("click", () => {

        municipioSelecionado = opcao.dataset.value;

        textoMunicipio.textContent = municipioSelecionado;

        selectMunicipio.classList.remove("aberto");

        console.log("Município selecionado:", municipioSelecionado);

    });

});


/* ==============================
   FECHAR AO CLICAR FORA
================================ */

document.addEventListener("click", (event) => {

    if (!selectMunicipio.contains(event.target)) {
        selectMunicipio.classList.remove("aberto");
    }

});


/* ==============================
   CONTINUAR PARA O CATÁLOGO
================================ */

btnContinuar.addEventListener("click", () => {

    if (municipioSelecionado === "") {
        alert("Por favor, selecione um município.");
        return;
    }

    localStorage.setItem(
        "municipioSelecionado",
        municipioSelecionado
    );

    console.log(
        "Município salvo:",
        municipioSelecionado
    );

    window.location.href = "catalogo.html";

});