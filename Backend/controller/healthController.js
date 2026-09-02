
import health from "../model/health.js";
import jwt from "jsonwebtoken";



//   export const healthData=async(req,res)=>{
//     try{
        
//        const { deviceId, heartRate, spo2, temperature } = req.body;
//        const hd=await health.create({ userid:req.user.id,deviceId:deviceId, heartRate:heartRate, spo2:spo2, temperature:temperature})
//        console.log(req.body);
//       res.status(201).json({
//       hd,
//       success: true,
//       message: "Data received successfully"})
//     }

//     catch(err)
//     {
//       res.status(500).json({
//       success: false,
//       message: err.message
//     });
//     }
// }





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
  if (riskLevel === "High" || riskLevel === "Critical") {
    recommendations.push(
      "Inform a family member or caregiver if you feel unwell",
      "Monitor your health parameters more frequently"
    );
  
  }

  
      res.status(201).json({
      hd,
      riskScore,
      riskLevel,
      recommendations,
      
      success: true,
      message: "Data received successfully"})
    
      }


    catch(err)
    {
      res.status(500).json({
      success: false,
      message: err.message
    });
    }
}
