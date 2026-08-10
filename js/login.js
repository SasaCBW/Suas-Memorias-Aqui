```javascript
/* =========================================================
   SUAS MEMÓRIAS AQUI
   LOGIN.JS
   Sistema de autenticação dos clientes
========================================================= */

import {
    auth,
    googleProvider,
    db
} from "./firebase.js";

import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    sendPasswordResetEmail,
    updateProfile,
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

const loginForm =
    document.getElementById("loginForm");

const loginEmail =
    document.getElementById("loginEmail");

const loginPassword =
    document.getElementById("loginPassword");

const loginButton =
    document.getElementById("loginButton");

const loginButtonText =
    document.getElementById("loginButtonText");

const googleLogin =
    document.getElementById("googleLogin");

const forgotPassword =
    document.getElementById("forgotPassword");

const togglePassword =
    document.getElementById("togglePassword");

const rememberMe =
    document.getElementById("rememberMe");

const authMessage =
    document.getElementById("authMessage");


/* =========================================================
   CADASTRO
========================================================= */

const registerModal =
    document.getElementById("registerModal");

const showRegister =
    document.getElementById("showRegister");

const closeRegister =
    document.getElementById("closeRegister");

const modalBackdrop =
    document.querySelector(".modal-backdrop");

const registerForm =
    document.getElementById("registerForm");

const registerName =
    document.getElementById("registerName");

const registerEmail =
    document.getElementById("registerEmail");

const registerPassword =
    document.getElementById("registerPassword");

const registerButton =
    document.getElementById("registerButton");

const registerButtonText =
    document.getElementById("registerButtonText");

const toggleRegisterPassword =
    document.getElementById(
        "toggleRegisterPassword"
    );

const registerMessage =
    document.getElementById(
        "registerMessage"
    );


/* =========================================================
   FUNÇÕES DE MENSAGEM
========================================================= */

function mostrarMensagem(
    elemento,
    mensagem,
    tipo = "error"
) {

    if (!elemento) {
        return;
    }

    elemento.textContent =
        mensagem;

    elemento.className =
        `auth-message show ${tipo}`;

}


function limparMensagem(elemento) {

    if (!elemento) {
        return;
    }

    elemento.textContent = "";

    elemento.className =
        "auth-message";

}


/* =========================================================
   ERROS DOS CAMPOS
========================================================= */

function limparErros() {

    document
        .querySelectorAll(".field-error")
        .forEach(elemento => {

            elemento.textContent = "";

        });


    document
        .querySelectorAll(".form-group")
        .forEach(elemento => {

            elemento.classList.remove(
                "has-error"
            );

        });

}


function mostrarErroCampo(
    input,
    errorId,
    mensagem
) {

    if (!input) {
        return;
    }


    const grupo =
        input.closest(
            ".form-group"
        );


    const erro =
        document.getElementById(
            errorId
        );


    if (grupo) {

        grupo.classList.add(
            "has-error"
        );

    }


    if (erro) {

        erro.textContent =
            mensagem;

    }

}


/* =========================================================
   BOTÃO — CARREGANDO
========================================================= */

function alterarEstadoBotao(
    botao,
    textoElemento,
    carregando,
    textoNormal
) {

    if (!botao) {
        return;
    }


    botao.disabled =
        carregando;


    if (textoElemento) {

        textoElemento.textContent =
            carregando
                ? "Aguarde..."
                : textoNormal;

    }

}


/* =========================================================
   TRADUÇÃO DOS ERROS DO FIREBASE
========================================================= */

function traduzirErroFirebase(
    erro
) {

    const codigo =
        erro?.code || "";


    const mensagens = {

        "auth/invalid-email":
            "Digite um e-mail válido.",

        "auth/user-not-found":
            "Não encontramos uma conta com este e-mail.",

        "auth/wrong-password":
            "E-mail ou senha incorretos.",

        "auth/invalid-credential":
            "E-mail ou senha incorretos.",

        "auth/email-already-in-use":
            "Este e-mail já possui uma conta.",

        "auth/weak-password":
            "A senha precisa ter pelo menos 6 caracteres.",

        "auth/popup-closed-by-user":
            "A janela do Google foi fechada.",

        "auth/popup-blocked":
            "O navegador bloqueou a janela do Google.",

        "auth/account-exists-with-different-credential":
            "Este e-mail já está cadastrado usando outro método de login.",

        "auth/too-many-requests":
            "Muitas tentativas. Aguarde alguns minutos e tente novamente.",

        "auth/network-request-failed":
            "Não foi possível conectar ao Firebase. Verifique sua internet.",

        "auth/operation-not-allowed":
            "Este método de login ainda não está ativado no Firebase.",

        "auth/unauthorized-domain":
            "Este domínio ainda não está autorizado no Firebase.",

        "auth/user-disabled":
            "Esta conta foi desativada.",

        "auth/requires-recent-login":
            "Por segurança, faça login novamente."

    };


    return (
        mensagens[codigo] ||
        "Não foi possível concluir a operação. Tente novamente."
    );

}


/* =========================================================
   VALIDAR E-MAIL
========================================================= */

function emailValido(
    email
) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


/* =========================================================
   LOGIN
========================================================= */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            limparErros();

            limparMensagem(
                authMessage
            );


            const email =
                loginEmail.value
                    .trim();

            const senha =
                loginPassword.value;


            let valido = true;


            if (!email) {

                mostrarErroCampo(
                    loginEmail,
                    "loginEmailError",
                    "Informe seu e-mail."
                );

                valido = false;

            } else if (
                !emailValido(email)
            ) {

                mostrarErroCampo(
                    loginEmail,
                    "loginEmailError",
                    "Digite um e-mail válido."
                );

                valido = false;

            }


            if (!senha) {

                mostrarErroCampo(
                    loginPassword,
                    "loginPasswordError",
                    "Informe sua senha."
                );

                valido = false;

            }


            if (!valido) {
                return;
            }


            alterarEstadoBotao(
                loginButton,
                loginButtonText,
                true,
                "Entrar na minha conta"
            );


            try {

                const persistencia =
                    rememberMe?.checked
                        ? browserLocalPersistence
                        : browserSessionPersistence;


                await setPersistence(
                    auth,
                    persistencia
                );


                await signInWithEmailAndPassword(
                    auth,
                    email,
                    senha
                );


                mostrarMensagem(
                    authMessage,
                    "Login realizado com sucesso. Entrando...",
                    "success"
                );


                setTimeout(
                    () => {

                        window.location.href =
                            "cliente.html";

                    },
                    700
                );


            } catch (erro) {

                console.error(
                    "Erro no login:",
                    erro
                );


                mostrarMensagem(
                    authMessage,
                    traduzirErroFirebase(
                        erro
                    ),
                    "error"
                );


                alterarEstadoBotao(
                    loginButton,
                    loginButtonText,
                    false,
                    "Entrar na minha conta"
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

            limparMensagem(
                authMessage
            );


            googleLogin.disabled =
                true;


            const textoOriginal =
                googleLogin.innerHTML;


            googleLogin.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                <span>Conectando...</span>
            `;


            try {

                const resultado =
                    await signInWithPopup(
                        auth,
                        googleProvider
                    );


                const usuario =
                    resultado.user;


                await salvarDadosCliente(
                    usuario,
                    "google"
                );


                mostrarMensagem(
                    authMessage,
                    "Login com Google realizado. Entrando...",
                    "success"
                );


                setTimeout(
                    () => {

                        window.location.href =
                            "cliente.html";

                    },
                    700
                );


            } catch (erro) {

                console.error(
                    "Erro no Google:",
                    erro
                );


                mostrarMensagem(
                    authMessage,
                    traduzirErroFirebase(
                        erro
                    ),
                    "error"
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
   ESQUECI MINHA SENHA
========================================================= */

if (forgotPassword) {

    forgotPassword.addEventListener(
        "click",
        async () => {

            limparMensagem(
                authMessage
            );


            limparErros();


            const email =
                loginEmail.value
                    .trim();


            if (!email) {

                mostrarErroCampo(
                    loginEmail,
                    "loginEmailError",
                    "Digite seu e-mail para recuperar a senha."
                );

                loginEmail.focus();

                return;

            }


            if (!emailValido(email)) {

                mostrarErroCampo(
                    loginEmail,
                    "loginEmailError",
                    "Digite um e-mail válido."
                );

                loginEmail.focus();

                return;

            }


            forgotPassword.disabled =
                true;


            try {

                await sendPasswordResetEmail(
                    auth,
                    email
                );


                mostrarMensagem(
                    authMessage,
                    "Enviamos um link para redefinir sua senha. Verifique seu e-mail.",
                    "success"
                );


            } catch (erro) {

                console.error(
                    "Erro ao recuperar senha:",
                    erro
                );


                mostrarMensagem(
                    authMessage,
                    traduzirErroFirebase(
                        erro
                    ),
                    "error"
                );

            } finally {

                forgotPassword.disabled =
                    false;

            }

        }
    );

}


/* =========================================================
   MOSTRAR / OCULTAR SENHA
========================================================= */

function configurarToggleSenha(
    botao,
    input
) {

    if (!botao || !input) {
        return;
    }


    botao.addEventListener(
        "click",
        () => {

            const mostrando =
                input.type === "text";


            input.type =
                mostrando
                    ? "password"
                    : "text";


            const icone =
                botao.querySelector(
                    "i"
                );


            if (icone) {

                icone.className =
                    mostrando
                        ? "fa-regular fa-eye"
                        : "fa-regular fa-eye-slash";

            }


            botao.setAttribute(
                "aria-label",
                mostrando
                    ? "Mostrar senha"
                    : "Ocultar senha"
            );

        }
    );

}


configurarToggleSenha(
    togglePassword,
    loginPassword
);


configurarToggleSenha(
    toggleRegisterPassword,
    registerPassword
);


/* =========================================================
   MODAL DE CADASTRO
========================================================= */

function abrirCadastro() {

    if (!registerModal) {
        return;
    }


    limparMensagem(
        registerMessage
    );


    limparErros();


    registerModal.classList.add(
        "open"
    );


    registerModal.setAttribute(
        "aria-hidden",
        "false"
    );


    setTimeout(
        () => {

            if (registerName) {

                registerName.focus();

            }

        },
        200
    );

}


function fecharCadastro() {

    if (!registerModal) {
        return;
    }


    registerModal.classList.remove(
        "open"
    );


    registerModal.setAttribute(
        "aria-hidden",
        "true"
    );

}


if (showRegister) {

    showRegister.addEventListener(
        "click",
        abrirCadastro
    );

}


if (closeRegister) {

    closeRegister.addEventListener(
        "click",
        fecharCadastro
    );

}


if (modalBackdrop) {

    modalBackdrop.addEventListener(
        "click",
        fecharCadastro
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
            registerModal?.classList.contains("open")
        ) {

            fecharCadastro();

        }

    }
);


/* =========================================================
   CRIAR CONTA
========================================================= */

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            limparErros();

            limparMensagem(
                registerMessage
            );


            const nome =
                registerName.value
                    .trim();

            const email =
                registerEmail.value
                    .trim();

            const senha =
                registerPassword.value;


            let valido = true;


            if (!nome) {

                mostrarErroCampo(
                    registerName,
                    "registerNameError",
                    "Informe seu nome."
                );

                valido = false;

            }


            if (!email) {

                mostrarErroCampo(
                    registerEmail,
                    "registerEmailError",
                    "Informe seu e-mail."
                );

                valido = false;

            } else if (
                !emailValido(email)
            ) {

                mostrarErroCampo(
                    registerEmail,
                    "registerEmailError",
                    "Digite um e-mail válido."
                );

                valido = false;

            }


            if (!senha) {

                mostrarErroCampo(
                    registerPassword,
                    "registerPasswordError",
                    "Crie uma senha."
                );

                valido = false;

            } else if (
                senha.length < 6
            ) {

                mostrarErroCampo(
                    registerPassword,
                    "registerPasswordError",
                    "A senha precisa ter pelo menos 6 caracteres."
                );

                valido = false;

            }


            if (!valido) {
                return;
            }


            alterarEstadoBotao(
                registerButton,
                registerButtonText,
                true,
                "Criar minha conta"
            );


            try {

                const resultado =
                    await createUserWithEmailAndPassword(
                        auth,
                        email,
                        senha
                    );


                const usuario =
                    resultado.user;


                await updateProfile(
                    usuario,
                    {
                        displayName:
                            nome
                    }
                );


                await salvarDadosCliente(
                    usuario,
                    "email"
                );


                mostrarMensagem(
                    registerMessage,
                    "Conta criada com sucesso! Entrando...",
                    "success"
                );


                setTimeout(
                    () => {

                        window.location.href =
                            "cliente.html";

                    },
                    900
                );


            } catch (erro) {

                console.error(
                    "Erro ao criar conta:",
                    erro
                );


                mostrarMensagem(
                    registerMessage,
                    traduzirErroFirebase(
                        erro
                    ),
                    "error"
                );


                alterarEstadoBotao(
                    registerButton,
                    registerButtonText,
                    false,
                    "Criar minha conta"
                );

            }

        }
    );

}


