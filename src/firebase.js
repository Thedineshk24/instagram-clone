import firebase from 'firebase'

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCQK0DXotZRt_zM4Fu6YmpbPc-71Wn0DZQ",
    authDomain: "instagram-react-clone-980dc.firebaseapp.com",
    databaseURL: "https://instagram-react-clone-980dc.firebaseio.com",
    projectId: "instagram-react-clone-980dc",
    storageBucket: "instagram-react-clone-980dc.appspot.com",
    messagingSenderId: "110672499769",
    appId: "1:110672499769:web:14637bf728b7525da169e8",
    measurementId: "G-QZQ00FX5L9"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage} ;