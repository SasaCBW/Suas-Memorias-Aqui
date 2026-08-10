```javascript
/* =========================================================
   SUAS MEMÓRIAS AQUI
   FIREBASE.JS

   Configuração central do Firebase
   Authentication
   Firestore
   Storage
========================================================= */


/* =========================================================
   IMPORTS
========================================================= */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";


import {
    getAuth
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";


import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


import {
    getStorage
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js";


/* =========================================================
   CONFIGURAÇÃO DO SEU PROJETO FIREBASE
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
   FIREBASE AUTHENTICATION
========================================================= */

const auth =
    getAuth(app);


/* =========================================================
   FIRESTORE
========================================================= */

const db =
    getFirestore(app);


/* =========================================================
   STORAGE
========================================================= */

const storage =
    getStorage(app);


/* =========================================================
   EXPORTAR SERVIÇOS
========================================================= */

export {
    app,
    auth,
    db,
    storage
};


/* =========================================================
   CONFIRMAÇÃO
========================================================= */

console.log(
    "Firebase conectado com sucesso."
);
```
