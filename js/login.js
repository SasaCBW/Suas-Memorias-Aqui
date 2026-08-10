```javascript
/* =========================================================
   SUAS MEMÓRIAS AQUI
   LOGIN.JS
   Sistema de login do cliente
========================================================= */


/* =========================================================
   ELEMENTOS
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

const buttonLoader =
    document.getElementById("buttonLoader");

const loginError =
    document.getElementById("loginError");

const googleLogin =
    document.getElementById("googleLogin");

const forgotPassword =
    document.getElementById("forgotPassword");

const createAccount =
    document.getElementById("createAccount");

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

            const passwordVisible =
                passwordInput.type === "text";

            if (passwordVisible) {

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

function showMessage(
    message,
    type = "error"
) {

    if (!loginError) {
        return;
    }

    loginError.textContent = message;

    loginError.className =
        `form-message ${type} show`;

}


function clearMessage() {

    if (!loginError) {
        return;
    }

    loginError.textContent = "";

    loginError.className =
        "form-message error";

}


/* =========================================================
   ESTADO DO BOTÃO
========================================================= */

function setLoading(
    loading
) {

    if (!loginButton) {
        return;
    }

    if (loading) {

        loginButton.disabled = true;

        loginButton.classList.add(
            "loading"
        );

    } else {

        loginButton.disabled = false;

        loginButton.classList.remove(
            "loading"
        );

    }

}


/* =========================================================
   VALIDAÇÃO DE E-MAIL
========================================================= */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


/* =========================================================
   LOGIN COM E-MAIL
========================================================= */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            clearMessage();

            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value;

            /* -----------------------------------------
               VALIDAÇÕES
            ----------------------------------------- */

            if (!email) {

                showMessage(
                    "Digite seu e-mail."
                );

                emailInput.focus();

                return;

            }

            if (!isValidEmail(email)) {

                showMessage(
                    "Digite um e-mail válido."
                );

                emailInput.focus();

                return;

            }

            if (!password) {

                showMessage(
                    "Digite sua senha."
                );

                passwordInput.focus();

                return;

            }

            if (password.length < 6) {

                showMessage(
                    "A senha precisa ter pelo menos 6 caracteres."
                );

                passwordInput.focus();

                return;

            }


            /* -----------------------------------------
               ATIVAR LOADING
            ----------------------------------------- */

            setLoading(true);


            /*
             * A autenticação real será conectada ao
             * Firebase Authentication.
             *
             * Não colocamos senhas diretamente neste
             * arquivo por segurança.
             */


            try {

                /*
                 * Quando o Firebase estiver configurado,
                 * o código abaixo será utilizado:
                 *
                 * await signInWithEmailAndPassword(
                 *     auth,
                 *     email,
                 *     password
                 * );
                 *
                 * Depois:
                 *
                 * window.location.href =
                 *     "cliente.html";
                 */


                /*
                 * TEMPORARIAMENTE:
                 * informa que o Firebase ainda será
                 * conectado.
                 */

                await new Promise(
                    resolve =>
                        setTimeout(resolve, 800)
                );


                showMessage(
                    "O sistema de autenticação ainda está sendo conectado ao Firebase.",
                    "success"
                );

            } catch (error) {

                console.error(
                    "Erro ao entrar:",
                    error
                );

                showMessage(
                    getFirebaseErrorMessage(
                        error
                    )
                );

            } finally {

                setLoading(false);

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

            clearMessage();

            googleLogin.disabled = true;

            const textoOriginal =
                googleLogin.innerHTML;

            googleLogin.innerHTML =
                "Conectando com Google...";


            try {

                /*
                 * Quando o Firebase estiver conectado:
                 *
                 * const provider =
                 *     new GoogleAuthProvider();
                 *
                 * await signInWithPopup(
                 *     auth,
                 *     provider
                 * );
                 *
                 * window.location.href =
                 *     "cliente.html";
                 */


                await new Promise(
                    resolve =>
                        setTimeout(resolve, 800)
                );


                showMessage(
                    "O login com Google será ativado junto com o Firebase.",
                    "success"
                );

            } catch (error) {

                console.error(
                    "Erro no Google:",
                    error
                );

                showMessage(
                    getFirebaseErrorMessage(
                        error
                    )
                );

            } finally {

                googleLogin.disabled = false;

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

            clearMessage();

            const email =
                emailInput.value.trim();


            if (!email) {

                showMessage(
                    "Digite seu e-mail para recuperar a senha."
                );

                emailInput.focus();

                return;

            }


            if (!isValidEmail(email)) {

                showMessage(
                    "Digite um e-mail válido."
                );

                emailInput.focus();

                return;

            }


            /*
             * Quando o Firebase estiver conectado:
             *
             * await sendPasswordResetEmail(
             *     auth,
             *     email
             * );
             */


            showMessage(
                "A recuperação de senha será ativada junto com o Firebase.",
                "success"
            );

        }
    );

}


/* =========================================================
   MODAL DE SOLICITAÇÃO DE ACESSO
========================================================= */

function openAccessModal() {

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


function closeAccessModal() {

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
        openAccessModal
    );

}


if (closeModal) {

    closeModal.addEventListener(
        "click",
        closeAccessModal
    );

}


if (modalOverlay) {

    modalOverlay.addEventListener(
        "click",
        closeAccessModal
    );

}


/* =========================================================
   ESC FECHA O MODAL
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

            closeAccessModal();

        }

    }
);


/* =========================================================
   MENSAGENS DO FIREBASE
========================================================= */

function getFirebaseErrorMessage(
    error
) {

    if (!error) {

        return "Não foi possível realizar o login.";

    }


    const code =
        error.code || "";


    switch (code) {

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

            return "A janela do Google foi fechada antes do login.";


        case "auth/popup-blocked":

            return "O navegador bloqueou a janela de login do Google.";


        default:

            return "Não foi possível entrar. Tente novamente.";

    }

}


/* =========================================================
   LIMPAR ERRO AO DIGITAR
========================================================= */

if (emailInput) {

    emailInput.addEventListener(
        "input",
        clearMessage
    );

}

if (passwordInput) {

    passwordInput.addEventListener(
        "input",
        clearMessage
    );

}


/* =========================================================
   LOG
========================================================= */

console.log(
    "Suas Memórias Aqui — login.js carregado."
);
```
