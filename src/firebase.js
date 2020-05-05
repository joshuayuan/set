import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyDRnyzMc_vvktILHbiSW0C5T0YBOcxk4oE",
    authDomain: "joshy-set-online.firebaseapp.com",
    databaseURL: "https://joshy-set-online.firebaseio.com",
    projectId: "joshy-set-online",
    storageBucket: "joshy-set-online.appspot.com",
    messagingSenderId: "1058452292083",
    appId: "1:1058452292083:web:3f2198f86e1de3a5a7d286",
    measurementId: "G-R69QQKTEN5"
};

firebase.initializeApp(firebaseConfig);
export default firebase;
