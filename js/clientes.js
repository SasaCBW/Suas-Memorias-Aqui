```javascript
/* =========================================================
   SUAS MEMÓRIAS AQUI
   CLIENTE.JS

   Área exclusiva do cliente
   Firebase Authentication + Firestore + Storage
========================================================= */


/* =========================================================
   FIREBASE
========================================================= */

import {
    auth,
    db
} from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


/* =========================================================
   ELEMENTOS
========================================================= */

const clientName =
    document.getElementById("clientName");

const heroClientName =
    document.getElementById("heroClientName");

const dropdownClientName =
    document.getElementById("dropdownClientName");

const dropdownClientEmail =
    document.getElementById("dropdownClientEmail");

const clientAvatar =
    document.getElementById("clientAvatar");

const clientAvatarPlaceholder =
    document.getElementById("clientAvatarPlaceholder");

const profileButton =
    document.getElementById("profileButton");

const clientProfile =
    document.querySelector(".client-profile");

const profileDropdown =
    document.getElementById("profileDropdown");

const logoutButton =
    document.getElementById("logoutButton");

const mobileLogoutButton =
    document.getElementById("mobileLogoutButton");

const clientMenuButton =
    document.getElementById("clientMenuButton");

const clientMobileMenu =
    document.getElementById("clientMobileMenu");

const clientGallery =
    document.getElementById("clientGallery");

const galleryLoading =
    document.getElementById("galleryLoading");

const galleryEmpty =
    document.getElementById("galleryEmpty");

const photoCount =
    document.getElementById("photoCount");

const videoCount =
    document.getElementById("videoCount");

const eventDate =
    document.getElementById("eventDate");

const eventDateFull =
    document.getElementById("eventDateFull");

const eventTime =
    document.getElementById("eventTime");

const eventLocation =
    document.getElementById("eventLocation");

const eventService =
    document.getElementById("eventService");

const eventName =
    document.getElementById("eventName");

const downloadAllButton =
    document.getElementById("downloadAllButton");

const lightbox =
    document.getElementById("clientLightbox");

const lightboxImage =
    document.getElementById("lightboxImage");

const lightboxVideo =
    document.getElementById("lightboxVideo");

const lightboxTitle =
    document.getElementById("lightboxTitle");

const lightboxDownload =
    document.getElementById("lightboxDownload");

const lightboxClose =
    document.getElementById("lightboxClose");

const lightboxBackdrop =
    document.getElementById("lightboxBackdrop");

const lightboxPrev =
    document.getElementById("lightboxPrev");

const lightboxNext =
    document.getElementById("lightboxNext");


/* =========================================================
   ESTADO
========================================================= */

let currentUser = null;

let galleryItems = [];

let filteredItems = [];

let currentLightboxIndex = 0;


/* =========================================================
   VERIFICAÇÃO DE LOGIN
========================================================= */

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        /*
         * Se não estiver logado,
         * volta para a página de login.
         */

        window.location.replace("login.html");

        return;
    }


    currentUser = user;


    /*
     * Mostra imediatamente os dados
     * disponíveis no Authentication.
     */

    showUserData(user);


    /*
     * Busca dados complementares
     * no Firestore.
     */

    await loadClientProfile(user.uid);


    /*
     * Carrega a galeria privada.
     */

    await loadClientGallery(user.uid);

});


/* =========================================================
   MOSTRAR DADOS DO USUÁRIO
========================================================= */

function showUserData(user) {

    const displayName =
        user.displayName ||
        user.email?.split("@")[0] ||
        "Cliente";


    const firstName =
        displayName
            .trim()
            .split(" ")[0];


    if (clientName) {

        clientName.textContent =
            firstName;

    }


    if (heroClientName) {

        heroClientName.textContent =
            firstName;

    }


    if (dropdownClientName) {

        dropdownClientName.textContent =
            displayName;

    }


    if (dropdownClientEmail) {

        dropdownClientEmail.textContent =
            user.email || "—";

    }


    /*
     * Foto do Google,
     * caso exista.
     */

    if (user.photoURL && clientAvatar) {

        clientAvatar.src =
            user.photoURL;

        clientAvatar.classList.add(
            "loaded"
        );

        if (clientAvatarPlaceholder) {

            clientAvatarPlaceholder.style.display =
                "none";

        }

    }

}


/* =========================================================
   PERFIL DO CLIENTE — FIRESTORE
========================================================= */

async function loadClientProfile(uid) {

    try {

        /*
         * Estrutura esperada:

         clientes
             └── UID
                 ├── nome
                 ├── email
                 ├── evento
                 ├── dataEvento
                 ├── horario
                 ├── local
                 └── servico
        */


        const clientRef =
            doc(
                db,
                "clientes",
                uid
            );


        const clientSnapshot =
            await getDoc(clientRef);


        if (!clientSnapshot.exists()) {

            console.log(
                "Perfil do cliente ainda não possui dados adicionais."
            );

            return;

        }


        const data =
            clientSnapshot.data();


        /*
         * Nome
         */

        if (data.nome) {

            const firstName =
                data.nome
                    .trim()
                    .split(" ")[0];


            if (clientName) {

                clientName.textContent =
                    firstName;

            }


            if (heroClientName) {

                heroClientName.textContent =
                    firstName;

            }


            if (dropdownClientName) {

                dropdownClientName.textContent =
                    data.nome;

            }

        }


        /*
         * Evento
         */

        if (data.evento && eventName) {

            eventName.textContent =
                data.evento;

        }


        /*
         * Data
         */

        if (data.dataEvento) {

            const formattedDate =
                formatDate(
                    data.dataEvento
                );


            if (eventDate) {

                eventDate.textContent =
                    formattedDate;

            }


            if (eventDateFull) {

                eventDateFull.textContent =
                    formattedDate;

            }

        }


        /*
         * Horário
         */

        if (data.horario && eventTime) {

            eventTime.textContent =
                data.horario;

        }


        /*
         * Local
         */

        if (data.local && eventLocation) {

            eventLocation.textContent =
                data.local;

        }


        /*
         * Serviço
         */

        if (data.servico && eventService) {

            eventService.textContent =
                data.servico;

        }

    } catch (error) {

        console.error(
            "Erro ao carregar perfil:",
            error
        );

    }

}


/* =========================================================
   CARREGAR GALERIA DO CLIENTE
========================================================= */

async function loadClientGallery(uid) {

    try {

        if (galleryLoading) {

            galleryLoading.style.display =
                "flex";

        }


        /*
         * Estrutura esperada:

         fotos
             ├── documento
             │   ├── clientId
             │   ├── url
             │   ├── tipo
             │   ├── titulo
             │   └── createdAt
         */


        const photosRef =
            collection(
                db,
                "fotos"
            );


        const photosQuery =
            query(
                photosRef,
                where(
                    "clientId",
                    "==",
                    uid
                )
            );


        const snapshot =
            await getDocs(
                photosQuery
            );


        galleryItems = [];


        snapshot.forEach((photoDoc) => {

            const data =
                photoDoc.data();


            /*
             * Aceita "foto" ou "video".
             */

            const type =
                data.tipo === "video"
                    ? "video"
                    : "photo";


            if (!data.url) {

                return;

            }


            galleryItems.push({

                id:
                    photoDoc.id,

                url:
                    data.url,

                type:
                    type,

                title:
                    data.titulo ||
                    "Memória",

                createdAt:
                    data.createdAt ||
                    null

            });

        });


        /*
         * Ordenação.
         */

        galleryItems.sort(
            (a, b) => {

                const dateA =
                    a.createdAt?.seconds ||
                    0;

                const dateB =
                    b.createdAt?.seconds ||
                    0;

                return dateB - dateA;

            }
        );


        /*
         * Contadores.
         */

        updateCounters();


        /*
         * Renderização.
         */

        renderGallery(
            "all"
        );


    } catch (error) {

        console.error(
            "Erro ao carregar galeria:",
            error
        );


        showGalleryError();

    } finally {

        if (galleryLoading) {

            galleryLoading.style.display =
                "none";

        }

    }

}


/* =========================================================
   CONTADORES
========================================================= */

function updateCounters() {

    const photos =
        galleryItems.filter(
            item =>
                item.type === "photo"
        ).length;


    const videos =
        galleryItems.filter(
            item =>
                item.type === "video"
        ).length;


    if (photoCount) {

        photoCount.textContent =
            photos;

    }


    if (videoCount) {

        videoCount.textContent =
            videos;

    }

}


/* =========================================================
   RENDERIZAR GALERIA
========================================================= */

function renderGallery(filter = "all") {

    if (!clientGallery) {
        return;
    }


    filteredItems =
        filter === "all"
            ? [...galleryItems]
            : galleryItems.filter(
                item =>
                    item.type === filter
            );


    clientGallery.innerHTML =
        "";


    /*
     * Nenhum conteúdo.
     */

    if (!filteredItems.length) {

        if (galleryEmpty) {

            galleryEmpty.hidden =
                false;

        }


        return;

    }


    if (galleryEmpty) {

        galleryEmpty.hidden =
            true;

    }


    filteredItems.forEach(
        (item, index) => {

            const galleryElement =
                createGalleryElement(
                    item,
                    index
                );


            clientGallery.appendChild(
                galleryElement
            );

        }
    );

}


/* =========================================================
   CRIAR ITEM DA GALERIA
========================================================= */

function createGalleryElement(
    item,
    index
) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "gallery-item";


    article.dataset.type =
        item.type;


    article.dataset.index =
        index;


    /*
     * FOTO
     */

    if (item.type === "photo") {

        const image =
            document.createElement(
                "img"
            );


        image.src =
            item.url;

        image.alt =
            item.title;

        image.loading =
            "lazy";


        article.appendChild(
            image
        );

    }


    /*
     * VÍDEO
     */

    else {

        const video =
            document.createElement(
                "video"
            );


        video.src =
            item.url;

        video.muted =
            true;

        video.playsInline =
            true;

        video.preload =
            "metadata";


        article.appendChild(
            video
        );


        const videoIcon =
            document.createElement(
                "span"
            );


        videoIcon.className =
            "gallery-video-icon";


        videoIcon.innerHTML =
            '<i class="fa-solid fa-play"></i>';


        article.appendChild(
            videoIcon
        );

    }


    /*
     * OVERLAY
     */

    const overlay =
        document.createElement(
            "div"
        );


    overlay.className =
        "gallery-item-overlay";


    const title =
        document.createElement(
            "span"
        );


    title.className =
        "gallery-item-title";

    title.textContent =
        item.title;


    const actions =
        document.createElement(
            "div"
        );


    actions.className =
        "gallery-item-actions";


    /*
     * BOTÃO VISUALIZAR
     */

    const viewButton =
        document.createElement(
            "button"
        );


    viewButton.type =
        "button";

    viewButton.className =
        "gallery-item-action";


    viewButton.title =
        "Visualizar";


    viewButton.innerHTML =
        '<i class="fa-regular fa-eye"></i>';


    viewButton.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            openLightbox(
                index
            );

        }
    );


    /*
     * BOTÃO DOWNLOAD
     */

    const downloadButton =
        document.createElement(
            "a"
        );


    downloadButton.className =
        "gallery-item-action";


    downloadButton.href =
        item.url;

    downloadButton.download =
        item.title || "memoria";


    downloadButton.target =
        "_blank";


    downloadButton.rel =
        "noopener";


    downloadButton.title =
        "Baixar";


    downloadButton.innerHTML =
        '<i class="fa-solid fa-download"></i>';


    downloadButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

        }
    );


    actions.appendChild(
        viewButton
    );

    actions.appendChild(
        downloadButton
    );


    overlay.appendChild(
        title
    );

    overlay.appendChild(
        actions
    );


    article.appendChild(
        overlay
    );


    /*
     * Clicar na imagem.
     */

    article.addEventListener(
        "click",
        () => {

            openLightbox(
                index
            );

        }
    );


    return article;

}


/* =========================================================
   LIGHTBOX
========================================================= */

function openLightbox(index) {

    if (!filteredItems.length) {
        return;
    }


    currentLightboxIndex =
        index;


    updateLightbox();


    if (lightbox) {

        lightbox.classList.add(
            "open"
        );

        lightbox.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   ATUALIZAR LIGHTBOX
========================================================= */

function updateLightbox() {

    const item =
        filteredItems[
            currentLightboxIndex
        ];


    if (!item) {
        return;
    }


    /*
     * FOTO
     */

    if (item.type === "photo") {

        lightboxImage.src =
            item.url;

        lightboxImage.style.display =
            "block";


        lightboxVideo.pause();

        lightboxVideo.removeAttribute(
            "src"
        );

        lightboxVideo.style.display =
            "none";

    }


    /*
     * VÍDEO
     */

    else {

        lightboxImage.removeAttribute(
            "src"
        );

        lightboxImage.style.display =
            "none";


        lightboxVideo.src =
            item.url;

        lightboxVideo.style.display =
            "block";

    }


    if (lightboxTitle) {

        lightboxTitle.textContent =
            item.title;

    }


    if (lightboxDownload) {

        lightboxDownload.href =
            item.url;

        lightboxDownload.download =
            item.title ||
            "memoria";

    }

}


/* =========================================================
   FECHAR LIGHTBOX
========================================================= */

function closeLightbox() {

    if (!lightbox) {
        return;
    }


    lightbox.classList.remove(
        "open"
    );


    lightbox.setAttribute(
        "aria-hidden",
        "true"
    );


    lightboxVideo.pause();


    document.body.style.overflow =
        "";

}


/* =========================================================
   PRÓXIMO
========================================================= */

function nextLightbox() {

    if (!filteredItems.length) {
        return;
    }


    currentLightboxIndex++;

    if (
        currentLightboxIndex >=
        filteredItems.length
    ) {

        currentLightboxIndex =
            0;

    }


    updateLightbox();

}


/* =========================================================
   ANTERIOR
========================================================= */

function previousLightbox() {

    if (!filteredItems.length) {
        return;
    }


    currentLightboxIndex--;

    if (
        currentLightboxIndex < 0
    ) {

        currentLightboxIndex =
            filteredItems.length - 1;

    }


    updateLightbox();

}


/* =========================================================
   EVENTOS DO LIGHTBOX
========================================================= */

if (lightboxClose) {

    lightboxClose.addEventListener(
        "click",
        closeLightbox
    );

}


if (lightboxBackdrop) {

    lightboxBackdrop.addEventListener(
        "click",
        closeLightbox
    );

}


if (lightboxNext) {

    lightboxNext.addEventListener(
        "click",
        nextLightbox
    );

}


if (lightboxPrev) {

    lightboxPrev.addEventListener(
        "click",
        previousLightbox
    );

}


/*
 * Teclado
 */

document.addEventListener(
    "keydown",
    event => {

        if (
            !lightbox?.classList.contains(
                "open"
            )
        ) {

            return;

        }


        if (event.key === "Escape") {

            closeLightbox();

        }


        if (event.key === "ArrowRight") {

            nextLightbox();

        }


        if (event.key === "ArrowLeft") {

            previousLightbox();

        }

    }
);


/* =========================================================
   FILTROS DA GALERIA
========================================================= */

document
    .querySelectorAll(
        ".gallery-filter"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".gallery-filter"
                        )
                        .forEach(
                            item => {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                    button.classList.add(
                        "active"
                    );


                    const filter =
                        button.dataset.filter ||
                        "all";


                    renderGallery(
                        filter
                    );

                }
            );

        }
    );


/* =========================================================
   DOWNLOAD DE TODAS
========================================================= */

if (downloadAllButton) {

    downloadAllButton.addEventListener(
        "click",
        async () => {

            if (!galleryItems.length) {

                alert(
                    "Ainda não existem arquivos disponíveis para baixar."
                );

                return;

            }


            /*
             * O navegador pode bloquear
             * vários downloads automáticos.
             *
             * Por isso abrimos os arquivos
             * individualmente em novas abas.
             */

            galleryItems.forEach(
                (item, index) => {

                    setTimeout(
                        () => {

                            window.open(
                                item.url,
                                "_blank"
                            );

                        },
                        index * 300
                    );

                }
            );

        }
    );

}


/* =========================================================
   LOGOUT
========================================================= */

async function logout() {

    try {

        await signOut(
            auth
        );


        window.location.replace(
            "login.html"
        );

    } catch (error) {

        console.error(
            "Erro ao sair:",
            error
        );


        alert(
            "Não foi possível sair da conta. Tente novamente."
        );

    }

}


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        logout
    );

}


if (mobileLogoutButton) {

    mobileLogoutButton.addEventListener(
        "click",
        logout
    );

}


/* =========================================================
   MENU DO PERFIL
========================================================= */

if (profileButton) {

    profileButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            clientProfile.classList.toggle(
                "open"
            );

        }
    );

}


document.addEventListener(
    "click",
    event => {

        if (
            clientProfile &&
            !clientProfile.contains(
                event.target
            )
        ) {

            clientProfile.classList.remove(
                "open"
            );

        }

    }
);


/* =========================================================
   MENU MOBILE
========================================================= */

if (clientMenuButton) {

    clientMenuButton.addEventListener(
        "click",
        () => {

            clientMobileMenu.classList.toggle(
                "open"
            );

            document.body.classList.toggle(
                "menu-open"
            );

        }
    );

}


document
    .querySelectorAll(
        ".client-mobile-menu a"
    )
    .forEach(
        link => {

            link.addEventListener(
                "click",
                () => {

                    clientMobileMenu.classList.remove(
                        "open"
                    );

                    document.body.classList.remove(
                        "menu-open"
                    );

                }
            );

        }
    );


/* =========================================================
   HEADER AO ROLAR
========================================================= */

const header =
    document.getElementById(
        "clientHeader"
    );


window.addEventListener(
    "scroll",
    () => {

        if (!header) {
            return;
        }


        if (window.scrollY > 30) {

            header.classList.add(
                "scrolled"
            );

        } else {

            header.classList.remove(
                "scrolled"
            );

        }

    },
    {
        passive: true
    }
);


/* =========================================================
   NAVEGAÇÃO ATIVA
========================================================= */

const navigationLinks =
    document.querySelectorAll(
        ".client-nav-link"
    );


const sections =
    document.querySelectorAll(
        "main section[id]"
    );


window.addEventListener(
    "scroll",
    () => {

        let currentSection =
            "inicio";


        sections.forEach(
            section => {

                const sectionTop =
                    section.offsetTop - 150;


                if (
                    window.scrollY >=
                    sectionTop
                ) {

                    currentSection =
                        section.id;

                }

            }
        );


        navigationLinks.forEach(
            link => {

                link.classList.remove(
                    "active"
                );


                if (
                    link.getAttribute(
                        "href"
                    ) ===
                    `#${currentSection}`
                ) {

                    link.classList.add(
                        "active"
                    );

                }

            }
        );

    },
    {
        passive: true
    }
);


