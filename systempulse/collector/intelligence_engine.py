import pandas as pd
import numpy as np


class SystemPulseIntelligence:

    def __init__(self):

        self.baseline_latency = 42.0
        self.baseline_cpu = 14.0
        self.baseline_memory = 78.0

        self.history = []
        self.max_history = 7


    def add_telemetry(
        self,
        response_time_ms,
        cpu_percent,
        memory_percent
    ):

        telemetry = {
            "response_time_ms": float(response_time_ms),
            "cpu_percent": float(cpu_percent),
            "memory_percent": float(memory_percent)
        }

        self.history.append(telemetry)

        if len(self.history) > self.max_history:
            self.history.pop(0)

        return self.analyze(telemetry)


    def calculate_trends(self):

        if len(self.history) < 2:

            return {
                "latency_slope": 0.0,
                "cpu_slope": 0.0,
                "memory_slope": 0.0
            }

        data = pd.DataFrame(self.history)

        x = np.arange(len(data))

        return {
            "latency_slope": float(
                np.polyfit(x, data["response_time_ms"], 1)[0]
            ),
            "cpu_slope": float(
                np.polyfit(x, data["cpu_percent"], 1)[0]
            ),
            "memory_slope": float(
                np.polyfit(x, data["memory_percent"], 1)[0]
            )
        }


    def analyze(self, telemetry):

        latency = telemetry["response_time_ms"]
        cpu = telemetry["cpu_percent"]
        memory = telemetry["memory_percent"]

        # Baseline deviations

        latency_deviation = max(
            0,
            (latency - self.baseline_latency)
            / self.baseline_latency
        )

        cpu_deviation = max(
            0,
            (cpu - self.baseline_cpu)
            / self.baseline_cpu
        )

        memory_deviation = max(
            0,
            (memory - self.baseline_memory)
            / self.baseline_memory
        )

        # Component scores

        latency_score = np.clip(
            latency_deviation * 35, 0, 35
        )

        cpu_score = np.clip(
            cpu_deviation * 20, 0, 20
        )

        memory_score = np.clip(
            memory_deviation * 20, 0, 20
        )

        # Trends

        trends = self.calculate_trends()

        latency_slope = trends["latency_slope"]
        cpu_slope = trends["cpu_slope"]
        memory_slope = trends["memory_slope"]

        latency_trend_score = np.clip(
            max(0, latency_slope)
            / self.baseline_latency * 15,
            0,
            15
        )

        cpu_trend_score = np.clip(
            max(0, cpu_slope)
            / self.baseline_cpu * 5,
            0,
            5
        )

        memory_trend_score = np.clip(
            max(0, memory_slope)
            / self.baseline_memory * 5,
            0,
            5
        )

        # Cross metric pressure

        metrics_rising = sum([
            latency_slope > 0,
            cpu_slope > 0,
            memory_slope > 0
        ])

        if metrics_rising == 3:
            cross_metric_score = 10
        elif metrics_rising == 2:
            cross_metric_score = 6
        elif metrics_rising == 1:
            cross_metric_score = 2
        else:
            cross_metric_score = 0

        # Risk

        raw_risk = (
            latency_score
            + cpu_score
            + memory_score
            + latency_trend_score
            + cpu_trend_score
            + memory_trend_score
            + cross_metric_score
        )

        # Strong immediate degradation should be reflected
        # even when history is not available.

        if latency > 150 and cpu > 70 and memory > 90:
            raw_risk = max(raw_risk, 85)

        elif latency > 100 and cpu > 70:
            raw_risk = max(raw_risk, 70)

        elif memory > 90 and latency > 100:
            raw_risk = max(raw_risk, 70)

        risk = float(np.clip(raw_risk, 0, 100))

        # Anomaly

        anomaly = (
            latency > 100
            or cpu > 80
            or memory > 90
            or risk >= 70
        )

        # Severity

        if risk >= 70:
            severity = "CRITICAL"

        elif risk >= 45:
            severity = "WARNING"

        elif risk >= 25:
            severity = "EARLY WARNING"

        else:
            severity = "NORMAL"

        # Trend

        if len(self.history) < 2:

            trend = "MIXED / STABLE"

        elif (
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

        # Root cause

        if (
            latency > 150
            and cpu > 70
            and memory > 90
        ):

            root_cause = "Combined resource pressure"

            explanation = (
                "The service is experiencing simultaneous "
                "latency, CPU and memory pressure."
            )

            recommended_action = (
                "Investigate CPU and memory intensive "
                "operations and reduce workload."
            )

        elif cpu > 70:

            root_cause = "CPU pressure"

            explanation = (
                "High CPU utilization is likely "
                "contributing to service degradation."
            )

            recommended_action = (
                "Investigate CPU-intensive processes "
                "and optimize the service workload."
            )

        elif memory > 90:

            root_cause = "Memory pressure"

            explanation = (
                "High memory utilization may be "
                "contributing to degraded performance."
            )

            recommended_action = (
                "Investigate memory-consuming processes "
                "and check for possible memory leaks."
            )

        elif latency > 100:

            root_cause = "Latency degradation"

            explanation = (
                "Response latency is significantly "
                "above the healthy baseline."
            )

            recommended_action = (
                "Investigate slow requests, database "
                "operations, network delays and bottlenecks."
            )

        elif latency > 60:

            root_cause = "Early latency degradation"

            explanation = (
                "The service is showing early signs "
                "of increasing response latency."
            )

            recommended_action = (
                "Continue monitoring latency closely "
                "and investigate the source of the increase."
            )

        else:

            root_cause = "No significant issue"

            explanation = (
                "System metrics are within the "
                "expected operating range."
            )

            recommended_action = (
                "Continue normal monitoring."
            )

        return {

            "response_time_ms": round(latency, 2),

            "cpu_percent": round(cpu, 2),

            "memory_percent": round(memory, 2),

            "risk": round(risk, 2),

            "anomaly": anomaly,

            "severity": severity,

            "trend": trend,

            "root_cause": root_cause,

            "explanation": explanation,

            "recommended_action": recommended_action,

            "latency_slope": round(latency_slope, 4),

            "cpu_slope": round(cpu_slope, 4),

            "memory_slope": round(memory_slope, 4)
        }


if __name__ == "__main__":

    print("\n==============================================")
    print("SystemPulse Intelligence Engine Test")
    print("==============================================\n")

    engine = SystemPulseIntelligence()

    result = engine.add_telemetry(
        response_time_ms=42.5,
        cpu_percent=14.0,
        memory_percent=78.0
    )

    print("Healthy Test:")
    print(result)

    result = engine.add_telemetry(
        response_time_ms=185.0,
        cpu_percent=82.0,
        memory_percent=94.0
    )

    print("\nDegraded Test:")
    print(result)

    print("\n==============================================")
    print("Intelligence Engine Test Completed")
    print("==============================================")