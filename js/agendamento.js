```javascript
/* =========================================================
   LS.FOTOSTORY
   AGENDAMENTO.JS
   Sistema de agendamento
========================================================= */

import {
    addDoc,
    collection,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    auth,
    db
} from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


/* =========================================================
   ELEMENTOS
========================================================= */

const form =
    document.getElementById("agendamentoForm");

const nomeInput =
    document.getElementById("nome");

const emailInput =
    document.getElementById("email");

const telefoneInput =
    document.getElementById("telefone");

const dataInput =
    document.getElementById("data");

const horarioInput =
    document.getElementById("horario");

const servicoInput =
    document.getElementById("servico");

const mensagemInput =
    document.getElementById("mensagem");

const submitButton =
    document.getElementById("agendamentoButton");

const successMessage =
    document.getElementById("agendamentoSuccess");

const errorMessage =
    document.getElementById("agendamentoError");


/* =========================================================
   USUÁRIO LOGADO
========================================================= */

onAuthStateChanged(
    auth,
    (user) => {

        if (!user) {
            return;
        }

        if (
            emailInput &&
            !emailInput.value
        ) {

            emailInput.value =
                user.email || "";

        }

        if (
            nomeInput &&
            !nomeInput.value
        ) {

            nomeInput.value =
                user.displayName || "";

        }

    }
);


/* =========================================================
   DATA MÍNIMA
========================================================= */

if (dataInput) {

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const day =
        String(
            today.getDate()
        ).padStart(
            2,
            "0"
        );

    dataInput.min =
        `${year}-${month}-${day}`;

}


/* =========================================================
   ENVIO
========================================================= */

if (form) {

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            clearMessages();

            const nome =
                nomeInput?.value
                    .trim();

            const email =
                emailInput?.value
                    .trim()
                    .toLowerCase();

            const telefone =
                telefoneInput?.value
                    .trim();

            const data =
                dataInput?.value;

            const horario =
                horarioInput?.value;

            const servico =
                servicoInput?.value
                    .trim();

            const mensagem =
                mensagemInput?.value
                    .trim();


            /* -----------------------------------------
               VALIDAÇÕES
            ----------------------------------------- */

            if (!nome) {

                showError(
                    "Digite seu nome."
                );

                nomeInput?.focus();

                return;

            }

            if (!email) {

                showError(
                    "Digite seu e-mail."
                );

                emailInput?.focus();

                return;

            }

            if (!isValidEmail(email)) {

                showError(
                    "Digite um e-mail válido."
                );

                emailInput?.focus();

                return;

            }

            if (!telefone) {

                showError(
                    "Digite seu telefone."
                );

                telefoneInput?.focus();

                return;

            }

            if (!data) {

                showError(
                    "Escolha uma data."
                );

                dataInput?.focus();

                return;

            }

            if (!horario) {

                showError(
                    "Escolha um horário."
                );

                horarioInput?.focus();

                return;

            }

            if (!servico) {

                showError(
                    "Escolha o serviço desejado."
                );

                servicoInput?.focus();

                return;

            }


            /* -----------------------------------------
               VERIFICAR DATA
            ----------------------------------------- */

            const selectedDate =
                new Date(
                    `${data}T${horario}`
                );

            const now =
                new Date();

            if (
                selectedDate <
                now
            ) {

                showError(
                    "Escolha uma data e horário futuros."
                );

                return;

            }


            /* -----------------------------------------
               LOADING
            ----------------------------------------- */

            setLoading(true);


            try {

                const user =
                    auth.currentUser;


                /* -----------------------------------------
                   FIRESTORE
                ----------------------------------------- */

                await addDoc(
                    collection(
                        db,
                        "agendamentos"
                    ),
                    {

                        nome,

                        email,

                        telefone,

                        data,

                        horario,

                        servico,

                        mensagem,

                        status:
                            "pendente",

                        uid:
                            user
                                ? user.uid
                                : null,

                        createdAt:
                            serverTimestamp()

                    }
                );


                /* -----------------------------------------
                   SUCESSO
                ----------------------------------------- */

                showSuccess(
                    "Seu pedido de agendamento foi enviado! A LS.fotostory entrará em contato para confirmar."
                );


                form.reset();


                if (
                    user &&
                    emailInput
                ) {

                    emailInput.value =
                        user.email || "";

                }


                /* -----------------------------------------
                   WHATSAPP
                ----------------------------------------- */

                const whatsappNumber =
                    "5542988620679";


                const whatsappMessage =
                    encodeURIComponent(
                        `Olá! Gostaria de solicitar um agendamento na LS.fotostory.

