import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDOkspM677YeTOSe_u4vD1CMUAeEwkRdEs",
  authDomain: "sistema-de-ponto-a036f.firebaseapp.com",
  projectId: "sistema-de-ponto-a036f",
  storageBucket: "sistema-de-ponto-a036f.firebasestorage.app",
  messagingSenderId: "27338791225",
  appId: "1:27338791225:web:e4572e7f4f7989c45670e8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  console.error('Erro ao habilitar persistência:', err);
});

// Required indexes for queries
// Collection: registros
// Fields to index:
// 1. usuarioId ASC, data ASC
// 2. usuarioId ASC, data DESC