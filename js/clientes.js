```javascript
/* =========================================================
   SUAS MEMÓRIAS AQUI
   JS / CLIENTE.JS

   Área exclusiva do cliente
========================================================= */

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

import {
    getFirestore,
    collection,
    query,
    where,
    getDocs,
    orderBy,
    limit
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

import {
    getStorage,
    ref,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-storage.js";

import {
    auth,
    app
} from "./firebase.js";


/* =========================================================
   FIREBASE
========================================================= */

const db = getFirestore(app);
const storage = getStorage(app);


/* =========================================================
   ELEMENTOS
========================================================= */

const pageLoading =
    document.getElementById("pageLoading");

const clientApp =
    document.getElementById("clientApp");

const sidebar =
    document.getElementById("sidebar");

const mobileMenuButton =
    document.getElementById("mobileMenuButton");

const pageTitle =
    document.getElementById("pageTitle");

const userName =
    document.getElementById("userName");

const welcomeName =
    document.getElementById("welcomeName");

const userAvatar =
    document.getElementById("userAvatar");

const accountAvatar =
    document.getElementById("accountAvatar");

const accountName =
    document.getElementById("accountName");

const accountEmail =
    document.getElementById("accountEmail");

const profileMenu =
    document.getElementById("profileMenu");

const profileButton =
    document.getElementById("profileButton");

const logoutButton =
    document.getElementById("logoutButton");

const accountLogoutButton =
    document.getElementById("accountLogoutButton");

const logoutModal =
    document.getElementById("logoutModal");

const cancelLogout =
    document.getElementById("cancelLogout");

const confirmLogout =
    document.getElementById("confirmLogout");

const photoCountBadge =
    document.getElementById("photoCountBadge");

const dashboardPhotoCount =
    document.getElementById("dashboardPhotoCount");

const dashboardVideoCount =
    document.getElementById("dashboardVideoCount");

const photoGallery =
    document.getElementById("photoGallery");

const videoGallery =
    document.getElementById("videoGallery");

const recentPhotos =
    document.getElementById("recentPhotos");

const downloadAllButton =
    document.getElementById("downloadAllButton");

const notificationButton =
    document.getElementById("notificationButton");

const notificationDot =
    document.getElementById("notificationDot");

const onlineMeetingButton =
    document.getElementById("onlineMeetingButton");

const presentialMeetingButton =
    document.getElementById(
        "presentialMeetingButton"
    );


/* =========================================================
   ESTADO
========================================================= */

let currentUser = null;

let clientPhotos = [];

let clientVideos = [];

let selectedPhotos = [];


/* =========================================================
   TÍTULOS DAS SEÇÕES
========================================================= */

const sectionTitles = {

    inicio:
        "Minha área",

    fotos:
        "Minhas fotos",

    videos:
        "Meus vídeos",

    agendamento:
        "Agendamento",

    contato:
        "Fale conosco",

    conta:
        "Minha conta"

};


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeNavigation();

        initializeProfileMenu();

        initializeLogout();

        initializeMeetingButtons();

        initializeNotification();

        initializeDownloadButton();

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

            await loadClientData(user);

            await loadClientPhotos(user);

            await loadClientVideos(user);

            await loadRecentPhotos(user);

        } catch (error) {

            console.error(
                "Erro ao carregar dados:",
                error
            );

        }


        showApplication();

    }
);


/* =========================================================
   MOSTRAR APLICAÇÃO
========================================================= */

function showApplication() {

    if (clientApp) {

        clientApp.style.visibility =
            "visible";

    }


    if (pageLoading) {

        pageLoading.classList.add(
            "hidden"
        );

    }

}


/* =========================================================
   DADOS DO CLIENTE
========================================================= */

async function loadClientData(user) {

    const displayName =
        user.displayName ||
        user.email?.split("@")[0] ||
        "Cliente";


    const firstName =
        displayName
            .trim()
            .split(" ")[0];


    setText(
        userName,
        displayName
    );


    setText(
        welcomeName,
        firstName
    );


    setText(
        accountName,
        displayName
    );


    setText(
        accountEmail,
        user.email || "—"
    );


    setAvatar(
        userAvatar,
        displayName,
        user.photoURL
    );


    setAvatar(
        accountAvatar,
        displayName,
        user.photoURL
    );


    /*
     * Tentamos buscar informações adicionais
     * do cliente no Firestore.
     */

    try {

        const clientsRef =
            collection(
                db,
                "clientes"
            );


        const clientQuery =
            query(
                clientsRef,
                where(
                    "uid",
                    "==",
                    user.uid
                ),
                limit(1)
            );


        const snapshot =
            await getDocs(
                clientQuery
            );


        if (!snapshot.empty) {

            const client =
                snapshot.docs[0].data();


            if (client.nome) {

                setText(
                    userName,
                    client.nome
                );


                setText(
                    welcomeName,
                    client.nome
                        .trim()
                        .split(" ")[0]
                );


                setText(
                    accountName,
                    client.nome
                );

            }

        }

    } catch (error) {

        /*
         * Se a coleção ainda não existir,
         * mantemos os dados do Firebase Auth.
         */

        console.info(
            "Coleção de clientes ainda não configurada."
        );

    }

}


/* =========================================================
   AVATAR
========================================================= */

function setAvatar(
    element,
    name,
    photoURL
) {

    if (!element) {
        return;
    }


    if (photoURL) {

        element.innerHTML = "";

        const image =
            document.createElement(
                "img"
            );


        image.src =
            photoURL;


        image.alt =
            name;


        element.appendChild(
            image
        );


        return;

    }


    const firstLetter =
        name
            .trim()
            .charAt(0)
            .toUpperCase();


    element.textContent =
        firstLetter || "C";

}


/* =========================================================
   NAVEGAÇÃO
========================================================= */

function initializeNavigation() {

    const navigationItems =
        document.querySelectorAll(
            "[data-section]"
        );


    navigationItems.forEach(
        (item) => {

            item.addEventListener(
                "click",
                () => {

                    const section =
                        item.dataset.section;


                    if (!section) {
                        return;
                    }


                    navigateToSection(
                        section
                    );


                    closeMobileMenu();

                }
            );

        }
    );

}


/* =========================================================
   IR PARA SEÇÃO
========================================================= */

function navigateToSection(
    sectionName
) {

    const sections =
        document.querySelectorAll(
            ".content-section"
        );


    sections.forEach(
        (section) => {

            section.classList.remove(
                "active-section"
            );

        }
    );


    const target =
        document.getElementById(
            `section-${sectionName}`
        );


    if (!target) {

        console.warn(
            `Seção não encontrada: ${sectionName}`
        );

        return;

    }


    target.classList.add(
        "active-section"
    );


    if (pageTitle) {

        pageTitle.textContent =
            sectionTitles[
                sectionName
            ] ||
            "Minha área";

    }


    updateActiveNavigation(
        sectionName
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   NAVEGAÇÃO ATIVA
========================================================= */

function updateActiveNavigation(
    sectionName
) {

    const navItems =
        document.querySelectorAll(
            ".sidebar-nav .nav-item"
        );


    navItems.forEach(
        (item) => {

            item.classList.remove(
                "active"
            );


            if (
                item.dataset.section ===
                sectionName
            ) {

                item.classList.add(
                    "active"
                );

            }

        }
    );

}


/* =========================================================
   MENU MOBILE
========================================================= */

if (mobileMenuButton) {

    mobileMenuButton.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "mobile-open"
            );

        }
    );

}


function closeMobileMenu() {

    if (sidebar) {

        sidebar.classList.remove(
            "mobile-open"
        );

    }

}


/* =========================================================
   MENU DO PERFIL
========================================================= */

function initializeProfileMenu() {

    if (!profileButton) {
        return;
    }


    profileButton.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            profileMenu.classList.toggle(
                "open"
            );

        }
    );


    document.addEventListener(
        "click",
        (event) => {

            if (
                profileMenu &&
                !profileMenu.contains(event.target)
            ) {

                profileMenu.classList.remove(
                    "open"
                );

            }

        }
    );


    document
        .querySelectorAll(
            ".profile-dropdown [data-section]"
        )
        .forEach(
            (item) => {

                item.addEventListener(
                    "click",
                    () => {

                        navigateToSection(
                            item.dataset.section
                        );


                        profileMenu.classList.remove(
                            "open"
                        );

                    }
                );

            }
        );

}


/* =========================================================
   LOGOUT
========================================================= */

function initializeLogout() {

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            openLogoutModal
        );

    }


    if (accountLogoutButton) {

        accountLogoutButton.addEventListener(
            "click",
            openLogoutModal
        );

    }


    if (cancelLogout) {

        cancelLogout.addEventListener(
            "click",
            closeLogoutModal
        );

    }


    if (confirmLogout) {

        confirmLogout.addEventListener(
            "click",
            logoutUser
        );

    }


    if (logoutModal) {

        logoutModal.addEventListener(
            "click",
            (event) => {

                if (
                    event.target ===
                    logoutModal
                ) {

                    closeLogoutModal();

                }

            }
        );

    }

}


function openLogoutModal() {

    if (profileMenu) {

        profileMenu.classList.remove(
            "open"
        );

    }


    if (logoutModal) {

        logoutModal.classList.add(
            "show"
        );

    }

}


function closeLogoutModal() {

    if (logoutModal) {

        logoutModal.classList.remove(
            "show"
        );

    }

}


async function logoutUser() {

    try {

        if (confirmLogout) {

            confirmLogout.disabled =
                true;

            confirmLogout.textContent =
                "Saindo...";

        }


        await signOut(auth);


        window.location.href =
            "cliente-login.html";

    } catch (error) {

        console.error(
            "Erro ao sair:",
            error
        );


        if (confirmLogout) {

            confirmLogout.disabled =
                false;

            confirmLogout.textContent =
                "Sair";

        }


        alert(
            "Não foi possível sair da conta. Tente novamente."
        );

    }

}


/* =========================================================
   FOTOS DO CLIENTE
========================================================= */

async function loadClientPhotos(user) {

    clientPhotos = [];


    try {

        const photosRef =
            collection(
                db,
                "fotos"
            );


        /*
         * Cada foto deve possuir:
         *
         * uidCliente
         * url
         * titulo
         * createdAt
         *
         */


        const photosQuery =
            query(
                photosRef,
                where(
                    "uidCliente",
                    "==",
                    user.uid
                )
            );


        const snapshot =
            await getDocs(
                photosQuery
            );


        snapshot.forEach(
            (doc) => {

                clientPhotos.push({
                    id: doc.id,
                    ...doc.data()
                });

            }
        );


        clientPhotos.sort(
            (a, b) => {

                const dateA =
                    getDateValue(
                        a.createdAt
                    );


                const dateB =
                    getDateValue(
                        b.createdAt
                    );


                return dateB - dateA;

            }
        );


        updatePhotoCounters();

        renderPhotoGallery();

    } catch (error) {

        console.error(
            "Erro ao carregar fotos:",
            error
        );


        updatePhotoCounters();

    }

}


/* =========================================================
   CONTADORES
========================================================= */

function updatePhotoCounters() {

    const total =
        clientPhotos.length;


    setText(
        photoCountBadge,
        total
    );


    setText(
        dashboardPhotoCount,
        total
    );

}


/* =========================================================
   GALERIA DE FOTOS
========================================================= */

function renderPhotoGallery() {

    if (!photoGallery) {
        return;
    }


    if (
        clientPhotos.length === 0
    ) {

        photoGallery.innerHTML = `
            <div class="empty-state large">

                <div class="empty-icon">
                    <i class="fa-regular fa-images"></i>
                </div>

                <h4>
                    Sua galeria está sendo preparada
                </h4>

                <p>
                    Assim que suas fotografias
                    forem disponibilizadas pela
                    equipe, elas aparecerão aqui.
                </p>

            </div>
        `;

        return;

    }


    photoGallery.innerHTML = "";


    clientPhotos.forEach(
        (photo) => {

            const card =
                createPhotoCard(
                    photo
                );


            photoGallery.appendChild(
                card
            );

        }
    );

}


function createPhotoCard(
    photo
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


    image.src =
        photo.url ||
        photo.imageUrl ||
        "";


    image.alt =
        photo.titulo ||
        photo.title ||
        "Fotografia do cliente";


    image.loading =
        "lazy";


    card.appendChild(
        image
    );


    const overlay =
        document.createElement(
            "div"
        );


    overlay.className =
        "photo-card-overlay";


    const download =
        document.createElement(
            "button"
        );


    download.type =
        "button";


    download.title =
        "Baixar foto";


    download.innerHTML =
        '<i class="fa-solid fa-download"></i>';


    download.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            downloadPhoto(
                photo
            );

        }
    );


    overlay.appendChild(
        download
    );


    card.appendChild(
        overlay
    );


    card.addEventListener(
        "click",
        () => {

            openPhoto(
                photo
            );

        }
    );


    return card;

}


/* =========================================================
   FOTO RECENTE
========================================================= */

async function loadRecentPhotos(
    user
) {

    if (!recentPhotos) {
        return;
    }


    /*
     * Usamos os dados já carregados
     * para evitar consultas desnecessárias.
     */

    const recent =
        clientPhotos.slice(
            0,
            4
        );


    if (recent.length === 0) {

        recentPhotos.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">
                    <i class="fa-regular fa-images"></i>
                </div>

                <h4>
                    Suas fotos aparecerão aqui
                </h4>

                <p>
                    Quando nossa equipe
                    disponibilizar suas
                    fotografias, elas serão
                    exibidas neste espaço.
                </p>

            </div>
        `;

        return;

    }


    recentPhotos.innerHTML = "";


    recent.forEach(
        (photo) => {

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
                photo.imageUrl ||
                "";


            image.alt =
                photo.titulo ||
                "Fotografia";


            image.loading =
                "lazy";


            card.appendChild(
                image
            );


            card.addEventListener(
                "click",
                () => {

                    openPhoto(
                        photo
                    );

                }
            );


            recentPhotos.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   ABRIR FOTO
========================================================= */

function openPhoto(
    photo
) {

    const url =
        photo.url ||
        photo.imageUrl;


    if (!url) {

        alert(
            "Esta fotografia ainda não possui um arquivo disponível."
        );

        return;

    }


    const newWindow =
        window.open(
            "",
            "_blank"
        );


    if (!newWindow) {

        alert(
            "Permita janelas pop-up para visualizar a fotografia."
        );

        return;

    }


    newWindow.document.write(`
        <!DOCTYPE html>

        <html lang="pt-BR">

        <head>

            <meta charset="UTF-8">

            <title>
                Sua memória
            </title>

            <style>

                * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    background: #181715;
                }

                img {
                    max-width: 100%;
                    max-height: 95vh;
                    object-fit: contain;
                }

            </style>

        </head>

        <body>

            <img
                src="${escapeAttribute(url)}"
                alt="Fotografia"
            >

        </body>

        </html>
    `);


    newWindow.document.close();

}


/* =========================================================
   DOWNLOAD
========================================================= */

async function downloadPhoto(
    photo
) {

    const url =
        photo.url ||
        photo.imageUrl;


    if (!url) {

        alert(
            "Arquivo indisponível."
        );

        return;

    }


    try {

        const response =
            await fetch(url);


        if (!response.ok) {
            throw new Error(
                "Falha no download."
            );
        }


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
            getFileName(
                photo,
                "foto.jpg"
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

        console.error(
            "Erro ao baixar foto:",
            error
        );


        /*
         * Fallback caso o navegador
         * bloqueie o download direto.
         */

        window.open(
            url,
            "_blank"
        );

    }

}


/* =========================================================
   DOWNLOAD DAS SELECIONADAS
========================================================= */

function initializeDownloadButton() {

    if (!downloadAllButton) {
        return;
    }


    downloadAllButton.addEventListener(
        "click",
        async () => {

            if (
                clientPhotos.length === 0
            ) {

                alert(
                    "Você ainda não possui fotos disponíveis."
                );

                return;

            }


            /*
             * Por enquanto baixamos todas
             * as fotos disponíveis.
             *
             * O sistema de seleção poderá
             * ser ativado posteriormente.
             */

            for (
                const photo
                of clientPhotos
            ) {

                await downloadPhoto(
                    photo
                );


                await wait(350);

            }

        }
    );

}


/* =========================================================
   VÍDEOS
========================================================= */

async function loadClientVideos(
    user
) {

    clientVideos = [];


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
                    "uidCliente",
                    "==",
                    user.uid
                )
            );


        const snapshot =
            await getDocs(
                videosQuery
            );


        snapshot.forEach(
            (doc) => {

                clientVideos.push({
                    id: doc.id,
                    ...doc.data()
                });

            }
        );


        clientVideos.sort(
            (a, b) => {

                return (
                    getDateValue(
                        b.createdAt
                    ) -
                    getDateValue(
                        a.createdAt
                    )
                );

            }
        );


        updateVideoCounter();

        renderVideoGallery();

    } catch (error) {

        console.error(
            "Erro ao carregar vídeos:",
            error
        );


        updateVideoCounter();

    }

}


