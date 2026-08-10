```javascript
/* =========================================================
   SUAS MEMÓRIAS AQUI
   CADASTRO.JS

   Cadastro de clientes
   Firebase Authentication
   Firestore
   Google
========================================================= */


/* =========================================================
   FIREBASE
========================================================= */

import {
    auth,
    db
} from "./firebase.js";


import {
    createUserWithEmailAndPassword,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";


import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


/* =========================================================
   ELEMENTOS
========================================================= */

const registerForm =
    document.getElementById(
        "registerForm"
    );


const nameInput =
    document.getElementById(
        "name"
    );


const emailInput =
    document.getElementById(
        "email"
    );


const passwordInput =
    document.getElementById(
        "password"
    );


const confirmPasswordInput =
    document.getElementById(
        "confirmPassword"
    );


const termsInput =
    document.getElementById(
        "terms"
    );


const registerButton =
    document.getElementById(
        "registerButton"
    );


const registerButtonText =
    document.getElementById(
        "registerButtonText"
    );


const registerButtonIcon =
    document.getElementById(
        "registerButtonIcon"
    );


const googleRegisterButton =
    document.getElementById(
        "googleRegisterButton"
    );


const togglePassword =
    document.getElementById(
        "togglePassword"
    );


const registerMessage =
    document.getElementById(
        "registerMessage"
    );


const registerMessageIcon =
    document.getElementById(
        "registerMessageIcon"
    );


const registerMessageText =
    document.getElementById(
        "registerMessageText"
    );


const passwordStrength =
    document.getElementById(
        "passwordStrength"
    );


const strengthFill =
    document.getElementById(
        "strengthFill"
    );


const strengthText =
    document.getElementById(
        "strengthText"
    );


/* =========================================================
   ESTADO
========================================================= */

let isLoading = false;


/* =========================================================
   MENSAGENS
========================================================= */

function clearMessage() {

    if (!registerMessage) {
        return;
    }

    registerMessage.classList.remove(
        "show",
        "error",
        "success"
    );

}


function showMessage(
    message,
    type = "error"
) {

    if (!registerMessage) {
        return;
    }


    registerMessageText.textContent =
        message;


    registerMessage.classList.remove(
        "error",
        "success"
    );


    registerMessage.classList.add(
        type,
        "show"
    );


    if (registerMessageIcon) {

        if (type === "success") {

            registerMessageIcon.className =
                "fa-solid fa-circle-check";

        } else {

            registerMessageIcon.className =
                "fa-solid fa-circle-exclamation";
        }

    }

}


/* =========================================================
   BOTÃO
========================================================= */

function setButtonLoading(
    loading
) {

    if (!registerButton) {
        return;
    }


    registerButton.disabled =
        loading;


    if (loading) {

        registerButtonText.textContent =
            "Criando sua conta...";


        registerButtonIcon.className =
            "fa-solid fa-spinner fa-spin";

    } else {

        registerButtonText.textContent =
            "Criar minha conta";


        registerButtonIcon.className =
            "fa-solid fa-arrow-right";
    }

}


/* =========================================================
   VALIDAR E-MAIL
========================================================= */

function validEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);
}


/* =========================================================
   FORÇA DA SENHA
========================================================= */

function calculatePasswordStrength(
    password
) {

    if (!password) {

        return {
            score: 0,
            text: "Digite uma senha."
        };

    }


    let score = 0;


    if (password.length >= 6) {
        score++;
    }


    if (password.length >= 10) {
        score++;
    }


    if (/[A-Z]/.test(password)) {
        score++;
    }


    if (/[0-9]/.test(password)) {
        score++;
    }


    if (/[^A-Za-z0-9]/.test(password)) {
        score++;
    }


    if (score <= 1) {

        return {
            score,
            text: "Senha fraca."
        };

    }


    if (score === 2) {

        return {
            score,
            text: "Senha razoável."
        };

    }


    if (score === 3) {

        return {
            score,
            text: "Senha boa."
        };

    }


    return {
        score,
        text: "Senha forte."
    };

}


/* =========================================================
   ATUALIZAR INDICADOR DA SENHA
========================================================= */

function updatePasswordStrength() {

    if (
        !passwordStrength ||
        !strengthFill ||
        !strengthText
    ) {
        return;
    }


    const password =
        passwordInput?.value || "";


    if (!password) {

        passwordStrength.classList.remove(
            "show"
        );

        return;
    }


    passwordStrength.classList.add(
        "show"
    );


    const result =
        calculatePasswordStrength(
            password
        );


    const percentage =
        Math.min(
            result.score * 20,
            100
        );


    strengthFill.style.width =
        `${percentage}%`;


    strengthText.textContent =
        result.text;


    /*
     * Cores somente do indicador.
     */

    if (result.score <= 1) {

        strengthFill.style.background =
            "#a6534f";

    } else if (result.score <= 3) {

        strengthFill.style.background =
            "#b58c4d";

    } else {

        strengthFill.style.background =
            "#63815e";
    }

}


/* =========================================================
   VALIDAR FORMULÁRIO
========================================================= */

function validateForm() {

    const name =
        nameInput?.value.trim() || "";


    const email =
        emailInput?.value.trim() || "";


    const password =
        passwordInput?.value || "";


    const confirmPassword =
        confirmPasswordInput?.value || "";


    /*
     * Nome
     */

    if (name.length < 2) {

        showMessage(
            "Digite seu nome completo."
        );

        nameInput?.focus();

        return false;
    }


    /*
     * E-mail
     */

    if (!email) {

        showMessage(
            "Digite seu e-mail."
        );

        emailInput?.focus();

        return false;
    }


    if (!validEmail(email)) {

        showMessage(
            "Digite um e-mail válido."
        );

        emailInput?.focus();

        return false;
    }


    /*
     * Senha
     */

    if (password.length < 6) {

        showMessage(
            "Sua senha precisa ter pelo menos 6 caracteres."
        );

        passwordInput?.focus();

        return false;
    }


    /*
     * Confirmação
     */

    if (
        password !==
        confirmPassword
    ) {

        showMessage(
            "As senhas não são iguais."
        );

        confirmPasswordInput?.focus();

        return false;
    }


    /*
     * Termos
     */

    if (
        !termsInput ||
        !termsInput.checked
    ) {

        showMessage(
            "Você precisa concordar com os termos para continuar."
        );

        return false;
    }


    return true;

}


/* =========================================================
   PERSISTÊNCIA
========================================================= */

async function configurePersistence() {

    if (
        termsInput &&
        !termsInput.checked
    ) {
        return;
    }


    /*
     * Cadastro ficará salvo no navegador.
     * O usuário poderá permanecer conectado.
     */

    await setPersistence(
        auth,
        browserLocalPersistence
    );

}


/* =========================================================
   SALVAR CLIENTE NO FIRESTORE
========================================================= */

async function saveClientProfile(
    user,
    extraData = {}
) {

    if (!user) {
        return;
    }


    const userRef =
        doc(
            db,
            "clientes",
            user.uid
        );


    await setDoc(
        userRef,
        {

            uid:
                user.uid,

            nome:
                extraData.nome ||
                user.displayName ||
                "",

            email:
                user.email ||
                "",

            fotoPerfil:
                user.photoURL ||
                "",

            tipo:
                "cliente",

            status:
                "ativo",

            criadoEm:
                serverTimestamp(),

            atualizadoEm:
                serverTimestamp()

        },
        {
            merge: true
        }
    );

}


/* =========================================================
   CADASTRO COM E-MAIL
========================================================= */

async function registerWithEmail() {

    if (isLoading) {
        return;
    }


    clearMessage();


    if (!validateForm()) {
        return;
    }


    const name =
        nameInput.value.trim();


    const email =
        emailInput.value.trim();


    const password =
        passwordInput.value;


    try {

        isLoading = true;

        setButtonLoading(
            true
        );


        await configurePersistence();


        /*
         * Cria usuário no Firebase Authentication.
         */

        const result =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );


        const user =
            result.user;


        /*
         * Define nome do usuário.
         */

        await updateProfile(
            user,
            {
                displayName:
                    name
            }
        );


        /*
         * Cria o perfil no Firestore.
         */

        await saveClientProfile(
            user,
            {
                nome:
                    name
            }
        );


        showMessage(
            "Conta criada com sucesso! Preparando seu acesso...",
            "success"
        );


        /*
         * Vai para a área do cliente.
         */

        setTimeout(() => {

            window.location.replace(
                "cliente.html"
            );

        }, 900);


    } catch (error) {

        console.error(
            "Erro ao criar conta:",
            error
        );


        let message =
            "Não foi possível criar sua conta.";


        switch (error.code) {

            case "auth/email-already-in-use":

                message =
                    "Este e-mail já possui uma conta.";

                break;


            case "auth/invalid-email":

                message =
                    "O e-mail informado não é válido.";

                break;


            case "auth/weak-password":

                message =
                    "Escolha uma senha mais segura.";

                break;


            case "auth/network-request-failed":

                message =
                    "Verifique sua conexão com a internet.";

                break;


            case "auth/operation-not-allowed":

                message =
                    "O cadastro por e-mail ainda não está ativado no Firebase.";

                break;


            default:

                console.error(
                    error
                );

        }


        showMessage(
            message
        );


    } finally {

        isLoading = false;

        setButtonLoading(
            false
        );

    }

}


/* =========================================================
   GOOGLE
========================================================= */

async function registerWithGoogle() {

    if (isLoading) {
        return;
    }


    try {

        isLoading = true;

        clearMessage();


        googleRegisterButton.disabled =
            true;


        await configurePersistence();


        const provider =
            new GoogleAuthProvider();


        provider.setCustomParameters({
            prompt: "select_account"
        });


        /*
         * Login/cadastro Google.
         */

        const result =
            await signInWithPopup(
                auth,
                provider
            );


        const user =
            result.user;


        /*
         * Salva perfil.
         */

        await saveClientProfile(
            user
        );


        showMessage(
            "Conta Google conectada! Preparando seu acesso...",
            "success"
        );


        setTimeout(() => {

            window.location.replace(
                "cliente.html"
            );

        }, 900);


    } catch (error) {

        console.error(
            "Erro no cadastro Google:",
            error
        );


        let message =
            "Não foi possível continuar com o Google.";


        switch (error.code) {

            case "auth/popup-closed-by-user":

                message =
                    "A janela do Google foi fechada.";

                break;


            case "auth/popup-blocked":

                message =
                    "O navegador bloqueou a janela do Google. Permita pop-ups.";

                break;


            case "auth/unauthorized-domain":

                message =
                    "Este domínio ainda não está autorizado no Firebase.";

                break;


            case "auth/network-request-failed":

                message =
                    "Verifique sua conexão com a internet.";

                break;


            default:

                console.error(
                    error
                );

        }


        showMessage(
            message
        );


    } finally {

        isLoading = false;

        if (googleRegisterButton) {

            googleRegisterButton.disabled =
                false;
        }

    }

}


/* =========================================================
   EVENTO DO FORMULÁRIO
========================================================= */

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            await registerWithEmail();

        }
    );

}


/* =========================================================
   GOOGLE
========================================================= */

if (googleRegisterButton) {

    googleRegisterButton.addEventListener(
        "click",
        registerWithGoogle
    );

}


/* =========================================================
   MOSTRAR / OCULTAR SENHA
========================================================= */

if (togglePassword) {

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


            if (!icon) {
                return;
            }


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
    );

}


/* =========================================================
   SENHA
========================================================= */

if (passwordInput) {

    passwordInput.addEventListener(
        "input",
        updatePasswordStrength
    );

}


/* =========================================================
   CONFIRMAÇÃO DA SENHA
========================================================= */

if (confirmPasswordInput) {

    confirmPasswordInput.addEventListener(
        "input",
        () => {

            clearMessage();

        }
    );

}


/* =========================================================
   NOME
========================================================= */

if (nameInput) {

    nameInput.addEventListener(
        "input",
        () => {

            clearMessage();

        }
    );

}


/* =========================================================
   E-MAIL
========================================================= */

if (emailInput) {

    emailInput.addEventListener(
        "input",
        () => {

            clearMessage();

        }
    );

}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updatePasswordStrength();

        console.log(
            "Suas Memórias Aqui — cadastro carregado."
        );

    }
);
```
