```javascript
/* =========================================================
   SUAS MEMÓRIAS AQUI
   CLIENTE-LOGIN.JS

   Login da Área do Cliente
========================================================= */

import {
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

import {
    auth
} from "./firebase.js";


/* =========================================================
   ELEMENTOS
========================================================= */

const loginLoading =
    document.getElementById(
        "loginLoading"
    );

const loginForm =
    document.getElementById(
        "clientLoginForm"
    );

const emailInput =
    document.getElementById(
        "email"
    );

const passwordInput =
    document.getElementById(
        "password"
    );

const rememberMe =
    document.getElementById(
        "rememberMe"
    );

const loginButton =
    document.getElementById(
        "loginButton"
    );

const loginButtonText =
    document.getElementById(
        "loginButtonText"
    );

const loginButtonIcon =
    document.getElementById(
        "loginButtonIcon"
    );

const googleLoginButton =
    document.getElementById(
        "googleLoginButton"
    );

const togglePassword =
    document.getElementById(
        "togglePassword"
    );

const forgotPasswordButton =
    document.getElementById(
        "forgotPasswordButton"
    );

const registerButton =
    document.getElementById(
        "registerButton"
    );

const loginMessage =
    document.getElementById(
        "loginMessage"
    );


/* =========================================================
   MODAL RECUPERAÇÃO
========================================================= */

const forgotPasswordModal =
    document.getElementById(
        "forgotPasswordModal"
    );

const closeForgotModal =
    document.getElementById(
        "closeForgotModal"
    );

const resetPasswordForm =
    document.getElementById(
        "resetPasswordForm"
    );

const resetEmail =
    document.getElementById(
        "resetEmail"
    );

const resetPasswordButton =
    document.getElementById(
        "resetPasswordButton"
    );

const resetMessage =
    document.getElementById(
        "resetMessage"
    );


/* =========================================================
   MODAL CADASTRO
========================================================= */

const registerModal =
    document.getElementById(
        "registerModal"
    );

const closeRegisterModal =
    document.getElementById(
        "closeRegisterModal"
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
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeLoginPage
);


/* =========================================================
   INICIALIZAR
========================================================= */

function initializeLoginPage() {

    initializeLoginForm();

    initializeGoogleLogin();

    initializePasswordToggle();

    initializePasswordRecovery();

    initializeRegisterModal();

    initializeKeyboard();

    hideLoadingWhenReady();

}


/* =========================================================
   VERIFICAR USUÁRIO JÁ LOGADO
========================================================= */

onAuthStateChanged(
    auth,
    (user) => {

        if (user) {

            /*
             * Se o usuário já estiver autenticado,
             * não precisa preencher o login novamente.
             */

            window.location.replace(
                "cliente.html"
            );

            return;

        }


        hideLoadingWhenReady();

    }
);


/* =========================================================
   FORMULÁRIO DE LOGIN
========================================================= */

function initializeLoginForm() {

    if (!loginForm) {
        return;
    }


    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            clearMessage();


            const email =
                emailInput.value
                    .trim();


            const password =
                passwordInput.value;


            if (!email) {

                showMessage(
                    "Digite seu e-mail.",
                    "error"
                );


                emailInput.focus();

                return;

            }


            if (!isValidEmail(email)) {

                showMessage(
                    "Digite um e-mail válido.",
                    "error"
                );


                emailInput.focus();

                return;

            }


            if (!password) {

                showMessage(
                    "Digite sua senha.",
                    "error"
                );


                passwordInput.focus();

                return;

            }


            await loginWithEmail(
                email,
                password
            );

        }
    );

}


/* =========================================================
   LOGIN COM E-MAIL
========================================================= */

async function loginWithEmail(
    email,
    password
) {

    setLoginLoading(
        true
    );


    try {

        /*
         * Define se a sessão deve permanecer
         * depois que o navegador for fechado.
         */

        if (
            rememberMe &&
            rememberMe.checked
        ) {

            await setPersistence(
                auth,
                browserLocalPersistence
            );

        } else {

            await setPersistence(
                auth,
                browserSessionPersistence
            );

        }


        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );


        showMessage(
            "Login realizado. Entrando na sua área...",
            "success"
        );


        /*
         * Pequeno intervalo para a mensagem
         * aparecer antes da navegação.
         */

        setTimeout(
            () => {

                window.location.replace(
                    "cliente.html"
                );

            },
            500
        );


    } catch (error) {

        console.error(
            "Erro no login:",
            error
        );


        setLoginLoading(
            false
        );


        handleFirebaseAuthError(
            error
        );

    }

}


/* =========================================================
   LOGIN COM GOOGLE
========================================================= */

function initializeGoogleLogin() {

    if (!googleLoginButton) {
        return;
    }


    googleLoginButton.addEventListener(
        "click",
        loginWithGoogle
    );

}


async function loginWithGoogle() {

    clearMessage();


    setGoogleLoading(
        true
    );


    try {

        await setPersistence(
            auth,
            browserLocalPersistence
        );


        await signInWithPopup(
            auth,
            googleProvider
        );


        showMessage(
            "Login realizado. Entrando na sua área...",
            "success"
        );


        setTimeout(
            () => {

                window.location.replace(
                    "cliente.html"
                );

            },
            500
        );


    } catch (error) {

        console.error(
            "Erro no login Google:",
            error
        );


        setGoogleLoading(
            false
        );


        /*
         * O usuário fechou a janela do Google.
         */

        if (
            error.code ===
            "auth/popup-closed-by-user"
        ) {

            showMessage(
                "A janela de login foi fechada. Tente novamente.",
                "info"
            );

            return;

        }


        handleFirebaseAuthError(
            error
        );

    }

}


/* =========================================================
   MOSTRAR / OCULTAR SENHA
========================================================= */

function initializePasswordToggle() {

    if (!togglePassword) {
        return;
    }


    togglePassword.addEventListener(
        "click",
        () => {

            const isPassword =
                passwordInput.type ===
                "password";


            passwordInput.type =
                isPassword
                    ? "text"
                    : "password";


            const icon =
                togglePassword.querySelector(
                    "i"
                );


            if (icon) {

                icon.className =
                    isPassword
                        ? "fa-regular fa-eye-slash"
                        : "fa-regular fa-eye";

            }


            togglePassword.setAttribute(
                "aria-label",
                isPassword
                    ? "Ocultar senha"
                    : "Mostrar senha"
            );

        }
    );

}


/* =========================================================
   RECUPERAÇÃO DE SENHA
========================================================= */

function initializePasswordRecovery() {

    if (forgotPasswordButton) {

        forgotPasswordButton.addEventListener(
            "click",
            openForgotPasswordModal
        );

    }


    if (closeForgotModal) {

        closeForgotModal.addEventListener(
            "click",
            closeForgotPasswordModal
        );

    }


    if (resetPasswordForm) {

        resetPasswordForm.addEventListener(
            "submit",
            sendPasswordRecovery
        );

    }


    if (forgotPasswordModal) {

        forgotPasswordModal.addEventListener(
            "click",
            (event) => {

                if (
                    event.target ===
                    forgotPasswordModal
                ) {

                    closeForgotPasswordModal();

                }

            }
        );

    }

}


/* =========================================================
   ABRIR RECUPERAÇÃO
========================================================= */

function openForgotPasswordModal() {

    clearResetMessage();


    if (
        emailInput &&
        emailInput.value.trim()
    ) {

        resetEmail.value =
            emailInput.value.trim();

    }


    forgotPasswordModal?.classList.add(
        "show"
    );


    setTimeout(
        () => {

            resetEmail?.focus();

        },
        150
    );

}


/* =========================================================
   FECHAR RECUPERAÇÃO
========================================================= */

function closeForgotPasswordModal() {

    forgotPasswordModal?.classList.remove(
        "show"
    );

}


/* =========================================================
   ENVIAR RECUPERAÇÃO
========================================================= */

async function sendPasswordRecovery(
    event
) {

    event.preventDefault();


    clearResetMessage();


    const email =
        resetEmail.value.trim();


    if (!email) {

        showResetMessage(
            "Digite seu e-mail.",
            "error"
        );


        resetEmail.focus();

        return;

    }


    if (!isValidEmail(email)) {

        showResetMessage(
            "Digite um e-mail válido.",
            "error"
        );


        resetEmail.focus();

        return;

    }


    setResetLoading(
        true
    );


    try {

        await sendPasswordResetEmail(
            auth,
            email
        );


        showResetMessage(
            "Enviamos as instruções para o seu e-mail. Verifique também a pasta de spam.",
            "success"
        );


        resetEmail.value = "";


        setTimeout(
            () => {

                closeForgotPasswordModal();

            },
            2800
        );


    } catch (error) {

        console.error(
            "Erro ao recuperar senha:",
            error
        );


        handleResetError(
            error
        );

    } finally {

        setResetLoading(
            false
        );

    }

}


/* =========================================================
   MODAL SOLICITAR ACESSO
========================================================= */

function initializeRegisterModal() {

    if (registerButton) {

        registerButton.addEventListener(
            "click",
            () => {

                registerModal?.classList.add(
                    "show"
                );

            }
        );

    }


    if (closeRegisterModal) {

        closeRegisterModal.addEventListener(
            "click",
            closeRegisterModalWindow
        );

    }


    if (registerModal) {

        registerModal.addEventListener(
            "click",
            (event) => {

                if (
                    event.target ===
                    registerModal
                ) {

                    closeRegisterModalWindow();

                }

            }
        );

    }

}


/* =========================================================
   FECHAR MODAL CADASTRO
========================================================= */

function closeRegisterModalWindow() {

    registerModal?.classList.remove(
        "show"
    );

}


/* =========================================================
   TECLADO
========================================================= */

function initializeKeyboard() {

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key ===
                "Escape"
            ) {

                closeForgotPasswordModal();

                closeRegisterModalWindow();

            }

        }
    );

}


/* =========================================================
   LOADING DA PÁGINA
========================================================= */

function hideLoadingWhenReady() {

    setTimeout(
        () => {

            if (loginLoading) {

                loginLoading.classList.add(
                    "hidden"
                );

            }

        },
        700
    );

}


/* =========================================================
   LOADING DO LOGIN
========================================================= */

function setLoginLoading(
    loading
) {

    if (!loginButton) {
        return;
    }


    loginButton.disabled =
        loading;


    if (loading) {

        if (loginButtonText) {

            loginButtonText.textContent =
                "Entrando...";

        }


        if (loginButtonIcon) {

            loginButtonIcon.className =
                "fa-solid fa-spinner fa-spin";

        }

    } else {

        if (loginButtonText) {

            loginButtonText.textContent =
                "Entrar na minha área";

        }


        if (loginButtonIcon) {

            loginButtonIcon.className =
                "fa-solid fa-arrow-right";

        }

    }

}


/* =========================================================
   LOADING GOOGLE
========================================================= */

function setGoogleLoading(
    loading
) {

    if (!googleLoginButton) {
        return;
    }


    googleLoginButton.disabled =
        loading;


    if (loading) {

        googleLoginButton.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            <span>
                Conectando ao Google...
            </span>
        `;

    } else {

        googleLoginButton.innerHTML = `
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
   LOADING RECUPERAÇÃO
========================================================= */

function setResetLoading(
    loading
) {

    if (!resetPasswordButton) {
        return;
    }


    resetPasswordButton.disabled =
        loading;


    if (loading) {

        resetPasswordButton.innerHTML = `
            Enviando...
            <i class="fa-solid fa-spinner fa-spin"></i>
        `;

    } else {

        resetPasswordButton.innerHTML = `
            Enviar instruções
            <i class="fa-solid fa-paper-plane"></i>
        `;

    }

}


/* =========================================================
   MENSAGEM DE LOGIN
========================================================= */

function showMessage(
    message,
    type = "info"
) {

    if (!loginMessage) {
        return;
    }


    loginMessage.textContent =
        message;


    loginMessage.className =
        `login-message show ${type}`;

}


function clearMessage() {

    if (!loginMessage) {
        return;
    }


    loginMessage.textContent =
        "";


    loginMessage.className =
        "login-message";

}


/* =========================================================
   MENSAGEM RESET
========================================================= */

function showResetMessage(
    message,
    type = "info"
) {

    if (!resetMessage) {
        return;
    }


    resetMessage.textContent =
        message;


    resetMessage.className =
        `login-message show ${type}`;

}


function clearResetMessage() {

    if (!resetMessage) {
        return;
    }


    resetMessage.textContent =
        "";


    resetMessage.className =
        "login-message";

}


/* =========================================================
   VALIDAÇÃO DE E-MAIL
========================================================= */

function isValidEmail(
    email
) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


/* =========================================================
   ERROS FIREBASE — LOGIN
========================================================= */

function handleFirebaseAuthError(
    error
) {

    let message =
        "Não foi possível entrar. Tente novamente.";


    switch (error.code) {

        case "auth/invalid-email":

            message =
                "O e-mail informado não é válido.";

            break;


        case "auth/user-disabled":

            message =
                "Esta conta foi desativada. Entre em contato com a equipe.";

            break;


        case "auth/user-not-found":

            message =
                "Não encontramos uma conta com este e-mail.";

            break;


        case "auth/wrong-password":

            message =
                "E-mail ou senha incorretos.";

            break;


        case "auth/invalid-credential":

            message =
                "E-mail ou senha incorretos.";

            break;


        case "auth/too-many-requests":

            message =
                "Muitas tentativas foram realizadas. Aguarde alguns minutos e tente novamente.";

            break;


        case "auth/network-request-failed":

            message =
                "Verifique sua conexão com a internet e tente novamente.";

            break;


        case "auth/popup-blocked":

            message =
                "O navegador bloqueou a janela do Google. Permita pop-ups para este site.";

            break;


        case "auth/popup-closed-by-user":

            message =
                "A janela do Google foi fechada antes do login.";

            break;


        case "auth/unauthorized-domain":

            message =
                "Este domínio ainda não está autorizado no Firebase Authentication.";

            break;


        case "auth/operation-not-allowed":

            message =
                "Este método de login ainda não foi ativado no Firebase.";

            break;

    }


    showMessage(
        message,
        "error"
    );

}


/* =========================================================
   ERROS — RECUPERAÇÃO
========================================================= */

function handleResetError(
    error
) {

    let message =
        "Não foi possível enviar o e-mail de recuperação.";


    switch (error.code) {

        case "auth/invalid-email":

            message =
                "Digite um e-mail válido.";

            break;


        case "auth/user-not-found":

            message =
                "Não encontramos uma conta com este e-mail.";

            break;


        case "auth/too-many-requests":

            message =
                "Muitas solicitações foram realizadas. Aguarde um pouco e tente novamente.";

            break;


        case "auth/network-request-failed":

            message =
                "Verifique sua conexão com a internet.";

            break;

    }


    showResetMessage(
        message,
        "error"
    );

}


/* =========================================================
   LIMPEZA AO SAIR
========================================================= */

window.addEventListener(
    "pageshow",
    () => {

        if (
            loginButton &&
            !loginButton.disabled
        ) {

            setLoginLoading(
                false
            );

        }


        if (googleLoginButton) {

            setGoogleLoading(
                false
            );

        }

    }
);
```
