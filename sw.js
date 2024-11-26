importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

// Initialize Firebase in the service worker
firebase.initializeApp({
    apiKey: "AIzaSyBBFtxoPU6_Wa92wL-1YGFvGe5rqk_oxYo",
    authDomain: "notification-3c0be.firebaseapp.com",
    projectId: "notification-3c0be",
    storageBucket: "notification-3c0be.appspot.com",
    messagingSenderId: "492100026014",
    appId: "1:492100026014:web:88b0624ec055d10d17c58f",
    measurementId: "G-GZ1LGYWB85",
});

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log("[Service Worker] Background message received:", payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
