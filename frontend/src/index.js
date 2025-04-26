import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';


// 1) Import Firebase libraries
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// 2) Your Firebase config (from Project Settings)
const firebaseConfig = {
  apiKey: "AIzaSyBgGzAOM-ux3RkE4tLXdothJd0aF3qyt5g",
  authDomain: "itp-2025-15b25.firebaseapp.com",
  projectId: "itp-2025-15b25",
  storageBucket: "itp-2025-15b25.firebasestorage.app",
  messagingSenderId: "531122629927",
  appId: "1:531122629927:web:81c439f809c87cc1408d02",
  measurementId: "G-SCF8E8Z6W5",
};

// 3) Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// 4) Register the service worker for background notifications
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then(async (registration) => {
      console.log("Service Worker registered:", registration);

      // 5) Request permission for notifications
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        try {
          // 6) Get FCM token (use your public VAPID key from Firebase Console → Cloud Messaging)
          const currentToken = await getToken(messaging, {
            vapidKey:
              "BI4dyJq3nAjbdYTMoxTECj_mo0HdYYxeji4a-q5uiZHrq9Fapd-blaSGZTu9RCBDzobx8M-WPnYt8f2xhjuFyT4",
          });

          if (currentToken) {
            console.log("FCM token:", currentToken);
            // TODO: Send this token to your server (e.g., via fetch) to store in DB
            // fetch('/api/save-fcm-token', { ... });
          }
        } catch (err) {
          console.error("Error getting FCM token:", err);
        }
      } else {
        console.log("Notification permission not granted");
      }
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
}

// 7) (Optional) Listen for messages while the app is in the foreground
onMessage(messaging, (payload) => {
  console.log("Received foreground message:", payload);
  // Here you can use your own UI toast or modal component instead of alert.
  alert(`${payload.notification.title}\n${payload.notification.body}`);
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

