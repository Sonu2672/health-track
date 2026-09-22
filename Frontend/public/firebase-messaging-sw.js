// /* global importScripts, firebase */
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
  console.log("🔥 BACKGROUND MESSAGE:", payload);

  const title = payload?.notification?.title || "HealthTrack";

  const body =
    payload?.notification?.body || "New notification received";

  self.registration.showNotification(title, {
    body: body,
    icon: "/logo192.png",
    badge: "/logo192.png",
    tag: "healthtrack-notification",
    renotify: true,
    data: payload?.data || {}
  });
});

self.addEventListener("notificationclick", (event) => {
  console.log("🔔 Notification clicked");

  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then((clients) => {
      if (clients.length > 0) {
        return clients[0].focus();
      }

      return self.clients.openWindow("/");
    })
  );
});


// // Firebase App
// importScripts(
//   "https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js"
// );

// // Firebase Messaging
// importScripts(
//   "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
// );

// // Firebase Configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyA3uaNQ22n4CMrpOlYSHY4l0zCq3JGbN0k",
//   authDomain: "healthtrack-507408.firebaseapp.com",
//   projectId: "healthtrack-507408",
//   storageBucket: "healthtrack-507408.firebasestorage.app",
//   messagingSenderId: "219847939232",
//   appId: "1:219847939232:web:b30e906c4eba01adb7a5c5"
// };

// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);

// // Firebase Messaging
// const messaging = firebase.messaging();

// // Background notification
// messaging.onBackgroundMessage((payload) => {
//   console.log(
//     "[firebase-messaging-sw.js] Received background message:",
//     payload
//   );

//   const notificationTitle =
//     payload.notification?.title || "HealthTrack";

//   const notificationOptions = {
//     body:
//       payload.notification?.body ||
//       "You have a new notification.",
//     icon: "/logo192.png",
//     data: payload.data || {}
//   };

//   self.registration.showNotification(
//     notificationTitle,
//     notificationOptions
//   );
// });

// // Notification click
// self.addEventListener("notificationclick", (event) => {
//   event.notification.close();

//   event.waitUntil(
//     self.clients.matchAll({
//       type: "window",
//       includeUncontrolled: true
//     }).then((clientList) => {
//       for (const client of clientList) {
//         if ("focus" in client) {
//           return client.focus();
//         }
//       }

//       if (self.clients.openWindow) {
//         return self.clients.openWindow("/");
//       }
//     })
//   );
// });
