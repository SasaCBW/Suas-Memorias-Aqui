```javascript
/* =========================================================
   SUAS MEMÓRIAS AQUI
   CLIENTE.JS

   Área exclusiva do cliente
========================================================= */


/* =========================================================
   FIREBASE
========================================================= */

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
    limit
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    app,
    auth,
    db
} from "./firebase.js";


/* =========================================================
   ESTADO
========================================================= */

let currentUser = null;

let currentPhotos = [];

let filteredPhotos = [];

let currentPhotoIndex = 0;


/* =========================================================
   ELEMENTOS
========================================================= */

const pageLoading =
    document.getElementById("pageLoading");

const sidebar =
    document.getElementById("sidebar");

const mobileOverlay =
    document.getElementById("mobileOverlay");

const menuToggle =
    document.getElementById("menuToggle");

const logoutButton =
    document.getElementById("logoutButton");

const profileLogoutButton =
    document.getElementById("profileLogoutButton");

const notificationButton =
    document.getElementById("notificationButton");

const notificationPanel =
    document.getElementById("notificationPanel");

const closeNotificationPanel =
    document.getElementById("closeNotificationPanel");

const photoViewer =
    document.getElementById("photoViewer");

const closePhotoViewer =
    document.getElementById("closePhotoViewer");

const previousPhoto =
    document.getElementById("previousPhoto");

const nextPhoto =
    document.getElementById("nextPhoto");

const viewerImage =
    document.getElementById("viewerImage");

const viewerPhotoName =
    document.getElementById("viewerPhotoName");

const downloadCurrentPhoto =
    document.getElementById("downloadCurrentPhoto");

const photoSearch =
    document.getElementById("photoSearch");

const galleryFilter =
    document.getElementById("galleryFilter");

const downloadAllButton =
    document.getElementById("downloadAllButton");


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeNavigation();

        initializeMobileMenu();

        initializeNotifications();

        initializePhotoViewer();

        initializeGallerySearch();

        initializeQuickButtons();

        initializeLogout();

        initializeKeyboardControls();

    }
);


/* =========================================================
   AUTENTICAÇÃO
========================================================= */

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            window.location.href =
                "cliente-login.html";

            return;

        }


        currentUser = user;


        try {

            await loadClientData();

            await loadClientPhotos();

            await loadClientVideos();

            await loadClientAppointments();

            await loadClientNotifications();

        } catch (error) {

            console.error(
                "Erro ao carregar dados do cliente:",
                error
            );

        } finally {

            hideLoading();

        }

    }
);


/* =========================================================
   ESCONDER LOADING
========================================================= */

function hideLoading() {

    setTimeout(
        () => {

            if (pageLoading) {

                pageLoading.classList.add(
                    "hidden"
                );

            }

        },
        300
    );

}


/* =========================================================
   DADOS DO CLIENTE
========================================================= */

async function loadClientData() {

    if (!currentUser) {
        return;
    }


    const displayName =
        currentUser.displayName ||
        "Cliente";


    const email =
        currentUser.email ||
        "—";


    const firstName =
        getFirstName(displayName);


    const initial =
        getInitial(displayName);


    setText(
        "headerUserName",
        displayName
    );


    setText(
        "welcomeUserName",
        firstName
    );


    setText(
        "profileName",
        displayName
    );


    setText(
        "profileFullName",
        displayName
    );


    setText(
        "profileEmail",
        email
    );


    setText(
        "profileEmailField",
        email
    );


    setText(
        "headerAvatarInitial",
        initial
    );


    setText(
        "profileAvatarInitial",
        initial
    );


    if (currentUser.metadata) {

        const creationTime =
            currentUser.metadata.creationTime;


        if (creationTime) {

            const formattedDate =
                formatDate(
                    creationTime
                );


            setText(
                "profileCreatedAt",
                formattedDate
            );

        }

    }

}


/* =========================================================
   PRIMEIRO NOME
========================================================= */

function getFirstName(name) {

    if (!name) {
        return "cliente";
    }


    return name
        .trim()
        .split(/\s+/)[0];

}


/* =========================================================
   INICIAL
========================================================= */

function getInitial(name) {

    if (!name) {
        return "?";
    }


    return name
        .trim()
        .charAt(0)
        .toUpperCase();

}


/* =========================================================
   NAVEGAÇÃO
========================================================= */

function initializeNavigation() {

    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );


    navItems.forEach(
        (item) => {

            item.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();


                    const section =
                        item.dataset.section;


                    if (!section) {
                        return;
                    }


                    showSection(
                        section
                    );


                    closeMobileMenu();

                }
            );

        }
    );


    window.addEventListener(
        "hashchange",
        handleHashNavigation
    );


    handleHashNavigation();

}


/* =========================================================
   HASH
========================================================= */

function handleHashNavigation() {

    const hash =
        window.location.hash
            .replace("#", "")
            .trim();


    if (!hash) {
        return;
    }


    const validSections = [
        "inicio",
        "fotos",
        "videos",
        "agendamento",
        "perfil"
    ];


    if (
        validSections.includes(hash)
    ) {

        showSection(
            hash,
            false
        );

    }

}


/* =========================================================
   MOSTRAR SEÇÃO
========================================================= */

function showSection(
    section,
    updateHash = true
) {

    const sections =
        document.querySelectorAll(
            ".content-section"
        );


    sections.forEach(
        (element) => {

            element.classList.remove(
                "active-section"
            );

        }
    );


    const selectedSection =
        document.getElementById(
            `section-${section}`
        );


    if (selectedSection) {

        selectedSection.classList.add(
            "active-section"
        );

    }


    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );


    navItems.forEach(
        (item) => {

            item.classList.toggle(
                "active",
                item.dataset.section === section
            );

        }
    );


    if (updateHash) {

        history.replaceState(
            null,
            "",
            `#${section}`
        );

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   BOTÕES RÁPIDOS
========================================================= */

