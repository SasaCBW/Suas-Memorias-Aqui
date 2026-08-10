/* =========================================================
   SUAS MEMÓRIAS AQUI
   ADMIN.JS
   Painel Administrativo
========================================================= */

import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


/* =========================================================
   CONFIGURAÇÃO DO ADMINISTRADOR
========================================================= */

/*
 * COLOQUE AQUI O E-MAIL DA SUA CONTA ADMINISTRADORA.
 *
 * Exemplo:
 *
 * const ADMIN_EMAIL = "sarah@gmail.com";
 *
 * Não coloque senha aqui.
 */

const ADMIN_EMAIL = "SEU_EMAIL_ADMIN";


/* =========================================================
   ELEMENTOS
========================================================= */

const adminName =
    document.getElementById("adminName");

const adminEmail =
    document.getElementById("adminEmail");

const adminAvatar =
    document.getElementById("adminAvatar");

const adminLogout =
    document.getElementById("adminLogout");

const adminSidebar =
    document.getElementById("adminSidebar");

const adminMenuButton =
    document.getElementById("adminMenuButton");


/* =========================================================
   MODAIS
========================================================= */

const clientModal =
    document.getElementById("clientModal");

const galleryModal =
    document.getElementById("galleryModal");

const newClientButton =
    document.getElementById("newClientButton");

const newGalleryButton =
    document.getElementById("newGalleryButton");

const closeClientModal =
    document.getElementById("closeClientModal");

const closeGalleryModal =
    document.getElementById("closeGalleryModal");

const clientModalOverlay =
    document.getElementById("clientModalOverlay");

const galleryModalOverlay =
    document.getElementById("galleryModalOverlay");


/* =========================================================
   FORMULÁRIOS
========================================================= */

const clientForm =
    document.getElementById("clientForm");

const galleryForm =
    document.getElementById("galleryForm");

const clientFormMessage =
    document.getElementById("clientFormMessage");

const galleryFormMessage =
    document.getElementById("galleryFormMessage");


/* =========================================================
   TABELA
========================================================= */

const clientsTableBody =
    document.getElementById("clientsTableBody");

const clientSearch =
    document.getElementById("clientSearch");

const galleryClient =
    document.getElementById("galleryClient");


/* =========================================================
   CONTADORES
========================================================= */

const totalClientes =
    document.getElementById("totalClientes");

const totalGalerias =
    document.getElementById("totalGalerias");

const totalFotos =
    document.getElementById("totalFotos");

const totalEventos =
    document.getElementById("totalEventos");

const totalFotosElement =
    totalFotos;


/* =========================================================
   ESTADO
========================================================= */

let clientes = [];

let galerias = [];

let eventos = [];


/* =========================================================
   AUTENTICAÇÃO
========================================================= */

onAuthStateChanged(
    auth,
    async (user) => {

        /*
         * Não está logado.
         */

        if (!user) {

            window.location.replace(
                "admin-login.html"
            );

            return;

        }


        /*
         * Verificação do administrador.
         *
         * IMPORTANTE:
         * isso também deverá ser protegido
         * pelas regras do Firebase.
         */

        const email =
            (user.email || "")
                .toLowerCase()
                .trim();


        const adminEmail =
            ADMIN_EMAIL
                .toLowerCase()
                .trim();


        if (
            adminEmail !== "seu_email_admin" &&
            email !== adminEmail
        ) {

            alert(
                "Acesso restrito. Esta conta não possui permissão administrativa."
            );


            await signOut(auth);


            window.location.replace(
                "admin-login.html"
            );


            return;

        }


        /*
         * Usuário autorizado.
         */

        carregarAdministrador(user);

        await carregarDados();

    }
);


/* =========================================================
   DADOS DO ADMINISTRADOR
========================================================= */

function carregarAdministrador(
    user
) {

    const nome =
        user.displayName ||
        "Administrador";


    if (adminName) {

        adminName.textContent =
            nome;

    }


    if (adminEmail) {

        adminEmail.textContent =
            user.email || "";

    }


    if (adminAvatar) {

        adminAvatar.textContent =
            obterIniciais(nome);

    }

}


/* =========================================================
   INICIAIS
========================================================= */

function obterIniciais(
    nome
) {

    if (!nome) {

        return "A";

    }


    const partes =
        nome
            .trim()
            .split(/\s+/);


    if (partes.length === 1) {

        return partes[0]
            .substring(0, 2)
            .toUpperCase();

    }


    return (
        partes[0][0] +
        partes[partes.length - 1][0]
    ).toUpperCase();

}


