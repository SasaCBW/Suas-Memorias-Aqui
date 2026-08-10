/* =========================================================
   SUAS MEMÓRIAS AQUI
   CONTATO.JS
   Formulário de contato + Firestore
========================================================= */

import {
    db,
    auth
} from "./firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


/* =========================================================
   ELEMENTOS
========================================================= */

const contactForm =
    document.getElementById("contactForm");

const contactButton =
    document.getElementById("contactButton");

const contactButtonText =
    document.getElementById("contactButtonText");

const contactMessage =
    document.getElementById("contactMessage");

const nameInput =
    document.getElementById("name");

const emailInput =
    document.getElementById("email");

const phoneInput =
    document.getElementById("phone");

const eventTypeInput =
    document.getElementById("eventType");

const eventDateInput =
    document.getElementById("eventDate");

const messageInput =
    document.getElementById("message");


/* =========================================================
   FORMULÁRIO
========================================================= */

if (contactForm) {

    contactForm.addEventListener(
        "submit",
        enviarContato
    );

}


/* =========================================================
   ENVIAR CONTATO
========================================================= */

async function enviarContato(event) {

    event.preventDefault();


    limparMensagem();

    limparErros();


    const nome =
        nameInput?.value.trim() || "";

    const email =
        emailInput?.value.trim() || "";

    const telefone =
        phoneInput?.value.trim() || "";

    const tipoEvento =
        eventTypeInput?.value || "";

    const dataEvento =
        eventDateInput?.value || "";

    const mensagem =
        messageInput?.value.trim() || "";


    const reuniaoSelecionada =
        document.querySelector(
            'input[name="meetingType"]:checked'
        );


    const tipoReuniao =
        reuniaoSelecionada
            ? reuniaoSelecionada.value
            : "";


    /* =====================================================
       VALIDAÇÃO
    ====================================================== */

    let valido = true;


    if (nome.length < 3) {

        mostrarErro(
            nameInput,
            "Digite seu nome completo."
        );

        valido = false;

    }


    if (!validarEmail(email)) {

        mostrarErro(
            emailInput,
            "Digite um e-mail válido."
        );

        valido = false;

    }


    if (telefone.length < 8) {

        mostrarErro(
            phoneInput,
            "Digite um telefone válido."
        );

        valido = false;

    }


    if (!tipoReuniao) {

        mostrarMensagem(
            "Escolha se prefere uma reunião online ou presencial.",
            "error"
        );

        valido = false;

    }


    if (!tipoEvento) {

        mostrarErro(
            eventTypeInput,
            "Selecione o tipo de evento."
        );

        valido = false;

    }


    if (mensagem.length < 10) {

        mostrarErro(
            messageInput,
            "Conte um pouco mais sobre o seu evento."
        );

        valido = false;

    }


    if (!valido) {

        return;

    }


    /* =====================================================
       ESTADO DE ENVIO
    ====================================================== */

    definirEstadoBotao(
        true
    );


    try {

        /* =================================================
           DADOS DO CLIENTE LOGADO
        ================================================== */

        const usuario =
            auth.currentUser;


        const dadosContato = {

            nome:
                nome,

            email:
                email,

            telefone:
                telefone,

            tipoReuniao:
                tipoReuniao,

            tipoEvento:
                tipoEvento,

            dataEvento:
                dataEvento || null,

            mensagem:
                mensagem,

            uidCliente:
                usuario
                    ? usuario.uid
                    : null,

            emailConta:
                usuario
                    ? usuario.email || null
                    : null,

            status:
                "pendente",

            origem:
                "site",

            criadoEm:
                serverTimestamp()

        };


        /* =================================================
           SALVAR NO FIRESTORE
        ================================================== */

        const documento =
            await addDoc(
                collection(
                    db,
                    "solicitacoesContato"
                ),
                dadosContato
            );


        console.log(
            "Solicitação criada:",
            documento.id
        );


        /* =================================================
           SUCESSO
        ================================================== */

        mostrarMensagem(
            "Sua solicitação foi enviada com sucesso! Em breve entraremos em contato para combinarmos os detalhes.",
            "success"
        );


        contactForm.reset();


        /* =================================================
           WHATSAPP
        ================================================= */

        oferecerWhatsApp(
            dadosContato
        );


    } catch (error) {

        console.error(
            "Erro ao enviar solicitação:",
            error
        );


        mostrarMensagem(
            obterMensagemErro(
                error
            ),
            "error"
        );

    } finally {

        definirEstadoBotao(
            false
        );

    }

}


/* =========================================================
   VALIDAR E-MAIL
========================================================= */

function validarEmail(
    email
) {

    const regex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(
        email
    );

}


/* =========================================================
   MOSTRAR ERRO
========================================================= */