function initializeQuickButtons() {

    const buttons =
        document.querySelectorAll(
            "[data-go-section]"
        );


    buttons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const section =
                        button.dataset.goSection;


                    if (section) {

                        showSection(
                            section
                        );

                    }

                }
            );

        }
    );

}


/* =========================================================
   MENU MOBILE
========================================================= */

function initializeMobileMenu() {

    if (menuToggle) {

        menuToggle.addEventListener(
            "click",
            () => {

                sidebar?.classList.add(
                    "open"
                );

                mobileOverlay?.classList.add(
                    "show"
                );

            }
        );

    }


    mobileOverlay?.addEventListener(
        "click",
        closeMobileMenu
    );

}


function closeMobileMenu() {

    sidebar?.classList.remove(
        "open"
    );

    mobileOverlay?.classList.remove(
        "show"
    );

}


/* =========================================================
   NOTIFICAÇÕES
========================================================= */

function initializeNotifications() {

    notificationButton?.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            notificationPanel?.classList.toggle(
                "show"
            );

        }
    );


    closeNotificationPanel?.addEventListener(
        "click",
        () => {

            notificationPanel?.classList.remove(
                "show"
            );

        }
    );


    document.addEventListener(
        "click",
        (event) => {

            if (
                notificationPanel &&
                !notificationPanel.contains(
                    event.target
                ) &&
                notificationButton &&
                !notificationButton.contains(
                    event.target
                )
            ) {

                notificationPanel.classList.remove(
                    "show"
                );

            }

        }
    );

}


/* =========================================================
   CARREGAR NOTIFICAÇÕES
========================================================= */

async function loadClientNotifications() {

    if (!currentUser || !db) {
        return;
    }


    const list =
        document.getElementById(
            "notificationsList"
        );


    if (!list) {
        return;
    }


    try {

        const notificationsRef =
            collection(
                db,
                "notifications"
            );


        const notificationsQuery =
            query(
                notificationsRef,
                where(
                    "userId",
                    "==",
                    currentUser.uid
                ),
                orderBy(
                    "createdAt",
                    "desc"
                ),
                limit(20)
            );


        const snapshot =
            await getDocs(
                notificationsQuery
            );


        if (snapshot.empty) {

            renderEmptyNotifications();

            return;

        }


        list.innerHTML = "";


        let unread = false;


        snapshot.forEach(
            (docSnapshot) => {

                const data =
                    docSnapshot.data();


                if (
                    data.read === false ||
                    data.read === undefined
                ) {

                    unread = true;

                }


                const item =
                    createNotificationElement(
                        data
                    );


                list.appendChild(
                    item
                );

            }
        );


        const notificationDot =
            document.getElementById(
                "notificationDot"
            );


        if (notificationDot) {

            notificationDot.classList.toggle(
                "show",
                unread
            );

        }

    } catch (error) {

        console.warn(
            "Não foi possível carregar notificações:",
            error
        );


        renderEmptyNotifications();

    }

}


