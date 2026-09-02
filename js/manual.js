let manuais = [];

let moduloSelecionado = null;
let categoriaSelecionada = null;
let subcategoriaSelecionada = null;

const manualContainer =
  document.querySelector(".manual-container");

const campoPesquisaManual =
  document.getElementById("campoPesquisaManual");


/* ========================================
   CARREGAR MANUAIS
======================================== */

async function carregarManuais() {
  try {

    const resposta =
      await fetch("data/manuais.json");

    if (!resposta.ok) {
      throw new Error(
        "Não foi possível carregar os manuais."
      );
    }

    manuais =
      await resposta.json();

    mostrarModulos();

  } catch (erro) {

    console.error(
      "Erro ao carregar manuais:",
      erro
    );

    manualContainer.innerHTML = `
      <div class="manual-vazio">

        <h2>
          Não foi possível carregar os conteúdos
        </h2>

        <p>
          Tente atualizar a página.
        </p>

      </div>
    `;
  }
}


/* ========================================
   MOSTRAR MÓDULOS
======================================== */

function mostrarModulos() {

  moduloSelecionado = null;
  categoriaSelecionada = null;
  subcategoriaSelecionada = null;

  campoPesquisaManual.value = "";

  const modulos = [
    ...new Set(
      manuais
        .map(
          manual =>
            manual.modulo
        )
        .filter(Boolean)
    )
  ].sort((a, b) =>
    a.localeCompare(
      b,
      "pt-BR"
    )
  );

  manualContainer.innerHTML = "";

  modulos.forEach(
    modulo => {

      const artigosModulo =
        manuais.filter(
          manual =>
            manual.modulo === modulo
        );

      const categorias = [
        ...new Set(
          artigosModulo
            .map(
              manual =>
                manual.categoria
            )
            .filter(Boolean)
        )
      ];

      const card =
        document.createElement(
          "article"
        );

      card.classList.add(
        "manual-card"
      );

      card.innerHTML = `
        <h2>
          ${modulo}
        </h2>

        <p>
          ${artigosModulo.length}
          ${
            artigosModulo.length === 1
              ? "conteúdo disponível"
              : "conteúdos disponíveis"
          }

          <br>

          <span
            class="manual-contagem-subcategorias"
          >
            ${categorias.length}
            ${
              categorias.length === 1
                ? "categoria"
                : "categorias"
            }
          </span>
        </p>

        <button
          type="button"
          class="manual-link"
        >
          Acessar módulo
        </button>
      `;

      card
        .querySelector(
          ".manual-link"
        )
        .addEventListener(
          "click",
          () => {

            mostrarCategorias(
              modulo
            );

          }
        );

      manualContainer.appendChild(
        card
      );
    }
  );
}


/* ========================================
   MOSTRAR CATEGORIAS
======================================== */

function mostrarCategorias(
  modulo
) {

  moduloSelecionado =
    modulo;

  categoriaSelecionada =
    null;

  subcategoriaSelecionada =
    null;

  campoPesquisaManual.value = "";

  const artigosModulo =
    manuais.filter(
      manual =>
        manual.modulo === modulo
    );

  const categorias = [
    ...new Set(
      artigosModulo
        .map(
          manual =>
            manual.categoria
        )
        .filter(Boolean)
    )
  ].sort((a, b) =>
    a.localeCompare(
      b,
      "pt-BR"
    )
  );

  manualContainer.innerHTML = `
    <div
      class="manual-lista-topo"
    >

      <button
        type="button"
        id="btnVoltarModulos"
        class="btn-voltar-manual"
      >
        ← Voltar aos módulos
      </button>

      <div
        class="manual-breadcrumb"
      >
        ${modulo}
      </div>

      <h2>
        ${modulo}
      </h2>

      <p
        class="manual-lista-descricao"
      >
        Selecione uma categoria
        para consultar os conteúdos.
      </p>

    </div>

    <div
      id="listaCategorias"
      class="manual-artigos"
    ></div>
  `;

  const listaCategorias =
    document.getElementById(
      "listaCategorias"
    );

  categorias.forEach(
    categoria => {

      const artigos =
        artigosModulo.filter(
          manual =>
            manual.categoria ===
            categoria
        );

      const subcategorias = [
        ...new Set(
          artigos
            .map(
              manual =>
                manual.subcategoria
            )
            .filter(Boolean)
        )
      ];

      const card =
        document.createElement(
          "article"
        );

      card.classList.add(
        "manual-card"
      );

      card.innerHTML = `
        <h2>
          ${categoria}
        </h2>

        <p>
          ${artigos.length}
          ${
            artigos.length === 1
              ? "conteúdo disponível"
              : "conteúdos disponíveis"
          }

          ${
            subcategorias.length > 0
              ? `
                <br>

                <span
                  class="manual-contagem-subcategorias"
                >
                  ${subcategorias.length}
                  ${
                    subcategorias.length === 1
                      ? "subcategoria"
                      : "subcategorias"
                  }
                </span>
              `
              : ""
          }
        </p>

        <button
          type="button"
          class="manual-link"
        >
          Ver conteúdos
        </button>
      `;

      card
        .querySelector(
          ".manual-link"
        )
        .addEventListener(
          "click",
          () => {

            mostrarSubcategorias(
              modulo,
              categoria
            );

          }
        );

      listaCategorias.appendChild(
        card
      );
    }
  );

  document
    .getElementById(
      "btnVoltarModulos"
    )
    .addEventListener(
      "click",
      () => {

        mostrarModulos();

      }
    );
}


