```javascript
/* =========================================================
   SUAS MEMÓRIAS AQUI
   LOGIN.JS
   Autenticação dos clientes
========================================================= */

import {
    auth
} from "./firebase.js";

import {
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


/* =========================================================
   ELEMENTOS
========================================================= */

const loginForm =
    document.getElementById("loginForm");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const loginButton =
    document.getElementById("loginButton");

const loginButtonText =
    document.getElementById("loginButtonText");

const loginSpinner =
    document.getElementById("loginSpinner");

const googleLogin =
    document.getElementById("googleLogin");

const togglePassword =
    document.getElementById("togglePassword");

const forgotPassword =
    document.getElementById("forgotPassword");

const forgotPasswordModal =
    document.getElementById("forgotPasswordModal");

const forgotModalOverlay =
    document.getElementById("forgotModalOverlay");

const closeForgotModal =
    document.getElementById("closeForgotModal");

const forgotPasswordForm =
    document.getElementById("forgotPasswordForm");

const recoveryEmail =
    document.getElementById("recoveryEmail");

const recoveryButton =
    document.getElementById("recoveryButton");

const recoveryMessage =
    document.getElementById("recoveryMessage");

const loginMessage =
    document.getElementById("loginMessage");

const emailError =
    document.getElementById("emailError");

const passwordError =
    document.getElementById("passwordError");


/* =========================================================
   FIREBASE GOOGLE PROVIDER
========================================================= */

const googleProvider =
    new GoogleAuthProvider();


googleProvider.setCustomParameters({
    prompt: "select_account"
});


/* =========================================================
   VERIFICAR SE JÁ ESTÁ LOGADO
========================================================= */

onAuthStateChanged(
    auth,
    user => {

        if (!user) {
            return;
        }

        /*
         * Se o usuário já estiver autenticado,
         * não precisa fazer login novamente.
         */

        redirecionarCliente();

    }
);


/* =========================================================
   LOGIN COM E-MAIL E SENHA
========================================================= */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            limparErros();


            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value;


            /*
             * Validação
             */

            if (!validarEmail(email)) {

                mostrarCampoErro(
                    emailError,
                    "Digite um e-mail válido."
                );

                emailInput.focus();

                return;

            }


            if (!password) {

                mostrarCampoErro(
                    passwordError,
                    "Digite sua senha."
                );

                passwordInput.focus();

                return;

            }


            iniciarCarregamento();


            try {

                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


                mostrarMensagem(
                    "Login realizado com sucesso. Entrando...",
                    "success"
                );


                /*
                 * O Firebase já confirmou
                 * a autenticação.
                 *
                 * O redirecionamento também
                 * será garantido pelo
                 * onAuthStateChanged.
                 */

                setTimeout(
                    redirecionarCliente,
                    500
                );


            } catch (error) {

                console.error(
                    "Erro no login:",
                    error
                );


                finalizarCarregamento();


                mostrarErroFirebase(
                    error
                );

            }

        }
    );

}


/* =========================================================
   LOGIN COM GOOGLE
========================================================= */

if (googleLogin) {

    googleLogin.addEventListener(
        "click",
        async () => {

            limparMensagem();


            googleLogin.disabled =
                true;


            googleLogin.classList.add(
                "loading"
            );


            const textoOriginal =
                googleLogin.innerHTML;


            googleLogin.innerHTML = `
                <span class="button-spinner"></span>
                <span>Conectando...</span>
            `;


            try {

                await signInWithPopup(
                    auth,
                    googleProvider
                );


                mostrarMensagem(
                    "Login realizado com sucesso. Entrando...",
                    "success"
                );


                setTimeout(
                    redirecionarCliente,
                    500
                );


            } catch (error) {

                console.error(
                    "Erro no login Google:",
                    error
                );


                /*
                 * Se o usuário simplesmente
                 * fechou a janela do Google,
                 * não mostramos um erro assustador.
                 */

                if (
                    error.code ===
                    "auth/popup-closed-by-user"
                ) {

                    mostrarMensagem(
                        "A janela de login foi fechada.",
                        "error"
                    );

                } else {

                    mostrarErroFirebase(
                        error
                    );

                }


                googleLogin.disabled =
                    false;


                googleLogin.classList.remove(
                    "loading"
                );


                googleLogin.innerHTML =
                    textoOriginal;

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


            passwordInput.type =
                senhaVisivel
                    ? "password"
                    : "text";


            togglePassword.textContent =
                senhaVisivel
                    ? "◉"
                    : "◉";


            togglePassword.setAttribute(
                "aria-label",
                senhaVisivel
                    ? "Mostrar senha"
                    : "Ocultar senha"
            );

        }
    );

}


/* =========================================================
   ABRIR RECUPERAÇÃO DE SENHA
========================================================= */

if (forgotPassword) {

    forgotPassword.addEventListener(
        "click",
        abrirModalRecuperacao
    );

}


function abrirModalRecuperacao() {

    if (!forgotPasswordModal) {
        return;
    }


    forgotPasswordModal.classList.add(
        "open"
    );


    forgotPasswordModal.setAttribute(
        "aria-hidden",
        "false"
    );


    recoveryMessage.className =
        "login-message";


    recoveryMessage.textContent =
        "";


    /*
     * Se o usuário já digitou o e-mail
     * no login, aproveitamos o valor.
     */

    if (
        emailInput &&
        validarEmail(
            emailInput.value.trim()
        )
    ) {

        recoveryEmail.value =
            emailInput.value.trim();

    }


    setTimeout(
        () => {

            recoveryEmail?.focus();

        },
        100
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   FECHAR MODAL
========================================================= */

function fecharModalRecuperacao() {

    if (!forgotPasswordModal) {
        return;
    }


    forgotPasswordModal.classList.remove(
        "open"
    );


    forgotPasswordModal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";

}


if (closeForgotModal) {

    closeForgotModal.addEventListener(
        "click",
        fecharModalRecuperacao
    );

}


if (forgotModalOverlay) {

    forgotModalOverlay.addEventListener(
        "click",
        fecharModalRecuperacao
    );

}


/* =========================================================
   TECLA ESC
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Escape"
        ) {

            if (
                forgotPasswordModal?.classList.contains(
                    "open"
                )
            ) {

                fecharModalRecuperacao();

            }

        }

    }
);


/* =========================================================
   RECUPERAÇÃO DE SENHA
========================================================= */

if (forgotPasswordForm) {

    forgotPasswordForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const email =
                recoveryEmail.value.trim();


            if (
                !validarEmail(email)
            ) {

                mostrarMensagemRecuperacao(
                    "Digite um e-mail válido.",
                    "error"
                );

                recoveryEmail.focus();

                return;

            }


            recoveryButton.disabled =
                true;


            recoveryButton.textContent =
                "Enviando...";


            try {

                await sendPasswordResetEmail(
                    auth,
                    email
                );


                mostrarMensagemRecuperacao(
                    "Enviamos as instruções de recuperação para o seu e-mail.",
                    "success"
                );


                recoveryEmail.value =
                    "";


                setTimeout(
                    fecharModalRecuperacao,
                    2500
                );


            } catch (error) {

                console.error(
                    "Erro na recuperação:",
                    error
                );


                mostrarMensagemRecuperacao(
                    obterMensagemRecuperacao(
                        error
                    ),
                    "error"
                );

            } finally {

                recoveryButton.disabled =
                    false;

                recoveryButton.textContent =
                    "Enviar instruções";

            }

        }
    );

}


/* =========================================================
   CARREGAMENTO DO LOGIN
========================================================= */

function iniciarCarregamento() {

    if (!loginButton) {
        return;
    }


    loginButton.disabled =
        true;


    loginButton.classList.add(
        "loading"
    );


    if (loginButtonText) {

        loginButtonText.textContent =
            "Entrando...";

    }


    if (loginSpinner) {

        loginSpinner.style.display =
            "block";

    }

}


function finalizarCarregamento() {

    if (!loginButton) {
        return;
    }


    loginButton.disabled =
        false;


    loginButton.classList.remove(
        "loading"
    );


    if (loginButtonText) {

        loginButtonText.textContent =
            "Entrar na minha conta";

    }


    if (loginSpinner) {

        loginSpinner.style.display =
            "none";

    }

}


/* =========================================================
   VALIDAÇÃO DE E-MAIL
========================================================= */

function validarEmail(
    email
) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


/* =========================================================
   MOSTRAR ERRO DE CAMPO
========================================================= */

function mostrarCampoErro(
    elemento,
    mensagem
) {

    if (!elemento) {
        return;
    }


    elemento.textContent =
        mensagem;


    elemento.classList.add(
        "show"
    );

}


/* =========================================================
   LIMPAR ERROS
========================================================= */

function limparErros() {

    if (emailError) {

        emailError.textContent =
            "";

        emailError.classList.remove(
            "show"
        );

    }


    if (passwordError) {

        passwordError.textContent =
            "";

        passwordError.classList.remove(
            "show"
        );

    }


    limparMensagem();

}


/* =========================================================
   MENSAGEM GERAL
========================================================= */

function mostrarMensagem(
    mensagem,
    tipo = "error"
) {

    if (!loginMessage) {
        return;
    }


    loginMessage.textContent =
        mensagem;


    loginMessage.className =
        `login-message show ${tipo}`;

}


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
   MENSAGEM RECUPERAÇÃO
========================================================= */

function mostrarMensagemRecuperacao(
    mensagem,
    tipo
) {

    if (!recoveryMessage) {
        return;
    }


    recoveryMessage.textContent =
        mensagem;


    recoveryMessage.className =
        `login-message show ${tipo}`;

}


/* =========================================================
   ERROS DO FIREBASE
========================================================= */

function mostrarErroFirebase(
    error
) {

    let mensagem =
        "Não foi possível entrar. Verifique seus dados e tente novamente.";


    switch (
        error.code
    ) {

        case "auth/invalid-email":

            mensagem =
                "O e-mail informado não é válido.";

            break;


        case "auth/user-not-found":

            mensagem =
                "Não encontramos uma conta com esse e-mail.";

            break;


        case "auth/wrong-password":

            mensagem =
                "A senha informada está incorreta.";

            break;


        case "auth/invalid-credential":

            mensagem =
                "E-mail ou senha incorretos.";

            break;


        case "auth/user-disabled":

            mensagem =
                "Esta conta foi desativada.";

            break;


        case "auth/too-many-requests":

            mensagem =
                "Foram feitas muitas tentativas. Aguarde alguns minutos e tente novamente.";

            break;


        case "auth/network-request-failed":

            mensagem =
                "Não foi possível conectar ao servidor. Verifique sua internet.";

            break;


        case "auth/popup-blocked":

            mensagem =
                "O navegador bloqueou a janela do Google. Permita pop-ups para este site.";

            break;


        case "auth/popup-closed-by-user":

            mensagem =
                "A janela do Google foi fechada.";

            break;


        case "auth/unauthorized-domain":

            mensagem =
                "Este domínio ainda não está autorizado no Firebase Authentication.";

            break;


        default:

            console.warn(
                "Código Firebase não tratado:",
                error.code
            );

            mensagem =
                "Não foi possível realizar o login. Tente novamente.";

            break;

    }


    mostrarMensagem(
        mensagem,
        "error"
    );

}


/* =========================================================
   ERROS DE RECUPERAÇÃO
========================================================= */

function obterMensagemRecuperacao(
    error
) {

    switch (
        error.code
    ) {

        case "auth/invalid-email":

            return "Digite um e-mail válido.";


        case "auth/user-not-found":

            return "Não encontramos uma conta com esse e-mail.";


        case "auth/too-many-requests":

            return "Muitas tentativas. Aguarde alguns minutos.";


        case "auth/network-request-failed":

            return "Verifique sua conexão com a internet.";


        default:

            return "Não foi possível enviar o e-mail de recuperação.";

    }

}


/* =========================================================
   REDIRECIONAMENTO
========================================================= */

function redirecionarCliente() {

    /*
     * IMPORTANTE:
     *
     * Depois vamos criar cliente.html.
     *
     * Por enquanto o login será enviado
     * para a área principal do cliente.
     */

    window.location.href =
        "cliente.html";

}


/* =========================================================
   LIMPAR E-MAIL AO SAIR DO CAMPO
========================================================= */

emailInput?.addEventListener(
    "blur",
    () => {

        const email =
            emailInput.value.trim();


        if (
            email &&
            !validarEmail(email)
        ) {

            mostrarCampoErro(
                emailError,
                "Digite um e-mail válido."
            );

        } else {

            if (emailError) {

                emailError.textContent =
                    "";

            }

        }

    }
);


/* =========================================================
   ENTER NO MODAL
========================================================= */

recoveryEmail?.addEventListener(
    "input",
    () => {

        if (
            recoveryMessage
        ) {

            recoveryMessage.className =
                "login-message";

            recoveryMessage.textContent =
                "";

        }

    }
);


/* =========================================================
   LOG
========================================================= */

console.log(
    "Suas Memórias Aqui — Login inicializado."
);
```