/* =========================================================
   CARREGAR DADOS
========================================================= */

async function carregarDados() {

    try {

        await Promise.all([
            carregarClientes(),
            carregarGalerias(),
            carregarEventos()
        ]);

        atualizarDashboard();

    } catch (error) {

        console.error(
            "Erro ao carregar dados:",
            error
        );

        mostrarErro(
            "Não foi possível carregar os dados do painel."
        );

    }

}


/* =========================================================
   CLIENTES
========================================================= */

async function carregarClientes() {

    try {

        const referencia =
            collection(
                db,
                "clientes"
            );


        const consulta =
            query(
                referencia,
                orderBy(
                    "createdAt",
                    "desc"
                )
            );


        const resultado =
            await getDocs(
                consulta
            );


        clientes =
            resultado.docs.map(
                documento => ({
                    id: documento.id,
                    ...documento.data()
                })
            );


        renderizarClientes(
            clientes
        );


        preencherSelectClientes(
            clientes
        );


    } catch (error) {

        /*
         * Se ainda não houver documentos
         * ou índice configurado, tentamos
         * carregar sem ordenação.
         */

        try {

            const resultado =
                await getDocs(
                    collection(
                        db,
                        "clientes"
                    )
                );


            clientes =
                resultado.docs.map(
                    documento => ({
                        id: documento.id,
                        ...documento.data()
                    })
                );


            renderizarClientes(
                clientes
            );


            preencherSelectClientes(
                clientes
            );


        } catch (secondError) {

            console.error(
                "Erro ao carregar clientes:",
                secondError
            );

            clientes = [];

            renderizarClientes([]);

            preencherSelectClientes([]);

        }

    }

}


/* =========================================================
   RENDERIZAR CLIENTES
========================================================= */

