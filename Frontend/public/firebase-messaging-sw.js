/* global importScripts, firebase */

// Firebase App
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js"
);

// Firebase Messaging
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3uaNQ22n4CMrpOlYSHY4l0zCq3JGbN0k",
  authDomain: "healthtrack-507408.firebaseapp.com",
  projectId: "healthtrack-507408",
  storageBucket: "healthtrack-507408.firebasestorage.app",
  messagingSenderId: "219847939232",
  appId: "1:219847939232:web:b30e906c4eba01adb7a5c5"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase Messaging
const messaging = firebase.messaging();

// Background notification
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message:",
    payload
  );

  const notificationTitle =
    payload.notification?.title || "HealthTrack";

  const notificationOptions = {
    body:
      payload.notification?.body ||
      "You have a new notification.",
    icon: "/logo192.png",
    data: payload.data || {}
  };

  self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

// Notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          return client.focus();
        }
      }

      if (self.clients.openWindow) {
        return self.clients.openWindow("/");
      }
    })
  );
});