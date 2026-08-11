```javascript
/* =========================================================
   LS.FOTOSTORY
   LOGIN.JS
   Login da área do cliente
========================================================= */

import {
    signInWithEmailAndPassword,
    signInWithPopup,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    googleProvider,
    auth
} from "./firebase.js";


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


const errorMessage =
    document.getElementById(
        "loginError"
    );


const successMessage =
    document.getElementById(
        "loginSuccess"
    );


const passwordToggle =
    document.getElementById(
        "passwordToggle"
    );


const rememberCheckbox =
    document.getElementById(
        "rememberMe"
    );


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeLogin();

        initializePasswordToggle();

        initializeRememberMe();

    }
);


/* =========================================================
   VERIFICAR SE JÁ ESTÁ LOGADO
========================================================= */

onAuthStateChanged(
    auth,
    (user) => {

        if (!user) {
            return;
        }


        const currentPage =
            window.location.pathname
                .split("/")
                .pop();


        /*
         * Se o usuário já estiver logado
         * e estiver em uma página de login,
         * vai para a área do cliente.
         */

        if (
            currentPage ===
                "login.html" ||
            currentPage ===
                "cliente-login.html"
        ) {

            redirectToClient();

        }

    }
);


/* =========================================================
   LOGIN COM E-MAIL E SENHA
========================================================= */

function initializeLogin() {

    if (!loginForm) {
        return;
    }


    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            clearMessages();


            const email =
                emailInput?.value
                    .trim()
                    .toLowerCase();


            const password =
                passwordInput?.value ||
                "";


            /* -----------------------------------------
               VALIDAÇÃO DO E-MAIL
            ----------------------------------------- */

            if (!email) {

                showError(
                    "Digite seu e-mail."
                );

                emailInput?.focus();

                return;

            }


            if (
                !isValidEmail(
                    email
                )
            ) {

                showError(
                    "Digite um e-mail válido."
                );

                emailInput?.focus();

                return;

            }


            /* -----------------------------------------
               VALIDAÇÃO DA SENHA
            ----------------------------------------- */

            if (!password) {

                showError(
                    "Digite sua senha."
                );

                passwordInput?.focus();

                return;

            }


            if (
                password.length <
                6
            ) {

                showError(
                    "A senha deve possuir pelo menos 6 caracteres."
                );

                passwordInput?.focus();

                return;

            }


            /* -----------------------------------------
               LOADING
            ----------------------------------------- */

            setLoading(
                true
            );


            try {

                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


                saveRememberedEmail();


                showSuccess(
                    "Login realizado com sucesso!"
                );


                setTimeout(
                    () => {

                        redirectToClient();

                    },
                    500
                );


            } catch (error) {

                console.error(
                    "Erro no login:",
                    error
                );


                showFirebaseError(
                    error
                );

            } finally {

                setLoading(
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

            clearMessages();


            setGoogleLoading(
                true
            );


            try {

                await signInWithPopup(
                    auth,
                    googleProvider
                );


                showSuccess(
                    "Login realizado com sucesso!"
                );


                setTimeout(
                    () => {

                        redirectToClient();

                    },
                    500
                );


            } catch (error) {

                console.error(
                    "Erro no login Google:",
                    error
                );


                if (
                    error.code ===
                    "auth/popup-closed-by-user"
                ) {

                    showError(
                        "A janela de login foi fechada."
                    );

                } else {

                    showFirebaseError(
                        error
                    );

                }

            } finally {

                setGoogleLoading(
                    false
                );

            }

        }
    );

}


/* =========================================================
   MOSTRAR / ESCONDER SENHA
========================================================= */

function initializePasswordToggle() {

    if (
        !passwordToggle ||
        !passwordInput
    ) {
        return;
    }


    passwordToggle.addEventListener(
        "click",
        () => {

            const showingPassword =
                passwordInput.type ===
                "text";


            passwordInput.type =
                showingPassword
                    ? "password"
                    : "text";


            /*
             * CORRETO:
             * busca o <i> dentro do botão.
             */

            const icon =
                passwordToggle.querySelector(
                    "i"
                );


            if (icon) {

                icon.className =
                    showingPassword
                        ? "fa-regular fa-eye"
                        : "fa-regular fa-eye-slash";

            }

        }
    );

}


/* =========================================================
   LEMBRAR E-MAIL
========================================================= */

function initializeRememberMe() {

    if (!rememberCheckbox) {
        return;
    }


    const savedEmail =
        localStorage.getItem(
            "lsfotostory_remember_email"
        );


    if (savedEmail) {

        if (emailInput) {

            emailInput.value =
                savedEmail;

        }


        rememberCheckbox.checked =
            true;

    }


    rememberCheckbox.addEventListener(
        "change",
        () => {

            if (!emailInput) {
                return;
            }


            if (
                rememberCheckbox.checked
            ) {

                const email =
                    emailInput.value
                        .trim()
                        .toLowerCase();


                if (email) {

                    localStorage.setItem(
                        "lsfotostory_remember_email",
                        email
                    );

                }

            } else {

                localStorage.removeItem(
                    "lsfotostory_remember_email"
                );

            }

        }
    );

}


/* =========================================================
   SALVAR E-MAIL
========================================================= */

function saveRememberedEmail() {

    if (
        !rememberCheckbox ||
        !emailInput
    ) {
        return;
    }


    if (
        rememberCheckbox.checked
    ) {

        localStorage.setItem(
            "lsfotostory_remember_email",
            emailInput.value
                .trim()
                .toLowerCase()
        );

    }

}


/* =========================================================
   REDIRECIONAMENTO
========================================================= */

function redirectToClient() {

    window.location.href =
        CLIENT_PAGE;

}


/* =========================================================
   LOADING DO LOGIN
========================================================= */

function setLoading(
    loading
) {

    if (!loginButton) {
        return;
    }


    loginButton.disabled =
        loading;


    if (loading) {

        loginButton.dataset.originalText =
            loginButton.innerHTML;


        loginButton.innerHTML =
            `
                <span class="login-spinner"></span>
                Entrando...
            `;

    } else {

        loginButton.innerHTML =
            loginButton.dataset.originalText ||
            "Entrar";

    }

}


/* =========================================================
   LOADING DO GOOGLE
========================================================= */

function setGoogleLoading(
    loading
) {

    if (!googleButton) {
        return;
    }


    googleButton.disabled =
        loading;


    if (loading) {

        googleButton.dataset.originalText =
            googleButton.innerHTML;


        googleButton.innerHTML =
            `
                <span class="login-spinner"></span>
                Conectando...
            `;

    } else {

        googleButton.innerHTML =
            googleButton.dataset.originalText ||
            `
                <i class="fa-brands fa-google"></i>
                Continuar com Google
            `;

    }

}


/* =========================================================
   ERROS DO FIREBASE
========================================================= */

function showFirebaseError(
    error
) {

    let message =
        "Não foi possível entrar. Verifique seus dados.";


    switch (
        error.code
    ) {

        case "auth/invalid-email":

            message =
                "O e-mail informado é inválido.";

            break;


        case "auth/user-not-found":

            message =
                "Não encontramos uma conta com este e-mail.";

            break;


        case "auth/wrong-password":

            message =
                "A senha está incorreta.";

            break;


        case "auth/invalid-credential":

            message =
                "E-mail ou senha incorretos.";

            break;


        case "auth/user-disabled":

            message =
                "Esta conta foi desativada.";

            break;


        case "auth/too-many-requests":

            message =
                "Muitas tentativas. Aguarde alguns minutos e tente novamente.";

            break;


        case "auth/network-request-failed":

            message =
                "Verifique sua conexão com a internet.";

            break;


        case "auth/popup-blocked":

            message =
                "O navegador bloqueou a janela do Google. Permita pop-ups e tente novamente.";

            break;


        case "auth/popup-closed-by-user":

            message =
                "A janela do Google foi fechada.";

            break;


        case "auth/unauthorized-domain":

            message =
                "Este domínio ainda não foi autorizado no Firebase.";

            break;


        case "auth/operation-not-allowed":

            message =
                "Este método de login ainda não está ativado no Firebase.";

            break;

    }


    showError(
        message
    );

}


/* =========================================================
   MENSAGEM DE ERRO
========================================================= */

function showError(
    message
) {

    if (!errorMessage) {

        alert(
            message
        );

        return;

    }


    errorMessage.textContent =
        message;


    errorMessage.classList.add(
        "show"
    );


    successMessage?.classList.remove(
        "show"
    );

}


/* =========================================================
   MENSAGEM DE SUCESSO
========================================================= */

function showSuccess(
    message
) {

    if (!successMessage) {
        return;
    }


    successMessage.textContent =
        message;


    successMessage.classList.add(
        "show"
    );


    errorMessage?.classList.remove(
        "show"
    );

}


/* =========================================================
   LIMPAR MENSAGENS
========================================================= */

function clearMessages() {

    errorMessage?.classList.remove(
        "show"
    );


    successMessage?.classList.remove(
        "show"
    );

}


/* =========================================================
   VALIDAR E-MAIL
========================================================= */

function isValidEmail(
    email
) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(
            email
        );

}


/* =========================================================
   ENTER PARA ENTRAR
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key !==
            "Enter"
        ) {
            return;
        }


        if (
            document.activeElement ===
                emailInput ||
            document.activeElement ===
                passwordInput
        ) {

            loginForm?.requestSubmit();

        }

    }
);
```
