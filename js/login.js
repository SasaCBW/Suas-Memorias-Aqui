```javascript
/* =========================================================
   SUAS MEMÓRIAS AQUI
   LOGIN.JS

   Sistema de autenticação dos clientes
   Firebase Authentication
========================================================= */


/* =========================================================
   FIREBASE
========================================================= */

import {
    auth
} from "./firebase.js";


import {
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence
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

const loginButtonIcon =
    document.getElementById("loginButtonIcon");

const googleLoginButton =
    document.getElementById(
        "googleLoginButton"
    );

const togglePassword =
    document.getElementById(
        "togglePassword"
    );

const loginError =
    document.getElementById(
        "loginError"
    );

const loginErrorText =
    document.getElementById(
        "loginErrorText"
    );

const loginSuccess =
    document.getElementById(
        "loginSuccess"
    );

const loginSuccessText =
    document.getElementById(
        "loginSuccessText"
    );

const emailError =
    document.getElementById(
        "emailError"
    );

const passwordError =
    document.getElementById(
        "passwordError"
    );

const loginLoading =
    document.getElementById(
        "loginLoading"
    );


/* =========================================================
   ESTADO
========================================================= */

let isLoading = false;


/* =========================================================
   UTILITÁRIOS
========================================================= */

function showLoading() {

    if (!loginLoading) {
        return;
    }

    loginLoading.classList.add(
        "show"
    );

    loginLoading.setAttribute(
        "aria-hidden",
        "false"
    );
}


function hideLoading() {

    if (!loginLoading) {
        return;
    }

    loginLoading.classList.remove(
        "show"
    );

    loginLoading.setAttribute(
        "aria-hidden",
        "true"
    );
}


function clearMessages() {

    if (loginError) {

        loginError.classList.remove(
            "show"
        );
    }

    if (loginSuccess) {

        loginSuccess.classList.remove(
            "show"
        );
    }

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
}


function showError(message) {

    if (!loginError) {
        return;
    }

    if (loginErrorText) {

        loginErrorText.textContent =
            message;
    }

    loginError.classList.add(
        "show"
    );
}


function showSuccess(message) {

    if (!loginSuccess) {
        return;
    }

    if (loginSuccessText) {

        loginSuccessText.textContent =
            message;
    }

    loginSuccess.classList.add(
        "show"
    );
}


function setButtonLoading(
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
                "Entrar na minha conta";
        }

        if (loginButtonIcon) {

            loginButtonIcon.className =
                "fa-solid fa-arrow-right";
        }
    }
}


/* =========================================================
   VALIDAR E-MAIL
========================================================= */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);
}


/* =========================================================
   VALIDAÇÃO
========================================================= */

function validateForm() {

    let valid = true;


    const email =
        emailInput?.value.trim() || "";


    const password =
        passwordInput?.value || "";


    /*
     * E-mail
     */

    if (!email) {

        if (emailError) {

            emailError.textContent =
                "Informe seu e-mail.";

            emailError.classList.add(
                "show"
            );
        }

        valid = false;

    } else if (!isValidEmail(email)) {

        if (emailError) {

            emailError.textContent =
                "Digite um e-mail válido.";

            emailError.classList.add(
                "show"
            );
        }

        valid = false;
    }


    /*
     * Senha
     */

    if (!password) {

        if (passwordError) {

            passwordError.textContent =
                "Informe sua senha.";

            passwordError.classList.add(
                "show"
            );
        }

        valid = false;

    } else if (password.length < 6) {

        if (passwordError) {

            passwordError.textContent =
                "A senha deve ter pelo menos 6 caracteres.";

            passwordError.classList.add(
                "show"
            );
        }

        valid = false;
    }


    return valid;
}


/* =========================================================
   TRADUZIR ERROS FIREBASE
========================================================= */

function translateFirebaseError(
    error
) {

    const code =
        error?.code || "";


    switch (code) {

        case "auth/invalid-email":

            return "O e-mail informado não é válido.";


        case "auth/user-not-found":

            return "Não encontramos uma conta com esse e-mail.";


        case "auth/wrong-password":

            return "A senha informada está incorreta.";


        case "auth/invalid-credential":

            return "E-mail ou senha incorretos.";


        case "auth/user-disabled":

            return "Esta conta está temporariamente desativada.";


        case "auth/too-many-requests":

            return "Muitas tentativas. Aguarde alguns minutos e tente novamente.";


        case "auth/network-request-failed":

            return "Não foi possível conectar à internet.";


        case "auth/popup-closed-by-user":

            return "A janela do Google foi fechada antes do login.";


        case "auth/popup-blocked":

            return "O navegador bloqueou a janela do Google. Permita pop-ups para este site.";


        case "auth/cancelled-popup-request":

            return "A solicitação de login foi cancelada.";


        case "auth/account-exists-with-different-credential":

            return "Já existe uma conta usando este e-mail com outro método de acesso.";


        case "auth/unauthorized-domain":

            return "Este endereço do site ainda não está autorizado no Firebase Authentication.";


        default:

            console.error(
                "Firebase:",
                error
            );

            return "Não foi possível entrar. Tente novamente.";
    }
}


/* =========================================================
   PERSISTÊNCIA
========================================================= */

async function configurePersistence() {

    try {

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

    } catch (error) {

        console.error(
            "Erro ao configurar sessão:",
            error
        );

        /*
         * O login ainda pode continuar.
         */
    }
}


/* =========================================================
   LOGIN COM E-MAIL E SENHA
========================================================= */

async function loginWithEmail(
    email,
    password
) {

    try {

        isLoading = true;

        clearMessages();

        setButtonLoading(
            true
        );

        showLoading();


        /*
         * Define quanto tempo a sessão
         * permanecerá ativa.
         */

        await configurePersistence();


        /*
         * Login Firebase.
         */

        const result =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


        console.log(
            "Usuário autenticado:",
            result.user.uid
        );


        showSuccess(
            "Login realizado com sucesso."
        );


        /*
         * Pequeno intervalo para
         * mostrar a mensagem.
         */

        setTimeout(() => {

            window.location.replace(
                "cliente.html"
            );

        }, 500);


    } catch (error) {

        console.error(
            "Erro no login:",
            error
        );


        hideLoading();

        setButtonLoading(
            false
        );

        showError(
            translateFirebaseError(
                error
            )
        );


    } finally {

        isLoading = false;
    }

}


/* =========================================================
   FORMULÁRIO
========================================================= */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            if (isLoading) {
                return;
            }


            clearMessages();


            if (!validateForm()) {
                return;
            }


            const email =
                emailInput.value.trim();


            const password =
                passwordInput.value;


            await loginWithEmail(
                email,
                password
            );

        }
    );

}


/* =========================================================
   LOGIN GOOGLE
========================================================= */

async function loginWithGoogle() {

    if (isLoading) {
        return;
    }


    try {

        isLoading = true;

        clearMessages();

        showLoading();


        /*
         * Persistência.
         */

        await configurePersistence();


        /*
         * Provedor Google.
         */

        const provider =
            new GoogleAuthProvider();


        provider.setCustomParameters({
            prompt: "select_account"
        });


        /*
         * Abre janela do Google.
         */

        const result =
            await signInWithPopup(
                auth,
                provider
            );


        console.log(
            "Google conectado:",
            result.user.uid
        );


        showSuccess(
            "Conta Google conectada com sucesso."
        );


        setTimeout(() => {

            window.location.replace(
                "cliente.html"
            );

        }, 500);


    } catch (error) {

        console.error(
            "Erro no Google:",
            error
        );


        hideLoading();

        showError(
            translateFirebaseError(
                error
            )
        );


    } finally {

        isLoading = false;
    }

}


if (googleLoginButton) {

    googleLoginButton.addEventListener(
        "click",
        loginWithGoogle
    );

}


/* =========================================================
   MOSTRAR / OCULTAR SENHA
========================================================= */

if (togglePassword) {

    togglePassword.addEventListener(
        "click",
        () => {

            if (!passwordInput) {
                return;
            }


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

                if (isPassword) {

                    icon.classList.remove(
                        "fa-eye"
                    );

                    icon.classList.add(
                        "fa-eye-slash"
                    );

                    togglePassword.setAttribute(
                        "aria-label",
                        "Ocultar senha"
                    );

                } else {

                    icon.classList.remove(
                        "fa-eye-slash"
                    );

                    icon.classList.add(
                        "fa-eye"
                    );

                    togglePassword.setAttribute(
                        "aria-label",
                        "Mostrar senha"
                    );
                }

            }

        }
    );

}


/* =========================================================
   LIMPAR ERROS AO DIGITAR
========================================================= */

if (emailInput) {

    emailInput.addEventListener(
        "input",
        () => {

            if (emailError) {

                emailError.textContent =
                    "";

                emailError.classList.remove(
                    "show"
                );
            }

            if (loginError) {

                loginError.classList.remove(
                    "show"
                );
            }

        }
    );

}


if (passwordInput) {

    passwordInput.addEventListener(
        "input",
        () => {

            if (passwordError) {

                passwordError.textContent =
                    "";

                passwordError.classList.remove(
                    "show"
                );
            }

            if (loginError) {

                loginError.classList.remove(
                    "show"
                );
            }

        }
    );

}


/* =========================================================
   ENTER NO FORMULÁRIO
========================================================= */

if (passwordInput) {

    passwordInput.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                loginForm?.requestSubmit();

            }

        }
    );

}


/* =========================================================
   VERIFICAR SESSÃO EXISTENTE
========================================================= */

onAuthStateChanged(
    auth,
    (user) => {

        /*
         * Se a pessoa já estiver autenticada,
         * não precisa fazer login novamente.
         */

        if (user) {

            /*
             * Evita redirecionar enquanto
             * o usuário ainda está preenchendo
             * o formulário.
             */

            if (
                document.visibilityState ===
                "visible"
            ) {

                /*
                 * Se o formulário estiver vazio,
                 * podemos assumir que a pessoa
                 * já possui uma sessão.
                 */

                const emailValue =
                    emailInput?.value.trim() ||
                    "";


                if (!emailValue) {

                    window.location.replace(
                        "cliente.html"
                    );
                }

            }

        }

    }
);


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        clearMessages();

        console.log(
            "Suas Memórias Aqui — login carregado."
        );

    }
);
```
