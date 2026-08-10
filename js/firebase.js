```javascript
/* =========================================================
   SUAS MEMÓRIAS AQUI
   FIREBASE.JS
   Configuração central do Firebase
========================================================= */


/* =========================================================
   FIREBASE APP
========================================================= */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";


/* =========================================================
   FIREBASE AUTHENTICATION
========================================================= */

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


/* =========================================================
   FIRESTORE
========================================================= */

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


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
   AUTENTICATION
========================================================= */

const auth =
    getAuth(
        app
    );


/* =========================================================
   FIRESTORE
========================================================= */

const db =
    getFirestore(
        app
    );


/* =========================================================
   EXPORTAR
========================================================= */

export {
    app,
    auth,
    db
};


/* =========================================================
   CONFIRMAÇÃO
========================================================= */

console.log(
    "Firebase conectado com sucesso."
);
```
