import device from "../model/device.js"; // Aapka device model path

export const sendPushNotification = async (userId, title, message) => {
   console.log("🚨 send push notification block trigers!");
  try {
    // 1. डेटाबेस से यूजर की OneSignal Player ID ढूंढें
    const userDevice = await device.findOne({ userid: userId });
    
    if (!userDevice || !userDevice.oneSignalPlayerId) {
      console.log("❌ Is user ki Player ID nahi mili!");
      return;
    }

    const playerId = userDevice.oneSignalPlayerId;

    // 2. Native fetch se OneSignal API ko Request bhejen
    const response = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "os_v2_app_v5t2ytgpyffgxovl7zv4swpnhz2pifjlkgnulfn5v547wjsde3ebthvmiw6uzo77am6smwtfr6uwim5bo5jc53e7pfoaupa733u2dha", // 👈 Yahan apni asli OneSignal REST API Key daal dena
      },
      body: JSON.stringify({
        app_id: "af67ac4c-cfc1-4a6b-baab-fe6bc959ed3e",
        include_player_ids: [playerId],
        headings: { en: title },
        contents: { en: message },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    console.log("✅ Notification Sent Successfully:", data);
  } catch (error) {
    console.error("❌ Error sending notification:", error.message);
  }
};
