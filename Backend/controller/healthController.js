
// import health from "../model/health.js";
// import jwt from "jsonwebtoken";



// //   export const healthData=async(req,res)=>{
// //     try{
        
// //        const { deviceId, heartRate, spo2, temperature } = req.body;
// //        const hd=await health.create({ userid:req.user.id,deviceId:deviceId, heartRate:heartRate, spo2:spo2, temperature:temperature})
// //        console.log(req.body);
// //       res.status(201).json({
// //       hd,
// //       success: true,
// //       message: "Data received successfully"})
// //     }

// //     catch(err)
// //     {
// //       res.status(500).json({
// //       success: false,
// //       message: err.message
// //     });
// //     }
// // }





//   export const healthData=async(req,res)=>{
//     try{
//         // const pname=req.user.firstname;
//        const { heartRate,spo2,temp } = req.body;
//        const hd=await health.create({ userid:req.user.id,heartRate:heartRate,spo2:spo2,temp:temp})
//        console.log(req.body);
//       res.status(201).json({
//         hd
//     })

   
// }

//  catch(err)
//     {
//       res.status(500).json({
//       success: false,
//       message: err.message
//     });
//     }
//   }




//   export const getData=async(req,res)=>{
//     try{
        
//        const hd = await health.findOne({ userid: req.user.id }).sort({ createdAt: -1 });
       
//           const {heartRate,spo2,temp}=hd;

      

// let riskScore = 0;

// // HEART RATE
//   if (heartRate < 40 || heartRate > 180) {
//     riskScore += 100;
//   } else if (heartRate < 50 || heartRate > 140) {
//     riskScore += 80;
//   } else if (heartRate < 60 || heartRate > 120) {
//     riskScore += 60;
//   } else if (heartRate < 60 || heartRate > 100) {
//     riskScore += 30;
//   }

// // SPO2
//   if (spo2 < 80) {
//     riskScore += 100;
//   } else if (spo2 < 85) {
//     riskScore += 80;
//   } else if (spo2 < 90) {
//     riskScore += 60;
//   } else if (spo2 < 95) {
//     riskScore += 30;
//   }

// // TEMPERATURE
//     if (temp < 32 || temp > 42) {
//       riskScore += 100;
//     } else if (temp < 34 || temp > 40) {
//       riskScore += 80;
//     } else if (temp < 35 || temp > 39) {
//       riskScore += 60;
//     } else if (temp < 36.1 || temp > 37.2) {
//       riskScore += 30;
//     }

// riskScore = Math.min(riskScore, 100);

// console.log(riskScore);

// let riskLevel;

//     if (riskScore === 0) {
//       riskLevel = "Normal";
//     } else if (riskScore <= 30) {
//       riskLevel = "Low Risk";
//     } else if (riskScore <= 60) {
//       riskLevel = "Moderate Risk";
//     } else if (riskScore <= 80) {
//       riskLevel = "High Risk";
//     } else {
//       riskLevel = "Critical Risk";
//     }
 




//   const recommendations = [];

//   // 🌡️ HIGH BODY TEMPERATURE
//   if (temp >= 38) {
//     recommendations.push(
//       "Move to a cool, shaded or indoor area",
//       "Drink water or oral fluids if appropriate",
//       "Avoid strenuous physical activity",
//       "Wear light and breathable clothing",
//       "Monitor body temperature regularly"
//     );
//   }

//   // 🔥 VERY HIGH TEMPERATURE
//   if (temp >= 39) {
//     recommendations.push(
//       "Seek medical evaluation, especially if symptoms are severe or worsening"
//     );
//   }

//   // 💓 HIGH HEART RATE
//   if (heartRate > 100) {
//     recommendations.push(
//       "Sit down and rest in a comfortable position",
//       "Avoid strenuous physical activity",
//       "Monitor your heart rate regularly"
//     );
//   }

//   // 🚨 VERY HIGH HEART RATE
//   if (heartRate >= 130) {
//     recommendations.push(
//       "Seek prompt medical attention, particularly if accompanied by concerning symptoms"
//     );
//   }

//   // 💓 LOW HEART RATE
//   if (heartRate < 60) {
//     recommendations.push(
//       "Rest and monitor your condition",
//       "Avoid sudden or strenuous physical activity"
//     );
//   }

//   // 🚨 VERY LOW HEART RATE
//   if (heartRate < 45) {
//     recommendations.push(
//       "Seek urgent medical attention if you feel faint, weak, or unwell"
//     );
//   }

//   // 🫁 LOW SPO2
//   if (spo2 < 95) {
//     recommendations.push(
//       "Rest and avoid strenuous activity",
//       "Ensure the sensor reading is taken correctly",
//       "Continue monitoring oxygen saturation"
//     );
//   }

//   // 🚨 CRITICAL SPO2
//   if (spo2 < 90) {
//     recommendations.push(
//       "Seek immediate medical attention",
//       "Do not ignore breathing difficulty or worsening symptoms"
//     );
//   }

