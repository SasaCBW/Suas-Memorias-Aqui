```javascript
/* =========================================================
   LS.FOTOSTORY
   ADMIN-LOGIN.JS
   Login exclusivo da administração
========================================================= */

import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    auth
} from "./firebase.js";


/* =========================================================
   CONFIGURAÇÃO
========================================================= */

/*
 * Coloque aqui o e-mail que terá acesso administrativo.
 *
 * IMPORTANTE:
 * Este controle é apenas uma camada visual.
 * A segurança real deve ser feita também pelas
 * regras do Firestore.
 */

const ADMIN_EMAILS = [
    "SEU_EMAIL_ADMIN_AQUI"
];


const ADMIN_PAGE =
    "admin.html";


const LOGIN_PAGE =
    "admin-login.html";


/* =========================================================
   ELEMENTOS
========================================================= */

const loginForm =
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


const errorMessage =
    document.getElementById(
        "adminLoginError"
    );


const successMessage =
    document.getElementById(
        "adminLoginSuccess"
    );


const passwordToggle =
    document.getElementById(
        "adminPasswordToggle"
    );


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeAdminLogin();

        initializePasswordToggle();

    }
);


/* =========================================================
   VERIFICAR SESSÃO
========================================================= */

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {
            return;
        }


        /*
         * Se a pessoa já estiver autenticada,
         * verificamos se o e-mail possui acesso.
         */

        if (
            isAdminUser(
                user
            )
        ) {

            const currentPage =
                window.location.pathname
                    .split("/")
                    .pop();


            /*
             * Se estiver no login administrativo,
             * pode ir direto ao painel.
             */

            if (
                currentPage ===
                LOGIN_PAGE
            ) {

                window.location.replace(
                    ADMIN_PAGE
                );

            }

        }

    }
);


/* =========================================================
   LOGIN ADMINISTRATIVO
========================================================= */

function initializeAdminLogin() {

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
               VALIDAÇÕES
            ----------------------------------------- */

            if (!email) {

                showError(
                    "Digite o e-mail administrativo."
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


            if (!password) {

                showError(
                    "Digite sua senha."
                );

                passwordInput?.focus();

                return;

            }


            setLoading(
                true
            );


            try {

                /*
                 * Login pelo Firebase Authentication
                 */

                const credential =
                    await signInWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                const user =
                    credential.user;


                /*
                 * Verificação adicional:
                 * somente e-mails cadastrados como
                 * administradores podem entrar.
                 */

                if (
                    !isAdminUser(
                        user
                    )
                ) {

                    await signOut(
                        auth
                    );


                    showError(
                        "Esta conta não possui permissão para acessar o painel."
                    );


                    return;

                }


                showSuccess(
                    "Acesso autorizado. Abrindo painel..."
                );


                setTimeout(
                    () => {

                        window.location.replace(
                            ADMIN_PAGE
                        );

                    },
                    500
                );


            } catch (error) {

                console.error(
                    "Erro no login administrativo:",
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
   VERIFICAR ADMIN
========================================================= */

function isAdminUser(
    user
) {

    if (!user) {
        return false;
    }


    const email =
        (
            user.email ||
            ""
        )
        .trim()
        .toLowerCase();


    return ADMIN_EMAILS
        .map(
            (adminEmail) =>
                adminEmail
                    .trim()
                    .toLowerCase()
        )
        .includes(
            email
        );

}


/* =========================================================
   SENHA
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
   LOADING
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
                <span class="admin-login-spinner"></span>
                Verificando...
            `;

    } else {

        loginButton.innerHTML =
            loginButton.dataset.originalText ||
            "Entrar no painel";

    }

}


/* =========================================================
   ERROS DO FIREBASE
========================================================= */

function showFirebaseError(
    error
) {

    let message =
        "Não foi possível realizar o acesso.";


    switch (
        error.code
    ) {

        case "auth/invalid-email":

            message =
                "O e-mail informado é inválido.";

            break;


        case "auth/user-not-found":

            message =
                "Conta administrativa não encontrada.";

            break;


        case "auth/wrong-password":

            message =
                "Senha administrativa incorreta.";

            break;


        case "auth/invalid-credential":

            message =
                "E-mail ou senha administrativos incorretos.";

            break;


        case "auth/user-disabled":

            message =
                "Esta conta administrativa foi desativada.";

            break;


        case "auth/too-many-requests":

            message =
                "Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.";

            break;


        case "auth/network-request-failed":

            message =
                "Não foi possível conectar ao Firebase. Verifique sua internet.";

            break;


        case "auth/operation-not-allowed":

            message =
                "O login por e-mail e senha não está ativado no Firebase.";

            break;


        case "auth/unauthorized-domain":

            message =
                "Este domínio ainda não está autorizado no Firebase.";

            break;

    }


    showError(
        message
    );

}


/* =========================================================
   MENSAGENS
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


function clearMessages() {

    errorMessage?.classList.remove(
        "show"
    );


    successMessage?.classList.remove(
        "show"
    );

}


/* =========================================================
   VALIDAÇÃO DE E-MAIL
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
   ENTER
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
