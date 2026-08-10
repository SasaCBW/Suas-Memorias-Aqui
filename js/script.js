```javascript
/* =========================================================
   SUAS MEMÓRIAS AQUI
   SCRIPT.JS
   JavaScript principal do site
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       MENU MOBILE
    ===================================================== */

    const menuButton = document.getElementById("menuButton");
    const mobileMenu = document.getElementById("mobileMenu");

    if (menuButton && mobileMenu) {

        menuButton.addEventListener("click", () => {

            mobileMenu.classList.toggle("active");

            const aberto =
                mobileMenu.classList.contains("active");

            menuButton.setAttribute(
                "aria-expanded",
                aberto
            );

            menuButton.innerHTML =
                aberto ? "✕" : "☰";

        });


        /* Fechar menu ao clicar em um link */

        const mobileLinks =
            mobileMenu.querySelectorAll("a");

        mobileLinks.forEach(link => {

            link.addEventListener("click", () => {

                mobileMenu.classList.remove("active");

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuButton.innerHTML = "☰";

            });

        });

    }


    /* =====================================================
       FECHAR MENU AO REDIMENSIONAR A TELA
    ===================================================== */

    window.addEventListener("resize", () => {

        if (
            window.innerWidth > 800 &&
            mobileMenu
        ) {

            mobileMenu.classList.remove("active");

            if (menuButton) {

                menuButton.innerHTML = "☰";

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }

    });


    /* =====================================================
       HEADER AO ROLAR A PÁGINA
    ===================================================== */

    const header =
        document.querySelector(".header");

    if (header) {

        window.addEventListener("scroll", () => {

            if (window.scrollY > 40) {

                header.classList.add("scrolled");

            } else {

                header.classList.remove("scrolled");

            }

        });

    }


    /* =====================================================
       LINKS INTERNOS COM SCROLL SUAVE
    ===================================================== */

    const internalLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );

    internalLinks.forEach(link => {

        link.addEventListener("click", event => {

            const targetId =
                link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }

            const target =
                document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            const headerHeight =
                header
                    ? header.offsetHeight
                    : 0;

            const position =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight;

            window.scrollTo({

                top: position,

                behavior: "smooth"

            });

        });

    });


    /* =====================================================
       ANIMAÇÃO DOS ELEMENTOS AO ENTRAREM NA TELA
    ===================================================== */

    const animatedElements =
        document.querySelectorAll(
            ".service-card, .experience-card, .client-feature"
        );

    if (
        animatedElements.length > 0 &&
        "IntersectionObserver" in window
    ) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

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

                    });

                },
                {
                    threshold: 0.12
                }
            );


        animatedElements.forEach(element => {

            element.classList.add(
                "scroll-animation"
            );

            observer.observe(element);

        });

    }


    /* =====================================================
       ANO AUTOMÁTICO DO FOOTER
    ===================================================== */

    const currentYear =
        document.querySelector(
            "[data-current-year]"
        );

    if (currentYear) {

        currentYear.textContent =
            new Date().getFullYear();

    }


    /* =====================================================
       PROTEÇÃO BÁSICA CONTRA CLIQUE DIREITO
       
       NÃO É SEGURANÇA REAL.
       A segurança verdadeira será feita pelo Firebase.
    ===================================================== */

    document.addEventListener(
        "contextmenu",
        event => {

            if (
                document.body.dataset.protectImages ===
                "true"
            ) {

                event.preventDefault();

            }

        }
    );


    /* =====================================================
       PREVENÇÃO DE FORMULÁRIOS DEMO
    ===================================================== */

    const forms =
        document.querySelectorAll(
            "form[data-demo]"
        );

    forms.forEach(form => {

        form.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                console.log(
                    "Formulário aguardando integração."
                );

            }
        );

    });


    /* =====================================================
       LOG DO SISTEMA
    ===================================================== */

    console.log(
        "Suas Memórias Aqui — site carregado."
    );

});
```
