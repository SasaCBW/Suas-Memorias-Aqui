```javascript
/* =========================================================
   SUAS MEMÓRIAS AQUI
   FIREBASE.JS

   Configuração central do Firebase
========================================================= */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

import {
    getStorage
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-storage.js";

import {
    getAnalytics
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";


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
   ANALYTICS
========================================================= */

let analytics = null;

try {

    analytics =
        getAnalytics(
            app
        );

} catch (error) {

    console.info(
        "Firebase Analytics não está disponível neste ambiente."
    );

}


/* =========================================================
   EXPORTAÇÕES
========================================================= */

export {

    app,

    auth,

    db,

    storage,

    analytics

};
```
