import pandas as pd

from sklearn.ensemble import IsolationForest
from sklearn.metrics import (
    confusion_matrix,
    classification_report,
    accuracy_score
)


DATASET = "experiment_dataset.csv"


# ============================================================
# LOAD DATA
# ============================================================

df = pd.read_csv(DATASET)

print("\nSystemPulse v2 - Intelligent Anomaly Engine")
print("============================================")

print(f"Total observations: {len(df)}")


# ============================================================
# TRAIN ONLY ON HEALTHY DATA
# ============================================================

normal_data = df[df["actual_anomaly"] == 0]

X_train = normal_data[["response_time_ms"]]

print(f"Training observations: {len(X_train)}")
print("Training only on healthy behavior.")


# ============================================================
# TRAIN ISOLATION FOREST
# ============================================================

model = IsolationForest(
    n_estimators=300,
    contamination=0.10,
    random_state=42
)

model.fit(X_train)


# ============================================================
# GENERATE ANOMALY SCORES
# ============================================================

X_all = df[["response_time_ms"]]

# decision_function:
# higher = more normal
# lower  = more anomalous

raw_scores = model.decision_function(X_all)


# Convert score so:
# higher = more anomalous

df["anomaly_score"] = -raw_scores


# ============================================================
# DETERMINE ANOMALY
# ============================================================

predictions = model.predict(X_all)

df["predicted_anomaly"] = (
    predictions == -1
).astype(int)


# ============================================================
# NORMALIZE SCORE FOR DISPLAY
# ============================================================

minimum = df["anomaly_score"].min()
maximum = df["anomaly_score"].max()

if maximum != minimum:

    df["risk_score"] = (
        (df["anomaly_score"] - minimum)
        / (maximum - minimum)
    ) * 100

else:

    df["risk_score"] = 0


# ============================================================
# SEVERITY
# ============================================================

def determine_severity(row):

    score = row["risk_score"]

    if score >= 80:
        return "CRITICAL"

    elif score >= 50:
        return "WARNING"

    else:
        return "NORMAL"


df["severity"] = df.apply(
    determine_severity,
    axis=1
)


# ============================================================
# DISPLAY RESULTS
# ============================================================

print("\nDetection Results")
print("------------------")

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
        f"Risk: {row['risk_score']:6.2f}% | "
        f"Severity: {row['severity']:8} | "
        f"Actual: {actual:7} | "
        f"Predicted: {predicted}"
    )


# ============================================================
# MODEL EVALUATION
# ============================================================

y_true = df["actual_anomaly"]

y_pred = df["predicted_anomaly"]


print("\n================================")
print("MODEL EVALUATION")
print("================================")

print(
    f"\nAccuracy: "
    f"{accuracy_score(y_true, y_pred):.2%}"
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
# OPERATIONAL SUMMARY
# ============================================================

true_anomalies = sum(
    (df["actual_anomaly"] == 1)
    &
    (df["predicted_anomaly"] == 1)
)

missed_anomalies = sum(
    (df["actual_anomaly"] == 1)
    &
    (df["predicted_anomaly"] == 0)
)

false_alarms = sum(
    (df["actual_anomaly"] == 0)
    &
    (df["predicted_anomaly"] == 1)
)


print("\n================================")
print("SYSTEMPULSE OPERATIONAL SUMMARY")
print("================================")

print(
    f"Actual anomalies detected : "
    f"{true_anomalies}"
)

print(
    f"Missed anomalies          : "
    f"{missed_anomalies}"
)

print(
    f"False alarms              : "
    f"{false_alarms}"
)


# ============================================================
# SAVE RESULTS
# ============================================================

df.to_csv(
    "anomaly_results.csv",
    index=False
)

print("\nResults saved to:")
print("anomaly_results.csv")