/* =========================================================
   CONTADOR DE VÍDEOS
========================================================= */

function updateVideoCounter() {

    setText(
        dashboardVideoCount,
        clientVideos.length
    );

}


/* =========================================================
   GALERIA DE VÍDEOS
========================================================= */

function renderVideoGallery() {

    if (!videoGallery) {
        return;
    }


    if (
        clientVideos.length === 0
    ) {

        videoGallery.innerHTML = `
            <div class="empty-state large">

                <div class="empty-icon">
                    <i class="fa-solid fa-film"></i>
                </div>

                <h4>
                    Nenhum vídeo disponível ainda
                </h4>

                <p>
                    Seus vídeos aparecerão
                    automaticamente aqui quando
                    forem publicados.
                </p>

            </div>
        `;

        return;

    }


    videoGallery.innerHTML = "";


    clientVideos.forEach(
        (video) => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "video-card";


            const videoElement =
                document.createElement(
                    "video"
                );


            videoElement.controls =
                true;


            videoElement.preload =
                "metadata";


            videoElement.src =
                video.url ||
                video.videoUrl ||
                "";


            card.appendChild(
                videoElement
            );


            const info =
                document.createElement(
                    "div"
                );


            info.className =
                "video-info";


            info.innerHTML = `
                <span>
                    SUAS MEMÓRIAS
                </span>

                <h4>
                    ${escapeHTML(
                        video.titulo ||
                        video.title ||
                        "Vídeo especial"
                    )}
                </h4>
            `;


            card.appendChild(
                info
            );


            videoGallery.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   AGENDAMENTO
========================================================= */

function initializeMeetingButtons() {

    if (onlineMeetingButton) {

        onlineMeetingButton.addEventListener(
            "click",
            () => {

                requestMeeting(
                    "Online"
                );

            }
        );

    }


    if (presentialMeetingButton) {

        presentialMeetingButton.addEventListener(
            "click",
            () => {

                requestMeeting(
                    "Presencial"
                );

            }
        );

    }

}


/* =========================================================
   SOLICITAR REUNIÃO
========================================================= */

function requestMeeting(
    type
) {

    const name =
        currentUser?.displayName ||
        currentUser?.email ||
        "Cliente";


    const message =
        `Olá! Sou ${name} e gostaria de solicitar uma reunião ${type.toLowerCase()} com a LS.fotostory.`;


    const whatsappNumber =
        "5542988620679";


    const url =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;


    window.open(
        url,
        "_blank"
    );

}


/* =========================================================
   NOTIFICAÇÕES
========================================================= */

function initializeNotification() {

    if (!notificationButton) {
        return;
    }


    notificationButton.addEventListener(
        "click",
        () => {

            notificationDot?.classList.add(
                "hidden"
            );


            alert(
                "Você não possui novas notificações."
            );

        }
    );

}


/* =========================================================
   FIREBASE STORAGE
========================================================= */

async function getStorageFileUrl(
    path
) {

    try {

        const fileRef =
            ref(
                storage,
                path
            );


        return await getDownloadURL(
            fileRef
        );

    } catch (error) {

        console.error(
            "Erro ao obter arquivo:",
            error
        );


        return null;

    }

}


/* =========================================================
   UTILITÁRIOS
========================================================= */

function setText(
    element,
    value
) {

    if (element) {

        element.textContent =
            value ?? "";

    }

}


function getDateValue(
    value
) {

    if (!value) {
        return 0;
    }


    if (
        typeof value.toMillis ===
        "function"
    ) {

        return value.toMillis();

    }


    if (
        value.seconds !== undefined
    ) {

        return (
            value.seconds * 1000
        );

    }


    const date =
        new Date(value);


    return Number.isNaN(
        date.getTime()
    )
        ? 0
        : date.getTime();

}


function getFileName(
    item,
    fallback
) {

    const original =
        item.nomeArquivo ||
        item.fileName ||
        item.titulo ||
        item.title;


    if (!original) {

        return fallback;

    }


    return String(original)
        .replace(
            /[^a-zA-Z0-9À-ÿ._-]/g,
            "_"
        );

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


function escapeHTML(
    value
) {

    return String(value)
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


function escapeAttribute(
    value
) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        );

}


/* =========================================================
   EXPORTAÇÕES
========================================================= */

export {

    navigateToSection,

    loadClientPhotos,

    loadClientVideos,

    requestMeeting

};
```
