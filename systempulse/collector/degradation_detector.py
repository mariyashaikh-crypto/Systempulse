import pandas as pd
import numpy as np


# ============================================================
# SystemPulse v4.1
# Predictive Risk Engine
# ============================================================

DATASET = "degradation_dataset.csv"

WINDOW = 7


# ============================================================
# Load Dataset
# ============================================================

df = pd.read_csv(DATASET)

print("\n==============================================")
print("SystemPulse v4.1 - Predictive Risk Engine")
print("==============================================")

print(f"\nTotal observations: {len(df)}")


# ============================================================
# Healthy Baseline
# ============================================================

stable = df[df["phase"] == "stable"]

baseline_latency = stable["response_time_ms"].mean()
baseline_cpu = stable["cpu_percent"].mean()
baseline_memory = stable["memory_percent"].mean()

print("\nHealthy Baseline")
print("----------------")
print(f"Latency : {baseline_latency:.2f} ms")
print(f"CPU     : {baseline_cpu:.2f}%")
print(f"Memory  : {baseline_memory:.2f}%")


# ============================================================
# Risk Calculation
# ============================================================

results = []


for i in range(len(df)):

    current = df.iloc[i]

    latency = float(current["response_time_ms"])
    cpu = float(current["cpu_percent"])
    memory = float(current["memory_percent"])


    # --------------------------------------------------------
    # Recent observations
    # --------------------------------------------------------

    start = max(0, i - WINDOW + 1)

    recent = df.iloc[start:i + 1]


    # --------------------------------------------------------
    # Calculate trends
    # --------------------------------------------------------

    if len(recent) >= 2:

        x = np.arange(len(recent))

        latency_slope = np.polyfit(
            x,
            recent["response_time_ms"],
            1
        )[0]

        cpu_slope = np.polyfit(
            x,
            recent["cpu_percent"],
            1
        )[0]

        memory_slope = np.polyfit(
            x,
            recent["memory_percent"],
            1
        )[0]

    else:

        latency_slope = 0
        cpu_slope = 0
        memory_slope = 0


    # --------------------------------------------------------
    # Baseline deviation
    # --------------------------------------------------------

    latency_deviation = max(
        0,
        (latency - baseline_latency)
        / baseline_latency
    )

    cpu_deviation = max(
        0,
        (cpu - baseline_cpu)
        / max(baseline_cpu, 1)
    )

    memory_deviation = max(
        0,
        (memory - baseline_memory)
        / max(baseline_memory, 1)
    )


    # --------------------------------------------------------
    # Convert deviation into component scores
    # --------------------------------------------------------

    latency_score = np.clip(
        latency_deviation * 30,
        0,
        30
    )

    cpu_score = np.clip(
        cpu_deviation * 15,
        0,
        15
    )

    memory_score = np.clip(
        memory_deviation * 15,
        0,
        15
    )


    # --------------------------------------------------------
    # Trend scores
    # --------------------------------------------------------

    latency_trend_score = np.clip(
        max(0, latency_slope)
        / max(baseline_latency, 1)
        * 25,
        0,
        25
    )

    cpu_trend_score = np.clip(
        max(0, cpu_slope)
        / max(baseline_cpu, 1)
        * 10,
        0,
        10
    )

    memory_trend_score = np.clip(
        max(0, memory_slope)
        / max(baseline_memory, 1)
        * 10,
        0,
        10
    )


    # --------------------------------------------------------
    # Persistence
    #
    # Count how many recent observations are increasing
    # relative to the previous observation.
    # --------------------------------------------------------

    persistence_score = 0

    if len(recent) >= 3:

        latency_values = recent[
            "response_time_ms"
        ].values

        cpu_values = recent[
            "cpu_percent"
        ].values

        memory_values = recent[
            "memory_percent"
        ].values

        latency_increases = sum(
            latency_values[j] > latency_values[j - 1]
            for j in range(1, len(latency_values))
        )

        cpu_increases = sum(
            cpu_values[j] > cpu_values[j - 1]
            for j in range(1, len(cpu_values))
        )

        memory_increases = sum(
            memory_values[j] > memory_values[j - 1]
            for j in range(1, len(memory_values))
        )

        total_increases = (
            latency_increases
            + cpu_increases
            + memory_increases
        )

        maximum_possible = (
            (len(recent) - 1) * 3
        )

        persistence_score = (
            total_increases
            / maximum_possible
        ) * 15


    # --------------------------------------------------------
    # Cross-metric pressure
    #
    # If multiple metrics rise together, increase risk.
    # --------------------------------------------------------

    metrics_rising = 0

    if latency_slope > 0:
        metrics_rising += 1

    if cpu_slope > 0:
        metrics_rising += 1

    if memory_slope > 0:
        metrics_rising += 1


    if metrics_rising == 3:

        cross_metric_score = 10

    elif metrics_rising == 2:

        cross_metric_score = 6

    elif metrics_rising == 1:

        cross_metric_score = 2

    else:

        cross_metric_score = 0


    # --------------------------------------------------------
    # Recovery detection
    # --------------------------------------------------------

    recovering = (
        latency_slope < 0
        and cpu_slope < 0
    )

    if recovering:

        recovery_reduction = 0.35

    else:

        recovery_reduction = 0


    # --------------------------------------------------------
    # Raw risk
    # --------------------------------------------------------

    raw_risk = (
        latency_score
        + cpu_score
        + memory_score
        + latency_trend_score
        + cpu_trend_score
        + memory_trend_score
        + persistence_score
        + cross_metric_score
    )


    # --------------------------------------------------------
    # Apply recovery adjustment
    # --------------------------------------------------------

    risk = raw_risk * (
        1 - recovery_reduction
    )

    risk = float(
        np.clip(risk, 0, 100)
    )


    # --------------------------------------------------------
    # Severity
    # --------------------------------------------------------

    if risk < 25:

        severity = "NORMAL"

    elif risk < 45:

        severity = "EARLY WARNING"

    elif risk < 70:

        severity = "WARNING"

    else:

        severity = "CRITICAL"


    # --------------------------------------------------------
    # Trend
    # --------------------------------------------------------

    if (
        latency_slope > 0
        and cpu_slope > 0
        and memory_slope > 0
    ):

        trend = "DETERIORATING"

    elif (
        latency_slope < 0
        and cpu_slope < 0
        and memory_slope < 0
    ):

        trend = "RECOVERING"

    else:

        trend = "MIXED / STABLE"


    # --------------------------------------------------------
    # Root cause estimation
    # --------------------------------------------------------

    causes = {

        "Latency degradation":
            latency_score
            + latency_trend_score,

        "CPU pressure":
            cpu_score
            + cpu_trend_score,

        "Memory pressure":
            memory_score
            + memory_trend_score
    }


    dominant_cause = max(
        causes,
        key=causes.get
    )


    # --------------------------------------------------------
    # Combined resource pressure
    # --------------------------------------------------------

    if (
        cpu_deviation > 0.5
        and memory_deviation > 0.1
        and latency_deviation > 0.5
    ):

        dominant_cause = (
            "Combined resource pressure"
        )


    # --------------------------------------------------------
    # Prediction
    # --------------------------------------------------------

    if trend == "DETERIORATING":

        if risk >= 70:

            prediction = (
                "HIGH probability of imminent failure"
            )

        elif risk >= 45:

            prediction = (
                "System is moving toward critical degradation"
            )

        elif risk >= 25:

            prediction = (
                "Early deterioration detected"
            )

        else:

            prediction = (
                "Potential degradation developing"
            )

    elif trend == "RECOVERING":

        prediction = (
            "System is recovering"
        )

    else:

        prediction = (
            "No strong failure trajectory detected"
        )


    # --------------------------------------------------------
    # Save result
    # --------------------------------------------------------

    results.append({

        "sequence":
            int(current["sequence"]),

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

        "prediction":
            prediction,

        "actual_phase":
            current["phase"],

        "actual_anomaly":
            int(current["actual_anomaly"])
    })


