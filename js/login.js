```css
/* =========================================================
   SUAS MEMÓRIAS AQUI
   LOGIN.CSS
   Design profissional da área de acesso
========================================================= */


/* =========================================================
   RESET
========================================================= */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}


html {
    scroll-behavior: smooth;
}


body {
    min-height: 100vh;

    font-family:
        "DM Sans",
        Arial,
        sans-serif;

    color: #252522;

    background:
        #f4f1eb;

    overflow-x: hidden;
}


button,
input {
    font-family: inherit;
}


button {
    cursor: pointer;
}


a {
    color: inherit;
    text-decoration: none;
}


/* =========================================================
   VARIÁVEIS
========================================================= */

:root {

    --black:
        #20201e;

    --dark:
        #292925;

    --cream:
        #f4f1eb;

    --cream-light:
        #faf9f6;

    --white:
        #ffffff;

    --gold:
        #b49a6c;

    --gold-dark:
        #92794e;

    --text:
        #252522;

    --muted:
        #77756f;

    --border:
        #dfdcd4;

    --error:
        #b94b4b;

    --success:
        #46785b;

    --shadow:
        0 25px 70px
        rgba(30, 28, 24, 0.12);

}


/* =========================================================
   FUNDO
========================================================= */

.login-background {
    position: fixed;

    inset: 0;

    z-index: -1;

    overflow: hidden;

    background:
        linear-gradient(
            120deg,
            #f6f3ed 0%,
            #ece7dd 50%,
            #f8f6f1 100%
        );
}


.background-shape {
    position: absolute;

    border-radius: 50%;

    filter:
        blur(2px);

    pointer-events: none;
}


.shape-one {
    width: 520px;
    height: 520px;

    left: -250px;
    top: -220px;

    background:
        rgba(180, 154, 108, 0.12);
}


.shape-two {
    width: 650px;
    height: 650px;

    right: -350px;
    bottom: -300px;

    background:
        rgba(255, 255, 255, 0.72);
}


.background-grain {
    position: absolute;

    inset: 0;

    opacity: 0.035;

    background-image:
        url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.6'/%3E%3C/svg%3E");

    pointer-events: none;
}


/* =========================================================
   PÁGINA
========================================================= */

.login-page {

    width: 100%;

    min-height: 100vh;

    display: grid;

    grid-template-columns:
        minmax(420px, 1fr)
        minmax(480px, 620px);

}


/* =========================================================
   LADO DA MARCA
========================================================= */

.login-brand {

    min-height: 100vh;

    padding:
        55px
        clamp(45px, 7vw, 110px);

    display: flex;

    flex-direction: column;

    justify-content: space-between;

    color: var(--white);

    background:
        linear-gradient(
            145deg,
            #171715 0%,
            #272722 48%,
            #181816 100%
        );

    position: relative;

    overflow: hidden;
}


.login-brand::before {

    content: "";

    position: absolute;

    width: 700px;

    height: 700px;

    border-radius: 50%;

    right: -400px;

    top: -250px;

    border:
        1px solid
        rgba(255,255,255,0.08);

}


.login-brand::after {

    content: "";

    position: absolute;

    width: 500px;

    height: 500px;

    border-radius: 50%;

    left: -350px;

    bottom: -300px;

    border:
        1px solid
        rgba(180,154,108,0.18);

}


/* =========================================================
   CONTEÚDO DA MARCA
========================================================= */

.brand-content {

    position: relative;

    z-index: 2;

    max-width: 570px;

}


/* =========================================================
   LOGO
========================================================= */

.brand-logo {

    display: inline-flex;

    align-items: center;

    gap: 14px;

    margin-bottom:
        clamp(90px, 13vh, 170px);

}


.brand-logo-symbol {

    width: 48px;

    height: 48px;

    display: flex;

    align-items: center;

    justify-content: center;

    border:
        1px solid
        rgba(255,255,255,0.55);

    font-family:
        "Playfair Display",
        serif;

    font-size: 14px;

    letter-spacing: 1px;

    color: var(--gold);

}


.brand-logo-text {

    display: flex;

    flex-direction: column;

    gap: 4px;

    font-family:
        "Playfair Display",
        Georgia,
        serif;

    font-size: 20px;

    letter-spacing: 0.2px;

}


.brand-logo-text small {

    font-family:
        "DM Sans",
        sans-serif;

    font-size: 8px;

    letter-spacing: 2.5px;

    color:
        rgba(255,255,255,0.55);

}


/* =========================================================
   MENSAGEM
========================================================= */

.eyebrow {

    display: block;

    margin-bottom: 18px;

    font-size: 10px;

    font-weight: 700;

    letter-spacing: 3px;

    color: var(--gold);

}


.brand-message h1 {

    max-width: 600px;

    font-family:
        "Playfair Display",
        Georgia,
        serif;

    font-size:
        clamp(48px, 5.5vw, 76px);

    line-height: 1.04;

    font-weight: 500;

    letter-spacing: -2px;

}


.brand-message p {

    max-width: 480px;

    margin-top: 28px;

    color:
        rgba(255,255,255,0.65);

    font-size: 15px;

    line-height: 1.8;

}


/* =========================================================
   FRASE
========================================================= */

.brand-quote {

    display: flex;

    align-items: flex-start;

    gap: 15px;

    margin-top: 55px;

    padding-left: 18px;

    border-left:
        1px solid
        rgba(180,154,108,0.55);

}


.brand-quote > span {

    color: var(--gold);

    font-family:
        Georgia,
        serif;

    font-size: 36px;

    line-height: 0.7;

}


.brand-quote p {

    max-width: 300px;

    color:
        rgba(255,255,255,0.55);

    font-family:
        "Playfair Display",
        serif;

    font-size: 15px;

    font-style: italic;

    line-height: 1.5;

}


/* =========================================================
   REUNIÃO
========================================================= */

.brand-meeting {

    display: flex;

    align-items: center;

    gap: 14px;

    margin-top: 45px;

}


.meeting-icon {

    width: 42px;

    height: 42px;

    display: flex;

    align-items: center;

    justify-content: center;

    border:
        1px solid
        rgba(180,154,108,0.45);

    color: var(--gold);

    font-size: 16px;

}


.brand-meeting div:last-child {

    display: flex;

    flex-direction: column;

    gap: 4px;

}


.brand-meeting strong {

    font-size: 13px;

    font-weight: 600;

}


.brand-meeting span {

    color:
        rgba(255,255,255,0.48);

    font-size: 12px;

}


/* =========================================================
   RODAPÉ DA MARCA
========================================================= */

.brand-footer {

    position: relative;

    z-index: 2;

    display: flex;

    justify-content: space-between;

    gap: 20px;

    color:
        rgba(255,255,255,0.32);

    font-size: 10px;

    letter-spacing: 0.5px;

}


/* =========================================================
   PAINEL DE LOGIN
========================================================= */

.login-panel {

    min-height: 100vh;

    padding:
        50px
        clamp(35px, 6vw, 90px);

    display: flex;

    flex-direction: column;

    align-items: center;

    justify-content: center;

    background:
        rgba(250,249,246,0.95);

}


/* =========================================================
   CARTÃO
========================================================= */

.login-card {

    width: 100%;

    max-width: 450px;

}


/* =========================================================
   CABEÇALHO
========================================================= */

.login-heading {

    margin-bottom: 35px;

}


.login-heading .login-eyebrow {

    display: block;

    margin-bottom: 13px;

    color: var(--gold-dark);

    font-size: 9px;

    font-weight: 800;

    letter-spacing: 2.5px;

}


.login-heading h2 {

    font-family:
        "Playfair Display",
        Georgia,
        serif;

    font-size:
        clamp(36px, 4vw, 48px);

    line-height: 1.1;

    font-weight: 500;

    color: var(--text);

}


.login-heading p {

    margin-top: 10px;

    color: var(--muted);

    font-size: 14px;

}


/* =========================================================
   FORMULÁRIO
========================================================= */

.login-form {

    width: 100%;

}


.form-field {

    margin-bottom: 22px;

}


.form-field > label,
.password-label label {

    display: block;

    margin-bottom: 9px;

    color: #46443f;

    font-size: 12px;

    font-weight: 700;

}


.password-label {

    display: flex;

    justify-content: space-between;

    align-items: center;

    margin-bottom: 9px;

}


.password-label label {

    margin-bottom: 0;

}


/* =========================================================
   INPUT
========================================================= */

.input-wrapper {

    position: relative;

    display: flex;

    align-items: center;

}


.input-wrapper input {

    width: 100%;

    height: 55px;

    padding:
        0
        48px;

    border:
        1px solid
        var(--border);

    border-radius: 2px;

    outline: none;

    background:
        rgba(255,255,255,0.8);

    color: var(--text);

    font-size: 14px;

    transition:
        border-color .25s ease,
        box-shadow .25s ease,
        background .25s ease;

}


.input-wrapper input::placeholder {

    color:
        #aaa79f;

}


.input-wrapper input:hover {

    background:
        #ffffff;

}


.input-wrapper input:focus {

    border-color:
        var(--gold);

    background:
        #ffffff;

    box-shadow:
        0 0 0 4px
        rgba(180,154,108,0.09);

}


/* =========================================================
   ÍCONE INPUT
========================================================= */

.input-icon {

    position: absolute;

    left: 17px;

    z-index: 2;

    width: 20px;

    text-align: center;

    color:
        #9a978f;

    font-size: 13px;

    pointer-events: none;

}


.toggle-password {

    position: absolute;

    right: 12px;

    width: 35px;

    height: 35px;

    border: none;

    background: transparent;

    color:
        #929087;

    font-size: 13px;

    transition:
        color .2s ease;

}


.toggle-password:hover {

    color: var(--gold-dark);

}


/* =========================================================
   ESQUECI SENHA
========================================================= */

.forgot-password {

    border: none;

    background: transparent;

    color:
        var(--gold-dark);

    font-size: 11px;

    font-weight: 600;

}


.forgot-password:hover {

    text-decoration: underline;

}


/* =========================================================
   ERROS
========================================================= */

.field-error {

    display: block;

    min-height: 16px;

    margin-top: 6px;

    color:
        var(--error);

    font-size: 11px;

}


/* =========================================================
   MENSAGEM
========================================================= */

.login-message {

    display: none;

    padding: 12px 14px;

    margin-bottom: 15px;

    border-radius: 3px;

    font-size: 12px;

    line-height: 1.5;

}


.login-message.show {

    display: block;

}


.login-message.error {

    color:
        #914343;

    background:
        rgba(185,75,75,0.08);

    border:
        1px solid
        rgba(185,75,75,0.18);

}


.login-message.success {

    color:
        #37654a;

    background:
        rgba(70,120,91,0.08);

    border:
        1px solid
        rgba(70,120,91,0.18);

}


/* =========================================================
   BOTÃO LOGIN
========================================================= */

.login-button {

    position: relative;

    width: 100%;

    height: 56px;

    display: flex;

    align-items: center;

    justify-content: center;

    gap: 10px;

    border:
        1px solid
        var(--black);

    border-radius: 2px;

    background:
        var(--black);

    color:
        #ffffff;

    font-size: 12px;

    font-weight: 700;

    letter-spacing: 0.5px;

    transition:
        transform .2s ease,
        background .2s ease,
        box-shadow .2s ease;

}


.login-button:hover {

    background:
        #33332e;

    box-shadow:
        0 12px 25px
        rgba(32,32,30,0.16);

    transform:
        translateY(-1px);

}


.login-button:active {

    transform:
        translateY(0);

}


.login-button:disabled {

    cursor:
        not-allowed;

    opacity:
        0.65;

    transform:
        none;

}


/* =========================================================
   SPINNER
========================================================= */

.button-spinner {

    display: none;

    width: 15px;

    height: 15px;

    border:
        2px solid
        rgba(255,255,255,0.35);

    border-top-color:
        #ffffff;

    border-radius: 50%;

    animation:
        loginSpin .7s linear infinite;

}


.login-button.loading
.button-spinner {

    display: block;

}


.login-button.loading
#loginButtonText {

    display: none;

}


@keyframes loginSpin {

    to {
        transform:
            rotate(360deg);
    }

}


/* =========================================================
   DIVISOR
========================================================= */

.login-divider {

    display: flex;

    align-items: center;

    gap: 14px;

    margin:
        27px 0;

}


.login-divider span {

    flex: 1;

    height: 1px;

    background:
        var(--border);

}


.login-divider small {

    color:
        #a09d95;

    font-size: 10px;

    white-space: nowrap;

}


/* =========================================================
   GOOGLE
========================================================= */

.google-button {

    width: 100%;

    height: 55px;

    display: flex;

    align-items: center;

    justify-content: center;

    gap: 12px;

    border:
        1px solid
        var(--border);

    border-radius: 2px;

    background:
        #ffffff;

    color:
        #393834;

    font-size: 12px;

    font-weight: 600;

    transition:
        border-color .2s ease,
        box-shadow .2s ease,
        transform .2s ease;

}


.google-button:hover {

    border-color:
        #c7c3b9;

    box-shadow:
        0 8px 22px
        rgba(30,28,24,0.07);

    transform:
        translateY(-1px);

}


.google-icon {

    width: 18px;

    height: 18px;

    display: flex;

}


.google-icon svg {

    width: 18px;

    height: 18px;

}


.google-icon path:nth-child(1) {
    fill: #4285F4;
}


.google-icon path:nth-child(2) {
    fill: #34A853;
}


.google-icon path:nth-child(3) {
    fill: #FBBC05;
}


.google-icon path:nth-child(4) {
    fill: #EA4335;
}


/* =========================================================
   CADASTRO
========================================================= */

.login-register {

    display: flex;

    justify-content: center;

    align-items: center;

    gap: 5px;

    margin-top: 27px;

    color:
        #85827b;

    font-size: 12px;

}


.login-register a {

    color:
        var(--gold-dark);

    font-weight: 700;

}


.login-register a:hover {

    text-decoration: underline;

}


/* =========================================================
   PRIVACIDADE
========================================================= */

.login-privacy {

    display: flex;

    align-items: flex-start;

    gap: 9px;

    margin-top: 30px;

    padding:
        13px 14px;

    border:
        1px solid
        rgba(180,154,108,0.16);

    background:
        rgba(180,154,108,0.05);

}


.login-privacy span {

    font-size: 12px;

    opacity: 0.7;

}


.login-privacy p {

    color:
        #85827b;

    font-size: 10px;

    line-height: 1.55;

}


/* =========================================================
   CONTATO
========================================================= */

.login-contact {

    display: flex;

    flex-direction: column;

    align-items: center;

    gap: 6px;

    margin-top: 38px;

}


.login-contact span {

    color:
        #aaa79f;

    font-size: 8px;

    font-weight: 700;

    letter-spacing: 2px;

}


.login-contact a {

    color:
        var(--gold-dark);

    font-size: 11px;

    font-weight: 600;

}


.login-contact a:hover {

    text-decoration: underline;

}


/* =========================================================
   MODAL
========================================================= */

.modal {

    position: fixed;

    inset: 0;

    z-index: 1000;

    display: none;

    align-items: center;

    justify-content: center;

    padding: 25px;

}


.modal.open {

    display: flex;

}


.modal-overlay {

    position: absolute;

    inset: 0;

    background:
        rgba(15,15,13,0.65);

    backdrop-filter:
        blur(7px);

    animation:
        modalFade .2s ease;

}


.modal-card {

    position: relative;

    z-index: 2;

    width: 100%;

    max-width: 440px;

    padding:
        45px;

    background:
        #faf9f6;

    box-shadow:
        0 30px 80px
        rgba(0,0,0,0.22);

    animation:
        modalUp .25s ease;

}


@keyframes modalFade {

    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }

}


@keyframes modalUp {

    from {
        opacity: 0;
        transform:
            translateY(20px);
    }

    to {
        opacity: 1;
        transform:
            translateY(0);
    }

}


/* =========================================================
   FECHAR MODAL
========================================================= */

.modal-close {

    position: absolute;

    top: 15px;

    right: 17px;

    width: 36px;

    height: 36px;

    display: flex;

    align-items: center;

    justify-content: center;

    border: none;

    background: transparent;

    color:
        #77746d;

    font-size: 25px;

    font-weight: 300;

}


.modal-close:hover {

    color:
        var(--black);

}


/* =========================================================
   ÍCONE MODAL
========================================================= */

.modal-icon {

    width: 46px;

    height: 46px;

    display: flex;

    align-items: center;

    justify-content: center;

    margin-bottom: 22px;

    border:
        1px solid
        rgba(180,154,108,0.4);

    color:
        var(--gold-dark);

    font-size: 18px;

}


.modal-card h3 {

    margin-top: 4px;

    font-family:
        "Playfair Display",
        Georgia,
        serif;

    font-size: 32px;

    font-weight: 500;

}


.modal-card > p {

    margin:
        12px 0 28px;

    color:
        var(--muted);

    font-size: 13px;

    line-height: 1.7;

}


/* =========================================================
   RESPONSIVIDADE — TABLET
========================================================= */

@media (max-width: 1050px) {

    .login-page {

        grid-template-columns:
            1fr
            500px;

    }


    .login-brand {

        padding:
            45px;

    }


    .brand-message h1 {

        font-size:
            clamp(42px, 5vw, 60px);

    }

}


/* =========================================================
   RESPONSIVIDADE — MOBILE
========================================================= */

@media (max-width: 800px) {

    body {

        background:
            var(--cream);

    }


    .login-page {

        display: block;

        min-height: 100vh;

    }


    /* -----------------------------------------
       MARCA
    ----------------------------------------- */

    .login-brand {

        min-height:
            auto;

        padding:
            28px 25px 45px;

    }


    .brand-logo {

        margin-bottom:
            70px;

    }


    .brand-message h1 {

        font-size:
            clamp(42px, 13vw, 58px);

        letter-spacing:
            -1.5px;

    }


    .brand-message p {

        font-size:
            13px;

        margin-top:
            20px;

    }


    .brand-quote {

        margin-top:
            35px;

    }


    .brand-meeting {

        margin-top:
            30px;

    }


    .brand-footer {

        display:
            none;

    }


    /* -----------------------------------------
       LOGIN
    ----------------------------------------- */

    .login-panel {

        min-height:
            auto;

        padding:
            55px 25px 45px;

        background:
            var(--cream-light);

    }


    .login-card {

        max-width:
            500px;

    }


    .login-heading {

        margin-bottom:
            30px;

    }


    .login-heading h2 {

        font-size:
            38px;

    }


    .login-contact {

        margin-top:
            30px;

    }

}


/* =========================================================
   MOBILE PEQUENO
========================================================= */

@media (max-width: 420px) {

    .login-brand {

        padding:
            25px 20px 38px;

    }


    .login-panel {

        padding:
            45px 20px 35px;

    }


    .brand-logo {

        margin-bottom:
            55px;

    }


    .brand-logo-text {

        font-size:
            18px;

    }


    .brand-message h1 {

        font-size:
            40px;

    }


    .brand-message p {

        font-size:
            12px;

    }


    .login-heading h2 {

        font-size:
            34px;

    }


    .modal {

        padding:
            15px;

    }


    .modal-card {

        padding:
            35px 25px;

    }

}


/* =========================================================
   ACESSIBILIDADE
========================================================= */

button:focus-visible,
a:focus-visible,
input:focus-visible {

    outline:
        2px solid
        var(--gold);

    outline-offset:
        3px;

}


/* =========================================================
   REDUÇÃO DE MOVIMENTO
========================================================= */

@media (prefers-reduced-motion: reduce) {

    *,
    *::before,
    *::after {

        scroll-behavior:
            auto !important;

        animation-duration:
            0.01ms !important;

        animation-iteration-count:
            1 !important;

        transition-duration:
            0.01ms !important;

    }

}
```
