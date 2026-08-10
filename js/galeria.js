```javascript
/* =========================================================
   SUAS MEMÓRIAS AQUI
   GALERIA.JS
   Galeria privada do cliente
========================================================= */

import {
    auth,
    db
} from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    doc,
    getDoc,
    collection,
    query,
    where,
    getDocs,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


/* =========================================================
   ELEMENTOS
========================================================= */

const galleryLoading =
    document.getElementById(
        "galleryLoading"
    );

const galleryContent =
    document.getElementById(
        "galleryContent"
    );

const galleryError =
    document.getElementById(
        "galleryError"
    );

const galleryErrorMessage =
    document.getElementById(
        "galleryErrorMessage"
    );

const galleryTitle =
    document.getElementById(
        "galleryTitle"
    );

const galleryDescription =
    document.getElementById(
        "galleryDescription"
    );

const galleryPhotoCount =
    document.getElementById(
        "galleryPhotoCount"
    );

const galleryDate =
    document.getElementById(
        "galleryDate"
    );

const mediaGrid =
    document.getElementById(
        "mediaGrid"
    );

const emptyMedia =
    document.getElementById(
        "emptyMedia"
    );

const galleryUserName =
    document.getElementById(
        "galleryUserName"
    );

const galleryAvatar =
    document.getElementById(
        "galleryAvatar"
    );

const lightbox =
    document.getElementById(
        "lightbox"
    );

const lightboxBackground =
    document.getElementById(
        "lightboxBackground"
    );

const lightboxMedia =
    document.getElementById(
        "lightboxMedia"
    );

const lightboxClose =
    document.getElementById(
        "lightboxClose"
    );

const lightboxPrevious =
    document.getElementById(
        "lightboxPrevious"
    );

const lightboxNext =
    document.getElementById(
        "lightboxNext"
    );

const lightboxTitle =
    document.getElementById(
        "lightboxTitle"
    );

const lightboxPosition =
    document.getElementById(
        "lightboxPosition"
    );

const lightboxDownload =
    document.getElementById(
        "lightboxDownload"
    );

const selectPhotos =
    document.getElementById(
        "selectPhotos"
    );

const downloadSelected =
    document.getElementById(
        "downloadSelected"
    );

const selectionBar =
    document.getElementById(
        "selectionBar"
    );

const selectedCount =
    document.getElementById(
        "selectedCount"
    );

const cancelSelection =
    document.getElementById(
        "cancelSelection"
    );

const downloadSelectionBottom =
    document.getElementById(
        "downloadSelectionBottom"
    );


/* =========================================================
   ESTADO
========================================================= */

let currentUser = null;

let currentGallery = null;

let mediaItems = [];

let visibleMediaItems = [];

let currentLightboxIndex = 0;

let selectionMode = false;

const selectedMedia =
    new Set();

let currentFilter = "all";


/* =========================================================
   ID DA GALERIA
========================================================= */

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const galleryId =
    urlParams.get(
        "id"
    );


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

if (!galleryId) {

    mostrarErro(
        "Nenhuma galeria foi especificada."
    );

} else {

    iniciarGaleria();

}


/* =========================================================
   AUTENTICAÇÃO
========================================================= */

function iniciarGaleria() {

    onAuthStateChanged(
        auth,
        async (user) => {

            if (!user) {

                window.location.replace(
                    "login.html"
                );

                return;

            }


            currentUser =
                user;


            carregarUsuario(
                user
            );


            await carregarGaleria();

        }
    );

}


/* =========================================================
   USUÁRIO
========================================================= */

function carregarUsuario(
    user
) {

    const nome =
        user.displayName ||
        user.email?.split("@")[0] ||
        "Cliente";


    const primeiroNome =
        nome
            .trim()
            .split(" ")[0];


    if (galleryUserName) {

        galleryUserName.textContent =
            primeiroNome;

    }


    if (galleryAvatar) {

        if (user.photoURL) {

            galleryAvatar.innerHTML = `
                <img
                    src="${escaparHTML(user.photoURL)}"
                    alt="Foto do cliente"
                >
            `;

        } else {

            galleryAvatar.textContent =
                primeiroNome
                    .charAt(0)
                    .toUpperCase();

        }

    }

}


/* =========================================================
   CARREGAR GALERIA
========================================================= */

async function carregarGaleria() {

    mostrarLoading();


    try {

        /*
         * Primeiro verificamos o documento
         * específico da galeria.
         */

        const galleryRef =
            doc(
                db,
                "galerias",
                galleryId
            );


        const gallerySnapshot =
            await getDoc(
                galleryRef
            );


        if (
            !gallerySnapshot.exists()
        ) {

            mostrarErro(
                "Esta galeria não existe ou foi removida."
            );

            return;

        }


        currentGallery = {

            id:
                gallerySnapshot.id,

            ...gallerySnapshot.data()

        };


        /*
         * SEGURANÇA:
         *
         * A galeria precisa pertencer
         * ao usuário atualmente conectado.
         */

        if (
            currentGallery.clienteId !==
            currentUser.uid
        ) {

            mostrarErro(
                "Você não possui acesso a esta galeria."
            );

            return;

        }


        preencherInformacoesGaleria();


        await carregarMidias();


    } catch (error) {

        console.error(
            "Erro ao carregar galeria:",
            error
        );


        if (
            error.code ===
            "permission-denied"
        ) {

            mostrarErro(
                "O acesso a esta galeria não foi autorizado."
            );

        } else {

            mostrarErro(
                "Não foi possível carregar sua galeria. Tente novamente."
            );

        }

    }

}


/* =========================================================
   INFORMAÇÕES DA GALERIA
========================================================= */

function preencherInformacoesGaleria() {

    const titulo =
        currentGallery.titulo ||
        currentGallery.title ||
        "Minha galeria";


    const descricao =
        currentGallery.descricao ||
        currentGallery.description ||
        "Suas memórias especiais.";


    galleryTitle.textContent =
        titulo;


    galleryDescription.textContent =
        descricao;


    const data =
        formatarData(
            currentGallery.data
        );


    if (galleryDate) {

        galleryDate.textContent =
            data;

    }


    document.title =
        `${titulo} | Suas Memórias Aqui`;

}


/* =========================================================
   CARREGAR MÍDIAS
========================================================= */

async function carregarMidias() {

    try {

        const mediaRef =
            collection(
                db,
                "galerias",
                galleryId,
                "midias"
            );


        let resultado;


        try {

            const consulta =
                query(
                    mediaRef,
                    orderBy(
                        "ordem",
                        "asc"
                    )
                );


            resultado =
                await getDocs(
                    consulta
                );


        } catch {

            /*
             * Caso os documentos não possuam
             * campo "ordem", fazemos uma
             * consulta simples.
             */

            resultado =
                await getDocs(
                    mediaRef
                );

        }


        mediaItems = [];


        resultado.forEach(
            documento => {

                const dados =
                    documento.data();


                mediaItems.push({

                    id:
                        documento.id,

                    ...dados

                });

            }
        );


        /*
         * Caso a coleção "midias" esteja vazia,
         * também verificamos uma possível
         * lista de mídias dentro da galeria.
         */

        if (
            mediaItems.length ===
            0 &&
            Array.isArray(
                currentGallery.midias
            )
        ) {

            mediaItems =
                currentGallery.midias
                    .map(
                        (item, index) => ({

                            id:
                                item.id ||
                                `media-${index}`,

                            ...item

                        })
                    );

        }


        atualizarContador();


        esconderLoading();


        if (
            mediaItems.length ===
            0
        ) {

            mostrarGaleriaVazia();

            return;

        }


        galleryContent.hidden =
            false;


        aplicarFiltro(
            currentFilter
        );


    } catch (error) {

        console.error(
            "Erro ao carregar mídias:",
            error
        );


        mostrarErro(
            "Não foi possível carregar as fotografias desta galeria."
        );

    }

}


/* =========================================================
   RENDERIZAR MÍDIAS
========================================================= */

function renderizarMidias(
    itens
) {

    mediaGrid.innerHTML =
        "";


    if (
        itens.length ===
        0
    ) {

        mediaGrid.style.display =
            "none";

        emptyMedia.hidden =
            false;

        return;

    }


    mediaGrid.style.display =
        "grid";

    emptyMedia.hidden =
        true;


    itens.forEach(
        (item, index) => {

            const elemento =
                criarItemMedia(
                    item,
                    index
                );


            mediaGrid.appendChild(
                elemento
            );

        }
    );

}


/* =========================================================
   CRIAR ITEM
========================================================= */

function criarItemMedia(
    item,
    index
) {

    const wrapper =
        document.createElement(
            "article"
        );


    wrapper.className =
        "media-item";


    wrapper.dataset.id =
        item.id;


    const tipo =
        obterTipoMedia(
            item
        );


    const url =
        item.url ||
        item.src ||
        item.downloadURL ||
        item.link ||
        "";


    if (!url) {

        return wrapper;

    }


    let mediaElement;


    if (
        tipo ===
        "video"
    ) {

        mediaElement =
            document.createElement(
                "video"
            );

        mediaElement.muted =
            true;

        mediaElement.playsInline =
            true;

        mediaElement.preload =
            "metadata";

    } else {

        mediaElement =
            document.createElement(
                "img"
            );

        mediaElement.loading =
            "lazy";

    }


    mediaElement.src =
        url;


    mediaElement.alt =
        item.nome ||
        item.titulo ||
        `Fotografia ${index + 1}`;


    wrapper.appendChild(
        mediaElement
    );


    /*
     * Checkbox de seleção
     */

    const checkbox =
        document.createElement(
            "input"
        );


    checkbox.type =
        "checkbox";


    checkbox.className =
        "media-select";


    checkbox.dataset.id =
        item.id;


    checkbox.checked =
        selectedMedia.has(
            item.id
        );


    checkbox.addEventListener(
        "click",
        event => {

            event.stopPropagation();

        }
    );


    checkbox.addEventListener(
        "change",
        () => {

            alterarSelecao(
                item.id,
                checkbox.checked
            );

        }
    );


    if (
        !selectionMode
    ) {

        checkbox.style.display =
            "none";

    }


    wrapper.appendChild(
        checkbox
    );


    /*
     * Ícone de vídeo
     */

    if (
        tipo ===
        "video"
    ) {

        const videoIcon =
            document.createElement(
                "div"
            );


        videoIcon.className =
            "media-video-icon";


        videoIcon.textContent =
            "▶";


        wrapper.appendChild(
            videoIcon
        );

    }


    /*
     * Overlay
     */

    const overlay =
        document.createElement(
            "div"
        );


    overlay.className =
        "media-item-overlay";


    const viewIcon =
        document.createElement(
            "div"
        );


    viewIcon.className =
        "media-view-icon";


    viewIcon.textContent =
        tipo ===
        "video"
            ? "▶"
            : "⌕";


    overlay.appendChild(
        viewIcon
    );


    wrapper.appendChild(
        overlay
    );


    /*
     * Clique
     */

    wrapper.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                checkbox
            ) {

                return;

            }


            if (
                selectionMode
            ) {

                checkbox.checked =
                    !checkbox.checked;


                alterarSelecao(
                    item.id,
                    checkbox.checked
                );


                return;

            }


            abrirLightbox(
                index
            );

        }
    );


    return wrapper;

}


/* =========================================================
   TIPO DA MÍDIA
========================================================= */

function obterTipoMedia(
    item
) {

    const tipo =
        (
            item.tipo ||
            item.type ||
            ""
        )
            .toString()
            .toLowerCase();


    if (
        tipo ===
        "video" ||
        tipo ===
        "mp4" ||
        tipo ===
        "mov"
    ) {

        return "video";

    }


    const url =
        (
            item.url ||
            item.src ||
            ""
        )
            .toString()
            .toLowerCase();


    if (
        url.includes(
            ".mp4"
        ) ||
        url.includes(
            ".webm"
        ) ||
        url.includes(
            ".mov"
        )
    ) {

        return "video";

    }


    return "foto";

}


/* =========================================================
   FILTROS
========================================================= */

const filterButtons =
    document.querySelectorAll(
        ".gallery-filter-button"
    );


filterButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                filterButtons.forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                currentFilter =
                    button.dataset.filter ||
                    "all";


                aplicarFiltro(
                    currentFilter
                );

            }
        );

    }
);


/* =========================================================
   APLICAR FILTRO
========================================================= */

function aplicarFiltro(
    filtro
) {

    if (
        filtro ===
        "all"
    ) {

        visibleMediaItems =
            [...mediaItems];

    } else {

        visibleMediaItems =
            mediaItems.filter(
                item =>
                    obterTipoMedia(
                        item
                    ) === filtro
            );

    }


    renderizarMidias(
        visibleMediaItems
    );

}


/* =========================================================
   CONTADOR
========================================================= */

function atualizarContador() {

    if (
        galleryPhotoCount
    ) {

        galleryPhotoCount.textContent =
            mediaItems.length;

    }

}


/* =========================================================
   LIGHTBOX
========================================================= */

function abrirLightbox(
    index
) {

    if (
        !visibleMediaItems.length
    ) {

        return;

    }


    currentLightboxIndex =
        index;


    atualizarLightbox();


    lightbox.classList.add(
        "open"
    );


    lightbox.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   ATUALIZAR LIGHTBOX
========================================================= */

function atualizarLightbox() {

    const item =
        visibleMediaItems[
            currentLightboxIndex
        ];


    if (!item) {
        return;
    }


    const tipo =
        obterTipoMedia(
            item
        );


    const url =
        item.url ||
        item.src ||
        item.downloadURL ||
        item.link ||
        "";


    lightboxMedia.innerHTML =
        "";


    let element;


    if (
        tipo ===
        "video"
    ) {

        element =
            document.createElement(
                "video"
            );


        element.controls =
            true;

        element.autoplay =
            true;

        element.playsInline =
            true;

    } else {

        element =
            document.createElement(
                "img"
            );

    }


    element.src =
        url;


    element.alt =
        item.nome ||
        item.titulo ||
        "Fotografia";


    lightboxMedia.appendChild(
        element
    );


    lightboxTitle.textContent =
        item.nome ||
        item.titulo ||
        "Fotografia";


    lightboxPosition.textContent =
        `${currentLightboxIndex + 1} / ${visibleMediaItems.length}`;

}


/* =========================================================
   PRÓXIMA
========================================================= */

if (lightboxNext) {

    lightboxNext.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            if (
                currentLightboxIndex <
                visibleMediaItems.length - 1
            ) {

                currentLightboxIndex++;

            } else {

                currentLightboxIndex =
                    0;

            }


            atualizarLightbox();

        }
    );

}


/* =========================================================
   ANTERIOR
========================================================= */

if (lightboxPrevious) {

    lightboxPrevious.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            if (
                currentLightboxIndex >
                0
            ) {

                currentLightboxIndex--;

            } else {

                currentLightboxIndex =
                    visibleMediaItems.length - 1;

            }


            atualizarLightbox();

        }
    );

}


/* =========================================================
   FECHAR LIGHTBOX
========================================================= */

function fecharLightbox() {

    lightbox.classList.remove(
        "open"
    );


    lightbox.setAttribute(
        "aria-hidden",
        "true"
    );


    lightboxMedia.innerHTML =
        "";


    document.body.style.overflow =
        "";

}


if (lightboxClose) {

    lightboxClose.addEventListener(
        "click",
        fecharLightbox
    );

}


if (lightboxBackground) {

    lightboxBackground.addEventListener(
        "click",
        fecharLightbox
    );

}


/* =========================================================
   TECLADO
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            !lightbox.classList.contains(
                "open"
            )
        ) {

            return;

        }


        if (
            event.key ===
            "Escape"
        ) {

            fecharLightbox();

        }


        if (
            event.key ===
            "ArrowRight"
        ) {

            if (
                currentLightboxIndex <
                visibleMediaItems.length - 1
            ) {

                currentLightboxIndex++;

            } else {

                currentLightboxIndex =
                    0;

            }


            atualizarLightbox();

        }


        if (
            event.key ===
            "ArrowLeft"
        ) {

            if (
                currentLightboxIndex >
                0
            ) {

                currentLightboxIndex--;

            } else {

                currentLightboxIndex =
                    visibleMediaItems.length - 1;

            }


            atualizarLightbox();

        }

    }
);


/* =========================================================
   SELEÇÃO
========================================================= */

if (selectPhotos) {

    selectPhotos.addEventListener(
        "click",
        () => {

            selectionMode =
                !selectionMode;


            selectPhotos.textContent =
                selectionMode
                    ? "Cancelar seleção"
                    : "Selecionar";


            atualizarInterfaceSelecao();

        }
    );

}


/* =========================================================
   ALTERAR SELEÇÃO
========================================================= */

function alterarSelecao(
    id,
    selecionado
) {

    if (
        selecionado
    ) {

        selectedMedia.add(
            id
        );

    } else {

        selectedMedia.delete(
            id
        );

    }


    atualizarInterfaceSelecao();


    const card =
        mediaGrid.querySelector(
            `[data-id="${CSS.escape(id)}"]`
        );


    if (card) {

        card.classList.toggle(
            "selected",
            selecionado
        );

    }

}


/* =========================================================
   INTERFACE DE SELEÇÃO
========================================================= */

function atualizarInterfaceSelecao() {

    const quantidade =
        selectedMedia.size;


    if (selectedCount) {

        selectedCount.textContent =
            quantidade;

    }


    if (downloadSelected) {

        downloadSelected.disabled =
            quantidade === 0;

    }


    if (
        downloadSelectionBottom
    ) {

        downloadSelectionBottom.disabled =
            quantidade === 0;

    }


    if (
        selectionBar
    ) {

        if (
            selectionMode &&
            quantidade > 0
        ) {

            selectionBar.classList.add(
                "open"
            );

            selectionBar.setAttribute(
                "aria-hidden",
                "false"
            );

        } else {

            selectionBar.classList.remove(
                "open"
            );

            selectionBar.setAttribute(
                "aria-hidden",
                "true"
            );

        }

    }


    /*
     * Atualiza checkboxes.
     */

    document
        .querySelectorAll(
            ".media-select"
        )
        .forEach(
            checkbox => {

                checkbox.style.display =
                    selectionMode
                        ? "block"
                        : "none";

                checkbox.checked =
                    selectedMedia.has(
                        checkbox.dataset.id
                    );

            }
        );

}


/* =========================================================
   CANCELAR SELEÇÃO
========================================================= */

if (cancelSelection) {

    cancelSelection.addEventListener(
        "click",
        () => {

            selectedMedia.clear();

            selectionMode =
                false;


            if (selectPhotos) {

                selectPhotos.textContent =
                    "Selecionar";

            }


            atualizarInterfaceSelecao();


            renderizarMidias(
                visibleMediaItems
            );

        }
    );

}


/* =========================================================
   DOWNLOAD INDIVIDUAL
========================================================= */

if (lightboxDownload) {

    lightboxDownload.addEventListener(
        "click",
        async () => {

            const item =
                visibleMediaItems[
                    currentLightboxIndex
                ];


            if (!item) {
                return;
            }


            await baixarArquivo(
                item
            );

        }
    );

}


/* =========================================================
   DOWNLOAD SELECIONADAS
========================================================= */

if (downloadSelected) {

    downloadSelected.addEventListener(
        "click",
        baixarSelecionadas
    );

}


if (
    downloadSelectionBottom
) {

    downloadSelectionBottom.addEventListener(
        "click",
        baixarSelecionadas
    );

}


/* =========================================================
   BAIXAR SELECIONADAS
========================================================= */

async function baixarSelecionadas() {

    const itens =
        mediaItems.filter(
            item =>
                selectedMedia.has(
                    item.id
                )
        );


    if (
        itens.length ===
        0
    ) {

        return;

    }


    for (
        const item of itens
    ) {

        await baixarArquivo(
            item
        );

        /*
         * Pequena pausa para evitar
         * bloquear vários downloads
         * simultaneamente.
         */

        await esperar(
            350
        );

    }

}


/* =========================================================
   BAIXAR ARQUIVO
========================================================= */

async function baixarArquivo(
    item
) {

    const url =
        item.url ||
        item.src ||
        item.downloadURL ||
        item.link ||
        "";


    if (!url) {

        return;

    }


    const nome =
        item.nome ||
        item.titulo ||
        `suas-memorias-${Date.now()}`;


    try {

        /*
         * Tentamos buscar o arquivo
         * para criar um download local.
         */

        const resposta =
            await fetch(
                url
            );


        if (
            !resposta.ok
        ) {

            throw new Error(
                "Não foi possível baixar o arquivo."
            );

        }


        const blob =
            await resposta.blob();


        const blobUrl =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            blobUrl;


        link.download =
            limparNomeArquivo(
                nome
            );


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        URL.revokeObjectURL(
            blobUrl
        );


    } catch (error) {

        /*
         * Fallback:
         * abre o arquivo caso o servidor
         * bloqueie o download via fetch.
         */

        console.warn(
            "Download direto bloqueado. Abrindo arquivo:",
            error
        );


        window.open(
            url,
            "_blank",
            "noopener,noreferrer"
        );

    }

}


/* =========================================================
   GALERIA VAZIA
========================================================= */

function mostrarGaleriaVazia() {

    galleryContent.hidden =
        false;


    mediaGrid.style.display =
        "none";


    emptyMedia.hidden =
        false;

}


/* =========================================================
   LOADING
========================================================= */

function mostrarLoading() {

    if (galleryLoading) {

        galleryLoading.style.display =
            "flex";

    }


    if (galleryContent) {

        galleryContent.hidden =
            true;

    }


    if (galleryError) {

        galleryError.hidden =
            true;

    }

}


function esconderLoading() {

    if (galleryLoading) {

        galleryLoading.style.display =
            "none";

    }

}


/* =========================================================
   ERRO
========================================================= */

function mostrarErro(
    mensagem
) {

    if (galleryLoading) {

        galleryLoading.style.display =
            "none";

    }


    if (galleryContent) {

        galleryContent.hidden =
            true;

    }


    if (galleryErrorMessage) {

        galleryErrorMessage.textContent =
            mensagem;

    }


    if (galleryError) {

        galleryError.hidden =
            false;

    }

}


/* =========================================================
   DATA
========================================================= */

function formatarData(
    valor
) {

    if (!valor) {

        return "";

    }


    try {

        if (
            typeof valor.toDate ===
            "function"
        ) {

            return valor
                .toDate()
                .toLocaleDateString(
                    "pt-BR"
                );

        }


        const data =
            new Date(
                valor
            );


        if (
            Number.isNaN(
                data.getTime()
            )
        ) {

            return "";

        }


        return data.toLocaleDateString(
            "pt-BR"
        );


    } catch {

        return "";

    }

}


/* =========================================================
   LIMPAR NOME
========================================================= */

function limparNomeArquivo(
    nome
) {

    return String(nome)
        .trim()
        .replace(
            /[<>:"/\\|?*]+/g,
            "-"
        )
        .replace(
            /\s+/g,
            "-"
        );

}


/* =========================================================
   ESPERAR
========================================================= */

function esperar(
    milissegundos
) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                milissegundos
            )
    );

}


/* =========================================================
   SEGURANÇA HTML
========================================================= */

function escaparHTML(
    valor
) {

    if (
        valor === null ||
        valor === undefined
    ) {

        return "";

    }


    return String(valor)
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
   SWIPE NO CELULAR
========================================================= */

let touchStartX = 0;

let touchEndX = 0;


lightbox?.addEventListener(
    "touchstart",
    event => {

        touchStartX =
            event.changedTouches[0]
                .screenX;

    },
    {
        passive: true
    }
);


lightbox?.addEventListener(
    "touchend",
    event => {

        touchEndX =
            event.changedTouches[0]
                .screenX;


        tratarSwipe();

    },
    {
        passive: true
    }
);


function tratarSwipe() {

    const distancia =
        touchEndX -
        touchStartX;


    if (
        Math.abs(
            distancia
        ) < 50
    ) {

        return;

    }


    if (
        distancia < 0
    ) {

        if (
            currentLightboxIndex <
            visibleMediaItems.length - 1
        ) {

            currentLightboxIndex++;

        } else {

            currentLightboxIndex =
                0;

        }

    } else {

        if (
            currentLightboxIndex >
            0
        ) {

            currentLightboxIndex--;

        } else {

            currentLightboxIndex =
                visibleMediaItems.length - 1;

        }

    }


    atualizarLightbox();

}


/* =========================================================
   FINAL
========================================================= */

console.log(
    "Suas Memórias Aqui — Galeria carregada."
);
```
