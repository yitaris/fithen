import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage'; // Firebase Storage modülünü import edin
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBsr951PgYO5-U8WIMi8NhYRrKdCNyCINU",
    authDomain: "fithen-92021.firebaseapp.com",
    projectId: "fithen-92021",
    storageBucket: "fithen-92021.appspot.com",
    messagingSenderId: "195521370075",
    appId: "1:195521370075:web:b8533a7840bf5c87a979fe",
    measurementId: "G-438VDMF5GW"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app); // Firebase Storage'ı initialize edin
const db = getFirestore(app);
export { auth, db, firestore, storage };