/* =========================================================
   ELEMENTO NOTIFICAÇÃO
========================================================= */

function createNotificationElement(
    data
) {

    const item =
        document.createElement(
            "div"
        );


    item.className =
        "notification-item";


    item.style.cssText = `
        display:flex;
        gap:12px;
        padding:16px 20px;
        border-bottom:1px solid #eee9e3;
    `;


    const icon =
        document.createElement(
            "div"
        );


    icon.style.cssText = `
        width:34px;
        height:34px;
        flex:0 0 34px;
        display:flex;
        align-items:center;
        justify-content:center;
        border-radius:50%;
        background:#efebe5;
        color:#615b54;
        font-size:12px;
    `;


    icon.innerHTML =
        `<i class="fa-regular fa-bell"></i>`;


    const content =
        document.createElement(
            "div"
        );


    const title =
        document.createElement(
            "strong"
        );


    title.textContent =
        data.title ||
        "Nova notificação";


    title.style.cssText = `
        display:block;
        margin-bottom:4px;
        color:#403c37;
        font-size:10px;
    `;


    const message =
        document.createElement(
            "p"
        );


    message.textContent =
        data.message ||
        "";


    message.style.cssText = `
        color:#8e877f;
        font-size:9px;
        line-height:1.5;
    `;


    content.appendChild(
        title
    );


    content.appendChild(
        message
    );


    item.appendChild(
        icon
    );


    item.appendChild(
        content
    );


    return item;

}


/* =========================================================
   NOTIFICAÇÕES VAZIAS
========================================================= */

function renderEmptyNotifications() {

    const list =
        document.getElementById(
            "notificationsList"
        );


    if (!list) {
        return;
    }


    list.innerHTML = `
        <div class="empty-notifications">

            <i class="fa-regular fa-bell"></i>

            <p>
                Nenhuma notificação no momento.
            </p>

        </div>
    `;

}


/* =========================================================
   CARREGAR FOTOS
========================================================= */

async function loadClientPhotos() {

    if (!currentUser || !db) {
        return;
    }


    try {

        const photosRef =
            collection(
                db,
                "photos"
            );


        const photosQuery =
            query(
                photosRef,
                where(
                    "clientId",
                    "==",
                    currentUser.uid
                )
            );


        const snapshot =
            await getDocs(
                photosQuery
            );


        currentPhotos = [];


        snapshot.forEach(
            (docSnapshot) => {

                currentPhotos.push({
                    id:
                        docSnapshot.id,

                    ...docSnapshot.data()
                });

            }
        );


        currentPhotos.sort(
            (a, b) => {

                const dateA =
                    getTimestampValue(
                        a.createdAt
                    );


                const dateB =
                    getTimestampValue(
                        b.createdAt
                    );


                return dateB - dateA;

            }
        );


        filteredPhotos =
            [...currentPhotos];


        updatePhotoCount();


        renderGallery();


        renderHomeGallery();

    } catch (error) {

        console.warn(
            "Não foi possível carregar fotos:",
            error
        );


        currentPhotos = [];

        filteredPhotos = [];

        updatePhotoCount();

        renderGallery();

        renderHomeGallery();

    }

}


/* =========================================================
   CONTAGEM DE FOTOS
========================================================= */

function updatePhotoCount() {

    const badge =
        document.getElementById(
            "photoCountBadge"
        );


    if (badge) {

        badge.textContent =
            currentPhotos.length;

    }

}


/* =========================================================
   GALERIA
========================================================= */

