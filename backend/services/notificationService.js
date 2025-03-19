const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("../configarations/xaphora-dress-firebase-adminsdk-fbsvc-f7145e832e.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const sendNotification = async (product) => {
  const message = {
    notification: {
      title: "Low Stock Alert",
      body: `The product "${product.name}" is low on stock! Only ${product.stockQuantity} left.`,
    },
    token: process.env.FCM_TOKEN, // Admin's FCM Token for push notifications
  };

  try {
    await admin.messaging().send(message);
    console.log("Notification sent!");
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

module.exports = { sendNotification };