function renderizarClientes(
    lista
) {

    if (!clientsTableBody) {

        return;

    }


    if (!lista.length) {

        clientsTableBody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="empty-table">

                    <div>
                        ♙
                    </div>

                    <strong>
                        Nenhum cliente cadastrado
                    </strong>

                    <span>
                        Cadastre seu primeiro cliente
                        para começar.
                    </span>

                </td>

            </tr>

        `;

        return;

    }


    clientsTableBody.innerHTML =
        lista.map(
            cliente => {

                const nome =
                    cliente.nome ||
                    "Cliente";


                const email =
                    cliente.email ||
                    "Sem e-mail";


                const iniciais =
                    obterIniciais(
                        nome
                    );


                const status =
                    cliente.status ||
                    "ativo";


                const galeriasCliente =
                    galerias.filter(
                        galeria =>
                            galeria.clienteId ===
                            cliente.id
                    ).length;


                return `

                    <tr>

                        <td>

                            <div
                                class="table-client">

                                <div
                                    class="table-client-avatar">

                                    ${escapeHTML(iniciais)}

                                </div>

                                <div
                                    class="table-client-information">

                                    <strong>
                                        ${escapeHTML(nome)}
                                    </strong>

                                    <span>
                                        Cliente
                                    </span>

                                </div>

                            </div>

                        </td>


                        <td>
                            ${escapeHTML(email)}
                        </td>


                        <td>
                            ${galeriasCliente}
                        </td>


                        <td>

                            <span
                                class="status-badge status-active">

                                ${escapeHTML(
                                    status
                                )}

                            </span>

                        </td>


                        <td>

                            <div
                                class="table-actions">

                                <button
                                    type="button"
                                    class="table-action"
                                    title="Visualizar"
                                    data-client-id="${cliente.id}">

                                    👁

                                </button>

                            </div>

                        </td>

                    </tr>

                `;

            }
        ).join("");


    adicionarEventosClientes();

}


/* =========================================================
   EVENTOS DOS CLIENTES
========================================================= */

function adicionarEventosClientes() {

    const botoes =
        document.querySelectorAll(
            "[data-client-id]"
        );


    botoes.forEach(
        botao => {

            botao.addEventListener(
                "click",
                () => {

                    const id =
                        botao.dataset.clientId;


                    visualizarCliente(
                        id
                    );

                }
            );

        }
    );

}


/* =========================================================
   VISUALIZAR CLIENTE
========================================================= */

function visualizarCliente(
    id
) {

    const cliente =
        clientes.find(
            item =>
                item.id === id
        );


    if (!cliente) {

        return;

    }


    const mensagem = `

Cliente: ${cliente.nome || "Não informado"}

E-mail: ${cliente.email || "Não informado"}

Evento: ${cliente.evento || "Não informado"}

Data do evento: ${
    cliente.dataEvento ||
    "Não informada"
}

    `;


    alert(
        mensagem
    );

}


/* =========================================================
   SELECT DE CLIENTES
========================================================= */

function preencherSelectClientes(
    lista
) {

    if (!galleryClient) {

        return;

    }


    galleryClient.innerHTML = `

        <option value="">
            Selecione um cliente
        </option>

    `;


    lista.forEach(
        cliente => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                cliente.id;


            option.textContent =
                cliente.nome ||
                cliente.email ||
                "Cliente";


            galleryClient.appendChild(
                option
            );

        }
    );

}


/* =========================================================
   GALERIAS
========================================================= */

async function carregarGalerias() {

    try {

        const resultado =
            await getDocs(
                collection(
                    db,
                    "galerias"
                )
            );


        galerias =
            resultado.docs.map(
                documento => ({
                    id: documento.id,
                    ...documento.data()
                })
            );


        renderizarGalerias(
            galerias
        );


    } catch (error) {

        console.error(
            "Erro ao carregar galerias:",
            error
        );

        galerias = [];

        renderizarGalerias([]);

    }

}


/* =========================================================
   RENDERIZAR GALERIAS
========================================================= */

function renderizarGalerias(
    lista
) {

    const grid =
        document.getElementById(
            "adminGalleryGrid"
        );


    if (!grid) {

        return;

    }


    if (!lista.length) {

        grid.innerHTML = `

            <div
                class="admin-empty-card">

                <div>
                    ▧
                </div>

                <h3>
                    Nenhuma galeria criada
                </h3>

                <p>
                    Crie uma galeria para começar
                    a disponibilizar fotos aos clientes.
                </p>

            </div>

        `;

        return;

    }


    grid.innerHTML =
        lista.map(
            galeria => {

                const cliente =
                    clientes.find(
                        item =>
                            item.id ===
                            galeria.clienteId
                    );


                const nomeCliente =
                    cliente?.nome ||
                    "Cliente";


                return `

                    <article
                        class="admin-gallery-card">

                        <div
                            class="admin-gallery-cover">

                            ${
                                galeria.capa
                                    ? `
                                        <img
                                            src="${escapeAttribute(
                                                galeria.capa
                                            )}"
                                            alt="${escapeAttribute(
                                                galeria.nome ||
                                                "Galeria"
                                            )}">
                                      `
                                    : `
                                        <div
                                            style="
                                            width:100%;
                                            height:100%;
                                            display:flex;
                                            align-items:center;
                                            justify-content:center;
                                            color:white;
                                            font-size:35px;
                                            ">

                                            📸

                                        </div>
                                      `
                            }

                        </div>


                        <div
                            class="admin-gallery-information">

                            <span>
                                ${escapeHTML(
                                    nomeCliente
                                )}
                            </span>

                            <h3>
                                ${escapeHTML(
                                    galeria.nome ||
                                    "Galeria sem nome"
                                )}
                            </h3>

                            <p>
                                ${
                                    galeria.totalFotos ||
                                    0
                                }
                                fotos
                            </p>


                            <div
                                class="admin-gallery-actions">

                                <button
                                    type="button"
                                    data-gallery-id="${galeria.id}">

                                    Abrir

                                </button>

                                <button
                                    type="button"
                                    data-gallery-delete="${galeria.id}">

                                    Excluir

                                </button>

                            </div>

                        </div>

                    </article>

                `;

            }
        ).join("");

}


/* =========================================================
   EVENTOS
========================================================= */

async function carregarEventos() {

    try {

        const resultado =
            await getDocs(
                collection(
                    db,
                    "eventos"
                )
            );


        eventos =
            resultado.docs.map(
                documento => ({
                    id: documento.id,
                    ...documento.data()
                })
            );


        renderizarEventos(
            eventos
        );


    } catch (error) {

        console.error(
            "Erro ao carregar eventos:",
            error
        );

        eventos = [];

        renderizarEventos([]);

    }

}


/* =========================================================
   RENDERIZAR EVENTOS
========================================================= */

function renderizarEventos(
    lista
) {

    const container =
        document.getElementById(
            "adminEventList"
        );


    if (!container) {

        return;

    }


    if (!lista.length) {

        container.innerHTML = `

            <div
                class="admin-empty-card compact">

                <div>
                    ◷
                </div>

                <h3>
                    Nenhum evento registrado
                </h3>

                <p>
                    Os próximos eventos aparecerão aqui.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        lista.map(
            evento => {

                const data =
                    formatarData(
                        evento.data
                    );


                return `

                    <div
                        class="admin-event-item">

                        <div
                            class="admin-event-information">

                            <div
                                class="admin-event-date">

                                <strong>
                                    ${data.dia}
                                </strong>

                                <span>
                                    ${data.mes}
                                </span>

                            </div>


                            <div>

                                <h3>
                                    ${escapeHTML(
                                        evento.nome ||
                                        "Evento"
                                    )}
                                </h3>

                                <p>
                                    ${escapeHTML(
                                        evento.local ||
                                        "Local não informado"
                                    )}
                                </p>

                            </div>

                        </div>


                        <span
                            class="admin-event-status">

                            ${escapeHTML(
                                evento.status ||
                                "Agendado"
                            )}

                        </span>

                    </div>

                `;

            }
        ).join("");

}


/* =========================================================
   DASHBOARD
========================================================= */

function atualizarDashboard() {

    if (totalClientes) {

        totalClientes.textContent =
            clientes.length;

    }


    if (totalGalerias) {

        totalGalerias.textContent =
            galerias.length;

    }


    if (totalEventos) {

        totalEventos.textContent =
            eventos.length;

    }


    /*
     * A quantidade de fotos será atualizada
     * conforme as fotos forem adicionadas
     * às galerias.
     */

    let fotos =
        0;


    galerias.forEach(
        galeria => {

            fotos +=
                Number(
                    galeria.totalFotos || 0
                );

        }
    );


    if (totalFotosElement) {

        totalFotosElement.textContent =
            fotos;

    }

}


/* =========================================================
   NOVO CLIENTE
========================================================= */

if (newClientButton) {

    newClientButton.addEventListener(
        "click",
        () => {

            abrirModal(
                clientModal
            );

        }
    );

}


/* =========================================================
   NOVA GALERIA
========================================================= */

if (newGalleryButton) {

    newGalleryButton.addEventListener(
        "click",
        () => {

            preencherSelectClientes(
                clientes
            );

            abrirModal(
                galleryModal
            );

        }
    );

}


/* =========================================================
   ABRIR MODAL
========================================================= */

function abrirModal(
    modal
) {

    if (!modal) {

        return;

    }


    modal.classList.add(
        "active"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   FECHAR MODAL
========================================================= */

function fecharModal(
    modal
) {

    if (!modal) {

        return;

    }


    modal.classList.remove(
        "active"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    if (
        !clientModal?.classList.contains(
            "active"
        ) &&
        !galleryModal?.classList.contains(
            "active"
        )
    ) {

        document.body.style.overflow =
            "";

    }

}


/* =========================================================
   FECHAR CLIENTE
========================================================= */

if (closeClientModal) {

    closeClientModal.addEventListener(
        "click",
        () => {

            fecharModal(
                clientModal
            );

        }
    );

}


if (clientModalOverlay) {

    clientModalOverlay.addEventListener(
        "click",
        () => {

            fecharModal(
                clientModal
            );

        }
    );

}


/* =========================================================
   FECHAR GALERIA
========================================================= */

if (closeGalleryModal) {

    closeGalleryModal.addEventListener(
        "click",
        () => {

            fecharModal(
                galleryModal
            );

        }
    );

}


if (galleryModalOverlay) {

    galleryModalOverlay.addEventListener(
        "click",
        () => {

            fecharModal(
                galleryModal
            );

        }
    );

}


/* =========================================================
   CADASTRAR CLIENTE
========================================================= */

if (clientForm) {

    clientForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            limparMensagem(
                clientFormMessage
            );


            const nome =
                document
                    .getElementById(
                        "clientFullName"
                    )
                    ?.value
                    .trim();


            const email =
                document
                    .getElementById(
                        "clientEmailInput"
                    )
                    ?.value
                    .trim()
                    .toLowerCase();


            const evento =
                document
                    .getElementById(
                        "clientEvent"
                    )
                    ?.value
                    .trim();


            const dataEvento =
                document
                    .getElementById(
                        "clientEventDate"
                    )
                    ?.value;


            if (!nome || !email) {

                mostrarMensagem(
                    clientFormMessage,
                    "Preencha nome e e-mail.",
                    false
                );

                return;

            }


            const botao =
                clientForm.querySelector(
                    "button[type='submit']"
                );


            bloquearBotao(
                botao,
                "Cadastrando..."
            );


            try {

                await addDoc(
                    collection(
                        db,
                        "clientes"
                    ),
                    {

                        nome,

                        email,

                        evento:
                            evento || "",

                        dataEvento:
                            dataEvento || "",

                        status:
                            "ativo",

                        createdAt:
                            serverTimestamp()

                    }
                );


                mostrarMensagem(
                    clientFormMessage,
                    "Cliente cadastrado com sucesso!",
                    true
                );


                clientForm.reset();


                await carregarClientes();

                atualizarDashboard();


                setTimeout(
                    () => {

                        fecharModal(
                            clientModal
                        );

                        limparMensagem(
                            clientFormMessage
                        );

                    },
                    1000
                );


            } catch (error) {

                console.error(
                    "Erro ao cadastrar cliente:",
                    error
                );


                mostrarMensagem(
                    clientFormMessage,
                    "Não foi possível cadastrar o cliente. Verifique as regras do Firestore.",
                    false
                );

            } finally {

                desbloquearBotao(
                    botao,
                    "Cadastrar cliente"
                );

            }

        }
    );

}


/* =========================================================
   CRIAR GALERIA
========================================================= */

if (galleryForm) {

    galleryForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            limparMensagem(
                galleryFormMessage
            );


            const nome =
                document
                    .getElementById(
                        "galleryName"
                    )
                    ?.value
                    .trim();


            const clienteId =
                galleryClient?.value;


            if (!nome || !clienteId) {

                mostrarMensagem(
                    galleryFormMessage,
                    "Informe o nome da galeria e selecione o cliente.",
                    false
                );

                return;

            }


            const botao =
                galleryForm.querySelector(
                    "button[type='submit']"
                );


            bloquearBotao(
                botao,
                "Criando..."
            );


            try {

                await addDoc(
                    collection(
                        db,
                        "galerias"
                    ),
                    {

                        nome,

                        clienteId,

                        totalFotos:
                            0,

                        capa:
                            "",

                        createdAt:
                            serverTimestamp()

                    }
                );


                mostrarMensagem(
                    galleryFormMessage,
                    "Galeria criada com sucesso!",
                    true
                );


                galleryForm.reset();


                await carregarGalerias();

                atualizarDashboard();


                setTimeout(
                    () => {

                        fecharModal(
                            galleryModal
                        );

                        limparMensagem(
                            galleryFormMessage
                        );

                    },
                    1000
                );


            } catch (error) {

                console.error(
                    "Erro ao criar galeria:",
                    error
                );


                mostrarMensagem(
                    galleryFormMessage,
                    "Não foi possível criar a galeria. Verifique o Firestore.",
                    false
                );

            } finally {

                desbloquearBotao(
                    botao,
                    "Criar galeria"
                );

            }

        }
    );

}


