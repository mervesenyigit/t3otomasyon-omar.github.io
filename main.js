import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getMessaging,
    getToken,
    onMessage,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBBFtxoPU6_Wa92wL-1YGFvGe5rqk_oxYo",
    authDomain: "notification-3c0be.firebaseapp.com",
    projectId: "notification-3c0be",
    storageBucket: "notification-3c0be.appspot.com",
    messagingSenderId: "492100026014",
    appId: "1:492100026014:web:88b0624ec055d10d17c58f",
    measurementId: "G-GZ1LGYWB85",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/noty/sw.js')
        .then((registration) => {
            console.log('Service Worker registered:', registration);

            // Get FCM token after service worker registration
            getToken(messaging, {
                serviceWorkerRegistration: registration,
                vapidKey: "BAzC49MbuF3VSwJTz3wMIX4Rg1DWm35FRHRM5UEcRzgAAn9jwhH07vaPYdUKILyUs8o60GY33KGv5azwxOYDzfw"
            })
                .then((currentToken) => {
                    if (currentToken) {
                        console.log('FCM Token:', currentToken);
                        document.getElementById('token').textContent = `FCM Token: ${currentToken}`;
                        // Optionally, you can send this token to your server
                    } else {
                        console.log('No registration token available.');
                    }
                })
                .catch((err) => {
                    console.error('An error occurred while retrieving the FCM token:', err);
                });
        })
        .catch((err) => {
            console.error('Service Worker registration failed:', err);
        });
}

// Handle foreground messages (when the app is open)
onMessage(messaging, (payload) => {
    console.log('Message received. ', payload);
    // Optionally, show a custom notification or handle the payload
});
