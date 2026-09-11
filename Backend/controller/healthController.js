

import health from "../model/health.js";
import device from "../model/device.js"
import jwt from "jsonwebtoken";




// export const healthData = async (req, res) => {
//   try {
//     const {
//       deviceId,
//       heartRate,
//       spo2,
//       temp,
//     } = req.body;
  
//     console.log("hi= " , deviceId,
//       heartRate,
//       spo2,
//       temp,)

    
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

//     // Device registration se userid milega
//     const userid = existingDevice.userid;

//     console.log("DEVICE ID:", deviceId);
//     console.log("FETCHED USER ID:", userid);

//     // 🔥 Har ESP32 reading ka NEW health document
//     const newHealthData = await health.create({
//       deviceId,
//       userid,
//       heartRate: Number(heartRate ?? 0),
//       spo2: Number(spo2 ?? 0),
//       temp: Number(temp ?? 0),
//     });


//     console.log("✅ NEW HEALTH READING:", newHealthData,heartRate,spo2,temp);

//     return res.status(200).json({
//       success: true,
//       message: "Health data saved successfully",
//       data: newHealthData,
//     });

//   } catch (error) {
//     console.error("❌ HEALTH DATA ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };






export const healthData = async (req, res) => {
   console.log("🔥🔥🔥 HEALTHDATA CONTROLLER HIT 🔥🔥🔥");
  try {
    console.log("🔥 HEALTH DATA API HIT");

    const {
      deviceId,
      heartRate,
      spo2,
      temp,
      envtemp,
      ecg,
      humidity,
      dust,
    } = req.body;

    console.log("📦 REQUEST BODY:", req.body);

    if (!deviceId) {
      console.log("❌ DEVICE ID MISSING");

      return res.status(400).json({
        success: false,
        message: "Device ID is required",
      });
    }

    console.log("🔍 FINDING DEVICE:", deviceId);

    const existingDevice = await device.findOne({ deviceId });

    console.log("📱 EXISTING DEVICE:", existingDevice);

    if (!existingDevice) {
      console.log("❌ DEVICE NOT REGISTERED");

      return res.status(404).json({
        success: false,
        message: "Device is not registered",
      });
    }

    const userid = existingDevice.userid;

    console.log("👤 USER ID:", userid);

    const healthPayload = {
      deviceId,
      userid,
      heartRate: Number(heartRate ?? 0),
      spo2: Number(spo2 ?? 0),
      temp: Number(temp ?? 0),
      envtemp : Number(envtemp ?? 0),
      ecg : Number(ecg ?? 0),
      humidity : Number(humidity ?? 0),
      dust : Number(dust ?? 0)
    };

    console.log("💾 SAVING HEALTH DATA:", healthPayload);

    const newHealthData = await health.create(healthPayload);

    console.log("✅ SAVED TO MONGODB:", newHealthData);

    return res.status(200).json({
      success: true,
      message: "Health data saved successfully",
      data: newHealthData,
    });

  } catch (error) {
    console.error("❌ HEALTH DATA ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const gethealthdata = async (req, res) => {
  try {
    // ==========================================
    // GET LOGGED-IN USER ID
    // ==========================================

    const userid = req.user.id;

    console.log("==========================================");
    console.log("GET HEALTH DATA");
    console.log("GET USER ID:", userid);

    // ==========================================
    // GET LATEST HEALTH DATA
    // ==========================================

    const hd = await health
      .findOne({ userid })
      .sort({ createdAt: -1 });

    console.log("LATEST DEVICE DATA:", hd);

    // ==========================================
    // NO DATA
    // ==========================================

    if (!hd) {
      return res.status(200).json({
        success: true,
        message: "No device data found",

        hd: null,

        sensorData: {
          heartRate: 0,
          spo2: 0,
          temp: 0,
          envtemp: 0,
          humidity: 0,
          ecg: 0,
          dust: 0,
        },

        riskScore: 0,
        riskLevel: "No Data",
        prediction: null,
        mlAvailable: false,

        recommendations: [],
        datatimers: [],
        heartRateData: [],
        spo2Data: [],
        tempData: [],
        riskFactors: [],
      });
    }

    // ==========================================
    // ❤️ 7 ML FEATURES
    // ==========================================

    const heartRate = Number(hd.heartRate ?? 0);
    const spo2 = Number(hd.spo2 ?? 0);
    const temp = Number(hd.temp ?? 0);
    const envtemp = Number(hd.envtemp ?? 0);
    const humidity = Number(hd.humidity ?? 0);
    const ecg = Number(hd.ecg ?? 0);
    const dust = Number(hd.dust ?? 0);

    console.log("==========================================");
    console.log("7 SENSOR VALUES");
    console.log("❤️ Heart Rate:", heartRate);
    console.log("🫁 SpO2:", spo2);
    console.log("🌡️ Body Temperature:", temp);
    console.log("🌍 Environment Temperature:", envtemp);
    console.log("💧 Humidity:", humidity);
    console.log("❤️ ECG:", ecg);
    console.log("🌫️ Dust:", dust);
    console.log("==========================================");

    // ==========================================
    // 🤖 ML MODEL PREDICTION
    // ==========================================

    let riskScore = 0;
    let riskLevel = "ML Unavailable";
    let prediction = null;
    let mlAvailable = false;

    try {
      console.log("🤖 Sending 7 features to ML model...");

      if (!process.env.ML_API_URL) {
        throw new Error("ML_API_URL is not configured");
      }

      const mlUrl = `${process.env.ML_API_URL.replace(/\/$/, "")}/predict`;

      console.log("🤖 ML URL:", mlUrl);

      // ==========================================
      // SEND EXACTLY 7 FEATURES
      // ORDER MUST MATCH TRAINING
      // ==========================================

      const mlPayload = {
        heartRate: heartRate,
        spo2: spo2,
        temp: temp,
        envtemp: envtemp,
        humidity: humidity,
        ecg: ecg,
        dust: dust,
      };

      console.log("🤖 ML PAYLOAD:", mlPayload);

      const mlResponse = await fetch(mlUrl, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(mlPayload),
      });

      console.log("🤖 ML API STATUS:", mlResponse.status);

      // ==========================================
      // READ RESPONSE
      // ==========================================

      const mlText = await mlResponse.text();

      console.log("🤖 ML RAW RESPONSE:", mlText);

      if (!mlResponse.ok) {
        throw new Error(
          `ML API returned status ${mlResponse.status}: ${mlText}`
        );
      }

      let mlData;

      try {
        mlData = JSON.parse(mlText);
      } catch (parseError) {
        throw new Error("ML API returned invalid JSON");
      }

      console.log("🤖 ML RESPONSE:", mlData);

      // ==========================================
      // VALIDATE ML RESPONSE
      // ==========================================

      if (
        mlData.riskScore === undefined ||
        mlData.riskLevel === undefined
      ) {
        throw new Error(
          "Invalid ML response: riskScore or riskLevel missing"
        );
      }

      // ==========================================
      // GET ML RESULT
      // ==========================================

      riskScore = Number(mlData.riskScore);

      riskLevel = String(mlData.riskLevel);

      prediction =
        mlData.prediction !== undefined
          ? Number(mlData.prediction)
          : null;

      // ==========================================
      // VALIDATE RISK SCORE
      // ==========================================

      if (Number.isNaN(riskScore)) {
        throw new Error(
          "Invalid riskScore received from ML model"
        );
      }

      riskScore = Math.max(
        0,
        Math.min(100, Math.round(riskScore))
      );

      mlAvailable = true;

      console.log("==========================================");
      console.log("🤖 ML SUCCESS");
      console.log("Prediction:", prediction);
      console.log("Risk Score:", riskScore);
      console.log("Risk Level:", riskLevel);
      console.log("ML Available:", mlAvailable);
      console.log("==========================================");

    } catch (mlError) {

      console.error("==========================================");
      console.error("❌ ML API ERROR");
      console.error("❌ MESSAGE:", mlError.message);
      console.error("==========================================");

      riskScore = 0;
      riskLevel = "ML Unavailable";
      prediction = null;
      mlAvailable = false;
    }

    // ==========================================
    // SAVE ML RESULT
    // ==========================================

    hd.riskScore = riskScore;
    hd.riskLevel = riskLevel;

    await hd.save();

    console.log("✅ ML RESULT SAVED TO MONGODB");

    // ==========================================
    // GET ALL USER DATA
    // ==========================================

    const allData = await health
      .find({ userid })
      .sort({ createdAt: 1 });

    console.log(
      "TOTAL DEVICE RECORDS:",
      allData.length
    );

    // ==========================================
    // HEART RATE GRAPH
    // ==========================================

    const heartRateData = allData.map((item) => ({
      time: new Date(item.createdAt).toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      ),

      value: Number(item.heartRate ?? 0),
    }));

    // ==========================================
    // SPO2 GRAPH
    // ==========================================

    const spo2Data = allData.map((item) => ({
      time: new Date(item.createdAt).toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      ),

      value: Number(item.spo2 ?? 0),
    }));

    // ==========================================
    // TEMPERATURE GRAPH
    // ==========================================

    const tempData = allData.map((item) => ({
      time: new Date(item.createdAt).toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      ),

      value: Number(item.temp ?? 0),
    }));

    // ==========================================
    // HEALTH TREND
    // ==========================================

    const datatimers = allData.map((item) => {

      const hr = Number(item.heartRate ?? 0);
      const oxygen = Number(item.spo2 ?? 0);
      const temperature = Number(item.temp ?? 0);

      let score = 0;

      // HEART RATE
      if (hr < 40 || hr > 180) {
        score += 100;
      } else if (hr < 50 || hr > 140) {
        score += 80;
      } else if (hr < 60 || hr > 120) {
        score += 60;
      } else if (hr > 100) {
        score += 30;
      }

      // SPO2
      if (oxygen < 80) {
        score += 100;
      } else if (oxygen < 85) {
        score += 80;
      } else if (oxygen < 90) {
        score += 60;
      } else if (oxygen < 95) {
        score += 30;
      }

      // TEMPERATURE
      if (
        temperature < 32 ||
        temperature > 42
      ) {
        score += 100;
      } else if (
        temperature < 34 ||
        temperature > 40
      ) {
        score += 80;
      } else if (
        temperature < 35 ||
        temperature > 39
      ) {
        score += 60;
      } else if (
        temperature < 36.1 ||
        temperature > 37.2
      ) {
        score += 30;
      }

      score = Math.min(score, 100);

      return {
        time: new Date(
          item.createdAt
        ).toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        ),

        score,
      };
    });

    // ==========================================
    // RECOMMENDATIONS
    // ==========================================

    const recommendations = [];

    // TEMPERATURE
    if (temp > 38) {
      recommendations.push(
        "Your body temperature is elevated. Rest and monitor your temperature."
      );
    } else if (temp < 35) {
      recommendations.push(
        "Your body temperature is lower than normal. Keep yourself warm and monitor it."
      );
    } else {
      recommendations.push(
        "Your body temperature is within the normal range."
      );
    }

    // HEART RATE
    if (heartRate > 100) {
      recommendations.push(
        "Your heart rate is elevated. Avoid strenuous activity and monitor your heart rate."
      );
    } else if (heartRate < 60) {
      recommendations.push(
        "Your heart rate is relatively low. Continue monitoring it, especially if you feel unwell."
      );
    } else {
      recommendations.push(
        "Your heart rate is within a normal range."
      );
    }

    // SPO2
    if (spo2 < 90) {
      recommendations.push(
        "Your SpO₂ level is low. Seek medical attention if this persists or you have breathing difficulty."
      );
    } else if (spo2 < 95) {
      recommendations.push(
        "Your SpO₂ is slightly below the usual range. Continue monitoring it."
      );
    } else {
      recommendations.push(
        "Your SpO₂ level is within a healthy range."
      );
    }

    // ML RECOMMENDATION
    if (riskLevel === "Critical Risk") {

      recommendations.push(
        "Critical risk detected. Immediate medical attention is recommended."
      );

    } else if (riskLevel === "High Risk") {

      recommendations.push(
        "High health risk detected. Please monitor your vital signs closely."
      );

    } else if (riskLevel === "Moderate Risk") {

      recommendations.push(
        "Moderate risk detected. Continue monitoring your health parameters."
      );

    } else if (riskLevel === "Low Risk") {

      recommendations.push(
        "Low risk detected. Maintain healthy habits and continue monitoring."
      );

    } else if (riskLevel === "ML Unavailable") {

      recommendations.push(
        "ML risk prediction is currently unavailable. Please try again later."
      );
    }

    // ==========================================
    // RISK FACTORS
    // ==========================================

    const riskFactors = [];

    // HEART RATE
    if (heartRate > 100) {

      riskFactors.push({
        factor: "Heart Rate",
        value: heartRate,
        status: "High",
      });

    } else if (heartRate < 60) {

      riskFactors.push({
        factor: "Heart Rate",
        value: heartRate,
        status: "Low",
      });

    } else {

      riskFactors.push({
        factor: "Heart Rate",
        value: heartRate,
        status: "Normal",
      });
    }

    // SPO2
    if (spo2 < 90) {

      riskFactors.push({
        factor: "SpO₂",
        value: spo2,
        status: "Low",
      });

    } else if (spo2 < 95) {

      riskFactors.push({
        factor: "SpO₂",
        value: spo2,
        status: "Slightly Low",
      });

    } else {

      riskFactors.push({
        factor: "SpO₂",
        value: spo2,
        status: "Normal",
      });
    }

    // TEMPERATURE
    if (temp > 38) {

      riskFactors.push({
        factor: "Temperature",
        value: temp,
        status: "High",
      });

    } else if (temp < 35) {

      riskFactors.push({
        factor: "Temperature",
        value: temp,
        status: "Low",
      });

    } else {

      riskFactors.push({
        factor: "Temperature",
        value: temp,
        status: "Normal",
      });
    }

    // ENVIRONMENT TEMPERATURE
    riskFactors.push({
      factor: "Environment Temp",
      value: envtemp,
      status:
        envtemp > 40
          ? "High"
          : envtemp < 10
          ? "Low"
          : "Normal",
    });

    // HUMIDITY
    riskFactors.push({
      factor: "Humidity",
      value: humidity,
      status:
        humidity > 80
          ? "High"
          : humidity < 30
          ? "Low"
          : "Normal",
    });

    // ECG
    riskFactors.push({
      factor: "ECG",
      value: ecg,
      status:
        Math.abs(ecg) > 2
          ? "High"
          : "Normal",
    });

    // DUST
    riskFactors.push({
      factor: "Dust",
      value: dust,
      status:
        dust > 300
          ? "High"
          : dust > 150
          ? "Moderate"
          : "Normal",
    });

    // ==========================================
    // FINAL RESPONSE
    // ==========================================

    return res.status(200).json({

      success: true,

      message: "Data received successfully",

      // ==========================================
      // LATEST HEALTH DATA
      // ==========================================

      hd,

      // ==========================================
      // EXACT 7 SENSOR VALUES
      // ==========================================

      sensorData: {
        heartRate,
        spo2,
        temp,
        envtemp,
        humidity,
        ecg,
        dust,
      },

      // ==========================================
      // ML RESULT
      // ==========================================

      riskScore,
      riskLevel,
      prediction,
      mlAvailable,

      // ==========================================
      // RECOMMENDATIONS
      // ==========================================

      recommendations,

      // ==========================================
      // GRAPH DATA
      // ==========================================

      datatimers,
      heartRateData,
      spo2Data,
      tempData,

      // ==========================================
      // RISK FACTORS
      // ==========================================

      riskFactors,
    });

  } catch (error) {

    console.error(
      "❌ GET DEVICE DATA ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to get device data",
      error: error.message,
    });
  }
};