function renderGallery() {

    const gallery =
        document.getElementById(
            "clientGallery"
        );


    if (!gallery) {
        return;
    }


    if (!filteredPhotos.length) {

        gallery.innerHTML = `
            <div class="empty-gallery">

                <div class="empty-icon">
                    <i class="fa-regular fa-images"></i>
                </div>

                <h3>
                    Nenhuma foto disponível
                </h3>

                <p>
                    Sua fotógrafa ainda não
                    disponibilizou fotos nesta galeria.
                </p>

            </div>
        `;

        return;

    }


    gallery.innerHTML = "";


    filteredPhotos.forEach(
        (photo, index) => {

            const card =
                createPhotoCard(
                    photo,
                    index
                );


            gallery.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   CARD DE FOTO
========================================================= */

function createPhotoCard(
    photo,
    index
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "photo-card";


    const image =
        document.createElement(
            "img"
        );


    image.loading =
        "lazy";


    image.alt =
        photo.name ||
        "Foto do cliente";


    image.src =
        photo.url ||
        photo.downloadURL ||
        "";


    card.appendChild(
        image
    );


    const overlay =
        document.createElement(
            "div"
        );


    overlay.className =
        "photo-overlay";


    const info =
        document.createElement(
            "div"
        );


    info.className =
        "photo-info";


    const name =
        document.createElement(
            "span"
        );


    name.textContent =
        photo.name ||
        "Fotografia";


    const action =
        document.createElement(
            "button"
        );


    action.type =
        "button";


    action.className =
        "photo-action";


    action.setAttribute(
        "aria-label",
        "Visualizar foto"
    );


    action.innerHTML =
        `<i class="fa-solid fa-expand"></i>`;


    action.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            openPhotoViewer(
                index
            );

        }
    );


    info.appendChild(
        name
    );


    info.appendChild(
        action
    );


    overlay.appendChild(
        info
    );


    card.appendChild(
        overlay
    );


    card.addEventListener(
        "click",
        () => {

            openPhotoViewer(
                index
            );

        }
    );


    return card;

}


/* =========================================================
   GALERIA DA HOME
========================================================= */

function renderHomeGallery() {

    const gallery =
        document.getElementById(
            "homeGallery"
        );


    if (!gallery) {
        return;
    }


    if (!currentPhotos.length) {

        gallery.innerHTML = `
            <div class="empty-gallery">

                <div class="empty-icon">
                    <i class="fa-regular fa-images"></i>
                </div>

                <h3>
                    Sua galeria está sendo preparada
                </h3>

                <p>
                    Quando suas fotos forem
                    disponibilizadas, elas aparecerão aqui.
                </p>

            </div>
        `;

        return;

    }


    const photos =
        currentPhotos.slice(
            0,
            4
        );


    gallery.innerHTML = "";


    gallery.style.display =
        "grid";


    gallery.style.gridTemplateColumns =
        "repeat(4, 1fr)";


    gallery.style.gap =
        "8px";


    photos.forEach(
        (photo, index) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "photo-card";


            const image =
                document.createElement(
                    "img"
                );


            image.src =
                photo.url ||
                photo.downloadURL ||
                "";


            image.alt =
                photo.name ||
                "Fotografia";


            image.loading =
                "lazy";


            card.appendChild(
                image
            );


            card.addEventListener(
                "click",
                () => {

                    showSection(
                        "fotos"
                    );

                    openPhotoViewer(
                        index
                    );

                }
            );


            gallery.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   BUSCA E FILTROS
========================================================= */

function initializeGallerySearch() {

    photoSearch?.addEventListener(
        "input",
        applyGalleryFilters
    );


    galleryFilter?.addEventListener(
        "change",
        applyGalleryFilters
    );

}


function applyGalleryFilters() {

    const search =
        (
            photoSearch?.value ||
            ""
        )
        .trim()
        .toLowerCase();


    const filter =
        galleryFilter?.value ||
        "all";


    filteredPhotos =
        currentPhotos.filter(
            (photo) => {

                const name =
                    (
                        photo.name ||
                        ""
                    )
                    .toLowerCase();


                const matchesSearch =
                    !search ||
                    name.includes(
                        search
                    );


                return matchesSearch;

            }
        );


    if (filter === "favorites") {

        filteredPhotos =
            filteredPhotos.filter(
                (photo) =>
                    photo.favorite === true
            );

    }


    if (filter === "recent") {

        filteredPhotos.sort(
            (a, b) => {

                return (
                    getTimestampValue(
                        b.createdAt
                    ) -
                    getTimestampValue(
                        a.createdAt
                    )
                );

            }
        );

    }


    renderGallery();

}


/* =========================================================
   VISUALIZADOR
========================================================= */

function initializePhotoViewer() {

    closePhotoViewer?.addEventListener(
        "click",
        closeViewer
    );


    photoViewer?.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                photoViewer
            ) {

                closeViewer();

            }

        }
    );


    previousPhoto?.addEventListener(
        "click",
        showPreviousPhoto
    );


    nextPhoto?.addEventListener(
        "click",
        showNextPhoto
    );


    downloadCurrentPhoto?.addEventListener(
        "click",
        downloadCurrent
    );

}


