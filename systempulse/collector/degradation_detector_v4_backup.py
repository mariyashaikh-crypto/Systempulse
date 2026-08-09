import pandas as pd
import numpy as np


# ============================================================
# SystemPulse v4 - Early Failure Prediction Engine
# ============================================================

DATASET = "degradation_dataset.csv"


# ------------------------------------------------------------
# Load dataset
# ------------------------------------------------------------

df = pd.read_csv(DATASET)

print("\n==============================================")
print("SystemPulse v4 - Early Failure Prediction")
print("==============================================")

print(f"\nTotal observations: {len(df)}")


# ------------------------------------------------------------
# Establish healthy baseline
# ------------------------------------------------------------

stable = df[df["phase"] == "stable"]

baseline_latency = stable["response_time_ms"].mean()
baseline_cpu = stable["cpu_percent"].mean()
baseline_memory = stable["memory_percent"].mean()

print("\nHealthy Baseline")
print("----------------")
print(f"Latency : {baseline_latency:.2f} ms")
print(f"CPU     : {baseline_cpu:.2f}%")
print(f"Memory  : {baseline_memory:.2f}%")


# ------------------------------------------------------------
# Calculate degradation risk
# ------------------------------------------------------------

results = []

window = 5


for i in range(len(df)):

    current = df.iloc[i]

    latency = current["response_time_ms"]
    cpu = current["cpu_percent"]
    memory = current["memory_percent"]

    # ----------------------------------------------
    # Distance from healthy baseline
    # ----------------------------------------------

    latency_change = (
        (latency - baseline_latency)
        / baseline_latency
    )

    cpu_change = (
        (cpu - baseline_cpu)
        / max(baseline_cpu, 1)
    )

    memory_change = (
        (memory - baseline_memory)
        / max(baseline_memory, 1)
    )


    # ----------------------------------------------
    # Recent trend
    # ----------------------------------------------

    start = max(0, i - window + 1)

    recent = df.iloc[start:i + 1]

    if len(recent) >= 2:

        latency_slope = np.polyfit(
            range(len(recent)),
            recent["response_time_ms"],
            1
        )[0]

        cpu_slope = np.polyfit(
            range(len(recent)),
            recent["cpu_percent"],
            1
        )[0]

        memory_slope = np.polyfit(
            range(len(recent)),
            recent["memory_percent"],
            1
        )[0]

    else:

        latency_slope = 0
        cpu_slope = 0
        memory_slope = 0


    # ----------------------------------------------
    # Normalize trend contribution
    # ----------------------------------------------

    latency_trend = max(
        0,
        latency_slope / max(baseline_latency, 1)
    )

    cpu_trend = max(
        0,
        cpu_slope / max(baseline_cpu, 1)
    )

    memory_trend = max(
        0,
        memory_slope / max(baseline_memory, 1)
    )


    # ----------------------------------------------
    # Convert changes to risk components
    # ----------------------------------------------

    latency_risk = np.clip(
        latency_change * 40,
        0,
        40
    )

    cpu_risk = np.clip(
        cpu_change * 20,
        0,
        20
    )

    memory_risk = np.clip(
        memory_change * 20,
        0,
        20
    )

    trend_risk = np.clip(
        (
            latency_trend * 10
            + cpu_trend * 5
            + memory_trend * 5
        ),
        0,
        20
    )


    # ----------------------------------------------
    # Overall degradation risk
    # ----------------------------------------------

    risk = (
        latency_risk
        + cpu_risk
        + memory_risk
        + trend_risk
    )

    risk = float(
        np.clip(risk, 0, 100)
    )


    # ----------------------------------------------
    # Determine severity
    # ----------------------------------------------

    if risk < 25:

        severity = "NORMAL"

    elif risk < 50:

        severity = "EARLY WARNING"

    elif risk < 75:

        severity = "WARNING"

    else:

        severity = "CRITICAL"


    # ----------------------------------------------
    # Determine dominant cause
    # ----------------------------------------------

    contributions = {
        "Latency degradation": latency_risk,
        "CPU pressure": cpu_risk,
        "Memory pressure": memory_risk
    }

    dominant_cause = max(
        contributions,
        key=contributions.get
    )


    # ----------------------------------------------
    # Determine trend direction
    # ----------------------------------------------

    if (
        latency_slope > 0
        and cpu_slope > 0
        and memory_slope > 0
    ):

        trend = "DETERIORATING"

    elif (
        latency_slope < 0
        and cpu_slope < 0
    ):

        trend = "RECOVERING"

    else:

        trend = "STABLE"


    # ----------------------------------------------
    # Save result
    # ----------------------------------------------

    results.append({

        "sequence":
            current["sequence"],

        "latency":
            round(latency, 2),

        "cpu":
            round(cpu, 2),

        "memory":
            round(memory, 2),

        "risk":
            round(risk, 2),

        "severity":
            severity,

        "trend":
            trend,

        "likely_cause":
            dominant_cause,

        "actual_phase":
            current["phase"],

        "actual_anomaly":
            current["actual_anomaly"]

    })


# ============================================================
# Results DataFrame
# ============================================================

results_df = pd.DataFrame(results)


# ============================================================
# Display results
# ============================================================

print("\n==============================================")
print("EARLY WARNING RESULTS")
print("==============================================")

for _, row in results_df.iterrows():

    print(
        f"\nSequence: {int(row['sequence']):3d}"
        f" | Latency: {row['latency']:7.2f} ms"
        f" | CPU: {row['cpu']:6.2f}%"
        f" | Memory: {row['memory']:6.2f}%"
        f" | Risk: {row['risk']:6.2f}%"
        f" | {row['severity']}"
    )

    print(
        f"   Trend: {row['trend']}"
        f" | Likely cause: {row['likely_cause']}"
        f" | Phase: {row['actual_phase']}"
    )


# ============================================================
# Summary
# ============================================================

print("\n==============================================")
print("SystemPulse v4 Summary")
print("==============================================")

print(
    "\nSeverity distribution:"
)

print(
    results_df["severity"].value_counts()
)


print(
    "\nTrend distribution:"
)

print(
    results_df["trend"].value_counts()
)


print(
    "\nLikely cause distribution:"
)

print(
    results_df["likely_cause"].value_counts()
)


# ============================================================
# Early warning analysis
# ============================================================

early_warning = results_df[
    results_df["severity"] == "EARLY WARNING"
]

warning = results_df[
    results_df["severity"] == "WARNING"
]

critical = results_df[
    results_df["severity"] == "CRITICAL"
]


print(
    f"\nEarly warnings generated : {len(early_warning)}"
)

print(
    f"Warnings generated       : {len(warning)}"
)

print(
    f"Critical alerts generated: {len(critical)}"
)


# ============================================================
# Save results
# ============================================================

output_file = "degradation_results.csv"

results_df.to_csv(
    output_file,
    index=False
)

print(
    f"\nResults saved as:\n{output_file}"
)

print("\nSystemPulse v4 analysis completed.")