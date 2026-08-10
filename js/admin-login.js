/* =========================================================
   SUAS MEMÓRIAS AQUI
   ADMIN-LOGIN.JS
   Login do administrador
========================================================= */

import {
    auth
} from "./firebase.js";

import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


/* =========================================================
   CONFIGURAÇÃO
========================================================= */

/*
 * COLOQUE AQUI O MESMO E-MAIL QUE SERÁ
 * AUTORIZADO NO admin.js
 *
 * Exemplo:
 *
 * const ADMIN_EMAIL = "sarah@gmail.com";
 */

const ADMIN_EMAIL =
    "SEU_EMAIL_ADMIN";


/* =========================================================
   ELEMENTOS
========================================================= */

const form =
    document.getElementById(
        "adminLoginForm"
    );

const emailInput =
    document.getElementById(
        "adminEmail"
    );

const passwordInput =
    document.getElementById(
        "adminPassword"
    );

const loginButton =
    document.getElementById(
        "adminLoginButton"
    );

const message =
    document.getElementById(
        "adminLoginMessage"
    );

const togglePassword =
    document.getElementById(
        "toggleAdminPassword"
    );


/* =========================================================
   REDIRECIONAMENTO
========================================================= */

const ADMIN_PAGE =
    "admin.html";


/* =========================================================
   VERIFICAR USUÁRIO JÁ LOGADO
========================================================= */

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {
            return;
        }


        const email =
            (user.email || "")
                .toLowerCase()
                .trim();


        const adminEmail =
            ADMIN_EMAIL
                .toLowerCase()
                .trim();


        /*
         * Se o e-mail configurado for diferente
         * do usuário autenticado, não deixa entrar.
         */

        if (
            adminEmail !==
            "seu_email_admin" &&
            email !== adminEmail
        ) {

            await signOut(auth);

            return;

        }


        /*
         * Conta autorizada.
         */

        if (
            adminEmail !==
            "seu_email_admin" &&
            email === adminEmail
        ) {

            window.location.replace(
                ADMIN_PAGE
            );

        }

    }
);


/* =========================================================
   MOSTRAR / ESCONDER SENHA
========================================================= */

if (togglePassword) {

    togglePassword.addEventListener(
        "click",
        () => {

            const mostrando =
                passwordInput.type ===
                "text";


            if (mostrando) {

                passwordInput.type =
                    "password";

                togglePassword.textContent =
                    "◉";

                togglePassword.setAttribute(
                    "aria-label",
                    "Mostrar senha"
                );

            } else {

                passwordInput.type =
                    "text";

                togglePassword.textContent =
                    "◌";

                togglePassword.setAttribute(
                    "aria-label",
                    "Ocultar senha"
                );

            }

        }
    );

}


/* =========================================================
   LOGIN
========================================================= */

if (form) {

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            limparMensagem();


            const email =
                emailInput.value
                    .trim()
                    .toLowerCase();


            const password =
                passwordInput.value;


            /* =============================================
               VALIDAÇÃO
            ============================================== */

            if (!email || !password) {

                mostrarMensagem(
                    "Digite seu e-mail e sua senha.",
                    "error"
                );

                return;

            }


            /*
             * Verificação adicional.
             *
             * Se você ainda não colocou o seu e-mail
             * no ADMIN_EMAIL, mostramos um aviso.
             */

            if (
                ADMIN_EMAIL ===
                "SEU_EMAIL_ADMIN"
            ) {

                mostrarMensagem(
                    "Configure o e-mail administrador no arquivo admin-login.js antes de entrar.",
                    "error"
                );

                return;

            }


            /*
             * Impede que uma conta diferente
             * tente acessar o painel.
             */

            if (
                email !==
                ADMIN_EMAIL
                    .toLowerCase()
                    .trim()
            ) {

                mostrarMensagem(
                    "Esta conta não possui acesso ao painel administrativo.",
                    "error"
                );

                return;

            }


            /* =============================================
               BOTÃO
            ============================================== */

            loginButton.disabled =
                true;

            loginButton.textContent =
                "ENTRANDO...";


            try {

                /* =========================================
                   FIREBASE LOGIN
                ========================================== */

                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


                /* =========================================
                   SUCESSO
                ========================================== */

                mostrarMensagem(
                    "Login realizado. Abrindo painel...",
                    "success"
                );


                setTimeout(
                    () => {

                        window.location.replace(
                            ADMIN_PAGE
                        );

                    },
                    700
                );


            } catch (error) {

                console.error(
                    "Erro no login administrativo:",
                    error
                );


                tratarErroFirebase(
                    error
                );


                loginButton.disabled =
                    false;

                loginButton.textContent =
                    "ENTRAR NO PAINEL";

            }

        }
    );

}


/* =========================================================
   MENSAGEM
========================================================= */

function mostrarMensagem(
    texto,
    tipo
) {

    if (!message) {
        return;
    }


    message.textContent =
        texto;


    message.className =
        "admin-login-message " +
        tipo;

}


function limparMensagem() {

    if (!message) {
        return;
    }


    message.textContent =
        "";

    message.className =
        "admin-login-message";

}


/* =========================================================
   ERROS DO FIREBASE
========================================================= */

function tratarErroFirebase(
    error
) {

    let texto =
        "Não foi possível entrar. Tente novamente.";


    switch (
        error.code
    ) {

        case "auth/invalid-credential":

            texto =
                "E-mail ou senha incorretos.";

            break;


        case "auth/invalid-email":

            texto =
                "Digite um e-mail válido.";

            break;


        case "auth/user-not-found":

            texto =
                "Não encontramos uma conta com esse e-mail.";

            break;


        case "auth/wrong-password":

            texto =
                "Senha incorreta.";

            break;


        case "auth/too-many-requests":

            texto =
                "Muitas tentativas. Aguarde alguns minutos e tente novamente.";

            break;


        case "auth/network-request-failed":

            texto =
                "Verifique sua conexão com a internet.";

            break;


        case "auth/user-disabled":

            texto =
                "Esta conta foi desativada.";

            break;


        default:

            console.error(
                "Código Firebase:",
                error.code
            );

            break;

    }


    mostrarMensagem(
        texto,
        "error"
    );

}


/* =========================================================
   ENTER / ESC
========================================================= */

if (passwordInput) {

    passwordInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Enter"
            ) {

                form?.requestSubmit();

            }

        }
    );

}


/* =========================================================
   FINAL
========================================================= */

console.log(
    "Suas Memórias Aqui — Login administrativo carregado."
);