/* ========================================
   MOSTRAR SUBCATEGORIAS
======================================== */

function mostrarSubcategorias(
  modulo,
  categoria
) {

  moduloSelecionado =
    modulo;

  categoriaSelecionada =
    categoria;

  subcategoriaSelecionada =
    null;

  campoPesquisaManual.value = "";

  const artigosCategoria =
    manuais.filter(
      manual =>
        manual.modulo === modulo &&
        manual.categoria === categoria
    );

  const subcategorias = [
    ...new Set(
      artigosCategoria
        .map(
          manual =>
            manual.subcategoria
        )
        .filter(Boolean)
    )
  ].sort((a, b) =>
    a.localeCompare(
      b,
      "pt-BR"
    )
  );


  /*
    Se a categoria não possuir
    subcategorias, exibe os artigos.
  */

  if (
    subcategorias.length === 0
  ) {

    mostrarArtigosCategoria(
      modulo,
      categoria
    );

    return;
  }


  manualContainer.innerHTML = `
    <div
      class="manual-lista-topo"
    >

      <button
        type="button"
        id="btnVoltarCategorias"
        class="btn-voltar-manual"
      >
        ← Voltar para ${modulo}
      </button>

      <div
        class="manual-breadcrumb"
      >
        ${modulo}

        <span>
          ›
        </span>

        ${categoria}
      </div>

      <h2>
        ${categoria}
      </h2>

      <p
        class="manual-lista-descricao"
      >
        Selecione uma subcategoria
        para consultar os conteúdos.
      </p>

    </div>

    <div
      id="listaSubcategorias"
      class="manual-artigos"
    ></div>
  `;

  const listaSubcategorias =
    document.getElementById(
      "listaSubcategorias"
    );

  subcategorias.forEach(
    subcategoria => {

      const artigos =
        artigosCategoria.filter(
          manual =>
            manual.subcategoria ===
            subcategoria
        );

      const card =
        document.createElement(
          "article"
        );

      card.classList.add(
        "manual-card"
      );

      card.innerHTML = `
        <h2>
          ${subcategoria}
        </h2>

        <p>
          ${artigos.length}
          ${
            artigos.length === 1
              ? "conteúdo disponível"
              : "conteúdos disponíveis"
          }
        </p>

        <button
          type="button"
          class="manual-link"
        >
          Ver conteúdos
        </button>
      `;

      card
        .querySelector(
          ".manual-link"
        )
        .addEventListener(
          "click",
          () => {

            mostrarArtigosSubcategoria(
              modulo,
              categoria,
              subcategoria
            );

          }
        );

      listaSubcategorias.appendChild(
        card
      );
    }
  );

  document
    .getElementById(
      "btnVoltarCategorias"
    )
    .addEventListener(
      "click",
      () => {

        mostrarCategorias(
          modulo
        );

      }
    );
}


/* ========================================
   ARTIGOS DA SUBCATEGORIA
======================================== */

function mostrarArtigosSubcategoria(
  modulo,
  categoria,
  subcategoria
) {

  moduloSelecionado =
    modulo;

  categoriaSelecionada =
    categoria;

  subcategoriaSelecionada =
    subcategoria;

  campoPesquisaManual.value = "";

  const artigos =
    manuais.filter(
      manual =>
        manual.modulo === modulo &&
        manual.categoria === categoria &&
        manual.subcategoria ===
          subcategoria
    );

  manualContainer.innerHTML = `
    <div
      class="manual-lista-topo"
    >

      <button
        type="button"
        id="btnVoltarSubcategorias"
        class="btn-voltar-manual"
      >
        ← Voltar para ${categoria}
      </button>

      <div
        class="manual-breadcrumb"
      >
        ${modulo}

        <span>
          ›
        </span>

        ${categoria}

        <span>
          ›
        </span>

        ${subcategoria}
      </div>

      <h2>
        ${subcategoria}
      </h2>

      <p
        class="manual-lista-descricao"
      >
        ${artigos.length}
        ${
          artigos.length === 1
            ? "conteúdo disponível"
            : "conteúdos disponíveis"
        }
      </p>

    </div>

    <div
      id="listaArtigos"
      class="manual-artigos"
    ></div>
  `;

  const listaArtigos =
    document.getElementById(
      "listaArtigos"
    );

  artigos.forEach(
    artigo => {

      listaArtigos.appendChild(
        criarCardArtigo(
          artigo
        )
      );

    }
  );

  document
    .getElementById(
      "btnVoltarSubcategorias"
    )
    .addEventListener(
      "click",
      () => {

        mostrarSubcategorias(
          modulo,
          categoria
        );

      }
    );
}


/* ========================================
   ARTIGOS SEM SUBCATEGORIA
======================================== */

