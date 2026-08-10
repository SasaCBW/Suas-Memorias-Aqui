```javascript
/* =========================================================
   SUAS MEMÓRIAS AQUI
   LOGIN.JS

   Login por e-mail e senha
   Login com Google
   Recuperação de senha
   Redirecionamento para área do cliente
========================================================= */

import {
    auth
} from "./firebase.js";

import {
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";


/* =========================================================
   ELEMENTOS
========================================================= */

const loginForm =
    document.getElementById("loginForm");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const rememberMe =
    document.getElementById("rememberMe");

const loginButton =
    document.getElementById("loginButton");

const loginButtonText =
    document.getElementById("loginButtonText");

const buttonLoader =
    document.getElementById("buttonLoader");

const googleButton =
    document.getElementById("googleLogin");

const passwordToggle =
    document.getElementById("passwordToggle");

const forgotPassword =
    document.getElementById("forgotPassword");

const passwordModal =
    document.getElementById("passwordModal");

const passwordModalBackdrop =
    document.getElementById(
        "passwordModalBackdrop"
    );

const modalClose =
    document.getElementById(
        "modalClose"
    );

const resetPasswordForm =
    document.getElementById(
        "resetPasswordForm"
    );

const resetEmail =
    document.getElementById(
        "resetEmail"
    );

const resetButton =
    document.getElementById(
        "resetButton"
    );

const resetMessage =
    document.getElementById(
        "resetMessage"
    );

const loginAlert =
    document.getElementById(
        "loginAlert"
    );

const loginAlertText =
    document.getElementById(
        "loginAlertText"
    );

const emailError =
    document.getElementById(
        "emailError"
    );

const passwordError =
    document.getElementById(
        "passwordError"
    );


/* =========================================================
   CONFIGURAÇÃO
========================================================= */

const CLIENT_PAGE =
    "cliente.html";


/* =========================================================
   VERIFICAR SE JÁ ESTÁ LOGADO
========================================================= */

onAuthStateChanged(
    auth,
    (user) => {

        if (user) {

            /*
             * Se a pessoa já estiver autenticada,
             * não precisa passar novamente pelo login.
             */

            window.location.replace(
                CLIENT_PAGE
            );

        }

    }
);


/* =========================================================
   UTILITÁRIOS
========================================================= */

function showAlert(message) {

    if (!loginAlert) {
        return;
    }


    loginAlertText.textContent =
        message;


    loginAlert.classList.add(
        "show"
    );

}


function hideAlert() {

    if (!loginAlert) {
        return;
    }


    loginAlert.classList.remove(
        "show"
    );

}


function clearErrors() {

    if (emailError) {

        emailError.textContent =
            "";

    }


    if (passwordError) {

        passwordError.textContent =
            "";

    }


    emailInput?.classList.remove(
        "input-error"
    );

    passwordInput?.classList.remove(
        "input-error"
    );

}


function validateEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


function setLoginLoading(
    loading
) {

    if (!loginButton) {
        return;
    }


    loginButton.disabled =
        loading;


    if (loading) {

        loginButton.classList.add(
            "loading"
        );

        loginButtonText.textContent =
            "Entrando...";

    } else {

        loginButton.classList.remove(
            "loading"
        );

        loginButtonText.textContent =
            "Entrar na minha área";

    }

}


/* =========================================================
   ERROS DO FIREBASE
========================================================= */

function getFirebaseErrorMessage(
    error
) {

    const code =
        error?.code || "";


    switch (code) {

        case "auth/invalid-email":

            return "O e-mail informado não é válido.";


        case "auth/user-disabled":

            return "Esta conta foi desativada. Entre em contato conosco.";


        case "auth/user-not-found":

            return "Não encontramos uma conta com este e-mail.";


        case "auth/wrong-password":

            return "A senha informada está incorreta.";


        case "auth/invalid-credential":

            return "E-mail ou senha incorretos. Verifique seus dados e tente novamente.";


        case "auth/too-many-requests":

            return "Muitas tentativas foram realizadas. Aguarde alguns minutos e tente novamente.";


        case "auth/network-request-failed":

            return "Não foi possível conectar ao servidor. Verifique sua internet.";


        case "auth/popup-closed-by-user":

            return "A janela do Google foi fechada antes da conclusão do login.";


        case "auth/popup-blocked":

            return "O navegador bloqueou a janela do Google. Permita pop-ups para este site.";


        case "auth/cancelled-popup-request":

            return "A solicitação de login foi cancelada.";


        case "auth/account-exists-with-different-credential":

            return "Este e-mail já possui uma conta usando outro método de login.";


        case "auth/operation-not-allowed":

            return "Este método de login ainda não foi ativado no Firebase.";


        case "auth/unauthorized-domain":

            return "Este domínio ainda não está autorizado no Firebase Authentication.";


        default:

            console.error(
                "Firebase Auth Error:",
                error
            );

            return "Não foi possível realizar o login. Tente novamente.";

    }

}


/* =========================================================
   LOGIN COM E-MAIL E SENHA
========================================================= */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            hideAlert();

            clearErrors();


            const email =
                emailInput
                    ?.value
                    .trim() ||
                "";


            const password =
                passwordInput
                    ?.value ||
                "";


            let valid =
                true;


            /* -----------------------------------------
               VALIDAR E-MAIL
            ----------------------------------------- */

            if (!email) {

                if (emailError) {

                    emailError.textContent =
                        "Digite seu e-mail.";

                }

                valid =
                    false;

            } else if (
                !validateEmail(email)
            ) {

                if (emailError) {

                    emailError.textContent =
                        "Digite um e-mail válido.";

                }

                valid =
                    false;

            }


            /* -----------------------------------------
               VALIDAR SENHA
            ----------------------------------------- */

            if (!password) {

                if (passwordError) {

                    passwordError.textContent =
                        "Digite sua senha.";

                }

                valid =
                    false;

            }


            if (!valid) {

                return;

            }


            try {

                setLoginLoading(
                    true
                );


                /*
                 * Se marcou "lembrar",
                 * mantém a sessão no navegador.
                 *
                 * Caso contrário,
                 * a sessão será temporária.
                 */

                await setPersistence(
                    auth,
                    rememberMe?.checked
                        ? browserLocalPersistence
                        : browserSessionPersistence
                );


                /*
                 * Login Firebase
                 */

                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


                /*
                 * O onAuthStateChanged
                 * fará o redirecionamento.
                 */

            } catch (error) {

                console.error(
                    "Erro no login:",
                    error
                );


                showAlert(
                    getFirebaseErrorMessage(
                        error
                    )
                );


                setLoginLoading(
                    false
                );

            }

        }
    );

}


/* =========================================================
   MOSTRAR / ESCONDER SENHA
========================================================= */

if (passwordToggle) {

    passwordToggle.addEventListener(
        "click",
        () => {

            if (
                !passwordInput
            ) {

                return;

            }


            const showing =
                passwordInput.type ===
                "text";


            passwordInput.type =
                showing
                    ? "password"
                    : "text";


            const icon =
                passwordToggle.querySelector(
                    "i"
                );


            if (icon) {

                icon.className =
                    showing
                        ? "fa-regular fa-eye"
                        : "fa-regular fa-eye-slash";

            }


            passwordToggle.setAttribute(
                "aria-label",
                showing
                    ? "Mostrar senha"
                    : "Ocultar senha"
            );

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

            try {

                hideAlert();

                googleButton.disabled =
                    true;


                googleButton.classList.add(
                    "loading"
                );


                const provider =
                    new GoogleAuthProvider();


                /*
                 * Permite selecionar
                 * outra conta Google.
                 */

                provider.setCustomParameters({
                    prompt: "select_account"
                });


                /*
                 * Login Google
                 */

                await signInWithPopup(
                    auth,
                    provider
                );


                /*
                 * O Firebase atualizará
                 * o estado de autenticação.
                 *
                 * O onAuthStateChanged
                 * redirecionará o cliente.
                 */

            } catch (error) {

                console.error(
                    "Erro no Google Login:",
                    error
                );


                showAlert(
                    getFirebaseErrorMessage(
                        error
                    )
                );


                googleButton.disabled =
                    false;


                googleButton.classList.remove(
                    "loading"
                );

            }

        }
    );

}


/* =========================================================
   ABRIR MODAL DE RECUPERAÇÃO
========================================================= */

if (forgotPassword) {

    forgotPassword.addEventListener(
        "click",
        (event) => {

            event.preventDefault();


            const currentEmail =
                emailInput
                    ?.value
                    .trim() ||
                "";


            if (
                resetEmail &&
                validateEmail(
                    currentEmail
                )
            ) {

                resetEmail.value =
                    currentEmail;

            }


            openPasswordModal();

        }
    );

}


/* =========================================================
   ABRIR MODAL
========================================================= */

function openPasswordModal() {

    if (!passwordModal) {
        return;
    }


    passwordModal.classList.add(
        "open"
    );


    passwordModal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";


    setTimeout(
        () => {

            resetEmail?.focus();

        },
        150
    );

}


/* =========================================================
   FECHAR MODAL
========================================================= */

function closePasswordModal() {

    if (!passwordModal) {
        return;
    }


    passwordModal.classList.remove(
        "open"
    );


    passwordModal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";


    clearResetMessage();

}


/* =========================================================
   EVENTOS DO MODAL
========================================================= */

if (modalClose) {

    modalClose.addEventListener(
        "click",
        closePasswordModal
    );

}


if (passwordModalBackdrop) {

    passwordModalBackdrop.addEventListener(
        "click",
        closePasswordModal
    );

}


/* =========================================================
   ESC FECHA MODAL
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            passwordModal?.classList.contains(
                "open"
            )
        ) {

            closePasswordModal();

        }

    }
);


/* =========================================================
   MENSAGEM DE RESET
========================================================= */

function showResetMessage(
    message,
    type
) {

    if (!resetMessage) {
        return;
    }


    resetMessage.textContent =
        message;


    resetMessage.className =
        `reset-message show ${type}`;

}


function clearResetMessage() {

    if (!resetMessage) {
        return;
    }


    resetMessage.textContent =
        "";


    resetMessage.className =
        "reset-message";

}


/* =========================================================
   LOADING DO RESET
========================================================= */

function setResetLoading(
    loading
) {

    if (!resetButton) {
        return;
    }


    resetButton.disabled =
        loading;


    if (loading) {

        resetButton.classList.add(
            "loading"
        );

        const span =
            resetButton.querySelector(
                "span"
            );

        if (span) {

            span.textContent =
                "Enviando...";

        }

    } else {

        resetButton.classList.remove(
            "loading"
        );

        const span =
            resetButton.querySelector(
                "span"
            );

        if (span) {

            span.textContent =
                "Enviar instruções";

        }

    }

}


/* =========================================================
   RECUPERAR SENHA
========================================================= */

if (resetPasswordForm) {

    resetPasswordForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            clearResetMessage();


            const email =
                resetEmail
                    ?.value
                    .trim() ||
                "";


            if (!email) {

                showResetMessage(
                    "Digite seu e-mail.",
                    "error"
                );

                resetEmail?.focus();

                return;

            }


            if (
                !validateEmail(
                    email
                )
            ) {

                showResetMessage(
                    "Digite um e-mail válido.",
                    "error"
                );

                resetEmail?.focus();

                return;

            }


            try {

                setResetLoading(
                    true
                );


                await sendPasswordResetEmail(
                    auth,
                    email
                );


                showResetMessage(
                    "Se este e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha.",
                    "success"
                );


                resetEmail.value =
                    "";


            } catch (error) {

                console.error(
                    "Erro ao recuperar senha:",
                    error
                );


                /*
                 * Por segurança,
                 * não informamos se o e-mail
                 * existe ou não.
                 */

                if (
                    error.code ===
                    "auth/invalid-email"
                ) {

                    showResetMessage(
                        "Digite um e-mail válido.",
                        "error"
                    );

                } else {

                    showResetMessage(
                        "Não foi possível enviar o e-mail de recuperação. Tente novamente.",
                        "error"
                    );

                }

            } finally {

                setResetLoading(
                    false
                );

            }

        }
    );

}


/* =========================================================
   LIMPAR ERRO AO DIGITAR
========================================================= */

emailInput?.addEventListener(
    "input",
    () => {

        if (emailError) {

            emailError.textContent =
                "";

        }

        hideAlert();

    }
);


passwordInput?.addEventListener(
    "input",
    () => {

        if (passwordError) {

            passwordError.textContent =
                "";

        }

        hideAlert();

    }
);


/* =========================================================
   ENTER NO E-MAIL
========================================================= */

emailInput?.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            passwordInput?.focus();

        }

    }
);


/* =========================================================
   CONSOLE
========================================================= */

console.log(
    "Suas Memórias Aqui — Login Firebase carregado."
);
```
