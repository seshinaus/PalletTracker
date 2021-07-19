import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBw0QNuF8xTKxGJpilXCkkyNsoGle6Mzv4",
  authDomain: "junior-team-dev.firebaseapp.com",
  databaseURL: "https://junior-team-dev-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "junior-team-dev",
  storageBucket: "junior-team-dev.appspot.com",
  messagingSenderId: "649546298030",
  appId: "1:649546298030:web:a59fc788eb93a1b857733f",
  measurementId: "G-GEFNY9V0ZT"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
export default { db };
