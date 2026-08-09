import pandas as pd
import numpy as np


np.random.seed(42)

records = []


# ============================================================
# SystemPulse v4
# Controlled Degradation / Early Warning Dataset
# ============================================================


def add_phase(
    phase,
    count,
    latency_start,
    latency_end,
    cpu_start,
    cpu_end,
    memory_start,
    memory_end,
    actual_anomaly
):

    for i in range(count):

        progress = i / (count - 1)

        # Gradual change rather than sudden jumps
        latency_mean = (
            latency_start
            + (latency_end - latency_start) * progress
        )

        cpu_mean = (
            cpu_start
            + (cpu_end - cpu_start) * progress
        )

        memory_mean = (
            memory_start
            + (memory_end - memory_start) * progress
        )

        latency = np.random.normal(
            latency_mean,
            max(1.5, latency_mean * 0.05)
        )

        cpu = np.random.normal(
            cpu_mean,
            3
        )

        memory = np.random.normal(
            memory_mean,
            0.8
        )

        records.append({
            "sequence": len(records) + 1,

            "response_time_ms": round(
                max(1, latency),
                2
            ),

            "cpu_percent": round(
                np.clip(cpu, 0, 100),
                2
            ),

            "memory_percent": round(
                np.clip(memory, 0, 100),
                2
            ),

            "phase": phase,

            "actual_anomaly": actual_anomaly
        })


# ============================================================
# PHASE 1 — STABLE SYSTEM
# ============================================================

add_phase(
    phase="stable",
    count=40,

    latency_start=40,
    latency_end=45,

    cpu_start=12,
    cpu_end=16,

    memory_start=77,
    memory_end=78,

    actual_anomaly=0
)


# ============================================================
# PHASE 2 — EARLY DEGRADATION
# ============================================================

add_phase(
    phase="early_degradation",
    count=30,

    latency_start=45,
    latency_end=80,

    cpu_start=16,
    cpu_end=35,

    memory_start=78,
    memory_end=82,

    actual_anomaly=0
)


# ============================================================
# PHASE 3 — WARNING
# ============================================================

add_phase(
    phase="warning",
    count=30,

    latency_start=80,
    latency_end=150,

    cpu_start=35,
    cpu_end=60,

    memory_start=82,
    memory_end=88,

    actual_anomaly=1
)


# ============================================================
# PHASE 4 — CRITICAL DEGRADATION
# ============================================================

add_phase(
    phase="critical",
    count=30,

    latency_start=150,
    latency_end=400,

    cpu_start=60,
    cpu_end=90,

    memory_start=88,
    memory_end=96,

    actual_anomaly=1
)


# ============================================================
# PHASE 5 — FAILURE
# ============================================================

add_phase(
    phase="failure",
    count=20,

    latency_start=400,
    latency_end=700,

    cpu_start=90,
    cpu_end=98,

    memory_start=96,
    memory_end=99,

    actual_anomaly=1
)


# ============================================================
# PHASE 6 — RECOVERY
# ============================================================

add_phase(
    phase="recovery",
    count=30,

    latency_start=180,
    latency_end=50,

    cpu_start=70,
    cpu_end=18,

    memory_start=90,
    memory_end=80,

    actual_anomaly=0
)


# ============================================================
# CREATE DATAFRAME
# ============================================================

df = pd.DataFrame(records)


# ============================================================
# SAVE DATASET
# ============================================================

output_file = "degradation_dataset.csv"

df.to_csv(
    output_file,
    index=False
)


# ============================================================
# DISPLAY INFORMATION
# ============================================================

print("\n==============================================")
print("SystemPulse v4 - Degradation Dataset")
print("==============================================")

print(
    f"\nTotal records: {len(df)}"
)

print("\nPhase distribution:")

print(
    df["phase"].value_counts(
        sort=False
    )
)

print("\nAnomaly distribution:")

print(
    df["actual_anomaly"].value_counts()
)

print("\nPhase statistics:")

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
    df.head(10).to_string(
        index=False
    )
)

print("\nLast 10 records:")

print(
    df.tail(10).to_string(
        index=False
    )
)