// import React, { useEffect } from "react";
// import { getToken } from "firebase/messaging";
// import { messaging } from "../firebase";
// const appId = import.meta.env.NOTIFICATION_TOKEN_KEY;
// const Notification = () => {
//   useEffect(() => {
//     const getFCMToken = async () => {
//       try {
//         // Browser notification permission
//         const permission = await Notification.requestPermission();

//         if (permission !== "granted") {
//           console.log("Notification permission denied");
//           return;
//         }

//         // Get FCM Token
//         const token = await getToken(messaging, {
//           vapidKey: {appId}
//         });

//         if (token) {
//           console.log("FCM Token:", token);
//         } else {
//           console.log("No FCM token received");
//         }
//       } catch (error) {
//         console.error("FCM Token Error:", error);
//       }
//     };

//     getFCMToken();
//   }, []);


import React, { useEffect } from "react";
import { getToken } from "firebase/messaging";
import { messaging } from "../firebase";
const appId = import.meta.env.NOTIFICATION_TOKEN_KEY;

const Notification = () => {
  useEffect(() => {
    const getFCMToken = async () => {
      try {
        // Browser notification permission
        const permission = await window.Notification.requestPermission();

        console.log("Notification permission:", permission);

        if (permission !== "granted") {
          console.log("Notification permission denied");
          return;
        }

        // Get FCM token
        const token = await getToken(messaging, {
          vapidKey: {appId},
        });

        if (token) {
          console.log("FCM Token:", token);
        } else {
          console.log("No FCM token received");
        }
      } catch (error) {
        console.error("FCM Token Error:", error);
      }
    };

    getFCMToken();
  }, []);

  return null;
};

export default Notification;

  return null;
};

export default Notification;