/* =========================================================
   BUSCA DE CLIENTES
========================================================= */

if (clientSearch) {

    clientSearch.addEventListener(
        "input",
        () => {

            const termo =
                clientSearch.value
                    .toLowerCase()
                    .trim();


            if (!termo) {

                renderizarClientes(
                    clientes
                );

                return;

            }


            const filtrados =
                clientes.filter(
                    cliente => {

                        const nome =
                            (
                                cliente.nome ||
                                ""
                            ).toLowerCase();


                        const email =
                            (
                                cliente.email ||
                                ""
                            ).toLowerCase();


                        return (
                            nome.includes(
                                termo
                            ) ||
                            email.includes(
                                termo
                            )
                        );

                    }
                );


            renderizarClientes(
                filtrados
            );

        }
    );

}


/* =========================================================
   MENU MOBILE
========================================================= */

if (
    adminMenuButton &&
    adminSidebar
) {

    adminMenuButton.addEventListener(
        "click",
        () => {

            adminSidebar.classList.toggle(
                "open"
            );

        }
    );

}


/* =========================================================
   FECHAR MENU MOBILE
========================================================= */

document.addEventListener(
    "click",
    event => {

        if (
            window.innerWidth > 850 ||
            !adminSidebar ||
            !adminSidebar.classList.contains(
                "open"
            )
        ) {

            return;

        }


        const dentroMenu =
            adminSidebar.contains(
                event.target
            );


        const botaoMenu =
            adminMenuButton &&
            adminMenuButton.contains(
                event.target
            );


        if (
            !dentroMenu &&
            !botaoMenu
        ) {

            adminSidebar.classList.remove(
                "open"
            );

        }

    }
);


