import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getMessaging,
    getToken as getFCMToken,
    onMessage,
    isSupported,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js";

// Logging functions for easier debugging
const log = (ns, ...args) => {
    console.group(
        `%c FCM %c [Info] %c [${ns}]`,
        "background: #E72020; color: #fff",
        "background: #1E88E5; color: #fff",
        "color: black"
    );
    console.log(...args);
    console.groupEnd();
};

const error = (ns, message, err) => {
    console.group(
        `%c FCM %c [Error] %c [${ns}] - ${message}`,
        "background: #E72020; color: #fff",
        "background: #F39C12; color: #fff",
        "color: black"
    );
    console.error(err);
    console.groupEnd();
};

// Load Firebase configuration from a file
const loadFirebaseConfig = async () => {
    try {
        const response = await fetch("./firebase-config.json");
        if (!response.ok) throw new Error("Failed to fetch Firebase config.");
        return await response.json();
    } catch (err) {
        error("Config", "Failed to load Firebase config.", err);
        return null;
    }
};

// Request notification permission and get token
const requestPermission = async () => {
    log("Permission", "Requesting notification permission...");

    if (!isSupported()) {
        error("Permission", "Notifications are not supported in this browser.");
        return;
    }

    const firebaseConfig = await loadFirebaseConfig();
    if (!firebaseConfig) return;

    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);

    if (Notification.permission === "denied") {
        error("Permission", "Notifications are blocked in browser settings.");
        return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
        error("Permission", "User denied the notification permission.");
        return;
    }

    const token = await getFCMToken(messaging, {
        vapidKey: firebaseConfig.vapidKey,
    });

    if (token) {
        log("Token", "Token received:", token);
        document.getElementById("token").innerText = token;
        document.cookie = `fcmToken=${token}; path=/; max-age=604800`; // 7 days
    } else {
        error("Token", "Failed to get FCM token.");
    }
};

// Handle foreground messages
const handleMessages = (messaging) => {
    onMessage(messaging, (payload) => {
        log("Message", "Message received in foreground:", payload);
        const { title, body } = payload.notification;
        new Notification(title, { body });
    });
};

(async () => {
    const firebaseConfig = await loadFirebaseConfig();
    if (!firebaseConfig) return;

    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);

    handleMessages(messaging);
})();