/* =========================================================
   SALVAR DADOS DO CLIENTE
========================================================= */

async function salvarDadosCliente(
    usuario,
    metodoLogin
) {

    if (!usuario || !db) {
        return;
    }


    try {

        await setDoc(
            doc(
                db,
                "clientes",
                usuario.uid
            ),
            {

                uid:
                    usuario.uid,

                nome:
                    usuario.displayName || "",

                email:
                    usuario.email || "",

                fotoPerfil:
                    usuario.photoURL || "",

                metodoLogin:
                    metodoLogin,

                atualizadoEm:
                    serverTimestamp()

            },
            {
                merge: true
            }
        );

    } catch (erro) {

        /*
         * O cadastro/login continua funcionando
         * mesmo se o Firestore ainda não estiver
         * configurado.
         */

        console.warn(
            "Não foi possível salvar os dados no Firestore:",
            erro
        );

    }

}


/* =========================================================
   ENTER NOS CAMPOS
========================================================= */

[
    loginEmail,
    loginPassword,
    registerName,
    registerEmail,
    registerPassword
]
    .filter(Boolean)
    .forEach(
        campo => {

            campo.addEventListener(
                "input",
                () => {

                    const grupo =
                        campo.closest(
                            ".form-group"
                        );


                    if (grupo) {

                        grupo.classList.remove(
                            "has-error"
                        );

                    }

                }
            );

        }
    );


/* =========================================================
   INFORMAÇÃO NO CONSOLE
========================================================= */

console.log(
    "Suas Memórias Aqui — autenticação carregada."
);
```