function mostrarArtigosCategoria(
  modulo,
  categoria
) {

  moduloSelecionado =
    modulo;

  categoriaSelecionada =
    categoria;

  subcategoriaSelecionada =
    null;

  campoPesquisaManual.value = "";

  const artigos =
    manuais.filter(
      manual =>
        manual.modulo === modulo &&
        manual.categoria === categoria
    );

  manualContainer.innerHTML = `
    <div
      class="manual-lista-topo"
    >

      <button
        type="button"
        id="btnVoltarCategorias"
        class="btn-voltar-manual"
      >
        ← Voltar para ${modulo}
      </button>

      <div
        class="manual-breadcrumb"
      >
        ${modulo}

        <span>
          ›
        </span>

        ${categoria}
      </div>

      <h2>
        ${categoria}
      </h2>

    </div>

    <div
      id="listaArtigos"
      class="manual-artigos"
    ></div>
  `;

  const listaArtigos =
    document.getElementById(
      "listaArtigos"
    );

  artigos.forEach(
    artigo => {

      listaArtigos.appendChild(
        criarCardArtigo(
          artigo
        )
      );

    }
  );

  document
    .getElementById(
      "btnVoltarCategorias"
    )
    .addEventListener(
      "click",
      () => {

        mostrarCategorias(
          modulo
        );

      }
    );
}


/* ========================================
   CRIAR CARD DO ARTIGO
======================================== */

function criarCardArtigo(
  artigo
) {

  const card =
    document.createElement(
      "article"
    );

  card.classList.add(
    "manual-artigo-card"
  );

  let botao = "";

  if (
    artigo.url &&
    artigo.url.trim() !== ""
  ) {

    botao = `
      <a
        href="${artigo.url}"
        target="_blank"
        rel="noopener noreferrer"
        class="manual-artigo-link"
      >
        Ler artigo →
      </a>
    `;

  } else {

    botao = `
      <span
        class="manual-artigo-indisponivel"
      >
        Conteúdo em breve
      </span>
    `;
  }

  card.innerHTML = `
    <div
      class="manual-artigo-info"
    >

      <span
        class="manual-artigo-categoria"
      >
        ${
          artigo.subcategoria ||
          artigo.categoria
        }
      </span>

      <h3>
        ${artigo.titulo}
      </h3>

      <p>
        ${artigo.descricao || ""}
      </p>

    </div>

    ${botao}
  `;

  return card;
}


/* ========================================
   PESQUISA
======================================== */

function pesquisarManual() {

  const termo =
    campoPesquisaManual
      .value
      .trim()
      .toLowerCase();

  if (!termo) {

    if (
      moduloSelecionado &&
      categoriaSelecionada &&
      subcategoriaSelecionada
    ) {

      mostrarArtigosSubcategoria(
        moduloSelecionado,
        categoriaSelecionada,
        subcategoriaSelecionada
      );

      return;
    }

    if (
      moduloSelecionado &&
      categoriaSelecionada
    ) {

      mostrarSubcategorias(
        moduloSelecionado,
        categoriaSelecionada
      );

      return;
    }

    if (
      moduloSelecionado
    ) {

      mostrarCategorias(
        moduloSelecionado
      );

      return;
    }

    mostrarModulos();

    return;
  }


  const resultados =
    manuais.filter(
      manual => {

        const texto = `
          ${manual.modulo || ""}
          ${manual.categoria || ""}
          ${manual.subcategoria || ""}
          ${manual.titulo || ""}
          ${manual.descricao || ""}
        `.toLowerCase();

        return texto.includes(
          termo
        );
      }
    );

  mostrarResultadosPesquisa(
    resultados
  );
}


/* ========================================
   RESULTADOS DA PESQUISA
======================================== */

function mostrarResultadosPesquisa(
  resultados
) {

  manualContainer.innerHTML = "";

  if (
    resultados.length === 0
  ) {

    manualContainer.innerHTML = `
      <div
        class="manual-vazio"
      >

        <h2>
          Nenhum conteúdo encontrado
        </h2>

        <p>
          Tente utilizar outro termo
          de pesquisa.
        </p>

      </div>
    `;

    return;
  }

  const topo =
    document.createElement(
      "div"
    );

  topo.classList.add(
    "manual-lista-topo"
  );

  topo.innerHTML = `
    <h2>
      Resultados da pesquisa
    </h2>

    <p
      class="manual-lista-descricao"
    >
      ${resultados.length}
      ${
        resultados.length === 1
          ? "resultado encontrado"
          : "resultados encontrados"
      }
    </p>
  `;

  const lista =
    document.createElement(
      "div"
    );

  lista.classList.add(
    "manual-artigos"
  );

  resultados.forEach(
    artigo => {

      lista.appendChild(
        criarCardArtigo(
          artigo
        )
      );

    }
  );

  manualContainer.appendChild(
    topo
  );

  manualContainer.appendChild(
    lista
  );
}


/* ========================================
   EVENTOS
======================================== */

campoPesquisaManual.addEventListener(
  "input",
  pesquisarManual
);


/* ========================================
   INICIALIZAÇÃO
======================================== */

carregarManuais();