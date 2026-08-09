import pandas as pd


# ============================================================
# SYSTEMPULSE CONTROLLED EXPERIMENT DATA
# ============================================================

normal = [
    44.82, 36.76, 44.70, 43.01, 41.48,
    39.41, 38.36, 40.57, 44.95, 44.69,
    42.20, 37.46, 38.50, 38.37, 42.02,
    39.70, 36.81, 146.69, 37.07, 38.98,
    37.60, 39.51, 43.50, 43.82, 38.93,
    46.73, 39.00, 34.77, 36.07, 38.08,
    39.52
]

abnormal = [
    2040.44, 2035.92, 2032.48, 2041.48, 2043.85,
    2041.39, 2043.32, 2033.85, 2039.38, 2036.28,
    2037.32, 2041.12, 2041.05, 2039.19, 2040.59,
    2035.74, 2034.34, 2036.29, 2042.13, 2041.74,
    2034.87, 2037.22, 2035.37, 2042.33, 2039.38,
    2042.45
]

recovery = [
    38.61, 44.28, 41.61, 39.49, 42.00,
    35.22, 39.64, 43.53, 41.05, 39.25
]


# ============================================================
# CREATE DATASET
# ============================================================

data = []

for latency in normal:
    data.append({
        "response_time_ms": latency,
        "phase": "normal",
        "actual_anomaly": 0
    })


for latency in abnormal:
    data.append({
        "response_time_ms": latency,
        "phase": "abnormal",
        "actual_anomaly": 1
    })


for latency in recovery:
    data.append({
        "response_time_ms": latency,
        "phase": "recovery",
        "actual_anomaly": 0
    })


df = pd.DataFrame(data)


# ============================================================
# SAVE DATASET
# ============================================================

df.to_csv("experiment_dataset.csv", index=False)


# ============================================================
# DISPLAY SUMMARY
# ============================================================

print("\nSystemPulse Experimental Dataset")
print("--------------------------------")

print(f"Normal readings   : {len(normal)}")
print(f"Abnormal readings : {len(abnormal)}")
print(f"Recovery readings : {len(recovery)}")
print(f"Total readings    : {len(df)}")

print("\nDataset saved as:")
print("experiment_dataset.csv")

print("\nFirst few records:")
print(df.head())

print("\nLatency statistics:")
print(df.groupby("phase")["response_time_ms"].agg(
    ["count", "mean", "min", "max"]
))