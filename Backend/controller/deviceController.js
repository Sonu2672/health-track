





import device from "../model/device.js";
// import health from "../model/health.js"

// export const receiveDeviceData = async (req, res) => {
//   try {
//     const {
//       deviceId,
//       heartRate,
//       spo2,
//       temp,
//     } = req.body;

//     if (!deviceId) {
//       return res.status(400).json({
//         success: false,
//         message: "Device ID is required",
//       });
//     }

//     // Registered device find karo
//     const existingDevice = await device.findOne({ deviceId });

//     if (!existingDevice) {
//       return res.status(404).json({
//         success: false,
//         message: "Device is not registered",
//       });
//     }

//     // Registration ke time saved userid fetch hoga
//     const userid = existingDevice.userid;

//     console.log("DEVICE ID:", deviceId);
//     console.log("FETCHED USER ID:", userid);

//     // SAME document update hoga
//     // const updatedDevice = await device.findOneAndUpdate(
//     //   { deviceId },
//     //   {
//     //     heartRate: Number(heartRate ?? 0),
//     //     spo2: Number(spo2 ?? 0),
//     //     temp: Number(temp ?? 0),
//     //   },
//     //   { new: true }
//     // );


//     const updatedDevice = await device.findOneAndUpdate(
//   {
//     deviceId,
//     userid: existingDevice.userid
//   },
//   {
//     heartRate: Number(heartRate ?? 0),
//     spo2: Number(spo2 ?? 0),
//     temp: Number(temp ?? 0),
//   },
//   {
//     new: true
//   }
// );

//     return res.status(200).json({
//       success: true,
//       message: "Device data updated successfully",
//       data: updatedDevice,
//     });

//   } catch (error) {
//     console.error("❌ RECEIVE DEVICE ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };







