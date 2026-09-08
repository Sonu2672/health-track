export const predictHealth = async (req, res) => {
  try {
    const {
      heartRate,
      spo2,
      temp
    } = req.body;

    // Validation
    if (
      heartRate === undefined ||
      spo2 === undefined ||
      temp === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "heartRate, spo2 and temp are required",
      });
    }

    // Python ML API call
    const mlResponse = await fetch(
      `${process.env.ML_API_URL}/predict`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          heartRate,
          spo2,
          temp,
        }),
      }
    );

    if (!mlResponse.ok) {
      throw new Error("ML API failed");
    }

    const mlData = await mlResponse.json();

    console.log("ML RESPONSE:", mlData);

    return res.status(200).json({
      success: true,
      prediction: mlData.prediction,
    });

  } catch (error) {

    console.error("ML ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "ML prediction failed",
      error: error.message,
    });
  }
};