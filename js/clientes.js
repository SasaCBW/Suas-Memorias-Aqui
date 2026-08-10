```javascript
/* =========================================================
   SUAS MEMÓRIAS AQUI
   CLIENTE.JS
   Área exclusiva do cliente
========================================================= */

import {
    auth,
    db
} from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


/* =========================================================
   ELEMENTOS
========================================================= */

const clientNameHeader =
    document.getElementById(
        "clientNameHeader"
    );

const clientEmailHeader =
    document.getElementById(
        "clientEmailHeader"
    );

const clientFirstName =
    document.getElementById(
        "clientFirstName"
    );

const clientAvatar =
    document.getElementById(
        "clientAvatar"
    );

const clientGalleryGrid =
    document.getElementById(
        "clientGalleryGrid"
    );

const galleryLoading =
    document.getElementById(
        "galleryLoading"
    );

const noGalleries =
    document.getElementById(
        "noGalleries"
    );

const galleryCount =
    document.getElementById(
        "galleryCount"
    );

const clientLogout =
    document.getElementById(
        "clientLogout"
    );

const logoutModal =
    document.getElementById(
        "logoutModal"
    );

const cancelLogout =
    document.getElementById(
        "cancelLogout"
    );

const confirmLogout =
    document.getElementById(
        "confirmLogout"
    );

const logoutModalOverlay =
    document.getElementById(
        "logoutModalOverlay"
    );


/* =========================================================
   ESTADO
========================================================= */

let currentUser =
    null;


/* =========================================================
   AUTENTICAÇÃO
========================================================= */

onAuthStateChanged(
    auth,
    async (user) => {

        /*
         * Se não estiver logado,
         * volta para o login.
         */

        if (!user) {

            window.location.replace(
                "login.html"
            );

            return;

        }


        currentUser =
            user;


        /*
         * Mostra informações
         * básicas do usuário.
         */

        carregarDadosUsuario(
            user
        );


        /*
         * Busca as galerias
         * vinculadas ao usuário.
         */

        await carregarGalerias(
            user
        );

    }
);


/* =========================================================
   DADOS DO USUÁRIO
========================================================= */

function carregarDadosUsuario(
    user
) {

    const nome =
        obterNomeUsuario(
            user
        );


    const primeiroNome =
        nome
            .trim()
            .split(" ")[0];


    const inicial =
        primeiroNome
            ? primeiroNome
                .charAt(0)
                .toUpperCase()
            : "C";


    if (clientNameHeader) {

        clientNameHeader.textContent =
            nome;

    }


    if (clientFirstName) {

        clientFirstName.textContent =
            primeiroNome ||
            "cliente";

    }


    if (clientEmailHeader) {

        clientEmailHeader.textContent =
            user.email ||
            "";

    }


    if (clientAvatar) {

        /*
         * Se o Google fornecer uma foto,
         * podemos utilizá-la.
         */

        if (user.photoURL) {

            clientAvatar.innerHTML = `
                <img
                    src="${escaparHTML(user.photoURL)}"
                    alt="Foto do cliente"
                >
            `;

        } else {

            clientAvatar.textContent =
                inicial;

        }

    }

}


/* =========================================================
   OBTER NOME
========================================================= */

function obterNomeUsuario(
    user
) {

    if (user.displayName) {

        return user.displayName;

    }


    if (user.email) {

        const parteEmail =
            user.email.split("@")[0];


        return formatarNome(
            parteEmail
        );

    }


    return "Cliente";

}


/* =========================================================
   FORMATAR NOME
========================================================= */

function formatarNome(
    nome
) {

    return nome
        .replace(/[._-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .split(" ")
        .map(
            palavra =>
                palavra
                    .charAt(0)
                    .toUpperCase() +
                palavra
                    .slice(1)
                    .toLowerCase()
        )
        .join(" ");

}


/* =========================================================
   CARREGAR GALERIAS
========================================================= */

async function carregarGalerias(
    user
) {

    mostrarLoading(
        true
    );


    esconderGalerias();


    try {

        /*
         * A coleção utilizada será:
         *
         * galerias
         *
         * Cada documento deverá possuir:
         *
         * clienteId
         * titulo
         * descricao
         * data
         * capa
         * quantidadeFotos
         */

        const galeriasRef =
            collection(
                db,
                "galerias"
            );


        const consulta =
            query(
                galeriasRef,
                where(
                    "clienteId",
                    "==",
                    user.uid
                ),
                orderBy(
                    "data",
                    "desc"
                )
            );


        const resultado =
            await getDocs(
                consulta
            );


        const galerias =
            [];


        resultado.forEach(
            documento => {

                galerias.push({
                    id:
                        documento.id,

                    ...documento.data()
                });

            }
        );


        mostrarLoading(
            false
        );


        atualizarQuantidade(
            galerias.length
        );


        if (
            galerias.length ===
            0
        ) {

            mostrarSemGalerias();

            return;

        }


        renderizarGalerias(
            galerias
        );


    } catch (error) {

        console.error(
            "Erro ao carregar galerias:",
            error
        );


        mostrarLoading(
            false
        );


        /*
         * Se a consulta falhar por causa
         * do índice do Firestore, mostramos
         * uma mensagem amigável.
         */

        mostrarErroGalerias(
            error
        );

    }

}


/* =========================================================
   RENDERIZAR GALERIAS
========================================================= */

function renderizarGalerias(
    galerias
) {

    if (!clientGalleryGrid) {
        return;
    }


    clientGalleryGrid.innerHTML =
        "";


    galerias.forEach(
        galeria => {

            const card =
                criarCardGaleria(
                    galeria
                );


            clientGalleryGrid.appendChild(
                card
            );

        }
    );


    clientGalleryGrid.style.display =
        "grid";

}


/* =========================================================
   CRIAR CARD
========================================================= */

function criarCardGaleria(
    galeria
) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "gallery-card";


    const capa =
        galeria.capa ||
        galeria.cover ||
        "";


    const titulo =
        galeria.titulo ||
        galeria.title ||
        "Minha galeria";


    const descricao =
        galeria.descricao ||
        galeria.description ||
        "Suas memórias estão esperando por você.";


    const quantidade =
        galeria.quantidadeFotos ??
        galeria.photoCount ??
        galeria.fotos ??
        0;


    const data =
        formatarData(
            galeria.data
        );


    article.innerHTML = `

        <div class="gallery-cover">

            ${
                capa
                    ? `
                        <img
                            src="${escaparHTML(capa)}"
                            alt="Capa da galeria ${escaparHTML(titulo)}"
                            loading="lazy"
                        >
                    `
                    : `
                        <div class="gallery-cover-placeholder">

                            <span>
                                ✦
                            </span>

                            <small>
                                SUAS MEMÓRIAS
                            </small>

                        </div>
                    `
            }


            ${
                data
                    ? `
                        <div class="gallery-date">
                            ${escaparHTML(data)}
                        </div>
                    `
                    : ""
            }

        </div>


        <div class="gallery-card-content">

            <span>
                GALERIA EXCLUSIVA
            </span>

            <h3>
                ${escaparHTML(titulo)}
            </h3>

            <p>
                ${escaparHTML(descricao)}
            </p>


            <div class="gallery-card-bottom">

                <span class="gallery-photo-count">
                    ${escaparHTML(
                        quantidade.toString()
                    )}
                    ${
                        Number(quantidade) === 1
                            ? "foto"
                            : "fotos"
                    }
                </span>


                <a
                    href="galeria.html?id=${encodeURIComponent(
                        galeria.id
                    )}"
                    class="gallery-open-button"
                >

                    Abrir galeria

                    <strong>
                        →
                    </strong>

                </a>

            </div>

        </div>

    `;


    return article;

}


/* =========================================================
   DATA
========================================================= */

function formatarData(
    valor
) {

    if (!valor) {
        return "";
    }


    try {

        /*
         * Timestamp do Firestore
         */

        if (
            typeof valor.toDate ===
            "function"
        ) {

            return valor
                .toDate()
                .toLocaleDateString(
                    "pt-BR"
                );

        }


        /*
         * Date normal
         */

        if (
            valor instanceof Date
        ) {

            return valor.toLocaleDateString(
                "pt-BR"
            );

        }


        /*
         * String ou número
         */

        const data =
            new Date(
                valor
            );


        if (
            Number.isNaN(
                data.getTime()
            )
        ) {

            return "";

        }


        return data.toLocaleDateString(
            "pt-BR"
        );


    } catch {

        return "";

    }

}


/* =========================================================
   LOADING
========================================================= */

function mostrarLoading(
    mostrar
) {

    if (!galleryLoading) {
        return;
    }


    galleryLoading.style.display =
        mostrar
            ? "flex"
            : "none";

}


/* =========================================================
   ESCONDER GALERIAS
========================================================= */

function esconderGalerias() {

    if (
        clientGalleryGrid
    ) {

        clientGalleryGrid.style.display =
            "none";

    }


    if (
        noGalleries
    ) {

        noGalleries.hidden =
            true;

    }

}


/* =========================================================
   SEM GALERIAS
========================================================= */

function mostrarSemGalerias() {

    if (
        clientGalleryGrid
    ) {

        clientGalleryGrid.innerHTML =
            "";

        clientGalleryGrid.style.display =
            "none";

    }


    if (
        noGalleries
    ) {

        noGalleries.hidden =
            false;

    }

}


/* =========================================================
   ERRO NAS GALERIAS
========================================================= */

function mostrarErroGalerias(
    error
) {

    if (!clientGalleryGrid) {
        return;
    }


    clientGalleryGrid.style.display =
        "block";


    clientGalleryGrid.innerHTML = `

        <div
            style="
                padding:50px 25px;
                border:1px solid #e7e2d9;
                background:#fff;
                text-align:center;
            "
        >

            <div
                style="
                    font-size:28px;
                    color:#967344;
                "
            >
                ✦
            </div>


            <h3
                style="
                    margin-top:15px;
                    font-family:'Playfair Display',serif;
                    font-size:23px;
                    font-weight:500;
                    color:#292929;
                "
            >
                Não conseguimos carregar
                suas galerias.
            </h3>


            <p
                style="
                    max-width:470px;
                    margin:10px auto 0;
                    color:#96928c;
                    font-size:9px;
                    line-height:1.8;
                "
            >
                Verifique sua conexão com a internet
                e tente novamente.
            </p>


            <button
                id="retryGalleries"
                type="button"
                style="
                    margin-top:20px;
                    min-height:40px;
                    padding:0 18px;
                    border:0;
                    background:#292929;
                    color:#fff;
                    cursor:pointer;
                    font-size:8px;
                    font-weight:800;
                "
            >
                TENTAR NOVAMENTE
            </button>

        </div>

    `;


    const retry =
        document.getElementById(
            "retryGalleries"
        );


    if (retry) {

        retry.addEventListener(
            "click",
            () => {

                if (currentUser) {

                    carregarGalerias(
                        currentUser
                    );

                }

            }
        );

    }


    /*
     * Ajuda durante o desenvolvimento.
     */

    if (
        error?.code ===
        "failed-precondition"
    ) {

        console.warn(
            "O Firestore pode estar solicitando a criação de um índice para esta consulta."
        );

    }

}


/* =========================================================
   CONTADOR
========================================================= */

function atualizarQuantidade(
    quantidade
) {

    if (!galleryCount) {
        return;
    }


    galleryCount.textContent =
        `${quantidade} ${
            quantidade === 1
                ? "galeria"
                : "galerias"
        }`;

}


/* =========================================================
   LOGOUT
========================================================= */

if (clientLogout) {

    clientLogout.addEventListener(
        "click",
        abrirModalLogout
    );

}


/* =========================================================
   ABRIR MODAL
========================================================= */

function abrirModalLogout() {

    if (!logoutModal) {
        return;
    }


    logoutModal.classList.add(
        "open"
    );


    logoutModal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   FECHAR MODAL
========================================================= */

function fecharModalLogout() {

    if (!logoutModal) {
        return;
    }


    logoutModal.classList.remove(
        "open"
    );


    logoutModal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";

}


/* =========================================================
   CANCELAR LOGOUT
========================================================= */

if (cancelLogout) {

    cancelLogout.addEventListener(
        "click",
        fecharModalLogout
    );

}


if (logoutModalOverlay) {

    logoutModalOverlay.addEventListener(
        "click",
        fecharModalLogout
    );

}


/* =========================================================
   CONFIRMAR LOGOUT
========================================================= */

if (confirmLogout) {

    confirmLogout.addEventListener(
        "click",
        async () => {

            confirmLogout.disabled =
                true;


            confirmLogout.textContent =
                "Saindo...";


            try {

                await signOut(
                    auth
                );


                window.location.replace(
                    "login.html"
                );


            } catch (error) {

                console.error(
                    "Erro ao sair:",
                    error
                );


                confirmLogout.disabled =
                    false;


                confirmLogout.textContent =
                    "Sair da conta";

            }

        }
    );

}


/* =========================================================
   ESC
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key ===
            "Escape"
        ) {

            fecharModalLogout();

        }

    }
);


/* =========================================================
   PROTEÇÃO CONTRA HTML
========================================================= */

function escaparHTML(
    valor
) {

    if (
        valor === null ||
        valor === undefined
    ) {

        return "";

    }


    return String(valor)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   FINAL
========================================================= */

console.log(
    "Suas Memórias Aqui — Área do cliente carregada."
);
```