/* =========================================================
   NAVEGAÇÃO
========================================================= */

const navigationLinks =
    document.querySelectorAll(
        ".admin-nav-link"
    );


navigationLinks.forEach(
    link => {

        link.addEventListener(
            "click",
            () => {

                navigationLinks.forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                if (
                    link.getAttribute(
                        "href"
                    )?.startsWith("#")
                ) {

                    link.classList.add(
                        "active"
                    );

                }


                if (
                    window.innerWidth <= 850
                ) {

                    adminSidebar?.classList.remove(
                        "open"
                    );

                }

            }
        );

    }
);


/* =========================================================
   LOGOUT
========================================================= */

if (adminLogout) {

    adminLogout.addEventListener(
        "click",
        async () => {

            const confirmar =
                window.confirm(
                    "Deseja realmente sair do painel administrativo?"
                );


            if (!confirmar) {

                return;

            }


            try {

                await signOut(
                    auth
                );


                window.location.replace(
                    "admin-login.html"
                );


            } catch (error) {

                console.error(
                    "Erro ao sair:",
                    error
                );

                alert(
                    "Não foi possível sair. Tente novamente."
                );

            }

        }
    );

}


/* =========================================================
   TECLA ESC FECHA MODAIS
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !== "Escape"
        ) {

            return;

        }


        fecharModal(
            clientModal
        );

        fecharModal(
            galleryModal
        );

    }
);


/* =========================================================
   MENSAGENS
========================================================= */

