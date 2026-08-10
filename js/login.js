```javascript
/* =========================================================
   SUAS MEMÓRIAS AQUI
   LOGIN.JS
   Login dos clientes
========================================================= */

import {
    auth
} from "./firebase.js";

import {
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


/* =========================================================
   CONFIGURAÇÃO
========================================================= */

const CLIENT_PAGE =
    "cliente.html";


/* =========================================================
   ELEMENTOS
========================================================= */

const loginForm =
    document.getElementById(
        "loginForm"
    );

const emailInput =
    document.getElementById(
        "email"
    );

const passwordInput =
    document.getElementById(
        "password"
    );

const loginButton =
    document.getElementById(
        "loginButton"
    );

const googleButton =
    document.getElementById(
        "googleLogin"
    );

const forgotPassword =
    document.getElementById(
        "forgotPassword"
    );

const togglePassword =
    document.getElementById(
        "togglePassword"
    );

const loginMessage =
    document.getElementById(
        "loginMessage"
    );


/* =========================================================
   GOOGLE
========================================================= */

const googleProvider =
    new GoogleAuthProvider();


googleProvider.setCustomParameters({
    prompt: "select_account"
});


/* =========================================================
   VERIFICAR SESSÃO
========================================================= */

onAuthStateChanged(
    auth,
    (user) => {

        if (!user) {
            return;
        }


        /*
         * Se o usuário já estiver autenticado,
         * não precisa fazer login novamente.
         */

        if (
            window.location.pathname.endsWith(
                "login.html"
            )
        ) {

            window.location.replace(
                CLIENT_PAGE
            );

        }

    }
);


/* =========================================================
   LOGIN COM E-MAIL E SENHA
========================================================= */

if (loginForm) {

    loginForm.addEventListener(
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

            if (!email) {

                mostrarMensagem(
                    "Digite seu e-mail.",
                    "error"
                );

                emailInput.focus();

                return;

            }


            if (!password) {

                mostrarMensagem(
                    "Digite sua senha.",
                    "error"
                );

                passwordInput.focus();

                return;

            }


            /* =============================================
               BOTÃO
            ============================================== */

            definirEstadoLogin(
                true
            );


            try {

                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


                mostrarMensagem(
                    "Login realizado com sucesso. Abrindo sua área...",
                    "success"
                );


                setTimeout(
                    () => {

                        window.location.replace(
                            CLIENT_PAGE
                        );

                    },
                    700
                );


            } catch (error) {

                console.error(
                    "Erro no login:",
                    error
                );


                tratarErroFirebase(
                    error
                );


                definirEstadoLogin(
                    false
                );

            }

        }
    );

}


/* =========================================================
   LOGIN COM GOOGLE
========================================================= */

if (googleButton) {

    googleButton.addEventListener(
        "click",
        async () => {

            limparMensagem();


            definirEstadoGoogle(
                true
            );


            try {

                await signInWithPopup(
                    auth,
                    googleProvider
                );


                mostrarMensagem(
                    "Login realizado com sucesso. Abrindo sua área...",
                    "success"
                );


                setTimeout(
                    () => {

                        window.location.replace(
                            CLIENT_PAGE
                        );

                    },
                    700
                );


            } catch (error) {

                console.error(
                    "Erro no login com Google:",
                    error
                );


                /*
                 * Se o usuário fechou a janela
                 * do Google, não mostramos erro
                 * assustador.
                 */

                if (
                    error.code ===
                    "auth/popup-closed-by-user"
                ) {

                    limparMensagem();

                } else {

                    tratarErroFirebase(
                        error
                    );

                }


                definirEstadoGoogle(
                    false
                );

            }

        }
    );

}


/* =========================================================
   RECUPERAÇÃO DE SENHA
========================================================= */

if (forgotPassword) {

    forgotPassword.addEventListener(
        "click",
        async () => {

            limparMensagem();


            const email =
                emailInput.value
                    .trim()
                    .toLowerCase();


            if (!email) {

                mostrarMensagem(
                    "Digite seu e-mail primeiro para receber o link de recuperação.",
                    "error"
                );

                emailInput.focus();

                return;

            }


            forgotPassword.disabled =
                true;


            forgotPassword.textContent =
                "Enviando...";


            try {

                await sendPasswordResetEmail(
                    auth,
                    email
                );


                mostrarMensagem(
                    "Enviamos um link de recuperação para o seu e-mail.",
                    "success"
                );


            } catch (error) {

                console.error(
                    "Erro ao recuperar senha:",
                    error
                );


                tratarErroRecuperacao(
                    error
                );

            } finally {

                forgotPassword.disabled =
                    false;

                forgotPassword.textContent =
                    "Esqueci minha senha";

            }

        }
    );

}


/* =========================================================
   MOSTRAR / ESCONDER SENHA
========================================================= */

if (togglePassword) {

    togglePassword.addEventListener(
        "click",
        () => {

            const senhaVisivel =
                passwordInput.type ===
                "text";


            if (senhaVisivel) {

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
   FUNÇÃO — ESTADO DO LOGIN
========================================================= */

function definirEstadoLogin(
    carregando
) {

    if (!loginButton) {
        return;
    }


    loginButton.disabled =
        carregando;


    if (carregando) {

        loginButton.innerHTML = `
            <span>
                ENTRANDO...
            </span>

            <strong>
                ...
            </strong>
        `;

    } else {

        loginButton.innerHTML = `
            <span>
                ENTRAR NA MINHA ÁREA
            </span>

            <strong>
                →
            </strong>
        `;

    }

}


/* =========================================================
   FUNÇÃO — ESTADO GOOGLE
========================================================= */

function definirEstadoGoogle(
    carregando
) {

    if (!googleButton) {
        return;
    }


    googleButton.disabled =
        carregando;


    if (carregando) {

        googleButton.innerHTML = `
            <span>
                G
            </span>

            <span>
                Conectando...
            </span>
        `;

    } else {

        googleButton.innerHTML = `
            <span class="google-icon">
                G
            </span>

            <span>
                Continuar com Google
            </span>
        `;

    }

}


/* =========================================================
   MENSAGEM
========================================================= */

function mostrarMensagem(
    texto,
    tipo
) {

    if (!loginMessage) {
        return;
    }


    loginMessage.textContent =
        texto;


    loginMessage.className =
        `login-message ${tipo}`;

}


/* =========================================================
   LIMPAR MENSAGEM
========================================================= */

function limparMensagem() {

    if (!loginMessage) {
        return;
    }


    loginMessage.textContent =
        "";

    loginMessage.className =
        "login-message";

}


/* =========================================================
   ERROS DE LOGIN
========================================================= */

function tratarErroFirebase(
    error
) {

    let texto =
        "Não foi possível realizar o login.";


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
                "A senha informada está incorreta.";

            break;


        case "auth/user-disabled":

            texto =
                "Esta conta foi desativada.";

            break;


        case "auth/too-many-requests":

            texto =
                "Muitas tentativas foram realizadas. Aguarde um pouco e tente novamente.";

            break;


        case "auth/network-request-failed":

            texto =
                "Não foi possível conectar ao servidor. Verifique sua internet.";

            break;


        case "auth/popup-blocked":

            texto =
                "O navegador bloqueou a janela do Google. Permita pop-ups para este site.";

            break;


        case "auth/popup-closed-by-user":

            texto =
                "A janela de login do Google foi fechada.";

            break;


        case "auth/account-exists-with-different-credential":

            texto =
                "Já existe uma conta com este e-mail usando outro método de login.";

            break;


        case "auth/operation-not-allowed":

            texto =
                "Este método de login ainda não está ativado no Firebase.";

            break;


        default:

            console.error(
                "Código do Firebase:",
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
   ERROS DE RECUPERAÇÃO
========================================================= */

function tratarErroRecuperacao(
    error
) {

    let texto =
        "Não foi possível enviar o e-mail de recuperação.";


    switch (
        error.code
    ) {

        case "auth/invalid-email":

            texto =
                "Digite um e-mail válido.";

            break;


        case "auth/user-not-found":

            /*
             * Não revelamos informações
             * desnecessárias sobre contas.
             */

            texto =
                "Se esse e-mail estiver cadastrado, você receberá as instruções de recuperação.";

            break;


        case "auth/too-many-requests":

            texto =
                "Muitas solicitações foram feitas. Aguarde um pouco e tente novamente.";

            break;


        case "auth/network-request-failed":

            texto =
                "Verifique sua conexão com a internet.";

            break;

    }


    mostrarMensagem(
        texto,
        "error"
    );

}


/* =========================================================
   ENTER
========================================================= */

if (passwordInput) {

    passwordInput.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key ===
                "Enter"
            ) {

                loginForm?.requestSubmit();

            }

        }
    );

}


/* =========================================================
   FINAL
========================================================= */

console.log(
    "Suas Memórias Aqui — Login de clientes carregado."
);
```
