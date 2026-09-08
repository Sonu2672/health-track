from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)

model = joblib.load("health_model.pkl")


@app.route("/predict", methods=["POST"])
def predict():

    data = request.json

    heartRate = float(data["heartRate"])
    spo2 = float(data["spo2"])
    temp = float(data["temp"])

    features = [[
        heartRate,
        spo2,
        temp
    ]]

    # ML Prediction
    prediction = int(model.predict(features)[0])

    # Risk Level
    riskLevels = {
        0: "Low Risk",
        1: "Moderate Risk",
        2: "High Risk",
        3: "Critical Risk"
    }

    riskLevel = riskLevels[prediction]

    # Prediction confidence
    probabilities = model.predict_proba(features)[0]

    riskScore = round(max(probabilities) * 100)

    return jsonify({
        "success": True,
        "riskScore": riskScore,
        "riskLevel": riskLevel,
        "prediction": prediction
    })


if __name__ == "__main__":
    app.run(port=5001, debug=True)