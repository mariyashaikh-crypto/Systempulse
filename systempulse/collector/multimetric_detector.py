import pandas as pd

from sklearn.ensemble import IsolationForest
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    classification_report
)


DATASET = "multimetric_dataset.csv"


# ============================================================
# LOAD DATASET
# ============================================================

df = pd.read_csv(DATASET)

print("\n==============================================")
print("SystemPulse v3 - Multivariate ML Engine")
print("==============================================")

print(f"\nTotal observations: {len(df)}")


# ============================================================
# FEATURES
# ============================================================

features = [
    "response_time_ms",
    "cpu_percent",
    "memory_percent"
]


# ============================================================
# TRAIN ONLY ON NORMAL BEHAVIOR
# ============================================================

normal_data = df[
    df["actual_anomaly"] == 0
]

X_train = normal_data[features]

print(
    f"Training observations: {len(X_train)}"
)

print(
    "Training only on NORMAL behavior."
)

print("\nFeatures used:")

for feature in features:
    print(f"  - {feature}")


# ============================================================
# ISOLATION FOREST
# ============================================================

model = IsolationForest(
    n_estimators=300,
    contamination=0.10,
    random_state=42
)

model.fit(X_train)


# ============================================================
# PREDICTION
# ============================================================

X_all = df[features]

predictions = model.predict(X_all)

df["predicted_anomaly"] = (
    predictions == -1
).astype(int)


# ============================================================
# ANOMALY SCORE
# ============================================================

raw_scores = model.decision_function(X_all)

df["anomaly_score"] = -raw_scores


# ============================================================
# DISPLAY RESULTS
# ============================================================

print("\n==============================================")
print("Detection Results")
print("==============================================")

for _, row in df.iterrows():

    actual = (
        "ANOMALY"
        if row["actual_anomaly"] == 1
        else "NORMAL"
    )

    predicted = (
        "ANOMALY"
        if row["predicted_anomaly"] == 1
        else "NORMAL"
    )

    print(
        f"Latency: {row['response_time_ms']:8.2f} ms | "
        f"CPU: {row['cpu_percent']:6.2f}% | "
        f"Memory: {row['memory_percent']:6.2f}% | "
        f"Phase: {row['phase']:22} | "
        f"Actual: {actual:7} | "
        f"Predicted: {predicted}"
    )


# ============================================================
# MODEL EVALUATION
# ============================================================

y_true = df["actual_anomaly"]

y_pred = df["predicted_anomaly"]


print("\n==============================================")
print("MODEL EVALUATION")
print("==============================================")

accuracy = accuracy_score(
    y_true,
    y_pred
)

print(
    f"\nAccuracy: {accuracy:.2%}"
)


print("\nConfusion Matrix:")

print(
    confusion_matrix(
        y_true,
        y_pred
    )
)


print("\nClassification Report:")

print(
    classification_report(
        y_true,
        y_pred,
        target_names=[
            "NORMAL",
            "ANOMALY"
        ],
        zero_division=0
    )
)


# ============================================================
# OPERATIONAL COUNTS
# ============================================================

detected = sum(
    (df["actual_anomaly"] == 1)
    &
    (df["predicted_anomaly"] == 1)
)

missed = sum(
    (df["actual_anomaly"] == 1)
    &
    (df["predicted_anomaly"] == 0)
)

false_alarms = sum(
    (df["actual_anomaly"] == 0)
    &
    (df["predicted_anomaly"] == 1)
)


print("\n==============================================")
print("SYSTEMPULSE OPERATIONAL SUMMARY")
print("==============================================")

print(
    f"Actual anomalies detected : {detected}"
)

print(
    f"Missed anomalies          : {missed}"
)

print(
    f"False alarms              : {false_alarms}"
)


# ============================================================
# PHASE-WISE ANALYSIS
# ============================================================

print("\n==============================================")
print("PHASE-WISE DETECTION")
print("==============================================")

phase_summary = (
    df.groupby("phase")
    .agg(
        total=("actual_anomaly", "count"),
        anomalies=("actual_anomaly", "sum"),
        detected=("predicted_anomaly", "sum")
    )
)

print(
    phase_summary
)


# ============================================================
# SAVE RESULTS
# ============================================================

output_file = "multimetric_results.csv"

df.to_csv(
    output_file,
    index=False
)

print(
    f"\nResults saved as:\n{output_file}"
)