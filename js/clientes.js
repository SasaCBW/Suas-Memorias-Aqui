```javascript
/* =========================================================
   SUAS MEMÓRIAS AQUI
   CLIENTE.JS
   Área privada do cliente
========================================================= */

import {
    auth
} from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


/* =========================================================
   ELEMENTOS
========================================================= */

const pageLoader =
    document.getElementById("pageLoader");

const sidebar =
    document.getElementById("sidebar");

const mobileOverlay =
    document.getElementById("mobileOverlay");

const menuButton =
    document.getElementById("menuButton");

const logoutButton =
    document.getElementById("logoutButton");

const logoutModal =
    document.getElementById("logoutModal");

const cancelLogout =
    document.getElementById("cancelLogout");

const confirmLogout =
    document.getElementById("confirmLogout");

const pageTitle =
    document.getElementById("pageTitle");

const userName =
    document.getElementById("userName");

const userEmail =
    document.getElementById("userEmail");

const userAvatar =
    document.getElementById("userAvatar");

const welcomeName =
    document.getElementById("welcomeName");

const navLinks =
    document.querySelectorAll(
        ".nav-link[data-section]"
    );

const sectionLinks =
    document.querySelectorAll(
        "[data-section-link]"
    );

const pageSections =
    document.querySelectorAll(
        ".page-section"
    );

const galleryCount =
    document.getElementById("galleryCount");

const videoCount =
    document.getElementById("videoCount");

const eventCount =
    document.getElementById("eventCount");


/* =========================================================
   NOMES DAS SEÇÕES
========================================================= */

const sectionTitles = {

    inicio:
        "Minhas memórias",

    galerias:
        "Minhas galerias",

    videos:
        "Meus vídeos",

    eventos:
        "Meus eventos"

};


/* =========================================================
   VERIFICAÇÃO DE AUTENTICAÇÃO
========================================================= */

let currentUser = null;


onAuthStateChanged(
    auth,
    user => {

        if (!user) {

            /*
             * Se não estiver logado,
             * não permitimos acesso
             * à área do cliente.
             */

            window.location.replace(
                "login.html"
            );

            return;

        }


        currentUser =
            user;


        carregarDadosUsuario(
            user
        );


        esconderLoader();

    }
);


/* =========================================================
   CARREGAR DADOS DO USUÁRIO
========================================================= */

function carregarDadosUsuario(
    user
) {

    const nome =
        obterNomeUsuario(
            user
        );


    const email =
        user.email ||
        "Conta Google";


    const iniciais =
        obterIniciais(
            nome
        );


    if (userName) {

        userName.textContent =
            nome;

    }


    if (welcomeName) {

        welcomeName.textContent =
            nome;

    }


    if (userEmail) {

        userEmail.textContent =
            email;

    }


    if (userAvatar) {

        userAvatar.textContent =
            iniciais;

    }

}


/* =========================================================
   OBTER NOME
========================================================= */

function obterNomeUsuario(
    user
) {

    if (
        user.displayName &&
        user.displayName.trim()
    ) {

        return
            user.displayName.trim();

    }


    if (user.email) {

        const parteEmail =
            user.email
                .split("@")[0]
                .replace(/[._-]+/g, " ");


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
        .trim()
        .split(/\s+/)
        .map(
            palavra => {

                if (!palavra) {
                    return "";
                }

                return (
                    palavra
                        .charAt(0)
                        .toUpperCase() +
                    palavra
                        .slice(1)
                        .toLowerCase()
                );

            }
        )
        .join(" ");

}


/* =========================================================
   INICIAIS
========================================================= */

function obterIniciais(
    nome
) {

    const palavras =
        nome
            .trim()
            .split(/\s+/)
            .filter(Boolean);


    if (
        palavras.length === 1
    ) {

        return palavras[0]
            .substring(0, 2)
            .toUpperCase();

    }


    return (
        palavras[0].charAt(0) +
        palavras[
            palavras.length - 1
        ].charAt(0)
    ).toUpperCase();

}


/* =========================================================
   ESCONDER LOADER
========================================================= */

function esconderLoader() {

    if (!pageLoader) {
        return;
    }


    setTimeout(
        () => {

            pageLoader.classList.add(
                "hidden"
            );

        },
        350
    );

}


/* =========================================================
   NAVEGAÇÃO ENTRE SEÇÕES
========================================================= */

function abrirSecao(
    sectionId
) {

    const target =
        document.getElementById(
            sectionId
        );


    if (!target) {
        return;
    }


    /*
     * Esconde todas as seções
     */

    pageSections.forEach(
        section => {

            section.classList.remove(
                "active-section"
            );

        }
    );


    /*
     * Mostra a seção escolhida
     */

    target.classList.add(
        "active-section"
    );


    /*
     * Atualiza título
     */

    if (pageTitle) {

        pageTitle.textContent =
            sectionTitles[
                sectionId
            ] ||
            "Minhas memórias";

    }


    /*
     * Atualiza menu
     */

    navLinks.forEach(
        link => {

            const linkSection =
                link.dataset.section;


            link.classList.toggle(
                "active",
                linkSection ===
                sectionId
            );

        }
    );


    /*
     * Atualiza URL
     */

    if (
        history.pushState
    ) {

        history.pushState(
            null,
            "",
            `#${sectionId}`
        );

    }


    /*
     * Fecha menu no celular
     */

    fecharMenuMobile();


    /*
     * Volta para o topo
     */

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   LINKS DO MENU
========================================================= */

