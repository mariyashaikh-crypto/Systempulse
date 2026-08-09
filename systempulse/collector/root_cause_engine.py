import pandas as pd


# ==============================================
# SystemPulse v5 - Root Cause & Explanation Engine
# ==============================================

INPUT_FILE = "degradation_results_v4_1.csv"
OUTPUT_FILE = "root_cause_results.csv"


print("==============================================")
print("SystemPulse v5 - Root Cause Engine")
print("==============================================")


# ==============================================
# Load dataset
# ==============================================

df = pd.read_csv(INPUT_FILE)

print()
print("Total observations:", len(df))

print()
print("Columns detected:")
print(list(df.columns))


# ==============================================
# Clean column names
# ==============================================

df.columns = (
    df.columns
    .str.strip()
    .str.lower()
    .str.replace(" ", "_")
)


# ==============================================
# Detect metric columns
# ==============================================

def find_column(possible_names):

    for name in possible_names:
        if name in df.columns:
            return name

    return None


latency_col = find_column([
    "response_time_ms",
    "response_time",
    "latency",
    "latency_ms"
])

cpu_col = find_column([
    "cpu_percent",
    "cpu",
    "cpu_usage"
])

memory_col = find_column([
    "memory_percent",
    "memory",
    "memory_usage"
])


# ==============================================
# Verify required columns
# ==============================================

print()
print("Detected metric columns:")

print("Latency :", latency_col)
print("CPU     :", cpu_col)
print("Memory  :", memory_col)


if latency_col is None:
    raise ValueError(
        "Could not find the latency column in degradation_results_v4_1.csv"
    )

if cpu_col is None:
    raise ValueError(
        "Could not find the CPU column in degradation_results_v4_1.csv"
    )

if memory_col is None:
    raise ValueError(
        "Could not find the memory column in degradation_results_v4_1.csv"
    )


# ==============================================
# Root Cause Detection
# ==============================================

def determine_root_cause(row):

    latency = float(row[latency_col])
    cpu = float(row[cpu_col])
    memory = float(row[memory_col])


    # ------------------------------------------
    # Combined resource pressure
    # ------------------------------------------

    if latency > 150 and cpu > 70 and memory > 90:

        return (
            "Combined resource pressure",

            [
                "Response latency is extremely high",
                "CPU utilization is high",
                "Memory utilization is high"
            ],

            "The service is experiencing simultaneous CPU, memory "
            "and latency pressure."
        )


    # ------------------------------------------
    # CPU pressure
    # ------------------------------------------

    elif cpu > 70:

        return (
            "CPU pressure",

            [
                "CPU utilization is high",
                "Response latency is increasing"
            ],

            "High CPU utilization is likely contributing "
            "to service degradation."
        )


    # ------------------------------------------
    # Memory pressure
    # ------------------------------------------

    elif memory > 90:

        return (
            "Memory pressure",

            [
                "Memory utilization is high",
                "Response latency is elevated"
            ],

            "High memory utilization may be contributing "
            "to degraded service performance."
        )


    # ------------------------------------------
    # Latency degradation
    # ------------------------------------------

    elif latency > 100:

        return (
            "Latency degradation",

            [
                "Response latency is significantly above normal",
                "CPU and memory are not the primary contributors"
            ],

            "The main observed problem is increased "
            "service response latency."
        )


    # ------------------------------------------
    # Early latency degradation
    # ------------------------------------------

    elif latency > 60:

        return (
            "Early latency degradation",

            [
                "Response latency is above the stable baseline"
            ],

            "The service is showing early signs "
            "of latency degradation."
        )


    # ------------------------------------------
    # Normal
    # ------------------------------------------

    else:

        return (
            "No significant issue",

            [
                "System metrics are within the expected range"
            ],

            "No significant performance problem "
            "is currently evident."
        )


# ==============================================
# Recommended Action
# ==============================================

def determine_action(cause):

    if cause == "Combined resource pressure":

        return (
            "Investigate CPU and memory intensive operations, "
            "reduce workload and inspect resource-consuming processes."
        )


    elif cause == "CPU pressure":

        return (
            "Investigate CPU-intensive processes, optimize "
            "service workload and check unusually high processing."
        )


    elif cause == "Memory pressure":

        return (
            "Investigate memory-consuming processes, check "
            "for memory leaks and reduce unnecessary memory usage."
        )


    elif cause == "Latency degradation":

        return (
            "Investigate slow requests, database operations, "
            "network delays and service response bottlenecks."
        )


    elif cause == "Early latency degradation":

        return (
            "Continue monitoring latency closely and investigate "
            "the source of increasing response time."
        )


    else:

        return "Continue normal monitoring."


# ==============================================
# Process each observation
# ==============================================

root_causes = []
evidence_list = []
explanations = []
actions = []


for _, row in df.iterrows():

    cause, evidence, explanation = determine_root_cause(row)

    action = determine_action(cause)

    root_causes.append(cause)
    evidence_list.append(" | ".join(evidence))
    explanations.append(explanation)
    actions.append(action)


# ==============================================
# Add results
# ==============================================

df["root_cause"] = root_causes
df["evidence"] = evidence_list
df["explanation"] = explanations
df["recommended_action"] = actions


# ==============================================
# Summary
# ==============================================

print()
print("==============================================")
print("SystemPulse v5 Summary")
print("==============================================")


print()
print("Root cause distribution:")

print(
    df["root_cause"].value_counts()
)


if "severity" in df.columns:

    print()
    print("Severity distribution:")

    print(
        df["severity"].value_counts()
    )


if "trend" in df.columns:

    print()
    print("Trend distribution:")

    print(
        df["trend"].value_counts()
    )


# ==============================================
# Save results
# ==============================================

df.to_csv(
    OUTPUT_FILE,
    index=False
)


print()
print("Results saved as:")
print(OUTPUT_FILE)

print()
print("SystemPulse v5 analysis completed.")