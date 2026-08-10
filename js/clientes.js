```javascript
/* =========================================================
   SUAS MEMÓRIAS AQUI
   CLIENTE.JS

   Área exclusiva dos clientes
   Firebase Authentication
   Galeria privada
   Menu do usuário
   Lightbox
   Responsividade
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
    getDocs,
    query,
    where,
    orderBy
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


/* =========================================================
   ELEMENTOS
========================================================= */

const userButton =
    document.getElementById("userButton");

const userMenu =
    document.getElementById("userMenu");

const logoutButton =
    document.getElementById("logoutButton");

const mobileLogout =
    document.getElementById("mobileLogout");

const mobileMenuButton =
    document.getElementById("mobileMenuButton");

const mobileNavigation =
    document.getElementById("mobileNavigation");

const userName =
    document.getElementById("userName");

const userEmail =
    document.getElementById("userEmail");

const menuUserName =
    document.getElementById("menuUserName");

const menuUserEmail =
    document.getElementById("menuUserEmail");

const heroUserName =
    document.getElementById("heroUserName");

const userAvatar =
    document.getElementById("userAvatar");

const menuAvatar =
    document.getElementById("menuAvatar");

const galleryGrid =
    document.getElementById("galleryGrid");

const galleryLoading =
    document.getElementById("galleryLoading");

const galleryEmpty =
    document.getElementById("galleryEmpty");

const photoCount =
    document.getElementById("photoCount");

const videoCount =
    document.getElementById("videoCount");

const eventCount =
    document.getElementById("eventCount");

const toast =
    document.getElementById("clientToast");

const toastMessage =
    document.getElementById("toastMessage");


/* =========================================================
   ESTADO
========================================================= */

let currentUser = null;

let galleryItems = [];

let filteredItems = [];

let currentLightboxIndex = 0;


/* =========================================================
   UTILITÁRIOS
========================================================= */


/**
 * Escapa caracteres HTML para evitar
 * inserção indevida de código.
 */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/**
 * Mostra uma pequena mensagem na tela.
 */

function showToast(message) {

    if (!toast || !toastMessage) {
        return;
    }

    toastMessage.textContent =
        message;

    toast.classList.add("show");

    clearTimeout(
        showToast.timeout
    );

    showToast.timeout =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 3500);
}


/**
 * Obtém o primeiro nome do usuário.
 */

function getFirstName(name) {

    if (!name) {
        return "Cliente";
    }

    return name
        .trim()
        .split(/\s+/)[0];
}


/**
 * Cria iniciais do usuário.
 */

function getInitials(name) {

    if (!name) {
        return "SM";
    }

    const parts =
        name
            .trim()
            .split(/\s+/)
            .filter(Boolean);

    if (parts.length === 1) {

        return parts[0]
            .substring(0, 2)
            .toUpperCase();

    }

    return (
        parts[0][0] +
        parts[parts.length - 1][0]
    ).toUpperCase();
}


/* =========================================================
   AVATAR
========================================================= */

function createFallbackAvatar(element, name) {

    if (!element) {
        return;
    }

    element.innerHTML = `
        <span
            style="
                font-family: 'DM Sans', sans-serif;
                font-size: 10px;
                font-weight: 700;
            "
        >
            ${escapeHTML(getInitials(name))}
        </span>
    `;
}


/**
 * Atualiza avatar do usuário.
 */

function updateAvatar(element, photoURL, name) {

    if (!element) {
        return;
    }

    if (photoURL) {

        element.innerHTML = "";

        const image =
            document.createElement("img");

        image.src = photoURL;

        image.alt =
            `Foto de ${name || "cliente"}`;

        image.loading = "lazy";

        image.onerror = () => {

            createFallbackAvatar(
                element,
                name
            );

        };

        element.appendChild(image);

    } else {

        createFallbackAvatar(
            element,
            name
        );
    }
}


/* =========================================================
   DADOS DO USUÁRIO
========================================================= */

function updateUserInterface(user) {

    if (!user) {
        return;
    }

    const name =
        user.displayName ||
        "Cliente";

    const email =
        user.email ||
        "Conta do cliente";

    const firstName =
        getFirstName(name);


    /* HEADER */

    if (userName) {
        userName.textContent =
            name;
    }

    if (userEmail) {
        userEmail.textContent =
            email;
    }


    /* MENU */

    if (menuUserName) {
        menuUserName.textContent =
            name;
    }

    if (menuUserEmail) {
        menuUserEmail.textContent =
            email;
    }


    /* HERO */

    if (heroUserName) {
        heroUserName.textContent =
            firstName;
    }


    /* AVATARES */

    updateAvatar(
        userAvatar,
        user.photoURL,
        name
    );

    updateAvatar(
        menuAvatar,
        user.photoURL,
        name
    );
}


/* =========================================================
   PROTEÇÃO DA PÁGINA
========================================================= */

onAuthStateChanged(
    auth,
    async (user) => {

        /*
         * Se não estiver logado,
         * volta para o login.
         */

        if (!user) {

            window.location.replace(
                "login.html"
            );

            return;
        }


        /*
         * Usuário autenticado.
         */

        currentUser =
            user;


        updateUserInterface(
            user
        );


        /*
         * Carrega as memórias
         * daquele usuário.
         */

        await loadClientGallery(
            user
        );

    }
);


/* =========================================================
   MENU DO USUÁRIO
========================================================= */

if (userButton) {

    userButton.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            const isOpen =
                userMenu.classList.contains(
                    "open"
                );

            userMenu.classList.toggle(
                "open"
            );

            userButton.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );

        }
    );
}


/* Fecha menu ao clicar fora */

document.addEventListener(
    "click",
    (event) => {

        if (
            userMenu &&
            userButton &&
            !userMenu.contains(event.target) &&
            !userButton.contains(event.target)
        ) {

            userMenu.classList.remove(
                "open"
            );

            userButton.setAttribute(
                "aria-expanded",
                "false"
            );
        }

    }
);


/* =========================================================
   MENU MOBILE
========================================================= */

if (mobileMenuButton) {

    mobileMenuButton.addEventListener(
        "click",
        () => {

            const isOpen =
                mobileNavigation.classList.contains(
                    "open"
                );

            mobileNavigation.classList.toggle(
                "open"
            );

            mobileMenuButton.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );


            const icon =
                mobileMenuButton.querySelector(
                    "i"
                );

            if (!icon) {
                return;
            }

            if (!isOpen) {

                icon.classList.remove(
                    "fa-bars"
                );

                icon.classList.add(
                    "fa-xmark"
                );

            } else {

                icon.classList.remove(
                    "fa-xmark"
                );

                icon.classList.add(
                    "fa-bars"
                );
            }

        }
    );
}


/* Fecha menu mobile ao clicar em link */

if (mobileNavigation) {

    mobileNavigation
        .querySelectorAll("a")
        .forEach((link) => {

            link.addEventListener(
                "click",
                () => {

                    mobileNavigation.classList.remove(
                        "open"
                    );

                    mobileMenuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    const icon =
                        mobileMenuButton.querySelector(
                            "i"
                        );

                    if (icon) {

                        icon.classList.remove(
                            "fa-xmark"
                        );

                        icon.classList.add(
                            "fa-bars"
                        );
                    }

                }
            );

        });
}


/* =========================================================
   LOGOUT
========================================================= */

async function logout() {

    try {

        await signOut(auth);

        showToast(
            "Você saiu da sua conta."
        );

        setTimeout(() => {

            window.location.replace(
                "login.html"
            );

        }, 500);

    } catch (error) {

        console.error(
            "Erro ao sair:",
            error
        );

        showToast(
            "Não foi possível sair da conta."
        );
    }
}


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        logout
    );
}


if (mobileLogout) {

    mobileLogout.addEventListener(
        "click",
        logout
    );
}


/* =========================================================
   GALERIA DO CLIENTE
========================================================= */


/**
 * Busca fotografias e vídeos
 * do cliente no Firestore.
 *
 * Estrutura esperada:
 *
 * collection: gallery
 *
 * documento:
 *
 * {
 *   clientId: "UID",
 *   type: "photo",
 *   url: "...",
 *   title: "...",
 *   description: "...",
 *   eventName: "...",
 *   createdAt: ...
 * }
 */

async function loadClientGallery(user) {

    showGalleryLoading();


    try {

        const galleryRef =
            collection(
                db,
                "gallery"
            );


        const galleryQuery =
            query(
                galleryRef,
                where(
                    "clientId",
                    "==",
                    user.uid
                ),
                orderBy(
                    "createdAt",
                    "desc"
                )
            );


        const snapshot =
            await getDocs(
                galleryQuery
            );


        galleryItems =
            snapshot.docs.map(
                (document) => ({

                    id:
                        document.id,

                    ...document.data()

                })
            );


        filteredItems =
            [...galleryItems];


        updateGalleryCounters();

        renderGallery();


    } catch (error) {

        console.error(
            "Erro ao carregar galeria:",
            error
        );


        /*
         * Caso a coleção ainda não tenha
         * sido criada, mostramos a galeria
         * vazia em vez de quebrar o site.
         */

        galleryItems = [];

        filteredItems = [];

        updateGalleryCounters();

        showGalleryEmpty();

        /*
         * Não mostramos erro técnico
         * para o cliente.
         */

    }

}


/* =========================================================
   LOADING
========================================================= */

function showGalleryLoading() {

    if (galleryLoading) {

        galleryLoading.style.display =
            "flex";
    }

    if (galleryEmpty) {

        galleryEmpty.classList.remove(
            "show"
        );
    }

    if (galleryGrid) {

        galleryGrid.innerHTML =
            "";
    }
}


function hideGalleryLoading() {

    if (galleryLoading) {

        galleryLoading.style.display =
            "none";
    }
}


/* =========================================================
   GALERIA VAZIA
========================================================= */

function showGalleryEmpty() {

    hideGalleryLoading();


    if (galleryGrid) {

        galleryGrid.innerHTML =
            "";
    }


    if (galleryEmpty) {

        galleryEmpty.classList.add(
            "show"
        );
    }
}


/* =========================================================
   CONTADORES
========================================================= */

function updateGalleryCounters() {

    const photos =
        galleryItems.filter(
            (item) =>
                item.type === "photo" ||
                item.type === "image"
        ).length;


    const videos =
        galleryItems.filter(
            (item) =>
                item.type === "video"
        ).length;


    const events =
        new Set(
            galleryItems
                .map(
                    (item) =>
                        item.eventName
                )
                .filter(Boolean)
        ).size;


    if (photoCount) {

        photoCount.textContent =
            photos;
    }


    if (videoCount) {

        videoCount.textContent =
            videos;
    }


    if (eventCount) {

        eventCount.textContent =
            events;
    }

}


/* =========================================================
   RENDER GALERIA
========================================================= */

function renderGallery() {

    hideGalleryLoading();


    if (!galleryItems.length) {

        showGalleryEmpty();

        return;
    }


    if (!filteredItems.length) {

        showGalleryEmpty();

        return;
    }


    if (galleryEmpty) {

        galleryEmpty.classList.remove(
            "show"
        );
    }


    if (!galleryGrid) {
        return;
    }


    galleryGrid.innerHTML =
        "";


    filteredItems.forEach(
        (item, index) => {

            const element =
                createGalleryItem(
                    item,
                    index
                );

            galleryGrid.appendChild(
                element
            );

        }
    );

}


/* =========================================================
   CRIAR ITEM DA GALERIA
========================================================= */

function createGalleryItem(
    item,
    index
) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "gallery-item";


    article.dataset.index =
        index;


    const type =
        item.type || "photo";


    const title =
        item.title ||
        item.eventName ||
        "Sua memória";


    const description =
        item.description ||
        "Registro especial";


    const url =
        item.url ||
        item.imageUrl;


    /*
     * Se não houver URL,
     * não criamos imagem quebrada.
     */

    if (!url) {

        article.innerHTML = `
            <div
                style="
                    width:100%;
                    height:100%;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    color:#9b958c;
                    background:#ebe7df;
                "
            >
                <i
                    class="fa-regular fa-image"
                    style="font-size:28px;"
                ></i>
            </div>
        `;

        return article;
    }


    const image =
        document.createElement(
            "img"
        );


    image.src =
        url;

    image.alt =
        title;

    image.loading =
        "lazy";


    image.onerror =
        () => {

            image.style.display =
                "none";

        };


    article.appendChild(
        image
    );


    /*
     * Ícone de vídeo.
     */

    if (type === "video") {

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
     * Overlay.
     */

    const overlay =
        document.createElement(
            "div"
        );


    overlay.className =
        "gallery-item-overlay";


    overlay.innerHTML = `
        <strong>
            ${escapeHTML(title)}
        </strong>

        <span>
            ${escapeHTML(description)}
        </span>
    `;


    article.appendChild(
        overlay
    );


    /*
     * Clique.
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
   FILTROS
========================================================= */

const filterButtons =
    document.querySelectorAll(
        ".filter-button"
    );


filterButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                filterButtons.forEach(
                    (item) => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                const filter =
                    button.dataset.filter;


                if (filter === "all") {

                    filteredItems =
                        [...galleryItems];

                } else {

                    filteredItems =
                        galleryItems.filter(
                            (item) => {

                                if (
                                    filter === "photo"
                                ) {

                                    return (
                                        item.type === "photo" ||
                                        item.type === "image"
                                    );

                                }

                                if (
                                    filter === "video"
                                ) {

                                    return (
                                        item.type === "video"
                                    );

                                }

                                return true;

                            }
                        );
                }


                renderGallery();

            }
        );

    }
);


/* =========================================================
   LIGHTBOX
========================================================= */

const lightbox =
    document.getElementById(
        "lightbox"
    );

const lightboxImage =
    document.getElementById(
        "lightboxImage"
    );

const lightboxTitle =
    document.getElementById(
        "lightboxTitle"
    );

const lightboxDescription =
    document.getElementById(
        "lightboxDescription"
    );

const lightboxClose =
    document.getElementById(
        "lightboxClose"
    );

const lightboxBackdrop =
    document.getElementById(
        "lightboxBackdrop"
    );

const lightboxPrev =
    document.getElementById(
        "lightboxPrev"
    );

const lightboxNext =
    document.getElementById(
        "lightboxNext"
    );


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


    document.body.classList.add(
        "no-scroll"
    );
}


function closeLightbox() {

    if (lightbox) {

        lightbox.classList.remove(
            "open"
        );

        lightbox.setAttribute(
            "aria-hidden",
            "true"
        );
    }


    document.body.classList.remove(
        "no-scroll"
    );
}


function updateLightbox() {

    const item =
        filteredItems[
            currentLightboxIndex
        ];


    if (!item) {
        return;
    }


    const url =
        item.url ||
        item.imageUrl;


    if (lightboxImage) {

        lightboxImage.src =
            url || "";

        lightboxImage.alt =
            item.title ||
            "Memória do cliente";
    }


    if (lightboxTitle) {

        lightboxTitle.textContent =
            item.title ||
            item.eventName ||
            "Sua memória";
    }


    if (lightboxDescription) {

        lightboxDescription.textContent =
            item.description ||
            "";
    }

}


/* =========================================================
   NAVEGAÇÃO LIGHTBOX
========================================================= */

function showPrevious() {

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


function showNext() {

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


if (lightboxPrev) {

    lightboxPrev.addEventListener(
        "click",
        showPrevious
    );
}


if (lightboxNext) {

    lightboxNext.addEventListener(
        "click",
        showNext
    );
}


/* =========================================================
   TECLADO
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            !lightbox ||
            !lightbox.classList.contains(
                "open"
            )
        ) {
            return;
        }


        if (
            event.key === "Escape"
        ) {

            closeLightbox();

        }


        if (
            event.key === "ArrowLeft"
        ) {

            showPrevious();

        }


        if (
            event.key === "ArrowRight"
        ) {

            showNext();

        }

    }
);


/* =========================================================
   FECHAR MENU AO REDIRECIONAR
========================================================= */

window.addEventListener(
    "beforeunload",
    () => {

        document.body.classList.remove(
            "no-scroll"
        );

    }
);


/* =========================================================
   CONSOLE
========================================================= */

console.log(
    "Suas Memórias Aqui — área do cliente carregada."
);
```