navLinks.forEach(
    link => {

        link.addEventListener(
            "click",
            event => {

                event.preventDefault();


                const section =
                    link.dataset.section;


                abrirSecao(
                    section
                );

            }
        );

    }
);


/* =========================================================
   LINKS INTERNOS
========================================================= */

sectionLinks.forEach(
    link => {

        link.addEventListener(
            "click",
            event => {

                event.preventDefault();


                const section =
                    link.dataset.sectionLink;


                abrirSecao(
                    section
                );

            }
        );

    }
);


/* =========================================================
   ABRIR SEÇÃO PELA URL
========================================================= */

function carregarSecaoInicial() {

    const hash =
        window.location.hash
            .replace("#", "");


    if (
        hash &&
        document.getElementById(hash)
    ) {

        abrirSecao(
            hash
        );

        return;

    }


    abrirSecao(
        "inicio"
    );

}


window.addEventListener(
    "load",
    carregarSecaoInicial
);


/* =========================================================
   BOTÃO MENU MOBILE
========================================================= */

if (menuButton) {

    menuButton.addEventListener(
        "click",
        abrirMenuMobile
    );

}


function abrirMenuMobile() {

    sidebar?.classList.add(
        "open"
    );

    mobileOverlay?.classList.add(
        "open"
    );

    document.body.style.overflow =
        "hidden";

}


function fecharMenuMobile() {

    sidebar?.classList.remove(
        "open"
    );

    mobileOverlay?.classList.remove(
        "open"
    );

    document.body.style.overflow =
        "";

}


if (mobileOverlay) {

    mobileOverlay.addEventListener(
        "click",
        fecharMenuMobile
    );

}


/* =========================================================
   ESC FECHA MENU
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            fecharMenuMobile();


            if (
                logoutModal?.classList.contains(
                    "open"
                )
            ) {

                fecharLogoutModal();

            }

        }

    }
);


/* =========================================================
   BOTÃO LOGOUT
========================================================= */

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        abrirLogoutModal
    );

}


/* =========================================================
   ABRIR MODAL LOGOUT
========================================================= */

function abrirLogoutModal() {

    if (!logoutModal) {
        return;
    }


    logoutModal.classList.add(
        "open"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   FECHAR MODAL LOGOUT
========================================================= */

function fecharLogoutModal() {

    if (!logoutModal) {
        return;
    }


    logoutModal.classList.remove(
        "open"
    );


    document.body.style.overflow =
        "";

}


if (cancelLogout) {

    cancelLogout.addEventListener(
        "click",
        fecharLogoutModal
    );

}


/* =========================================================
   CLICAR FORA DO MODAL
========================================================= */

if (logoutModal) {

    const overlay =
        logoutModal.querySelector(
            ".modal-overlay"
        );


    overlay?.addEventListener(
        "click",
        fecharLogoutModal
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

                alert(
                    "Não foi possível sair da conta. Tente novamente."
                );

            }

        }
    );

}


/* =========================================================
   FECHAR MODAL AO REDIMENSIONAR
========================================================= */

window.addEventListener(
    "resize",
    () => {

        if (
            window.innerWidth >
            800
        ) {

            fecharMenuMobile();

        }

    }
);


/* =========================================================
   CONTADORES
========================================================= */

function atualizarContadores(
    dados = {}
) {

    if (galleryCount) {

        galleryCount.textContent =
            dados.galerias ?? 0;

    }


    if (videoCount) {

        videoCount.textContent =
            dados.videos ?? 0;

    }


    if (eventCount) {

        eventCount.textContent =
            dados.eventos ?? 0;

    }

}


/*
 * Por enquanto começamos em zero.
 *
 * Na próxima etapa vamos buscar esses
 * dados no Firestore.
 */

atualizarContadores({
    galerias: 0,
    videos: 0,
    eventos: 0
});


/* =========================================================
   PREVENIR ACESSO COM TECLA VOLTAR
========================================================= */

window.addEventListener(
    "pageshow",
    event => {

        if (
            event.persisted &&
            !auth.currentUser
        ) {

            window.location.replace(
                "login.html"
            );

        }

    }
);


/* =========================================================
   LOG
========================================================= */

console.log(
    "Suas Memórias Aqui — Área do cliente inicializada."
);
```
