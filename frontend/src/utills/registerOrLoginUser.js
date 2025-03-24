import { messaging } from "./firebase";

async function registerOrLoginUser(userData) {
  // 1) Submit user info to your server (create account in DB).
  //    Assume you get a successful response indicating user is registered.

  // 2) Ask for notification permission from the browser
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    try {
      // 3) Generate an FCM token (the `vapidKey` is from Firebase Console → Project Settings → Cloud Messaging)
      const currentToken = await getToken(messaging, {
        vapidKey: "YOUR_PUBLIC_VAPID_KEY",
      });

      if (currentToken) {
        console.log("FCM Token:", currentToken);

        // 4) Send this token to your server to store in the DB (associated with the user)
        await fetch("/api/save-fcm-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: currentToken, userId: userData.id }),
        });
      }
    } catch (error) {
      console.error("Error getting FCM token:", error);
    }
  } else {
    console.log("Notifications permission not granted");
  }
}
