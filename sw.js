importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

// Firebase configuration
firebase.initializeApp({
    apiKey: "AIzaSyBBFtxoPU6_Wa92wL-1YGFvGe5rqk_oxYo",
    authDomain: "notification-3c0be.firebaseapp.com",
    projectId: "notification-3c0be",
    storageBucket: "notification-3c0be.firebasestorage.app",
    messagingSenderId: "492100026014",
    appId: "1:492100026014:web:88b0624ec055d10d17c58f",
    measurementId: "G-GZ1LGYWB85",
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log("[Service Worker] Background message received:", payload);

    const { title, body, icon, click_action } = payload.notification || {};
    self.registration.showNotification(title || "Notification", {
        body: body || "You have a new message.",
        icon: icon || "/default-icon.png", // Replace with a fallback icon if needed
        data: {
            click_action: click_action || "/", // Provide a fallback URL if click_action is not set
        },
        actions: [
            { action: "view", title: "View Message" },
            { action: "dismiss", title: "Dismiss" },
        ],
    });
});

// Handle notification click events
self.addEventListener("notificationclick", (event) => {
    console.log("[Service Worker] Notification click received:", event);

    // Extract the URL from the notification data
    const url = event.notification.data?.click_action || "/";

    event.notification.close(); // Close the notification

    // Focus or open the URL in a new tab/window
    event.waitUntil(
        clients
            .matchAll({ type: "window", includeUncontrolled: true })
            .then((windowClients) => {
                const matchingClient = windowClients.find(
                    (client) => client.url === url
                );
                if (matchingClient) {
                    return matchingClient.focus();
                } else {
                    return clients.openWindow(url);
                }
            })
    );
});

// Handle service worker installation
self.addEventListener("install", (event) => {
    console.log("[Service Worker] Installed");
    self.skipWaiting(); // Activate the service worker immediately
});

// Handle service worker activation
self.addEventListener("activate", (event) => {
    console.log("[Service Worker] Activated");
    event.waitUntil(self.clients.claim()); // Take control of all clients immediately
});
