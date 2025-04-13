// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// import dotenv from 'dotenv';

// dotenv.config();
// Your web app's Firebase configuration
export const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let app;

if (getApps().length === 0) {
	app = initializeApp(firebaseConfig);
} else {
	app = getApps()[0];
}

// Initialize Firebase
export const db = initializeFirestore(app, {
	experimentalAutoDetectLongPolling: false
});
export const firebaseAuth = getAuth(app);
export const storage = getStorage(app);
