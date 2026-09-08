import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

data = pd.read_csv("health_data.csv")

X = data[["heartRate", "spo2", "temp"]]
y = data["risk"]

model = RandomForestClassifier(
    n_estimators=200,
    random_state=42
)

model.fit(X, y)

joblib.dump(model, "health_model.pkl")

print("4-Class ML Model trained successfully!")