/* =========================================================
   ERRO DA GALERIA
========================================================= */

function showGalleryError() {

    if (!clientGallery) {
        return;
    }


    clientGallery.innerHTML = `

        <div
            class="gallery-loading"
            style="grid-column:1/-1;"
        >

            <i
                class="fa-solid fa-circle-exclamation"
                style="
                    font-size:28px;
                    color:#b49a6c;
                "
            ></i>

            <p>
                Não foi possível carregar suas fotos.
            </p>

            <button
                type="button"
                id="retryGallery"
                style="
                    margin-top:10px;
                    padding:10px 16px;
                    border:1px solid #ddd8ce;
                    background:transparent;
                    cursor:pointer;
                    font-size:9px;
                "
            >
                Tentar novamente
            </button>

        </div>

    `;


    const retry =
        document.getElementById(
            "retryGallery"
        );


    if (retry) {

        retry.addEventListener(
            "click",
            () => {

                if (currentUser) {

                    loadClientGallery(
                        currentUser.uid
                    );

                }

            }
        );

    }

}


/* =========================================================
   FORMATAR DATA
========================================================= */

function formatDate(value) {

    if (!value) {
        return "A confirmar";
    }


    /*
     * Timestamp do Firestore
     */

    if (
        typeof value.toDate ===
        "function"
    ) {

        value =
            value.toDate();

    }


    /*
     * Data JavaScript
     */

    if (
        value instanceof Date
    ) {

        return value.toLocaleDateString(
            "pt-BR"
        );

    }


    /*
     * String
     */

    if (
        typeof value ===
        "string"
    ) {

        const date =
            new Date(
                value
            );


        if (
            !Number.isNaN(
                date.getTime()
            )
        ) {

            return date.toLocaleDateString(
                "pt-BR"
            );

        }

    }


    return String(
        value
    );

}


/* =========================================================
   FINAL
========================================================= */

console.log(
    "Área do cliente carregada — Suas Memórias Aqui."
);
```