# ============================================================
# Results DataFrame
# ============================================================

results_df = pd.DataFrame(results)


# ============================================================
# Display selected observations
# ============================================================

print("\n==============================================")
print("PREDICTIVE RISK RESULTS")
print("==============================================")


# Display every 5th observation
# plus important phase transitions.

important_phases = [
    "stable",
    "early_degradation",
    "warning",
    "critical",
    "failure",
    "recovery"
]


for phase in important_phases:

    phase_rows = results_df[
        results_df["actual_phase"] == phase
    ]

    print(
        f"\n--- {phase.upper()} ---"
    )

    # Show first 3 observations
    # and last observation of each phase.

    selected = pd.concat([
        phase_rows.head(3),
        phase_rows.tail(1)
    ]).drop_duplicates()

    for _, row in selected.iterrows():

        print(
            f"Seq {int(row['sequence']):3d}"
            f" | Latency {row['latency']:7.2f} ms"
            f" | CPU {row['cpu']:6.2f}%"
            f" | Memory {row['memory']:6.2f}%"
            f" | Risk {row['risk']:6.2f}%"
            f" | {row['severity']}"
            f" | {row['trend']}"
        )

        print(
            f"       Cause: {row['likely_cause']}"
        )

        print(
            f"       Prediction: {row['prediction']}"
        )


# ============================================================
# Summary
# ============================================================

print("\n==============================================")
print("SystemPulse v4.1 Summary")
print("==============================================")


print("\nSeverity distribution:")

print(
    results_df["severity"].value_counts()
)


print("\nTrend distribution:")

print(
    results_df["trend"].value_counts()
)


print("\nLikely cause distribution:")

print(
    results_df["likely_cause"].value_counts()
)


# ============================================================
# Phase-wise risk
# ============================================================

print("\nAverage risk by phase:")

phase_risk = (
    results_df
    .groupby("actual_phase")["risk"]
    .mean()
    .round(2)
)

print(phase_risk)


# ============================================================
# Early warning detection
# ============================================================

early_degradation = results_df[
    results_df["actual_phase"]
    == "early_degradation"
]

early_warnings = early_degradation[
    early_degradation["severity"]
    != "NORMAL"
]


print(
    "\nEarly degradation observations:"
)

print(
    len(early_degradation)
)


print(
    "Early degradation observations "
    "flagged before ground-truth warning:"
)

print(
    len(early_warnings)
)


# ============================================================
# Critical detection
# ============================================================

critical_phase = results_df[
    results_df["actual_phase"]
    == "critical"
]

critical_detected = critical_phase[
    critical_phase["severity"]
    == "CRITICAL"
]


print(
    "\nCritical phase observations:"
)

print(
    len(critical_phase)
)


print(
    "Critical observations detected:"
)

print(
    len(critical_detected)
)


# ============================================================
# Save results
# ============================================================

output_file = "degradation_results_v4_1.csv"

results_df.to_csv(
    output_file,
    index=False
)


print(
    f"\nResults saved as:\n{output_file}"
)

print(
    "\nSystemPulse v4.1 analysis completed."
)