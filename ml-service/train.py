import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report


# ==========================================
# LOAD DATASET
# ==========================================

# CSV TAB-separated hai
df = pd.read_csv("health_data.csv", sep="\t")

print("\nDataset columns:")
print(df.columns.tolist())

print("\nDataset shape:")
print(df.shape)


# ==========================================
# FEATURES
# ==========================================

features = [
    "heartRate",
    "spo2",
    "temp",
    "envtemp",
    "humidity",
    "ecg",
    "dust"
]

target = "risk"


# ==========================================
# CHECK REQUIRED COLUMNS
# ==========================================

required_columns = features + [target]

missing_columns = [
    column for column in required_columns
    if column not in df.columns
]

if missing_columns:
    print("\n❌ Missing columns:")
    print(missing_columns)
    raise ValueError(
        "Dataset columns do not match the expected format."
    )


# ==========================================
# REMOVE EMPTY VALUES
# ==========================================

df = df.dropna(subset=required_columns)


# ==========================================
# INPUT & TARGET
# ==========================================

X = df[features]
y = df[target]


print("\nFeatures used:")
print(features)

print("\nRisk classes:")
print(y.value_counts())


# ==========================================
# TRAIN / TEST SPLIT
# ==========================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


# ==========================================
# RANDOM FOREST MODEL
# ==========================================

model = RandomForestClassifier(
    n_estimators=200,
    random_state=42,
    class_weight="balanced"
)


# ==========================================
# TRAIN MODEL
# ==========================================

print("\n🤖 Training model...")

model.fit(X_train, y_train)


# ==========================================
# TEST MODEL
# ==========================================

y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)

print("\n==========================================")
print("MODEL RESULT")
print("==========================================")

print("Accuracy:", round(accuracy * 100, 2), "%")

print("\nClassification Report:")
print(classification_report(y_test, y_pred))


# ==========================================
# SAVE MODEL
# ==========================================

joblib.dump(model, "health_model.pkl")

print("\n==========================================")
print("✅ MODEL SAVED")
print("==========================================")

print("health_model.pkl created successfully.")
print("Features:", features)