function mostrarMensagem(
    elemento,
    mensagem,
    sucesso
) {

    if (!elemento) {

        return;

    }


    elemento.textContent =
        mensagem;


    elemento.classList.toggle(
        "success",
        sucesso
    );

}


function limparMensagem(
    elemento
) {

    if (!elemento) {

        return;

    }


    elemento.textContent =
        "";

    elemento.classList.remove(
        "success"
    );

}


/* =========================================================
   BOTÃO
========================================================= */

function bloquearBotao(
    botao,
    texto
) {

    if (!botao) {

        return;

    }


    botao.disabled =
        true;


    botao.dataset.originalText =
        botao.textContent;


    botao.textContent =
        texto;

}


function desbloquearBotao(
    botao,
    texto
) {

    if (!botao) {

        return;

    }


    botao.disabled =
        false;


    botao.textContent =
        texto ||
        botao.dataset.originalText ||
        "Enviar";

}


/* =========================================================
   DATA
========================================================= */

function formatarData(
    valor
) {

    if (!valor) {

        return {

            dia: "--",

            mes: "---"

        };

    }


    let data;


    try {

        if (
            typeof valor ===
            "object" &&
            typeof valor.toDate ===
            "function"
        ) {

            data =
                valor.toDate();

        } else {

            data =
                new Date(valor);

        }


        if (
            Number.isNaN(
                data.getTime()
            )
        ) {

            throw new Error(
                "Data inválida"
            );

        }

    } catch {

        return {

            dia: "--",

            mes: "---"

        };

    }


    const meses = [
        "JAN",
        "FEV",
        "MAR",
        "ABR",
        "MAI",
        "JUN",
        "JUL",
        "AGO",
        "SET",
        "OUT",
        "NOV",
        "DEZ"
    ];


    return {

        dia:
            String(
                data.getDate()
            ).padStart(
                2,
                "0"
            ),

        mes:
            meses[
                data.getMonth()
            ]

    };

}


/* =========================================================
   SEGURANÇA — HTML
========================================================= */

function escapeHTML(
    valor
) {

    return String(
        valor ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   SEGURANÇA — ATRIBUTO
========================================================= */

function escapeAttribute(
    valor
) {

    return escapeHTML(
        valor
    );

}


/* =========================================================
   ERRO
========================================================= */

function mostrarErro(
    mensagem
) {

    console.error(
        mensagem
    );

}


/* =========================================================
   FINAL
========================================================= */

console.log(
    "Suas Memórias Aqui — Painel administrativo carregado."
);