function openPhotoViewer(
    index
) {

    if (
        !filteredPhotos.length ||
        !photoViewer ||
        !viewerImage
    ) {
        return;
    }


    currentPhotoIndex =
        Math.max(
            0,
            Math.min(
                index,
                filteredPhotos.length - 1
            )
        );


    updateViewer();


    photoViewer.classList.add(
        "show"
    );


    document.body.style.overflow =
        "hidden";

}


function closeViewer() {

    photoViewer?.classList.remove(
        "show"
    );


    document.body.style.overflow =
        "";

}


function updateViewer() {

    const photo =
        filteredPhotos[
            currentPhotoIndex
        ];


    if (!photo) {
        return;
    }


    const url =
        photo.url ||
        photo.downloadURL ||
        "";


    viewerImage.src =
        url;


    viewerPhotoName.textContent =
        photo.name ||
        "Fotografia";


    if (
        filteredPhotos.length <= 1
    ) {

        previousPhoto.style.display =
            "none";

        nextPhoto.style.display =
            "none";

    } else {

        previousPhoto.style.display =
            "flex";

        nextPhoto.style.display =
            "flex";

    }

}


function showPreviousPhoto() {

    if (!filteredPhotos.length) {
        return;
    }


    currentPhotoIndex =
        (
            currentPhotoIndex -
            1 +
            filteredPhotos.length
        ) %
        filteredPhotos.length;


    updateViewer();

}


function showNextPhoto() {

    if (!filteredPhotos.length) {
        return;
    }


    currentPhotoIndex =
        (
            currentPhotoIndex +
            1
        ) %
        filteredPhotos.length;


    updateViewer();

}


/* =========================================================
   DOWNLOAD DA FOTO ATUAL
========================================================= */

async function downloadCurrent() {

    const photo =
        filteredPhotos[
            currentPhotoIndex
        ];


    if (!photo) {
        return;
    }


    const url =
        photo.url ||
        photo.downloadURL;


    if (!url) {

        showTemporaryMessage(
            "Esta foto não possui um arquivo disponível."
        );

        return;

    }


    try {

        const response =
            await fetch(
                url
            );


        const blob =
            await response.blob();


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
            sanitizeFileName(
                photo.name ||
                "foto"
            ) +
            ".jpg";


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        URL.revokeObjectURL(
            blobUrl
        );

    } catch (error) {

        console.error(
            "Erro ao baixar foto:",
            error
        );


        window.open(
            url,
            "_blank"
        );

    }

}


/* =========================================================
   DOWNLOAD DAS SELECIONADAS
========================================================= */

downloadAllButton?.addEventListener(
    "click",
    async () => {

        if (!currentPhotos.length) {

            showTemporaryMessage(
                "Não há fotos disponíveis para baixar."
            );

            return;

        }


        showTemporaryMessage(
            "Preparando o download..."
        );


        for (
            const photo
            of currentPhotos
        ) {

            const url =
                photo.url ||
                photo.downloadURL;


            if (!url) {
                continue;
            }


            try {

                const response =
                    await fetch(
                        url
                    );


                const blob =
                    await response.blob();


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
                    sanitizeFileName(
                        photo.name ||
                        "foto"
                    ) +
                    ".jpg";


                document.body.appendChild(
                    link
                );


                link.click();


                link.remove();


                URL.revokeObjectURL(
                    blobUrl
                );


                await wait(
                    250
                );

            } catch (error) {

                console.warn(
                    "Não foi possível baixar:",
                    url
                );

            }

        }

    }
);


/* =========================================================
   VÍDEOS
========================================================= */

async function loadClientVideos() {

    if (!currentUser || !db) {
        return;
    }


    const container =
        document.getElementById(
            "clientVideos"
        );


    if (!container) {
        return;
    }


    try {

        const videosRef =
            collection(
                db,
                "videos"
            );


        const videosQuery =
            query(
                videosRef,
                where(
                    "clientId",
                    "==",
                    currentUser.uid
                )
            );


        const snapshot =
            await getDocs(
                videosQuery
            );


        if (snapshot.empty) {

            return;

        }


        container.innerHTML = "";


        snapshot.forEach(
            (docSnapshot) => {

                const data =
                    docSnapshot.data();


                const card =
                    createVideoCard(
                        data
                    );


                container.appendChild(
                    card
                );

            }
        );

    } catch (error) {

        console.warn(
            "Não foi possível carregar vídeos:",
            error
        );

    }

}


