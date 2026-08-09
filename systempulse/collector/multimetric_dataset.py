import pandas as pd
import numpy as np


np.random.seed(42)


# ============================================================
# SystemPulse v3
# Controlled Multi-Metric Experimental Dataset
# ============================================================

records = []


def add_records(
    phase,
    count,
    latency_mean,
    latency_std,
    cpu_mean,
    cpu_std,
    memory_mean,
    memory_std,
    actual_anomaly
):

    for _ in range(count):

        latency = max(
            1,
            np.random.normal(
                latency_mean,
                latency_std
            )
        )

        cpu = np.clip(
            np.random.normal(
                cpu_mean,
                cpu_std
            ),
            0,
            100
        )

        memory = np.clip(
            np.random.normal(
                memory_mean,
                memory_std
            ),
            0,
            100
        )

        records.append({
            "response_time_ms": round(latency, 2),
            "cpu_percent": round(cpu, 2),
            "memory_percent": round(memory, 2),
            "phase": phase,
            "actual_anomaly": actual_anomaly
        })


# ============================================================
# 1. NORMAL SYSTEM BEHAVIOR
# ============================================================

add_records(
    phase="normal",
    count=100,

    latency_mean=42,
    latency_std=4,

    cpu_mean=15,
    cpu_std=5,

    memory_mean=78,
    memory_std=2,

    actual_anomaly=0
)


# ============================================================
# 2. CPU DEGRADATION
# ============================================================

add_records(
    phase="cpu_stress",
    count=50,

    latency_mean=180,
    latency_std=25,

    cpu_mean=88,
    cpu_std=5,

    memory_mean=79,
    memory_std=2,

    actual_anomaly=1
)


# ============================================================
# 3. MEMORY PRESSURE
# ============================================================

add_records(
    phase="memory_pressure",
    count=50,

    latency_mean=160,
    latency_std=20,

    cpu_mean=25,
    cpu_std=6,

    memory_mean=96,
    memory_std=1.5,

    actual_anomaly=1
)


# ============================================================
# 4. NETWORK / SERVICE LATENCY DEGRADATION
# ============================================================

add_records(
    phase="latency_degradation",
    count=50,

    latency_mean=500,
    latency_std=60,

    cpu_mean=18,
    cpu_std=5,

    memory_mean=79,
    memory_std=2,

    actual_anomaly=1
)


# ============================================================
# 5. RECOVERY
# ============================================================

add_records(
    phase="recovery",
    count=50,

    latency_mean=55,
    latency_std=8,

    cpu_mean=25,
    cpu_std=7,

    memory_mean=82,
    memory_std=2,

    actual_anomaly=0
)


# ============================================================
# CREATE DATAFRAME
# ============================================================

df = pd.DataFrame(records)


# Shuffle dataset so the model doesn't simply learn
# the ordering of phases.

df = df.sample(
    frac=1,
    random_state=42
).reset_index(drop=True)


# ============================================================
# SAVE DATASET
# ============================================================

output_file = "multimetric_dataset.csv"

df.to_csv(
    output_file,
    index=False
)


# ============================================================
# DISPLAY INFORMATION
# ============================================================

print("\n==============================================")
print("SystemPulse v3 - Multi-Metric Dataset")
print("==============================================")

print(
    f"\nTotal records: {len(df)}"
)

print("\nPhase distribution:")

print(
    df["phase"].value_counts()
)

print("\nAnomaly distribution:")

print(
    df["actual_anomaly"].value_counts()
)

print("\nMetric statistics:")

print(
    df.groupby("phase")[
        [
            "response_time_ms",
            "cpu_percent",
            "memory_percent"
        ]
    ].mean().round(2)
)

print(
    f"\nDataset saved as:\n{output_file}"
)

print("\nFirst 10 records:")

print(
    df.head(10).to_string(index=False)
)