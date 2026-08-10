```javascript
/* =========================================================
   SUAS MEMÓRIAS AQUI
   CLIENTE.JS
   Área privada do cliente
========================================================= */


/* =========================================================
   FIREBASE
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

const clientName =
    document.getElementById("clientName");

const clientEmail =
    document.getElementById("clientEmail");

const welcomeName =
    document.getElementById("welcomeName");

const profileAvatar =
    document.getElementById("profileAvatar");

const logoutButton =
    document.getElementById("logoutButton");

const mobileMenuButton =
    document.getElementById("mobileMenuButton");

const sidebar =
    document.getElementById("sidebar");

const photoCount =
    document.getElementById("photoCount");

const videoCount =
    document.getElementById("videoCount");

const albumCount =
    document.getElementById("albumCount");

const eventCount =
    document.getElementById("eventCount");


/* =========================================================
   ESTADO DE AUTENTICAÇÃO
========================================================= */

onAuthStateChanged(
    auth,
    user => {

        /*
         * Se não existe usuário autenticado,
         * não permitimos acesso à área privada.
         */

        if (!user) {

            window.location.replace(
                "login.html"
            );

            return;

        }


        /*
         * Usuário autenticado.
         */

        console.log(
            "Cliente autenticado:",
            user.uid
        );


        carregarDadosDoCliente(user);

    }
);


/* =========================================================
   CARREGAR DADOS DO CLIENTE
========================================================= */

function carregarDadosDoCliente(
    user
) {

    /*
     * Nome preferencial:
     *
     * 1. displayName do Google
     * 2. primeira parte do e-mail
     * 3. "Cliente"
     */

    let nome =
        user.displayName;


    if (!nome && user.email) {

        nome =
            user.email
                .split("@")[0]
                .replace(/[._-]/g, " ");

        nome =
            capitalizarNome(nome);

    }


    if (!nome) {

        nome =
            "Cliente";

    }


    /*
     * Nome no cabeçalho
     */

    if (clientName) {

        clientName.textContent =
            nome;

    }


    /*
     * Nome na mensagem de boas-vindas
     */

    if (welcomeName) {

        welcomeName.textContent =
            nome.split(" ")[0];

    }


    /*
     * E-mail
     */

    if (clientEmail) {

        clientEmail.textContent =
            user.email || "";

    }


    /*
     * Avatar
     */

    if (profileAvatar) {

        profileAvatar.textContent =
            obterIniciais(nome);

    }


    /*
     * Por enquanto os contadores começam
     * zerados.
     *
     * Posteriormente eles serão carregados
     * diretamente do Firestore.
     */

    if (photoCount) {

        photoCount.textContent =
            "0";

    }

    if (videoCount) {

        videoCount.textContent =
            "0";

    }

    if (albumCount) {

        albumCount.textContent =
            "0";

    }

    if (eventCount) {

        eventCount.textContent =
            "0";

    }

}


/* =========================================================
   INICIAIS DO NOME
========================================================= */

function obterIniciais(
    nome
) {

    if (!nome) {

        return "SM";

    }


    const partes =
        nome
            .trim()
            .split(/\s+/)
            .filter(Boolean);


    if (partes.length === 1) {

        return partes[0]
            .substring(0, 2)
            .toUpperCase();

    }


    return (
        partes[0][0] +
        partes[partes.length - 1][0]
    ).toUpperCase();

}


/* =========================================================
   CAPITALIZAR NOME
========================================================= */

function capitalizarNome(
    nome
) {

    return nome
        .split(" ")
        .map(
            palavra => {

                if (!palavra) {
                    return palavra;
                }

                return (
                    palavra.charAt(0).toUpperCase() +
                    palavra.slice(1).toLowerCase()
                );

            }
        )
        .join(" ");

}


/* =========================================================
   SAIR DA CONTA
========================================================= */

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async () => {

            const confirmar =
                window.confirm(
                    "Deseja realmente sair da sua conta?"
                );


            if (!confirmar) {

                return;

            }


            try {

                await signOut(auth);


                window.location.replace(
                    "login.html"
                );


            } catch (error) {

                console.error(
                    "Erro ao sair:",
                    error
                );

                alert(
                    "Não foi possível sair da conta. Tente novamente."
                );

            }

        }
    );

}


/* =========================================================
   MENU MOBILE
========================================================= */

if (
    mobileMenuButton &&
    sidebar
) {

    mobileMenuButton.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "open"
            );

        }
    );

}


/* =========================================================
   FECHAR MENU AO CLICAR EM UM LINK
========================================================= */

if (sidebar) {

    const links =
        sidebar.querySelectorAll(
            ".navigation-link"
        );


    links.forEach(
        link => {

            link.addEventListener(
                "click",
                () => {

                    if (
                        window.innerWidth <= 850
                    ) {

                        sidebar.classList.remove(
                            "open"
                        );

                    }

                }
            );

        }
    );

}


/* =========================================================
   DESTACAR ITEM DO MENU
========================================================= */

const navigationLinks =
    document.querySelectorAll(
        ".client-navigation .navigation-link"
    );


navigationLinks.forEach(
    link => {

        link.addEventListener(
            "click",
            () => {

                navigationLinks.forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                link.classList.add(
                    "active"
                );

            }
        );

    }
);


/* =========================================================
   FECHAR SIDEBAR AO CLICAR FORA
========================================================= */

document.addEventListener(
    "click",
    event => {

        if (
            window.innerWidth > 850 ||
            !sidebar ||
            !sidebar.classList.contains("open")
        ) {

            return;

        }


        const clicouNoMenu =
            sidebar.contains(
                event.target
            );

        const clicouNoBotao =
            mobileMenuButton &&
            mobileMenuButton.contains(
                event.target
            );


        if (
            !clicouNoMenu &&
            !clicouNoBotao
        ) {

            sidebar.classList.remove(
                "open"
            );

        }

    }
);


/* =========================================================
   PROTEÇÃO CONTRA ERRO DE REDE
========================================================= */

window.addEventListener(
    "offline",
    () => {

        console.warn(
            "O dispositivo está sem conexão com a internet."
        );

    }
);


/* =========================================================
   CONSOLE
========================================================= */

console.log(
    "Suas Memórias Aqui — área do cliente carregada."
);
```
