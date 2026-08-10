```javascript
/* =========================================================
   SUAS MEMÓRIAS AQUI
   FIREBASE.JS

   Configuração central do Firebase
   Authentication + Firestore + Storage
========================================================= */


/* =========================================================
   FIREBASE APP
========================================================= */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";


/* =========================================================
   FIREBASE AUTHENTICATION
========================================================= */

import {
    getAuth,
    GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";


/* =========================================================
   FIRESTORE
========================================================= */

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


/* =========================================================
   FIREBASE STORAGE
========================================================= */

import {
    getStorage
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js";


/* =========================================================
   CONFIGURAÇÃO DO SEU PROJETO
========================================================= */

const firebaseConfig = {

    apiKey:
        "AIzaSyBQtD6m2ti24SQjEqAFZ3idQP50xRYa7co",

    authDomain:
        "lsfotostory-d908f.firebaseapp.com",

    projectId:
        "lsfotostory-d908f",

    storageBucket:
        "lsfotostory-d908f.firebasestorage.app",

    messagingSenderId:
        "17338738179",

    appId:
        "1:17338738179:web:b193bba14d5dc0ce2f5036",

    measurementId:
        "G-GR899RTPSW"

};


/* =========================================================
   INICIALIZAR FIREBASE
========================================================= */

const app =
    initializeApp(
        firebaseConfig
    );


/* =========================================================
   AUTHENTICATION
========================================================= */

const auth =
    getAuth(
        app
    );


/* =========================================================
   GOOGLE
========================================================= */

const googleProvider =
    new GoogleAuthProvider();


googleProvider.setCustomParameters({

    prompt:
        "select_account"

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

    googleProvider,

    db,

    storage

};


/* =========================================================
   TESTE
========================================================= */

console.log(
    "Firebase conectado — Suas Memórias Aqui."
);
```
