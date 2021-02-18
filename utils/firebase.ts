import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
	apiKey: 'AIzaSyDRbWrzeOcWs5WLKKlf6iHuZK7pRHUC_dw',
	authDomain: 'nextfire-26eeb.firebaseapp.com',
	databaseURL: 'https://nextfire-26eeb-default-rtdb.firebaseio.com',
	projectId: 'nextfire-26eeb',
	storageBucket: 'nextfire-26eeb.appspot.com',
	messagingSenderId: '877450305741',
	appId: '1:877450305741:web:1537309e936877cec78984',
	measurementId: 'G-ZQ83F10VEP',
};

// only initialize if the length is zero
if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const firestore = firebase.firestore();
export const storage = firebase.storage();
