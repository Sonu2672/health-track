from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)

model = joblib.load("health_model.pkl")


@app.route("/predict", methods=["POST"])
def predict():

    data = request.json

    # ==========================================
    # ❤️ HEALTH FEATURES
    # ==========================================

    heartRate = float(data["heartRate"])
    spo2 = float(data["spo2"])
    temp = float(data["temp"])

    # ==========================================
    # 🌍 ENVIRONMENT FEATURES
    # ==========================================

    envtemp = float(data["envtemp"])
    humidity = float(data["humidity"])
    ecg = float(data["ecg"])
    dust = float(data["dust"])

    # ==========================================
    # 🤖 7 FEATURES
    # ORDER MUST MATCH TRAINING DATA
    # ==========================================

    features = [[
        heartRate,
        spo2,
        temp,
        envtemp,
        humidity,
        ecg,
        dust
    ]]

    # ==========================================
    # ML PREDICTION
    # ==========================================

    prediction = int(model.predict(features)[0])

    # ==========================================
    # RISK LEVEL
    # ==========================================

    riskLevels = {
        0: "Low Risk",
        1: "Moderate Risk",
        2: "High Risk",
        3: "Critical Risk"
    }

    riskLevel = riskLevels.get(
        prediction,
        "Unknown Risk"
    )

    # ==========================================
    # PREDICTION CONFIDENCE
    # ==========================================

    probabilities = model.predict_proba(features)[0]

    riskScore = round(max(probabilities) * 100)

    # ==========================================
    # RESPONSE
    # ==========================================

    return jsonify({
        "success": True,
        "riskScore": riskScore,
        "riskLevel": riskLevel,
        "prediction": prediction
    })


if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5001,
        debug=True
    )