Nome: ${nome}
E-mail: ${email}
Telefone: ${telefone}
Data: ${formatDate(data)}
Horário: ${horario}
Serviço: ${servico}

${mensagem
    ? `Mensagem: ${mensagem}`
    : ""}`
                    );


                const whatsappURL =
                    `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;


                /*
                 * Não abre automaticamente para evitar
                 * bloquear a experiência do formulário.
                 *
                 * Se houver um botão com o ID abaixo,
                 * ele receberá o link.
                 */

                const whatsappButton =
                    document.getElementById(
                        "agendamentoWhatsapp"
                    );


                if (whatsappButton) {

                    whatsappButton.href =
                        whatsappURL;

                    whatsappButton.style.display =
                        "inline-flex";

                }


            } catch (error) {

                console.error(
                    "Erro ao criar agendamento:",
                    error
                );


                showError(
                    getFirebaseError(
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
   LOADING
========================================================= */

function setLoading(
    loading
) {

    if (!submitButton) {
        return;
    }


    submitButton.disabled =
        loading;


    if (loading) {

        submitButton.dataset.originalText =
            submitButton.innerHTML;


        submitButton.innerHTML =
            `
                <span class="login-spinner"></span>
                Enviando...
            `;

    } else {

        submitButton.innerHTML =
            submitButton.dataset.originalText ||
            "Solicitar agendamento";

    }

}


/* =========================================================
   MENSAGENS
========================================================= */

function clearMessages() {

    errorMessage?.classList.remove(
        "show"
    );

    successMessage?.classList.remove(
        "show"
    );

}


function showError(
    message
) {

    if (!errorMessage) {

        alert(message);

        return;

    }


    errorMessage.textContent =
        message;

    errorMessage.classList.add(
        "show"
    );

}


function showSuccess(
    message
) {

    if (!successMessage) {

        alert(message);

        return;

    }


    successMessage.textContent =
        message;

    successMessage.classList.add(
        "show"
    );

}


/* =========================================================
   ERROS FIREBASE
========================================================= */

function getFirebaseError(
    error
) {

    switch (
        error?.code
    ) {

        case "permission-denied":

            return "Não foi possível enviar o agendamento. Verifique as permissões do Firebase.";

        case "unavailable":

            return "O Firebase está temporariamente indisponível. Tente novamente.";

        case "network-request-failed":

            return "Verifique sua conexão com a internet.";

        default:

            return "Não foi possível enviar o agendamento. Tente novamente.";

    }

}


/* =========================================================
   E-MAIL
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
   DATA
========================================================= */

function formatDate(
    value
) {

    if (!value) {
        return "";
    }


    const date =
        new Date(
            `${value}T00:00:00`
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return value;

    }


    return date.toLocaleDateString(
        "pt-BR"
    );

}


/* =========================================================
   MÁSCARA TELEFONE
========================================================= */

if (telefoneInput) {

    telefoneInput.addEventListener(
        "input",
        () => {

            let value =
                telefoneInput.value
                    .replace(
                        /\D/g,
                        ""
                    )
                    .slice(
                        0,
                        11
                    );


            if (
                value.length <= 10
            ) {

                value =
                    value.replace(
                        /^(\d{2})(\d)/,
                        "($1) $2"
                    )
                    .replace(
                        /(\d{4})(\d)/,
                        "$1-$2"
                    );

            } else {

                value =
                    value.replace(
                        /^(\d{2})(\d)/,
                        "($1) $2"
                    )
                    .replace(
                        /(\d{5})(\d)/,
                        "$1-$2"
                    );

            }


            telefoneInput.value =
                value;

        }
    );

}
```