//   // 🟢 NORMAL CONDITION
//   if (
//     heartRate >= 60 &&
//     heartRate <= 100 &&
//     spo2 >= 95 &&
//     temp >= 36 &&
//     temp < 38
//   ) {
//     recommendations.push(
//       "All monitored parameters are currently within the configured range",
//       "Continue regular health monitoring",
//       "Maintain adequate hydration and rest"
//     );
//   }

//   // 🔴 OVERALL HIGH RISK
//   if (riskLevel === "High" || riskLevel === "Critical") {
//     recommendations.push(
//       "Inform a family member or caregiver if you feel unwell",
//       "Monitor your health parameters more frequently"
//     );
  
//   }

  
//       res.status(201).json({
//       hd,
//       riskScore,
//       riskLevel,
//       recommendations,
      
//       success: true,
//       message: "Data received successfully"})
    
//       }


//     catch(err)
//     {
//       res.status(500).json({
//       success: false,
//       message: err.message
//     });
//     }
// }


























import health from "../model/health.js";
import jwt from "jsonwebtoken";





  export const healthData=async(req,res)=>{
    try{
        // const pname=req.user.firstname;
       const { heartRate,spo2,temp } = req.body;
       const hd=await health.create({ userid:req.user.id,heartRate:heartRate,spo2:spo2,temp:temp})
       console.log(req.body);
      res.status(201).json({
        hd
    })

   
}

 catch(err)
    {
      res.status(500).json({
      success: false,
      message: err.message
    });
    }
  }




  export const getData=async(req,res)=>{
    try{
        
       const hd = await health.findOne({ userid: req.user.id }).sort({ createdAt: -1 });
      
        
          const {heartRate,spo2,temp}=hd;
          //  const lasthr = await health.findOne({ userid: req.user.id }).sort({ createdAt: -1 }).skip(1);
              
          //   const  change1=((hd.heartRate-lasthr.heartRate)/lasthr)*100
          //    const change2=((hd.spo2Rate-lasthr.spo2Rate)/lasthr)*100
          //     const   change3=((hd.tempRate-lasthr.tempRate)/lasthr)*100
          //     const change = {
          //       heartRate: change1,
          //       spo2: change2,
          //       temp: change3,
          //            };
        // const healthMonitorData=[];   
       
        const healthData = await health
  .find({ userid: req.user.id })
  .select("heartRate spo2 temp -_id");

const heartRateData = healthData.map((item) => item.heartRate);

const spo2Data = healthData.map((item) => item.spo2);

const tempData = healthData.map((item) => item.temp);
      

         
      //findone single object aaray return karta or find pura object aray return karta

let riskScore = 0;

// HEART RATE
  if (heartRate < 40 || heartRate > 180) {
    riskScore += 100;
  } else if (heartRate < 50 || heartRate > 140) {
    riskScore += 80;
  } else if (heartRate < 60 || heartRate > 120) {
    riskScore += 60;
  } else if (heartRate < 60 || heartRate > 100) {
    riskScore += 30;
  }

// SPO2
  if (spo2 < 80) {
    riskScore += 100;
  } else if (spo2 < 85) {
    riskScore += 80;
  } else if (spo2 < 90) {
    riskScore += 60;
  } else if (spo2 < 95) {
    riskScore += 30;
  }

// TEMPERATURE
    if (temp < 32 || temp > 42) {
      riskScore += 100;
    } else if (temp < 34 || temp > 40) {
      riskScore += 80;
    } else if (temp < 35 || temp > 39) {
      riskScore += 60;
    } else if (temp < 36.1 || temp > 37.2) {
      riskScore += 30;
    }

riskScore = Math.min(riskScore, 100);

console.log(riskScore);

let riskLevel;

    if (riskScore === 0) {
      riskLevel = "Normal";
    } else if (riskScore <= 30) {
      riskLevel = "Low Risk";
    } else if (riskScore <= 60) {
      riskLevel = "Moderate Risk";
    } else if (riskScore <= 80) {
      riskLevel = "High Risk";
    } else {
      riskLevel = "Critical Risk";
    }
 

 hd.riskScore = riskScore;
    await hd.save();


  const recommendations = [];

  // 🌡️ HIGH BODY TEMPERATURE
  if (temp >= 38) {
    recommendations.push(
      "Move to a cool, shaded or indoor area",
      "Drink water or oral fluids if appropriate",
      "Avoid strenuous physical activity",
      "Wear light and breathable clothing",
      "Monitor body temperature regularly"
    );
  }

  // 🔥 VERY HIGH TEMPERATURE
  if (temp >= 39) {
    recommendations.push(
      "Seek medical evaluation, especially if symptoms are severe or worsening"
    );
  }

  // 💓 HIGH HEART RATE
  if (heartRate > 100) {
    recommendations.push(
      "Sit down and rest in a comfortable position",
      "Avoid strenuous physical activity",
      "Monitor your heart rate regularly"
    );
  }

  // 🚨 VERY HIGH HEART RATE
  if (heartRate >= 130) {
    recommendations.push(
      "Seek prompt medical attention, particularly if accompanied by concerning symptoms"
    );
  }

  // 💓 LOW HEART RATE
  if (heartRate < 60) {
    recommendations.push(
      "Rest and monitor your condition",
      "Avoid sudden or strenuous physical activity"
    );
  }

  // 🚨 VERY LOW HEART RATE
  if (heartRate < 45) {
    recommendations.push(
      "Seek urgent medical attention if you feel faint, weak, or unwell"
    );
  }

  // 🫁 LOW SPO2
  if (spo2 < 95) {
    recommendations.push(
      "Rest and avoid strenuous activity",
      "Ensure the sensor reading is taken correctly",
      "Continue monitoring oxygen saturation"
    );
  }

  // 🚨 CRITICAL SPO2
  if (spo2 < 90) {
    recommendations.push(
      "Seek immediate medical attention",
      "Do not ignore breathing difficulty or worsening symptoms"
    );
  }

  // 🟢 NORMAL CONDITION
  if (
    heartRate >= 60 &&
    heartRate <= 100 &&
    spo2 >= 95 &&
    temp >= 36 &&
    temp < 38
  ) {
    recommendations.push(
      "All monitored parameters are currently within the configured range",
      "Continue regular health monitoring",
      "Maintain adequate hydration and rest"
    );
  }

  // 🔴 OVERALL HIGH RISK
  // 🔴 OVERALL HIGH RISK
if (riskLevel === "High Risk" || riskLevel === "Critical Risk") {
  recommendations.push(
    "Inform a family member or caregiver if you feel unwell",
    "Monitor your health parameters more frequently"
  );
}


// GRAPH DATA
const hdr = await health
  .find({ userid: req.user.id })
  .sort({ createdAt: 1 });

const datatimers = hdr.map((item) => {

  const hr = Number(item.heartRate);
  const oxygen = Number(item.spo2);
  const temperature = Number(item.temp);

  let score = 0;

  // ❤️ HEART RATE
  if (hr < 40 || hr > 180) {
    score += 100;
  } 
  else if (hr < 50 || hr > 140) {
    score += 80;
  } 
  else if (hr < 60 || hr > 120) {
    score += 60;
  } 
  else if (hr > 100) {
    score += 30;
  }

  // 🫁 SPO2
  if (oxygen < 80) {
    score += 100;
  } 
  else if (oxygen < 85) {
    score += 80;
  } 
  else if (oxygen < 90) {
    score += 60;
  } 
  else if (oxygen < 95) {
    score += 30;
  }

  // 🌡️ TEMPERATURE
  if (temperature < 32 || temperature > 42) {
    score += 100;
  } 
  else if (temperature < 34 || temperature > 40) {
    score += 80;
  } 
  else if (temperature < 35 || temperature > 39) {
    score += 60;
  } 
  else if (temperature < 36.1 || temperature > 37.2) {
    score += 30;
  }

  score = Math.min(score, 100);

  const time = new Date(item.createdAt).toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return {
    time,
    score,
  };
});

// const datatimers = Object.values(hourlyData);


const riskFactors = [];
if (heartRate > 100) {
  riskFactors.push({
    title: "Elevated Heart Rate",
    sub: `${heartRate} BPM`,
    value: 60,
  });
}

if (heartRate > 140) {
  riskFactors.push({
    title: "Very High Heart Rate",
    sub: `${heartRate} BPM`,
    value: 90,
  });
}

if (spo2 < 95) {
  riskFactors.push({
    title: "Low Oxygen Level",
    sub: `${spo2}% SpO₂`,
    value: 60,
  });
}

if (spo2 < 90) {
  riskFactors.push({
    title: "Critical Oxygen Level",
    sub: `${spo2}% SpO₂`,
    value: 90,
  });
}



if (temp > 37.2) {
  riskFactors.push({
    title: "Elevated Body Temperature",
    sub: `${temp}°C`,
    value: 50,
  });
}

if (temp >= 39) {
  riskFactors.push({
    title: "High Body Temperature",
    sub: `${temp}°C`,
    value: 90,
  });
}
// RESPONSE HAMESHA SABSE BAHAR
res.status(200).json({
  hd,
  riskScore,
  riskLevel,
  recommendations,
  datatimers,
  heartRateData,
  spo2Data,
  tempData,
  riskFactors,
  success: true,
  message: "Data received successfully",
});
    }
    


    catch(err)
    {
      res.status(500).json({
      success: false,
      message: err.message
    });
    }
}




// Esp32 
export const receiveDeviceData = async (req, res) => {
  try {
    const { deviceId, heartRate, spo2, temp } = req.body;

    const newHealthData = await health.create({
      userid: userId,
      deviceid,
      heartRate,
      spo2,
      temp,
    });

    res.status(201).json({
      success: true,
      data: newHealthData,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
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