export const deviceRegister = async (req, res) => {
  try {
    const {deviceId} = req.body;

    if (!deviceId) {
      return res.status(400).json({
        success: false,
        message: "Device ID is required"
      });
    }

    // Logged-in user ID
    const userid = req.user.id;

   const existingDevice = await device.findOne({ deviceId }); //agr device reg hai phle se
      
   if (existingDevice) {
  return res.status(404).json({
    success: false,
    message: "Device is already registered",
  });
}    
    console.log("POST USER ID:", userid);
    console.log("DEVICE ID:", deviceId);

    // Har reading ka NEW document
    const newDeviceData = await device.create({
      deviceId,
      userid,
    });

    return res.status(200).json({
      success: true,
      message: "Device regitered successfully",
      
    });

  } catch (error) {
    console.error("❌ RECEIVE DEVICE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};











// export const getdevicedata = async (req, res) => {
//   try {
//     // ==========================================
//     // GET LOGGED-IN USER ID
//     // ==========================================

//     const userid = req.user.id;

//     console.log("GET USER ID:", userid);

//     // ==========================================
//     // GET LATEST DEVICE DATA
//     // ==========================================

//     const hd = await device
//       .findOne({ userid })
//       .sort({ createdAt: -1 });

//     console.log("LATEST DEVICE DATA:", hd);

//     // ==========================================
//     // NO DEVICE DATA
//     // ==========================================

//     if (!hd) {
//       return res.status(200).json({
//         success: true,
//         message: "No device data found",

//         hd: null,

//         riskScore: 0,
//         riskLevel: "Normal",

//         recommendations: [],
//         datatimers: [],

//         heartRateData: [],
//         spo2Data: [],
//         tempData: [],

//         riskFactors: [],
//       });
//     }

//     // ==========================================
//     // LATEST SENSOR VALUES
//     // ==========================================

//     const heartRate = Number(hd.heartRate ?? 0);
//     const spo2 = Number(hd.spo2 ?? 0);
//     const temp = Number(hd.temp ?? 0);

//     console.log("SENSOR VALUES:");
//     console.log("Heart Rate:", heartRate);
//     console.log("SpO2:", spo2);
//     console.log("Temperature:", temp);

//     // ==========================================
//     // 🤖 ML MODEL PREDICTION
//     // ==========================================

//     let riskScore = 0;

//     try {
//       console.log("🤖 Sending data to ML model...");

//       const mlResponse = await fetch(
//         `${process.env.ML_API_URL}/predict`,
//         {
//           method: "POST",

//           headers: {
//             "Content-Type": "application/json",
//           },

//           body: JSON.stringify({
//             heartRate,
//             spo2,
//             temp,
//           }),
//         }
//       );

//       console.log("ML API STATUS:", mlResponse.status);

//       if (!mlResponse.ok) {
//         throw new Error(
//           `ML API returned status ${mlResponse.status}`
//         );
//       }

//       const mlData = await mlResponse.json();

//       console.log("🤖 ML RESPONSE:", mlData);

//       // ==========================================
//       // GET RISK SCORE FROM ML RESPONSE
//       // ==========================================

//       if (mlData.riskScore !== undefined) {
//         riskScore = Number(mlData.riskScore);
//       }

//       // ------------------------------------------
//       // OPTIONAL:
//       // If model returns probability instead
//       // ------------------------------------------

//       else if (mlData.probability !== undefined) {
//         riskScore = Number(mlData.probability) * 100;
//       }

//       // ------------------------------------------
//       // OPTIONAL:
//       // If model returns prediction
//       // 0 = normal
//       // 1 = risk
//       // ------------------------------------------

//       else if (mlData.prediction !== undefined) {
//         const prediction = Number(mlData.prediction);

//         riskScore = prediction === 1 ? 100 : 0;
//       }

//       // ------------------------------------------
//       // OPTIONAL:
//       // If model returns score
//       // ------------------------------------------

//       else if (mlData.score !== undefined) {
//         riskScore = Number(mlData.score);
//       }

//       else {
//         console.warn(
//           "⚠️ ML API did not return riskScore/probability/prediction/score"
//         );
//       }

//       // ==========================================
//       // MAKE SURE SCORE IS 0-100
//       // ==========================================

//       riskScore = Math.max(
//         0,
//         Math.min(100, riskScore)
//       );

//       // Remove decimal
//       riskScore = Math.round(riskScore);

//     } catch (mlError) {

//       console.error(
//         "❌ ML API ERROR:",
//         mlError.message
//       );

//       // ==========================================
//       // IMPORTANT
//       // ML FAIL HONE PAR APP CRASH NA HO
//       // ==========================================

//       riskScore = 0;
//     }

//     // ==========================================
//     // RISK LEVEL
//     // ==========================================

//     let riskLevel;

//     if (riskScore === 0) {
//       riskLevel = "Normal";
//     }

//     else if (riskScore <= 30) {
//       riskLevel = "Low Risk";
//     }

//     else if (riskScore <= 60) {
//       riskLevel = "Moderate Risk";
//     }

//     else if (riskScore <= 80) {
//       riskLevel = "High Risk";
//     }

//     else {
//       riskLevel = "Critical Risk";
//     }

//     console.log("🤖 FINAL ML RISK SCORE:", riskScore);
//     console.log("🤖 FINAL RISK LEVEL:", riskLevel);

//     // ==========================================
//     // SAVE ML RESULT IN MONGODB
//     // ==========================================

//     hd.riskScore = riskScore;
//     hd.riskLevel = riskLevel;

//     await hd.save();

//     console.log("✅ ML RESULT SAVED TO MONGODB");

//     // ==========================================
//     // GET ALL USER DEVICE DATA
//     // ==========================================

//     const allData = await device
//       .find({ userid })
//       .sort({ createdAt: 1 });

//     console.log(
//       "TOTAL DEVICE RECORDS:",
//       allData.length
//     );

//     // ==========================================
//     // HEART RATE DATA
//     // ==========================================

//     const heartRateData = allData.map((item) => ({
//       time: new Date(item.createdAt).toLocaleTimeString(
//         [],
//         {
//           hour: "2-digit",
//           minute: "2-digit",
//         }
//       ),

//       value: Number(item.heartRate ?? 0),
//     }));

//     // ==========================================
//     // SPO2 DATA
//     // ==========================================

//     const spo2Data = allData.map((item) => ({
//       time: new Date(item.createdAt).toLocaleTimeString(
//         [],
//         {
//           hour: "2-digit",
//           minute: "2-digit",
//         }
//       ),

//       value: Number(item.spo2 ?? 0),
//     }));

//     // ==========================================
//     // TEMPERATURE DATA
//     // ==========================================

//     const tempData = allData.map((item) => ({
//       time: new Date(item.createdAt).toLocaleTimeString(
//         [],
//         {
//           hour: "2-digit",
//           minute: "2-digit",
//         }
//       ),

//       value: Number(item.temp ?? 0),
//     }));

//     // ==========================================
//     // HEALTH TREND DATA
//     // ==========================================

//     const datatimers = allData.map((item) => {

//       const hr = Number(item.heartRate ?? 0);
//       const oxygen = Number(item.spo2 ?? 0);
//       const temperature = Number(item.temp ?? 0);

//       // ------------------------------------------
//       // TEMPORARY TREND SCORE
//       // ------------------------------------------
//       // Latest riskScore is ML based.
//       // Historical graph remains threshold based.
//       // ------------------------------------------

//       let score = 0;

//       // HEART RATE

//       if (hr < 40 || hr > 180) {
//         score += 100;
//       }

//       else if (hr < 50 || hr > 140) {
//         score += 80;
//       }

//       else if (hr < 60 || hr > 120) {
//         score += 60;
//       }

//       else if (hr > 100) {
//         score += 30;
//       }

//       // SPO2

//       if (oxygen < 80) {
//         score += 100;
//       }

//       else if (oxygen < 85) {
//         score += 80;
//       }

//       else if (oxygen < 90) {
//         score += 60;
//       }

//       else if (oxygen < 95) {
//         score += 30;
//       }

//       // TEMPERATURE

//       if (
//         temperature < 32 ||
//         temperature > 42
//       ) {
//         score += 100;
//       }

//       else if (
//         temperature < 34 ||
//         temperature > 40
//       ) {
//         score += 80;
//       }

//       else if (
//         temperature < 35 ||
//         temperature > 39
//       ) {
//         score += 60;
//       }

//       else if (
//         temperature < 36.1 ||
//         temperature > 37.2
//       ) {
//         score += 30;
//       }

//       score = Math.min(score, 100);

//       return {
//         time: new Date(
//           item.createdAt
//         ).toLocaleTimeString(
//           [],
//           {
//             hour: "2-digit",
//             minute: "2-digit",
//           }
//         ),

//         score,
//       };
//     });

//     // ==========================================
//     // RECOMMENDATIONS
//     // ==========================================

//     const recommendations = [];

//     // ------------------------------------------
//     // TEMPERATURE
//     // ------------------------------------------

//     if (temp > 38) {
//       recommendations.push(
//         "Your body temperature is elevated. Rest and monitor your temperature."
//       );
//     }

//     else if (temp < 35) {
//       recommendations.push(
//         "Your body temperature is lower than normal. Keep yourself warm and monitor it."
//       );
//     }

//     else {
//       recommendations.push(
//         "Your body temperature is within the normal range."
//       );
//     }

//     // ------------------------------------------
//     // HEART RATE
//     // ------------------------------------------

//     if (heartRate > 100) {
//       recommendations.push(
//         "Your heart rate is elevated. Avoid strenuous activity and monitor your heart rate."
//       );
//     }

//     else if (heartRate < 60) {
//       recommendations.push(
//         "Your heart rate is relatively low. Continue monitoring it, especially if you feel unwell."
//       );
//     }

//     else {
//       recommendations.push(
//         "Your heart rate is within a normal range."
//       );
//     }

//     // ------------------------------------------
//     // SPO2
//     // ------------------------------------------

//     if (spo2 < 90) {
//       recommendations.push(
//         "Your SpO₂ level is low. Seek medical attention if this persists or you have breathing difficulty."
//       );
//     }

//     else if (spo2 < 95) {
//       recommendations.push(
//         "Your SpO₂ is slightly below the usual range. Continue monitoring it."
//       );
//     }

//     else {
//       recommendations.push(
//         "Your SpO₂ level is within a healthy range."
//       );
//     }

//     // ------------------------------------------
//     // RISK LEVEL
//     // ------------------------------------------

//     if (riskLevel === "Critical Risk") {
//       recommendations.push(
//         "Critical risk detected. Immediate medical attention is recommended."
//       );
//     }

//     else if (riskLevel === "High Risk") {
//       recommendations.push(
//         "High health risk detected. Please monitor your vital signs closely."
//       );
//     }

//     else if (riskLevel === "Moderate Risk") {
//       recommendations.push(
//         "Moderate risk detected. Continue monitoring your health parameters."
//       );
//     }

//     else if (riskLevel === "Low Risk") {
//       recommendations.push(
//         "Low risk detected. Maintain healthy habits and continue monitoring."
//       );
//     }

//     else {
//       recommendations.push(
//         "Your current health indicators look normal. Keep maintaining a healthy lifestyle."
//       );
//     }

//     // ==========================================
//     // RISK FACTORS
//     // ==========================================

//     const riskFactors = [];

//     // Heart rate factor

//     if (heartRate > 100) {
//       riskFactors.push({
//         factor: "Heart Rate",
//         value: heartRate,
//         status: "High",
//       });
//     }

//     else if (heartRate < 60) {
//       riskFactors.push({
//         factor: "Heart Rate",
//         value: heartRate,
//         status: "Low",
//       });
//     }

//     else {
//       riskFactors.push({
//         factor: "Heart Rate",
//         value: heartRate,
//         status: "Normal",
//       });
//     }

//     // SpO2 factor

//     if (spo2 < 90) {
//       riskFactors.push({
//         factor: "SpO₂",
//         value: spo2,
//         status: "Low",
//       });
//     }

//     else if (spo2 < 95) {
//       riskFactors.push({
//         factor: "SpO₂",
//         value: spo2,
//         status: "Slightly Low",
//       });
//     }

//     else {
//       riskFactors.push({
//         factor: "SpO₂",
//         value: spo2,
//         status: "Normal",
//       });
//     }

//     // Temperature factor

//     if (temp > 38) {
//       riskFactors.push({
//         factor: "Temperature",
//         value: temp,
//         status: "High",
//       });
//     }

//     else if (temp < 35) {
//       riskFactors.push({
//         factor: "Temperature",
//         value: temp,
//         status: "Low",
//       });
//     }

//     else {
//       riskFactors.push({
//         factor: "Temperature",
//         value: temp,
//         status: "Normal",
//       });
//     }

//     // ==========================================
//     // FINAL RESPONSE
//     // ==========================================

//     return res.status(200).json({
//       success: true,

//       message: "Data received successfully",

//       // Latest device data
//       hd,

//       // 🤖 ML RESULT
//       riskScore,
//       riskLevel,

//       // Recommendations
//       recommendations,

//       // Graph data
//       datatimers,

//       heartRateData,
//       spo2Data,
//       tempData,

//       // Risk factors
//       riskFactors,
//     });

//   } catch (error) {

//     console.error(
//       "❌ GET DEVICE DATA ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,

//       message: "Failed to get device data",

//       error: error.message,
//     });
//   }
// };



// export const getdevicedata = async (req, res) => {
//   try {
//     // ==========================================
//     // GET LOGGED-IN USER ID
//     // ==========================================

//     const userid = req.user.id;

//     console.log("GET USER ID:", userid);

//     // ==========================================
//     // GET LATEST DEVICE DATA
//     // ==========================================

//     const hd = await device
//       .findOne({ userid })
//       .sort({ createdAt: -1 });

//     console.log("LATEST DEVICE DATA:", hd);

//     // ==========================================
//     // NO DEVICE DATA
//     // ==========================================

//     if (!hd) {
//       return res.status(200).json({
//         success: true,
//         message: "No device data found",

//         hd: null,

//         riskScore: 0,
//         riskLevel: "No Data",
//         prediction: null,

//         recommendations: [],
//         datatimers: [],

//         heartRateData: [],
//         spo2Data: [],
//         tempData: [],

//         riskFactors: [],
//       });
//     }

//     // ==========================================
//     // LATEST SENSOR VALUES
//     // ==========================================

//     const heartRate = Number(hd.heartRate ?? 0);
//     const spo2 = Number(hd.spo2 ?? 0);
//     const temp = Number(hd.temp ?? 0);

//     console.log("SENSOR VALUES:");
//     console.log("Heart Rate:", heartRate);
//     console.log("SpO2:", spo2);
//     console.log("Temperature:", temp);

//     // ==========================================
//     // 🤖 ML MODEL PREDICTION
//     // ==========================================

//     let riskScore = 0;
//     let riskLevel = "ML Unavailable";
//     let prediction = null;
//     let mlAvailable = false;

//     try {
//       console.log("🤖 Sending data to ML model...");

//       const mlUrl = `${process.env.ML_API_URL}/predict`;

//       console.log("🤖 ML URL:", mlUrl);

//       const mlResponse = await fetch(mlUrl, {
//         method: "POST",

//         headers: {
//           "Content-Type": "application/json",
//         },

//         body: JSON.stringify({
//           heartRate,
//           spo2,
//           temp,
//         }),
//       });

//       console.log("ML API STATUS:", mlResponse.status);

//       if (!mlResponse.ok) {
//         throw new Error(
//           `ML API returned status ${mlResponse.status}`
//         );
//       }

//       const mlData = await mlResponse.json();

//       console.log("🤖 ML RESPONSE:", mlData);

//       // ==========================================
//       // GET ML RESULT
//       // ==========================================

//       if (
//         mlData.riskScore === undefined ||
//         mlData.riskLevel === undefined
//       ) {
//         throw new Error(
//           "Invalid ML response: riskScore or riskLevel missing"
//         );
//       }

//       riskScore = Number(mlData.riskScore);

//       riskLevel = String(mlData.riskLevel);

//       prediction =
//         mlData.prediction !== undefined
//           ? Number(mlData.prediction)
//           : null;

//       // ==========================================
//       // VALIDATE RISK SCORE
//       // ==========================================

//       if (Number.isNaN(riskScore)) {
//         throw new Error("Invalid riskScore received from ML model");
//       }

//       riskScore = Math.max(
//         0,
//         Math.min(100, Math.round(riskScore))
//       );

//       mlAvailable = true;

//       console.log("🤖 ML PREDICTION:", prediction);
//       console.log("🤖 ML RISK SCORE:", riskScore);
//       console.log("🤖 ML RISK LEVEL:", riskLevel);

//     } catch (mlError) {
//       console.error(
//         "❌ ML API ERROR:",
//         mlError.message
//       );

//       // IMPORTANT:
//       // ML fail hone par Normal mat dikhao.
//       riskScore = 0;
//       riskLevel = "ML Unavailable";
//       prediction = null;
//       mlAvailable = false;
//     }

//     // ==========================================
//     // FINAL ML RESULT
//     // ==========================================

//     console.log(
//       "🤖 FINAL ML RISK SCORE:",
//       riskScore
//     );

//     console.log(
//       "🤖 FINAL RISK LEVEL:",
//       riskLevel
//     );

//     console.log(
//       "🤖 ML AVAILABLE:",
//       mlAvailable
//     );

//     // ==========================================
//     // SAVE ML RESULT IN MONGODB
//     // ==========================================

//     hd.riskScore = riskScore;
//     hd.riskLevel = riskLevel;

//     await hd.save();

//     console.log("✅ ML RESULT SAVED TO MONGODB");

//     // ==========================================
//     // GET ALL USER DEVICE DATA
//     // ==========================================

//     const allData = await device
//       .find({ userid })
//       .sort({ createdAt: 1 });

//     console.log(
//       "TOTAL DEVICE RECORDS:",
//       allData.length
//     );

//     // ==========================================
//     // HEART RATE DATA
//     // ==========================================

//     const heartRateData = allData.map((item) => ({
//       time: new Date(
//         item.createdAt
//       ).toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),

//       value: Number(item.heartRate ?? 0),
//     }));

//     // ==========================================
//     // SPO2 DATA
//     // ==========================================

//     const spo2Data = allData.map((item) => ({
//       time: new Date(
//         item.createdAt
//       ).toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),

//       value: Number(item.spo2 ?? 0),
//     }));

//     // ==========================================
//     // TEMPERATURE DATA
//     // ==========================================

//     const tempData = allData.map((item) => ({
//       time: new Date(
//         item.createdAt
//       ).toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),

//       value: Number(item.temp ?? 0),
//     }));

//     // ==========================================
//     // HEALTH TREND DATA
//     // ==========================================

//     const datatimers = allData.map((item) => {
//       const hr = Number(item.heartRate ?? 0);
//       const oxygen = Number(item.spo2 ?? 0);
//       const temperature = Number(item.temp ?? 0);

//       let score = 0;

//       // HEART RATE
//       if (hr < 40 || hr > 180) {
//         score += 100;
//       } else if (hr < 50 || hr > 140) {
//         score += 80;
//       } else if (hr < 60 || hr > 120) {
//         score += 60;
//       } else if (hr > 100) {
//         score += 30;
//       }

//       // SPO2
//       if (oxygen < 80) {
//         score += 100;
//       } else if (oxygen < 85) {
//         score += 80;
//       } else if (oxygen < 90) {
//         score += 60;
//       } else if (oxygen < 95) {
//         score += 30;
//       }

//       // TEMPERATURE
//       if (
//         temperature < 32 ||
//         temperature > 42
//       ) {
//         score += 100;
//       } else if (
//         temperature < 34 ||
//         temperature > 40
//       ) {
//         score += 80;
//       } else if (
//         temperature < 35 ||
//         temperature > 39
//       ) {
//         score += 60;
//       } else if (
//         temperature < 36.1 ||
//         temperature > 37.2
//       ) {
//         score += 30;
//       }

//       score = Math.min(score, 100);

//       return {
//         time: new Date(
//           item.createdAt
//         ).toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         }),

//         score,
//       };
//     });

//     // ==========================================
//     // RECOMMENDATIONS
//     // ==========================================

//     const recommendations = [];

//     // TEMPERATURE
//     if (temp > 38) {
//       recommendations.push(
//         "Your body temperature is elevated. Rest and monitor your temperature."
//       );
//     } else if (temp < 35) {
//       recommendations.push(
//         "Your body temperature is lower than normal. Keep yourself warm and monitor it."
//       );
//     } else {
//       recommendations.push(
//         "Your body temperature is within the normal range."
//       );
//     }

//     // HEART RATE
//     if (heartRate > 100) {
//       recommendations.push(
//         "Your heart rate is elevated. Avoid strenuous activity and monitor your heart rate."
//       );
//     } else if (heartRate < 60) {
//       recommendations.push(
//         "Your heart rate is relatively low. Continue monitoring it, especially if you feel unwell."
//       );
//     } else {
//       recommendations.push(
//         "Your heart rate is within a normal range."
//       );
//     }

//     // SPO2
//     if (spo2 < 90) {
//       recommendations.push(
//         "Your SpO₂ level is low. Seek medical attention if this persists or you have breathing difficulty."
//       );
//     } else if (spo2 < 95) {
//       recommendations.push(
//         "Your SpO₂ is slightly below the usual range. Continue monitoring it."
//       );
//     } else {
//       recommendations.push(
//         "Your SpO₂ level is within a healthy range."
//       );
//     }

//     // ==========================================
//     // ML RISK RECOMMENDATION
//     // ==========================================

//     if (riskLevel === "Critical Risk") {
//       recommendations.push(
//         "Critical risk detected. Immediate medical attention is recommended."
//       );
//     } else if (riskLevel === "High Risk") {
//       recommendations.push(
//         "High health risk detected. Please monitor your vital signs closely."
//       );
//     } else if (riskLevel === "Moderate Risk") {
//       recommendations.push(
//         "Moderate risk detected. Continue monitoring your health parameters."
//       );
//     } else if (riskLevel === "Low Risk") {
//       recommendations.push(
//         "Low risk detected. Maintain healthy habits and continue monitoring."
//       );
//     } else if (riskLevel === "ML Unavailable") {
//       recommendations.push(
//         "ML risk prediction is currently unavailable. Please try again later."
//       );
//     } else {
//       recommendations.push(
//         "Your current health indicators look normal. Keep maintaining a healthy lifestyle."
//       );
//     }

//     // ==========================================
//     // RISK FACTORS
//     // ==========================================

//     const riskFactors = [];

//     // HEART RATE
//     if (heartRate > 100) {
//       riskFactors.push({
//         factor: "Heart Rate",
//         value: heartRate,
//         status: "High",
//       });
//     } else if (heartRate < 60) {
//       riskFactors.push({
//         factor: "Heart Rate",
//         value: heartRate,
//         status: "Low",
//       });
//     } else {
//       riskFactors.push({
//         factor: "Heart Rate",
//         value: heartRate,
//         status: "Normal",
//       });
//     }

//     // SPO2
//     if (spo2 < 90) {
//       riskFactors.push({
//         factor: "SpO₂",
//         value: spo2,
//         status: "Low",
//       });
//     } else if (spo2 < 95) {
//       riskFactors.push({
//         factor: "SpO₂",
//         value: spo2,
//         status: "Slightly Low",
//       });
//     } else {
//       riskFactors.push({
//         factor: "SpO₂",
//         value: spo2,
//         status: "Normal",
//       });
//     }

//     // TEMPERATURE
//     if (temp > 38) {
//       riskFactors.push({
//         factor: "Temperature",
//         value: temp,
//         status: "High",
//       });
//     } else if (temp < 35) {
//       riskFactors.push({
//         factor: "Temperature",
//         value: temp,
//         status: "Low",
//       });
//     } else {
//       riskFactors.push({
//         factor: "Temperature",
//         value: temp,
//         status: "Normal",
//       });
//     }

//     // ==========================================
//     // FINAL RESPONSE
//     // ==========================================

//     return res.status(200).json({
//       success: true,

//       message: "Data received successfully",

//       // Latest device data
//       hd,

//       // ML RESULT
//       riskScore,
//       riskLevel,
//       prediction,
//       mlAvailable,

//       // Recommendations
//       recommendations,

//       // Graph data
//       datatimers,

//       heartRateData,
//       spo2Data,
//       tempData,

//       // Risk factors
//       riskFactors,
//     });

//   } catch (error) {
//     console.error(
//       "❌ GET DEVICE DATA ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message: "Failed to get device data",
//       error: error.message,
//     });
//   }
// };