```javascript
/* =========================================================
   LS.FOTOSTORY
   GALERIA.JS
   Galeria pública de fotos
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeGallery();

    }
);


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

function initializeGallery() {

    const gallery =
        document.querySelector(
            ".gallery-grid"
        );


    if (!gallery) {
        return;
    }


    const items =
        gallery.querySelectorAll(
            ".gallery-item"
        );


    items.forEach(
        (item, index) => {

            item.dataset.index =
                index;


            item.addEventListener(
                "click",
                () => {

                    openLightbox(
                        items,
                        index
                    );

                }
            );

        }
    );


    createLightbox();

}


/* =========================================================
   LIGHTBOX
========================================================= */

function createLightbox() {

    if (
        document.getElementById(
            "galleryLightbox"
        )
    ) {
        return;
    }


    const lightbox =
        document.createElement(
            "div"
        );


    lightbox.id =
        "galleryLightbox";


    lightbox.className =
        "gallery-lightbox";


    lightbox.innerHTML =
        `
            <button
                class="lightbox-close"
                aria-label="Fechar"
            >
                ×
            </button>


            <button
                class="lightbox-prev"
                aria-label="Foto anterior"
            >
                ‹
            </button>


            <div class="lightbox-content">

                <img
                    class="lightbox-image"
                    src=""
                    alt=""
                >

                <p class="lightbox-caption"></p>

            </div>


            <button
                class="lightbox-next"
                aria-label="Próxima foto"
            >
                ›
            </button>
        `;


    document.body.appendChild(
        lightbox
    );


    lightbox
        .querySelector(
            ".lightbox-close"
        )
        .addEventListener(
            "click",
            closeLightbox
        );


    lightbox
        .querySelector(
            ".lightbox-prev"
        )
        .addEventListener(
            "click",
            () => changeLightbox(
                -1
            )
        );


    lightbox
        .querySelector(
            ".lightbox-next"
        )
        .addEventListener(
            "click",
            () => changeLightbox(
                1
            )
        );


    lightbox.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                lightbox
            ) {

                closeLightbox();

            }

        }
    );


    document.addEventListener(
        "keydown",
        (event) => {

            if (
                !lightbox.classList.contains(
                    "active"
                )
            ) {
                return;
            }


            if (
                event.key ===
                "Escape"
            ) {

                closeLightbox();

            }


            if (
                event.key ===
                "ArrowLeft"
            ) {

                changeLightbox(
                    -1
                );

            }


            if (
                event.key ===
                "ArrowRight"
            ) {

                changeLightbox(
                    1
                );

            }

        }
    );

}


/* =========================================================
   ESTADO
========================================================= */

let currentItems = [];

let currentIndex = 0;


/* =========================================================
   ABRIR
========================================================= */

function openLightbox(
    items,
    index
) {

    currentItems =
        Array.from(
            items
        );


    currentIndex =
        index;


    updateLightbox();


    const lightbox =
        document.getElementById(
            "galleryLightbox"
        );


    lightbox?.classList.add(
        "active"
    );


    document.body.classList.add(
        "lightbox-open"
    );

}


/* =========================================================
   ATUALIZAR
========================================================= */

function updateLightbox() {

    if (
        currentItems.length ===
        0
    ) {
        return;
    }


    const item =
        currentItems[
            currentIndex
        ];


    const image =
        item.querySelector(
            "img"
        );


    const caption =
        item.querySelector(
            ".gallery-caption"
        );


    const lightbox =
        document.getElementById(
            "galleryLightbox"
        );


    const lightboxImage =
        lightbox?.querySelector(
            ".lightbox-image"
        );


    const lightboxCaption =
        lightbox?.querySelector(
            ".lightbox-caption"
        );


    if (
        image &&
        lightboxImage
    ) {

        lightboxImage.src =
            image.src;

        lightboxImage.alt =
            image.alt ||
            "Foto da LS.fotostory";

    }


    if (lightboxCaption) {

        lightboxCaption.textContent =
            caption
                ? caption.textContent
                : "";

    }

}


/* =========================================================
   PRÓXIMA / ANTERIOR
========================================================= */

function changeLightbox(
    direction
) {

    if (
        currentItems.length ===
        0
    ) {
        return;
    }


    currentIndex +=
        direction;


    if (
        currentIndex <
        0
    ) {

        currentIndex =
            currentItems.length - 1;

    }


    if (
        currentIndex >=
        currentItems.length
    ) {

        currentIndex =
            0;

    }


    updateLightbox();

}


/* =========================================================
   FECHAR
========================================================= */

function closeLightbox() {

    const lightbox =
        document.getElementById(
            "galleryLightbox"
        );


    lightbox?.classList.remove(
        "active"
    );


    document.body.classList.remove(
        "lightbox-open"
    );

}
```
