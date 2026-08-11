```javascript
/* =========================================================
   LS.FOTOSTORY
   FIREBASE.JS
   Configuração central do Firebase
========================================================= */

import { initializeApp } from
    "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    getStorage
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";


/* =========================================================
   CONFIGURAÇÃO DO SEU PROJETO FIREBASE

   IMPORTANTE:
   Substitua somente os valores abaixo pelos dados
   do seu projeto no Firebase.
========================================================= */

const firebaseConfig = {

    apiKey: "COLOQUE_SUA_API_KEY_AQUI",

    authDomain:
        "COLOQUE_SEU_PROJETO.firebaseapp.com",

    projectId:
        "COLOQUE_SEU_PROJECT_ID_AQUI",

    storageBucket:
        "COLOQUE_SEU_STORAGE_BUCKET_AQUI",

    messagingSenderId:
        "COLOQUE_SEU_MESSAGING_SENDER_ID_AQUI",

    appId:
        "COLOQUE_SEU_APP_ID_AQUI"

};


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

const app =
    initializeApp(
        firebaseConfig
    );


/* =========================================================
   AUTENTICAÇÃO
========================================================= */

const auth =
    getAuth(
        app
    );


/* =========================================================
   LOGIN GOOGLE
========================================================= */

const googleProvider =
    new GoogleAuthProvider();


googleProvider.setCustomParameters({
    prompt: "select_account"
});


/* =========================================================
   FIRESTORE
========================================================= */

const db =
    getFirestore(
        app
    );


/* =========================================================
   STORAGE
========================================================= */

const storage =
    getStorage(
        app
    );


/* =========================================================
   EXPORTAÇÕES
========================================================= */

export {
    app,
    auth,
    db,
    storage,
    googleProvider
};
```