/* =========================================================
   CARD DE VÍDEO
========================================================= */

function createVideoCard(
    data
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "video-card";


    const thumbnail =
        document.createElement(
            "div"
        );


    thumbnail.className =
        "video-thumbnail";


    if (data.thumbnail) {

        const image =
            document.createElement(
                "img"
            );


        image.src =
            data.thumbnail;


        image.alt =
            data.name ||
            "Vídeo";


        thumbnail.appendChild(
            image
        );

    }


    const play =
        document.createElement(
            "a"
        );


    play.className =
        "video-play";


    play.href =
        data.url ||
        data.videoURL ||
        "#";


    play.target =
        "_blank";


    play.rel =
        "noopener noreferrer";


    play.innerHTML =
        `<i class="fa-solid fa-play"></i>`;


    thumbnail.appendChild(
        play
    );


    const details =
        document.createElement(
            "div"
        );


    details.className =
        "video-details";


    const title =
        document.createElement(
            "h3"
        );


    title.textContent =
        data.name ||
        "Meu vídeo";


    const description =
        document.createElement(
            "p"
        );


    description.textContent =
        data.description ||
        "Vídeo disponibilizado pela nossa equipe.";


    details.appendChild(
        title
    );


    details.appendChild(
        description
    );


    card.appendChild(
        thumbnail
    );


    card.appendChild(
        details
    );


    return card;

}


/* =========================================================
   AGENDAMENTOS
========================================================= */

async function loadClientAppointments() {

    if (!currentUser || !db) {
        return;
    }


    const container =
        document.getElementById(
            "appointmentsList"
        );


    if (!container) {
        return;
    }


    try {

        const appointmentsRef =
            collection(
                db,
                "agendamentos"
            );


        const appointmentsQuery =
            query(
                appointmentsRef,
                where(
                    "clienteId",
                    "==",
                    currentUser.uid
                )
            );


        const snapshot =
            await getDocs(
                appointmentsQuery
            );


        if (snapshot.empty) {

            return;

        }


        container.innerHTML = "";


        const appointments = [];


        snapshot.forEach(
            (docSnapshot) => {

                appointments.push({
                    id:
                        docSnapshot.id,

                    ...docSnapshot.data()
                });

            }
        );


        appointments.sort(
            (a, b) => {

                return (
                    getTimestampValue(
                        b.createdAt
                    ) -
                    getTimestampValue(
                        a.createdAt
                    )
                );

            }
        );


        appointments.forEach(
            (appointment) => {

                const item =
                    createAppointmentElement(
                        appointment
                    );


                container.appendChild(
                    item
                );

            }
        );

    } catch (error) {

        console.warn(
            "Não foi possível carregar agendamentos:",
            error
        );

    }

}


/* =========================================================
   ITEM DE AGENDAMENTO
========================================================= */

function createAppointmentElement(
    data
) {

    const item =
        document.createElement(
            "div"
        );


    item.className =
        "appointment-item";


    item.style.cssText = `
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:15px;
        padding:15px 0;
        border-bottom:1px solid #eee9e3;
    `;


    const info =
        document.createElement(
            "div"
        );


    const date =
        document.createElement(
            "strong"
        );


    date.textContent =
        formatAppointmentDate(
            data.data ||
            data.date
        );


    date.style.cssText = `
        display:block;
        color:#403c37;
        font-size:11px;
        margin-bottom:4px;
    `;


    const type =
        document.createElement(
            "span"
        );


    type.textContent =
        data.tipo ||
        data.servico ||
        "Agendamento";


    type.style.cssText = `
        color:#918a82;
        font-size:9px;
    `;


    info.appendChild(
        date
    );


    info.appendChild(
        type
    );


    const status =
        document.createElement(
            "span"
        );


    const statusText =
        data.status ||
        "Pendente";


    status.textContent =
        capitalize(
            statusText
        );


    status.style.cssText = `
        padding:6px 9px;
        border-radius:20px;
        background:#efebe5;
        color:#6d665f;
        font-size:8px;
        white-space:nowrap;
    `;


    item.appendChild(
        info
    );


    item.appendChild(
        status
    );


    return item;

}


