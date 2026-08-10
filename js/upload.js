```javascript
/* =========================================================
   SUAS MEMÓRIAS AQUI
   UPLOAD.JS
   Envio de fotos para o Firebase Storage
========================================================= */

import {
    auth,
    db,
    storage
} from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    collection,
    getDocs,
    query,
    where,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
    ref,
    uploadBytesResumable,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";


/* =========================================================
   ELEMENTOS
========================================================= */

const uploadForm =
    document.getElementById(
        "uploadForm"
    );

const clientSelect =
    document.getElementById(
        "uploadClient"
    );

const gallerySelect =
    document.getElementById(
        "uploadGallery"
    );

const descriptionInput =
    document.getElementById(
        "uploadDescription"
    );

const photoInput =
    document.getElementById(
        "photoInput"
    );

const dropzone =
    document.getElementById(
        "uploadDropzone"
    );

const previewSection =
    document.getElementById(
        "previewSection"
    );

const previewGrid =
    document.getElementById(
        "previewGrid"
    );

const selectedCount =
    document.getElementById(
        "selectedCount"
    );

const submitButton =
    document.getElementById(
        "submitUploadButton"
    );

const clearButton =
    document.getElementById(
        "clearUploadButton"
    );

const message =
    document.getElementById(
        "uploadMessage"
    );

const progress =
    document.getElementById(
        "uploadProgress"
    );

const progressBar =
    document.getElementById(
        "progressBar"
    );

const progressText =
    document.getElementById(
        "progressText"
    );

const progressPercent =
    document.getElementById(
        "progressPercent"
    );


/* =========================================================
   ESTADO
========================================================= */

let currentUser = null;

let selectedFiles = [];

let clients = [];

let galleries = [];


/* =========================================================
   AUTENTICAÇÃO
========================================================= */

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            window.location.replace(
                "admin-login.html"
            );

            return;

        }


        currentUser = user;


        try {

            await carregarClientes();

        } catch (error) {

            console.error(
                "Erro ao carregar clientes:",
                error
            );

            mostrarMensagem(
                "Não foi possível carregar os clientes.",
                "error"
            );

        }

    }
);


/* =========================================================
   CARREGAR CLIENTES
========================================================= */

async function carregarClientes() {

    clientSelect.innerHTML = `
        <option value="">
            Carregando clientes...
        </option>
    `;

    clientSelect.disabled = true;


    const snapshot =
        await getDocs(
            collection(
                db,
                "clientes"
            )
        );


    clients = [];


    snapshot.forEach(
        (doc) => {

            clients.push({
                id: doc.id,
                ...doc.data()
            });

        }
    );


    clients.sort(
        (a, b) => {

            const nomeA =
                String(
                    a.nome ||
                    a.name ||
                    ""
                ).toLowerCase();

            const nomeB =
                String(
                    b.nome ||
                    b.name ||
                    ""
                ).toLowerCase();

            return nomeA.localeCompare(
                nomeB,
                "pt-BR"
            );

        }
    );


    preencherClientes();

}


/* =========================================================
   PREENCHER CLIENTES
========================================================= */

function preencherClientes() {

    clientSelect.innerHTML = `
        <option value="">
            Selecione um cliente
        </option>
    `;


    if (clients.length === 0) {

        clientSelect.innerHTML = `
            <option value="">
                Nenhum cliente cadastrado
            </option>
        `;

        clientSelect.disabled = true;

        return;

    }


    clients.forEach(
        (client) => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                client.id;


            option.textContent =
                client.nome ||
                client.name ||
                client.email ||
                "Cliente";


            clientSelect.appendChild(
                option
            );

        }
    );


    clientSelect.disabled = false;

}


/* =========================================================
   CLIENTE ALTERADO
========================================================= */

clientSelect.addEventListener(
    "change",
    async () => {

        const clientId =
            clientSelect.value;


        limparGalerias();


        if (!clientId) {
            return;
        }


        try {

            await carregarGalerias(
                clientId
            );

        } catch (error) {

            console.error(
                "Erro ao carregar galerias:",
                error
            );

            mostrarMensagem(
                "Não foi possível carregar as galerias.",
                "error"
            );

        }

    }
);


/* =========================================================
   CARREGAR GALERIAS
========================================================= */

async function carregarGalerias(
    clientId
) {

    gallerySelect.innerHTML = `
        <option value="">
            Carregando galerias...
        </option>
    `;

    gallerySelect.disabled = true;


    /*
     * A consulta procura galerias
     * vinculadas ao cliente.
     */

    const galleriesQuery =
        query(
            collection(
                db,
                "galerias"
            ),
            where(
                "clienteId",
                "==",
                clientId
            )
        );


    const snapshot =
        await getDocs(
            galleriesQuery
        );


    galleries = [];


    snapshot.forEach(
        (doc) => {

            galleries.push({
                id: doc.id,
                ...doc.data()
            });

        }
    );


    galleries.sort(
        (a, b) => {

            const nomeA =
                String(
                    a.nome ||
                    a.name ||
                    ""
                ).toLowerCase();

            const nomeB =
                String(
                    b.nome ||
                    b.name ||
                    ""
                ).toLowerCase();

            return nomeA.localeCompare(
                nomeB,
                "pt-BR"
            );

        }
    );


    gallerySelect.innerHTML = `
        <option value="">
            Selecione uma galeria
        </option>
    `;


    if (galleries.length === 0) {

        gallerySelect.innerHTML = `
            <option value="">
                Nenhuma galeria encontrada
            </option>
        `;

        gallerySelect.disabled = true;

        return;

    }


    galleries.forEach(
        (gallery) => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                gallery.id;


            option.textContent =
                gallery.nome ||
                gallery.name ||
                "Galeria";


            gallerySelect.appendChild(
                option
            );

        }
    );


    gallerySelect.disabled = false;

}


/* =========================================================
   LIMPAR GALERIAS
========================================================= */

function limparGalerias() {

    gallerySelect.innerHTML = `
        <option value="">
            Selecione primeiro o cliente
        </option>
    `;

    gallerySelect.disabled = true;

    galleries = [];

}


/* =========================================================
   SELECIONAR FOTOS
========================================================= */

photoInput.addEventListener(
    "change",
    () => {

        const files =
            Array.from(
                photoInput.files || []
            );


        adicionarArquivos(
            files
        );

    }
);


/* =========================================================
   ADICIONAR ARQUIVOS
========================================================= */

function adicionarArquivos(
    files
) {

    const imagensValidas =
        files.filter(
            validarArquivo
        );


    if (
        imagensValidas.length !==
        files.length
    ) {

        mostrarMensagem(
            "Alguns arquivos foram ignorados. Selecione apenas JPG, PNG ou WEBP.",
            "error"
        );

    }


    selectedFiles = [
        ...selectedFiles,
        ...imagensValidas
    ];


    /*
     * Evita duplicação pelo nome,
     * tamanho e última modificação.
     */

    const uniqueFiles =
        new Map();


    selectedFiles.forEach(
        (file) => {

            const key =
                [
                    file.name,
                    file.size,
                    file.lastModified
                ].join(
                    "-"
                );


            uniqueFiles.set(
                key,
                file
            );

        }
    );


    selectedFiles =
        Array.from(
            uniqueFiles.values()
        );


    atualizarPreview();

}


/* =========================================================
   VALIDAR ARQUIVO
========================================================= */

function validarArquivo(
    file
) {

    const tiposPermitidos = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];


    const tamanhoMaximo =
        25 * 1024 * 1024;


    if (
        !tiposPermitidos.includes(
            file.type
        )
    ) {

        return false;

    }


    if (
        file.size >
        tamanhoMaximo
    ) {

        mostrarMensagem(
            `"${file.name}" ultrapassa o limite de 25 MB.`,
            "error"
        );

        return false;

    }


    return true;

}


/* =========================================================
   PREVIEW
========================================================= */

function atualizarPreview() {

    previewGrid.innerHTML =
        "";


    if (
        selectedFiles.length ===
        0
    ) {

        previewSection.classList.remove(
            "visible"
        );

        selectedCount.textContent =
            "0 fotos";

        submitButton.disabled =
            true;

        return;

    }


    previewSection.classList.add(
        "visible"
    );


    selectedCount.textContent =
        selectedFiles.length === 1
            ? "1 foto"
            : `${selectedFiles.length} fotos`;


    selectedFiles.forEach(
        (file) => {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "preview-item";


            const image =
                document.createElement(
                    "img"
                );


            const url =
                URL.createObjectURL(
                    file
                );


            image.src =
                url;


            image.alt =
                file.name;


            image.onload =
                () => {

                    URL.revokeObjectURL(
                        url
                    );

                };


            const name =
                document.createElement(
                    "div"
                );


            name.className =
                "preview-item-name";


            name.textContent =
                file.name;


            item.appendChild(
                image
            );


            item.appendChild(
                name
            );


            previewGrid.appendChild(
                item
            );

        }
    );


    submitButton.disabled =
        false;

}


/* =========================================================
   DRAG AND DROP
========================================================= */

[
    "dragenter",
    "dragover"
].forEach(
    eventName => {

        dropzone.addEventListener(
            eventName,
            event => {

                event.preventDefault();

                event.stopPropagation();

                dropzone.classList.add(
                    "dragover"
                );

            }
        );

    }
);


[
    "dragleave",
    "drop"
].forEach(
    eventName => {

        dropzone.addEventListener(
            eventName,
            event => {

                event.preventDefault();

                event.stopPropagation();

                dropzone.classList.remove(
                    "dragover"
                );

            }
        );

    }
);


dropzone.addEventListener(
    "drop",
    event => {

        const files =
            Array.from(
                event.dataTransfer.files
            );


        adicionarArquivos(
            files
        );

    }
);


/* =========================================================
   LIMPAR
========================================================= */

clearButton.addEventListener(
    "click",
    () => {

        selectedFiles = [];

        photoInput.value =
            "";

        atualizarPreview();

        esconderProgresso();

        limparMensagem();

    }
);


/* =========================================================
   SUBMIT
========================================================= */

uploadForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        if (!currentUser) {

            mostrarMensagem(
                "Sua sessão expirou. Entre novamente.",
                "error"
            );

            return;

        }


        const clientId =
            clientSelect.value;


        const galleryId =
            gallerySelect.value;


        const description =
            descriptionInput.value.trim();


        if (!clientId) {

            mostrarMensagem(
                "Selecione um cliente.",
                "error"
            );

            return;

        }


        if (!galleryId) {

            mostrarMensagem(
                "Selecione uma galeria.",
                "error"
            );

            return;

        }


        if (
            selectedFiles.length ===
            0
        ) {

            mostrarMensagem(
                "Selecione pelo menos uma foto.",
                "error"
            );

            return;

        }


        await enviarFotos({
            clientId,
            galleryId,
            description
        });

    }
);


/* =========================================================
   ENVIO DAS FOTOS
========================================================= */

async function enviarFotos({
    clientId,
    galleryId,
    description
}) {

    submitButton.disabled =
        true;

    clearButton.disabled =
        true;

    clientSelect.disabled =
        true;

    gallerySelect.disabled =
        true;


    mostrarProgresso();


    let enviadas =
        0;


    const total =
        selectedFiles.length;


    try {

        for (
            const file of selectedFiles
        ) {

            enviadas++;


            progressText.textContent =
                `Enviando foto ${enviadas} de ${total}...`;


            /*
             * Nome seguro para o arquivo.
             */

            const nomeSeguro =
                criarNomeSeguro(
                    file.name
                );


            /*
             * Caminho organizado:
             *
             * galerias/
             * clienteId/
             * galleryId/
             * arquivo
             */

            const storagePath =
                [
                    "galerias",
                    clientId,
                    galleryId,
                    `${Date.now()}-${nomeSeguro}`
                ].join(
                    "/"
                );


            const storageReference =
                ref(
                    storage,
                    storagePath
                );


            const uploadTask =
                uploadBytesResumable(
                    storageReference,
                    file,
                    {
                        contentType:
                            file.type,

                        customMetadata: {

                            clienteId:
                                clientId,

                            galeriaId:
                                galleryId,

                            enviadoPor:
                                currentUser.uid

                        }

                    }
                );


            await acompanharUpload(
                uploadTask,
                enviadas,
                total
            );


            const downloadURL =
                await getDownloadURL(
                    storageReference
                );


            /*
             * Registrar a foto no Firestore.
             */

            await addDoc(
                collection(
                    db,
                    "fotos"
                ),
                {

                    clienteId:
                        clientId,

                    galeriaId:
                        galleryId,

                    nome:
                        file.name,

                    nomeArquivo:
                        nomeSeguro,

                    url:
                        downloadURL,

                    caminhoStorage:
                        storagePath,

                    tipo:
                        file.type,

                    tamanho:
                        file.size,

                    descricao:
                        description,

                    enviadoPor:
                        currentUser.uid,

                    criadoEm:
                        serverTimestamp()

                }
            );

        }


        /* ================================================
           SUCESSO
        ================================================= */

        atualizarProgresso(
            100
        );


        progressText.textContent =
            "Envio concluído com sucesso.";


        mostrarMensagem(
            `${total} ${total === 1 ? "foto foi enviada" : "fotos foram enviadas"} para a galeria.`,
            "success"
        );


        selectedFiles = [];

        photoInput.value =
            "";


        atualizarPreview();


        descriptionInput.value =
            "";


        setTimeout(
            esconderProgresso,
            2500
        );


    } catch (error) {

        console.error(
            "Erro durante o upload:",
            error
        );


        mostrarMensagem(
            obterMensagemErro(
                error
            ),
            "error"
        );


    } finally {

        submitButton.disabled =
            selectedFiles.length ===
            0;

        clearButton.disabled =
            false;

        clientSelect.disabled =
            false;

        /*
         * Só habilita galeria se
         * houver galerias carregadas.
         */

        gallerySelect.disabled =
            galleries.length ===
            0;

    }

}


/* =========================================================
   ACOMPANHAR UPLOAD
========================================================= */

function acompanharUpload(
    uploadTask,
    arquivoAtual,
    totalArquivos
) {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            uploadTask.on(
                "state_changed",

                snapshot => {

                    const progressoArquivo =
                        (
                            snapshot.bytesTransferred /
                            snapshot.totalBytes
                        ) * 100;


                    const progressoGeral =
                        (
                            (
                                arquivoAtual - 1
                            ) +
                            (
                                progressoArquivo /
                                100
                            )
                        ) /
                        totalArquivos
                    ) * 100;


                    atualizarProgresso(
                        progressoGeral
                    );

                },

                error => {

                    reject(
                        error
                    );

                },

                () => {

                    resolve();

                }
            );

        }
    );

}


/* =========================================================
   PROGRESSO
========================================================= */

function mostrarProgresso() {

    progress.classList.add(
        "visible"
    );


    atualizarProgresso(
        0
    );

}


function esconderProgresso() {

    progress.classList.remove(
        "visible"
    );


    atualizarProgresso(
        0
    );

}


function atualizarProgresso(
    value
) {

    const percentual =
        Math.max(
            0,
            Math.min(
                100,
                value
            )
        );


    const rounded =
        Math.round(
            percentual
        );


    progressBar.style.width =
        `${percentual}%`;


    progressPercent.textContent =
        `${rounded}%`;

}


/* =========================================================
   NOME SEGURO
========================================================= */

function criarNomeSeguro(
    nome
) {

    return nome

        .normalize(
            "NFD"
        )

        .replace(
            /[\u0300-\u036f]/g,
            ""
        )

        .replace(
            /[^a-zA-Z0-9._-]/g,
            "-"
        )

        .replace(
            /-+/g,
            "-"
        )

        .toLowerCase();

}


/* =========================================================
   MENSAGENS
========================================================= */

function mostrarMensagem(
    texto,
    tipo
) {

    message.textContent =
        texto;

    message.className =
        `upload-message ${tipo}`;

}


function limparMensagem() {

    message.textContent =
        "";

    message.className =
        "upload-message";

}


/* =========================================================
   ERROS FIREBASE
========================================================= */

function obterMensagemErro(
    error
) {

    switch (
        error?.code
    ) {

        case "storage/unauthorized":

            return "O Firebase não permitiu o envio. Verifique as regras do Storage.";

        case "storage/canceled":

            return "O envio foi cancelado.";

        case "storage/quota-exceeded":

            return "O armazenamento disponível foi excedido.";

        case "storage/unauthenticated":

            return "Sua sessão expirou. Entre novamente.";

        case "permission-denied":

            return "Você não possui permissão para realizar esta operação.";

        default:

            return "Ocorreu um erro durante o envio das fotos. Verifique sua conexão e tente novamente.";

    }

}


/* =========================================================
   FINAL
========================================================= */

console.log(
    "Suas Memórias Aqui — Upload carregado."
);
```
