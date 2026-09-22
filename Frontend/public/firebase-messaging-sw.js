/* global importScripts, firebase */

importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyA3uaNQ22n4CMrpOlYSHY4l0zCq3JGbN0k",
  authDomain: "healthtrack-507408.firebaseapp.com",
  projectId: "healthtrack-507408",
  storageBucket: "healthtrack-507408.firebasestorage.app",
  messagingSenderId: "219847939232",
  appId: "1:219847939232:web:b30e906c4eba01adb7a5c5"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("🔥 FCM BACKGROUND MESSAGE:", payload);

  const title = payload?.notification?.title || "HealthTrack";
  const body = payload?.notification?.body || "New notification";

  self.registration
    .showNotification(title, {
      body: body,
      // icon: "/logo192.png",
      // badge: "/logo192.png",
      tag: "healthtrack",
      renotify: true
    })
    .then(() => {
      console.log("✅ showNotification SUCCESS");
    })
    .catch((error) => {
      console.error("❌ showNotification ERROR:", error);
    });
});
