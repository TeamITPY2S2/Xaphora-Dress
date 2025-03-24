// public/firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

// Initialize the Firebase app in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyBgGzAOM-ux3RkE4tLXdothJd0aF3qyt5g",
  authDomain: "itp-2025-15b25.firebaseapp.com",
  projectId: "itp-2025-15b25",
  storageBucket: "itp-2025-15b25.firebasestorage.app",
  messagingSenderId: "531122629927",
  appId: "1:531122629927:web:81c439f809c87cc1408d02",
  measurementId: "G-SCF8E8Z6W5",
});

const messaging = firebase.messaging();

// Optional: handle background notifications
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message:",
    payload
  );

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