export const getHealthHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const days = Number(req.query.days) || 7;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const healthData = await health.find({
      userid: userId,
      createdAt: {
        $gte: startDate,
      },
    })
      .sort({ createdAt: 1 })
      .lean();

    if (!healthData.length) {
      return res.status(200).json({
        success: true,
        summary: null,
        trends: {
          heartRate: [],
          spo2: [],
          temperature: [],
        },
        recentRecords: [],
      });
    }

    // =====================
    // HEART RATE
    // =====================

    const heartRates = healthData
      .map((item) => item.heartRate)
      .filter((value) => value != null);

    const lowest = Math.min(...heartRates);

    const highest = Math.max(...heartRates);

    const average = Math.round(
      heartRates.reduce((sum, value) => sum + value, 0) /
        heartRates.length
    );

    // Latest Record
    const latestData = healthData[healthData.length - 1];

    // =====================
    // RESPONSE
    // =====================

    res.status(200).json({
      success: true,

      summary: {
        heartRate: {
          lowest,
          highest,
          average,
          today: latestData.heartRate,
        },
      },

      trends: {
        heartRate: healthData.map((item) => ({
          value: item.heartRate,
          date: item.createdAt,
        })),

        spo2: healthData.map((item) => ({
          value: item.spo2,
          date: item.createdAt,
        })),

        temperature: healthData.map((item) => ({
          value: item.temp,
          date: item.createdAt,
        })),
      },

      recentRecords: healthData
        .slice(-10)
        .reverse()
        .map((item) => ({
          id: item._id,
          heartRate: item.heartRate,
          spo2: item.spo2,
          temperature: item.temp,
          date: item.createdAt,
        })),
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};












