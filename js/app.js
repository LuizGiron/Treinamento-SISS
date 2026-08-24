const municipioSelect = document.getElementById("municipio");
const btnContinuar = document.getElementById("btnContinuar");

btnContinuar.addEventListener("click", () => {
    const municipioSelecionado = municipioSelect.value;

    if (municipioSelecionado === "") {
        alert("Por favor, selecione um município.");
        return;
    }

    localStorage.setItem("municipioSelecionado", municipioSelecionado);

    console.log("Município selecionado:", municipioSelecionado);

    window.location.href = "catalogo.html";
});