```javascript
/* =========================================================
   SUAS MEMÓRIAS AQUI
   LOGIN.JS
   Autenticação real com Firebase
========================================================= */


/* =========================================================
   FIREBASE
========================================================= */

import {
    auth,
    googleProvider
} from "./firebase.js";

import {
    signInWithEmailAndPassword,
    signInWithPopup,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


/* =========================================================
   ELEMENTOS DA PÁGINA
========================================================= */

const loginForm =
    document.getElementById("loginForm");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const togglePassword =
    document.getElementById("togglePassword");

const loginButton =
    document.getElementById("loginButton");

const googleLogin =
    document.getElementById("googleLogin");

const forgotPassword =
    document.getElementById("forgotPassword");

const createAccount =
    document.getElementById("createAccount");

const loginError =
    document.getElementById("loginError");

const accessModal =
    document.getElementById("accessModal");

const closeModal =
    document.getElementById("closeModal");

const modalOverlay =
    document.getElementById("modalOverlay");


/* =========================================================
   MOSTRAR / OCULTAR SENHA
========================================================= */

if (togglePassword && passwordInput) {

    togglePassword.addEventListener(
        "click",
        () => {

            const mostrando =
                passwordInput.type === "text";

            if (mostrando) {

                passwordInput.type = "password";

                togglePassword.textContent = "👁";

                togglePassword.setAttribute(
                    "aria-label",
                    "Mostrar senha"
                );

            } else {

                passwordInput.type = "text";

                togglePassword.textContent = "🙈";

                togglePassword.setAttribute(
                    "aria-label",
                    "Ocultar senha"
                );

            }

        }
    );

}


/* =========================================================
   MENSAGENS
========================================================= */

function mostrarMensagem(
    mensagem,
    tipo = "error"
) {

    if (!loginError) {
        return;
    }

    loginError.textContent =
        mensagem;

    loginError.className =
        `form-message ${tipo} show`;

}


function limparMensagem() {

    if (!loginError) {
        return;
    }

    loginError.textContent = "";

    loginError.className =
        "form-message error";

}


/* =========================================================
   LOADING
========================================================= */

function definirLoading(
    carregando
) {

    if (!loginButton) {
        return;
    }

    loginButton.disabled =
        carregando;

    loginButton.classList.toggle(
        "loading",
        carregando
    );

}


/* =========================================================
   VALIDAÇÃO DE E-MAIL
========================================================= */

function emailValido(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


/* =========================================================
   LOGIN COM E-MAIL E SENHA
========================================================= */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            limparMensagem();

            const email =
                emailInput.value.trim();

            const senha =
                passwordInput.value;


            /* -----------------------------------------
               VALIDAÇÕES
            ----------------------------------------- */

            if (!email) {

                mostrarMensagem(
                    "Digite seu e-mail."
                );

                emailInput.focus();

                return;

            }


            if (!emailValido(email)) {

                mostrarMensagem(
                    "Digite um e-mail válido."
                );

                emailInput.focus();

                return;

            }


            if (!senha) {

                mostrarMensagem(
                    "Digite sua senha."
                );

                passwordInput.focus();

                return;

            }


            definirLoading(true);


            /* -----------------------------------------
               FIREBASE AUTHENTICATION
            ----------------------------------------- */

            try {

                const resultado =
                    await signInWithEmailAndPassword(
                        auth,
                        email,
                        senha
                    );


                console.log(
                    "Usuário conectado:",
                    resultado.user.uid
                );


                mostrarMensagem(
                    "Login realizado! Entrando na sua área...",
                    "success"
                );


                /* -------------------------------------
                   REDIRECIONAMENTO
                ------------------------------------- */

                setTimeout(() => {

                    window.location.href =
                        "cliente.html";

                }, 800);


            } catch (error) {

                console.error(
                    "Erro no login:",
                    error
                );

                mostrarMensagem(
                    traduzirErroFirebase(
                        error
                    )
                );

                definirLoading(false);

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

            const textoOriginal =
                googleLogin.innerHTML;

            googleLogin.innerHTML =
                "Conectando...";


            try {

                const resultado =
                    await signInWithPopup(
                        auth,
                        googleProvider
                    );


                console.log(
                    "Login Google:",
                    resultado.user.uid
                );


                mostrarMensagem(
                    "Login realizado! Entrando na sua área...",
                    "success"
                );


                setTimeout(() => {

                    window.location.href =
                        "cliente.html";

                }, 800);


            } catch (error) {

                console.error(
                    "Erro no login Google:",
                    error
                );

                mostrarMensagem(
                    traduzirErroFirebase(
                        error
                    )
                );


                googleLogin.disabled =
                    false;

                googleLogin.innerHTML =
                    textoOriginal;

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
        async event => {

            event.preventDefault();

            limparMensagem();

            const email =
                emailInput.value.trim();


            if (!email) {

                mostrarMensagem(
                    "Digite seu e-mail para recuperar a senha."
                );

                emailInput.focus();

                return;

            }


            if (!emailValido(email)) {

                mostrarMensagem(
                    "Digite um e-mail válido."
                );

                emailInput.focus();

                return;

            }


            try {

                await sendPasswordResetEmail(
                    auth,
                    email
                );


                mostrarMensagem(
                    "Enviamos um link de recuperação para seu e-mail.",
                    "success"
                );


            } catch (error) {

                console.error(
                    "Erro ao recuperar senha:",
                    error
                );

                mostrarMensagem(
                    traduzirErroFirebase(
                        error
                    )
                );

            }

        }
    );

}


/* =========================================================
   MODAL DE SOLICITAÇÃO DE ACESSO
========================================================= */

function abrirModal() {

    if (!accessModal) {
        return;
    }

    accessModal.classList.add(
        "active"
    );

    accessModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";

}


function fecharModal() {

    if (!accessModal) {
        return;
    }

    accessModal.classList.remove(
        "active"
    );

    accessModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";

}


if (createAccount) {

    createAccount.addEventListener(
        "click",
        abrirModal
    );

}


if (closeModal) {

    closeModal.addEventListener(
        "click",
        fecharModal
    );

}


if (modalOverlay) {

    modalOverlay.addEventListener(
        "click",
        fecharModal
    );

}


/* =========================================================
   ESC FECHA MODAL
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            accessModal &&
            accessModal.classList.contains(
                "active"
            )
        ) {

            fecharModal();

        }

    }
);


/* =========================================================
   TRADUZIR ERROS DO FIREBASE
========================================================= */

function traduzirErroFirebase(
    error
) {

    const codigo =
        error?.code || "";


    switch (codigo) {

        case "auth/invalid-email":

            return "O e-mail informado é inválido.";


        case "auth/user-not-found":

            return "Não encontramos uma conta com esse e-mail.";


        case "auth/wrong-password":

            return "E-mail ou senha incorretos.";


        case "auth/invalid-credential":

            return "E-mail ou senha incorretos.";


        case "auth/too-many-requests":

            return "Muitas tentativas. Aguarde alguns minutos e tente novamente.";


        case "auth/network-request-failed":

            return "Verifique sua conexão com a internet.";


        case "auth/popup-closed-by-user":

            return "A janela do Google foi fechada.";


        case "auth/popup-blocked":

            return "O navegador bloqueou a janela do Google. Permita pop-ups para continuar.";


        case "auth/unauthorized-domain":

            return "Este domínio ainda não está autorizado no Firebase.";


        case "auth/operation-not-allowed":

            return "Este método de login ainda não foi ativado no Firebase.";


        case "auth/user-disabled":

            return "Esta conta foi desativada. Entre em contato conosco.";


        default:

            return "Não foi possível entrar. Verifique seus dados e tente novamente.";

    }

}


/* =========================================================
   LIMPAR MENSAGEM AO DIGITAR
========================================================= */

if (emailInput) {

    emailInput.addEventListener(
        "input",
        limparMensagem
    );

}


if (passwordInput) {

    passwordInput.addEventListener(
        "input",
        limparMensagem
    );

}


/* =========================================================
   INFORMAÇÃO NO CONSOLE
========================================================= */

console.log(
    "Suas Memórias Aqui — autenticação Firebase carregada."
);
```
