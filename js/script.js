/* =========================================================
   SUAS MEMÓRIAS AQUI
   SCRIPT.JS
   Funcionalidades da página inicial
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTOS
    ====================================================== */

    const header =
        document.getElementById("mainHeader");

    const menuToggle =
        document.getElementById("menuToggle");

    const mobileMenu =
        document.getElementById("mobileMenu");

    const mobileClose =
        document.getElementById("mobileClose");

    const mobileLinks =
        document.querySelectorAll(
            ".mobile-menu a"
        );

    const navLinks =
        document.querySelectorAll(
            ".main-nav .nav-link"
        );


    /* =====================================================
       HEADER AO ROLAR
    ====================================================== */

    function atualizarHeader() {

        if (!header) {
            return;
        }

        if (window.scrollY > 40) {

            header.classList.add(
                "scrolled"
            );

        } else {

            header.classList.remove(
                "scrolled"
            );

        }

    }


    atualizarHeader();


    window.addEventListener(
        "scroll",
        atualizarHeader,
        {
            passive: true
        }
    );


    /* =====================================================
       ABRIR MENU MOBILE
    ====================================================== */

    function abrirMenu() {

        if (!mobileMenu) {
            return;
        }

        mobileMenu.classList.add(
            "open"
        );

        document.body.classList.add(
            "menu-open"
        );

    }


    /* =====================================================
       FECHAR MENU MOBILE
    ====================================================== */

    function fecharMenu() {

        if (!mobileMenu) {
            return;
        }

        mobileMenu.classList.remove(
            "open"
        );

        document.body.classList.remove(
            "menu-open"
        );

    }


    if (menuToggle) {

        menuToggle.addEventListener(
            "click",
            abrirMenu
        );

    }


    if (mobileClose) {

        mobileClose.addEventListener(
            "click",
            fecharMenu
        );

    }


    /* =====================================================
       LINKS DO MENU MOBILE
    ====================================================== */

    mobileLinks.forEach(
        link => {

            link.addEventListener(
                "click",
                () => {

                    fecharMenu();

                }
            );

        }
    );


    /* =====================================================
       ESC FECHA MENU
    ====================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                fecharMenu();

            }

        }
    );


    /* =====================================================
       DESTAQUE DO MENU
    ====================================================== */

    const secoes =
        document.querySelectorAll(
            "main section[id]"
        );


    function atualizarSecaoAtiva() {

        if (!secoes.length) {
            return;
        }


        let secaoAtual = "";


        secoes.forEach(
            secao => {

                const distancia =
                    secao.offsetTop -
                    window.scrollY -
                    180;


                if (distancia <= 0) {

                    secaoAtual =
                        secao.id;

                }

            }
        );


        navLinks.forEach(
            link => {

                link.classList.remove(
                    "active"
                );


                const destino =
                    link.getAttribute(
                        "href"
                    );


                if (
                    destino ===
                    `#${secaoAtual}`
                ) {

                    link.classList.add(
                        "active"
                    );

                }

            }
        );

    }


    window.addEventListener(
        "scroll",
        atualizarSecaoAtiva,
        {
            passive: true
        }
    );


    atualizarSecaoAtiva();


    /* =====================================================
       FECHAR MENU SE REDIMENSIONAR
    ====================================================== */

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth > 800
            ) {

                fecharMenu();

            }

        }
    );


    /* =====================================================
       ANIMAÇÃO DE ENTRADA
    ====================================================== */

    const elementosAnimados =
        document.querySelectorAll(
            ".service-card, " +
            ".visual-card, " +
            ".contact-option, " +
            ".experience-list > div"
        );


    if (
        "IntersectionObserver" in window
    ) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "visible"
                                );

                                observer.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.12
                }
            );


        elementosAnimados.forEach(
            elemento => {

                elemento.classList.add(
                    "animate-on-scroll"
                );

                observer.observe(
                    elemento
                );

            }
        );

    } else {

        elementosAnimados.forEach(
            elemento => {

                elemento.classList.add(
                    "visible"
                );

            }
        );

    }


    /* =====================================================
       LINKS COM SCROLL SUAVE
    ====================================================== */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    event => {

                        const destino =
                            link.getAttribute(
                                "href"
                            );


                        if (
                            !destino ||
                            destino === "#"
                        ) {

                            return;

                        }


                        const elemento =
                            document.querySelector(
                                destino
                            );


                        if (!elemento) {
                            return;
                        }


                        event.preventDefault();


                        const alturaHeader =
                            header
                                ? header.offsetHeight
                                : 0;


                        const posicao =
                            elemento.offsetTop -
                            alturaHeader;


                        window.scrollTo({

                            top:
                                posicao,

                            behavior:
                                "smooth"

                        });

                    }
                );

            }
        );


    /* =====================================================
       ATUALIZAÇÃO DO ANO
    ====================================================== */

    const anoAtual =
        new Date().getFullYear();


    document
        .querySelectorAll(
            ".footer-center span"
        )
        .forEach(
            elemento => {

                elemento.textContent =
                    `© ${anoAtual} Suas Memórias Aqui`;

            }
        );


    /* =====================================================
       LOG DO SISTEMA
    ====================================================== */

    console.log(
        "Suas Memórias Aqui — site carregado com sucesso."
    );

});