function mostrarErro(
    elemento,
    mensagem
) {

    if (!elemento) {
        return;
    }


    const grupo =
        elemento.closest(
            ".form-group"
        );


    if (grupo) {

        grupo.classList.add(
            "has-error"
        );


        const erro =
            grupo.querySelector(
                ".field-error"
            );


        if (erro) {

            erro.textContent =
                mensagem;

        }

    }


    elemento.focus();

}


/* =========================================================
   LIMPAR ERROS
========================================================= */

function limparErros() {

    document
        .querySelectorAll(
            ".form-group.has-error"
        )
        .forEach(
            grupo => {

                grupo.classList.remove(
                    "has-error"
                );

            }
        );


    document
        .querySelectorAll(
            ".field-error"
        )
        .forEach(
            erro => {

                erro.textContent =
                    "";

            }
        );

}


/* =========================================================
   MENSAGEM
========================================================= */

function mostrarMensagem(
    mensagem,
    tipo
) {

    if (!contactMessage) {
        return;
    }


    contactMessage.textContent =
        mensagem;


    contactMessage.className =
        "contact-message show " +
        tipo;


    contactMessage.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });

}


/* =========================================================
   LIMPAR MENSAGEM
========================================================= */

function limparMensagem() {

    if (!contactMessage) {
        return;
    }


    contactMessage.textContent =
        "";

    contactMessage.className =
        "contact-message";

}


/* =========================================================
   BOTÃO
========================================================= */

function definirEstadoBotao(
    carregando
) {

    if (!contactButton) {
        return;
    }


    contactButton.disabled =
        carregando;


    if (!contactButtonText) {
        return;
    }


    if (carregando) {

        contactButtonText.textContent =
            "Enviando solicitação...";

    } else {

        contactButtonText.textContent =
            "Enviar solicitação";

    }

}


/* =========================================================
   WHATSAPP
========================================================= */

function oferecerWhatsApp(
    dados
) {

    const numero =
        "5542988620679";


    const texto =
        `Olá, Sarah! Meu nome é ${dados.nome}. ` +
        `Enviei uma solicitação pelo site Suas Memórias Aqui. ` +
        `Gostaria de conversar sobre ${dados.tipoEvento}. ` +
        `Minha preferência de reunião é ${dados.tipoReuniao}.`;


    const url =
        "https://wa.me/" +
        numero +
        "?text=" +
        encodeURIComponent(
            texto
        );


    const botao =
        document.createElement(
            "a"
        );


    botao.href =
        url;

    botao.target =
        "_blank";

    botao.rel =
        "noopener noreferrer";

    botao.className =
        "whatsapp-after-form";

    botao.textContent =
        "Continuar pelo WhatsApp →";


    if (contactForm) {

        contactForm.appendChild(
            botao
        );

    }

}


/* =========================================================
   MENSAGENS DE ERRO DO FIREBASE
========================================================= */

function obterMensagemErro(
    error
) {

    if (
        error?.code ===
        "permission-denied"
    ) {

        return (
            "Não foi possível enviar a solicitação. " +
            "Verifique as regras do Firestore."
        );

    }


    if (
        error?.code ===
        "unavailable"
    ) {

        return (
            "O Firebase está temporariamente indisponível. " +
            "Verifique sua conexão e tente novamente."
        );

    }


    return (
        "Não foi possível enviar sua solicitação agora. " +
        "Tente novamente em alguns instantes."
    );

}


/* =========================================================
   MÁSCARA DE TELEFONE
========================================================= */

if (phoneInput) {

    phoneInput.addEventListener(
        "input",
        aplicarMascaraTelefone
    );

}


function aplicarMascaraTelefone(
    event
) {

    let valor =
        event.target.value
            .replace(/\D/g, "")
            .slice(0, 11);


    if (valor.length <= 10) {

        valor =
            valor.replace(
                /^(\d{2})(\d{4})(\d{0,4}).*/,
                "($1) $2-$3"
            );

    } else {

        valor =
            valor.replace(
                /^(\d{2})(\d{5})(\d{0,4}).*/,
                "($1) $2-$3"
            );

    }


    event.target.value =
        valor;

}


/* =========================================================
   DATA MÍNIMA DO EVENTO
========================================================= */

if (eventDateInput) {

    const hoje =
        new Date();


    const ano =
        hoje.getFullYear();


    const mes =
        String(
            hoje.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const dia =
        String(
            hoje.getDate()
        ).padStart(
            2,
            "0"
        );


    eventDateInput.min =
        `${ano}-${mes}-${dia}`;

}


/* =========================================================
   REMOVER BOTÃO WHATSAPP ANTIGO
========================================================= */

contactForm?.addEventListener(
    "reset",
    () => {

        setTimeout(
            () => {

                document
                    .querySelectorAll(
                        ".whatsapp-after-form"
                    )
                    .forEach(
                        botao => botao.remove()
                    );

            },
            0
        );

    }
);


/* =========================================================
   LOG
========================================================= */

console.log(
    "Suas Memórias Aqui — formulário de contato carregado."
);