/* =========================================================
   LOGOUT
========================================================= */

function initializeLogout() {

    logoutButton?.addEventListener(
        "click",
        handleLogout
    );


    profileLogoutButton?.addEventListener(
        "click",
        handleLogout
    );

}


async function handleLogout() {

    try {

        await signOut(
            auth
        );


        window.location.href =
            "cliente-login.html";

    } catch (error) {

        console.error(
            "Erro ao sair:",
            error
        );


        showTemporaryMessage(
            "Não foi possível sair da conta."
        );

    }

}


/* =========================================================
   TECLADO
========================================================= */

function initializeKeyboardControls() {

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                !photoViewer?.classList.contains(
                    "show"
                )
            ) {
                return;
            }


            if (
                event.key ===
                "Escape"
            ) {

                closeViewer();

            }


            if (
                event.key ===
                "ArrowLeft"
            ) {

                showPreviousPhoto();

            }


            if (
                event.key ===
                "ArrowRight"
            ) {

                showNextPhoto();

            }

        }
    );

}


/* =========================================================
   UTILITÁRIOS
========================================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;

    }

}


function formatDate(
    date
) {

    const parsed =
        new Date(
            date
        );


    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {

        return "—";

    }


    return parsed.toLocaleDateString(
        "pt-BR",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );

}


function formatAppointmentDate(
    date
) {

    if (!date) {
        return "Data não informada";
    }


    if (
        typeof date ===
        "object" &&
        typeof date.toDate ===
        "function"
    ) {

        return date
            .toDate()
            .toLocaleDateString(
                "pt-BR",
                {
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                }
            );

    }


    const parsed =
        new Date(
            date
        );


    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {

        return String(
            date
        );

    }


    return parsed.toLocaleDateString(
        "pt-BR",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );

}


function getTimestampValue(
    timestamp
) {

    if (!timestamp) {
        return 0;
    }


    if (
        typeof timestamp.toMillis ===
        "function"
    ) {

        return timestamp.toMillis();

    }


    if (
        typeof timestamp.toDate ===
        "function"
    ) {

        return timestamp
            .toDate()
            .getTime();

    }


    const date =
        new Date(
            timestamp
        );


    const value =
        date.getTime();


    return Number.isNaN(value)
        ? 0
        : value;

}


function sanitizeFileName(
    name
) {

    return String(name)
        .replace(
            /[<>:"/\\|?*]+/g,
            ""
        )
        .trim()
        .replace(
            /\s+/g,
            "-"
        )
        .toLowerCase() ||
        "foto";

}


function capitalize(
    text
) {

    const value =
        String(text || "");


    return value
        .charAt(0)
        .toUpperCase() +
        value.slice(1);

}


function wait(
    milliseconds
) {

    return new Promise(
        (resolve) => {

            setTimeout(
                resolve,
                milliseconds
            );

        }
    );

}


/* =========================================================
   MENSAGEM TEMPORÁRIA
========================================================= */

function showTemporaryMessage(
    message
) {

    let toast =
        document.getElementById(
            "clientToast"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );


        toast.id =
            "clientToast";


        toast.style.cssText = `
            position:fixed;
            left:50%;
            bottom:28px;
            z-index:20000;
            transform:translateX(-50%) translateY(20px);
            max-width:calc(100vw - 30px);
            padding:12px 18px;
            border-radius:5px;
            background:#292724;
            color:#fff;
            font-size:10px;
            box-shadow:0 10px 30px rgba(0,0,0,.18);
            opacity:0;
            transition:all .25s ease;
            pointer-events:none;
        `;


        document.body.appendChild(
            toast
        );

    }


    toast.textContent =
        message;


    requestAnimationFrame(
        () => {

            toast.style.opacity =
                "1";

            toast.style.transform =
                "translateX(-50%) translateY(0)";

        }
    );


    clearTimeout(
        toast._timer
    );


    toast._timer =
        setTimeout(
            () => {

                toast.style.opacity =
                    "0";

                toast.style.transform =
                    "translateX(-50%) translateY(20px)";

            },
            3000
        );

}


/* =========================================================
   EXPORTAÇÃO
========================================================= */

export {
    loadClientPhotos,
    loadClientVideos,
    loadClientAppointments,
    loadClientNotifications
};
```
