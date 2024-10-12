import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyDxs66bVRGCZ-ziNfAKPIxeV6Vrm52A1FI",
  authDomain: "trello-e1641.firebaseapp.com",
  projectId: "trello-e1641",
  storageBucket: "trello-e1641.appspot.com",
  messagingSenderId: "474941774655",
  appId: "1:474941774655:web:085e770c981660a52b118a",
  measurementId: "G-R6S5WHW0KC"
};

const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);  
const db = getFirestore(app);     

export { db };
