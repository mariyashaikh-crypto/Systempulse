import requests
import time
import csv
import os
import psutil
from datetime import datetime


# -----------------------------------
# Configuration
# -----------------------------------

PRODUCT_SERVICE_URL = "http://127.0.0.1:8002/products"

MONITORING_API_URL = "http://127.0.0.1:8003/api/metrics"

MONITOR_INTERVAL = 5

CSV_FILE = "telemetry.csv"


# -----------------------------------
# Save telemetry to CSV
# -----------------------------------

def save_telemetry(telemetry):

    file_exists = os.path.exists(CSV_FILE)

    with open(CSV_FILE, "a", newline="") as file:

        writer = csv.DictWriter(
            file,
            fieldnames=[
                "timestamp",
                "service",
                "status_code",
                "response_time_ms",
                "cpu_percent",
                "memory_percent",
                "healthy"
            ]
        )

        if not file_exists:
            writer.writeheader()

        writer.writerow(telemetry)


# -----------------------------------
# Send telemetry to Monitoring API
# -----------------------------------

def send_to_monitoring_api(telemetry):

    try:

        response = requests.post(
            MONITORING_API_URL,
            json=telemetry,
            timeout=2
        )

        if response.status_code == 200:

            print("→ Monitoring API: metric sent successfully")

        else:

            print(
                f"→ Monitoring API error: "
                f"HTTP {response.status_code}"
            )

    except requests.exceptions.RequestException as error:

        # The collector should continue working
        # even if the Monitoring API is unavailable.

        print(
            f"→ Monitoring API unavailable: {error}"
        )


# -----------------------------------
# Check Product Service
# -----------------------------------

def check_product_service():

    start_time = time.perf_counter()

    try:

        response = requests.get(
            PRODUCT_SERVICE_URL,
            timeout=5
        )

        end_time = time.perf_counter()

        response_time = (
            end_time - start_time
        ) * 1000

        # System resource metrics

        cpu_usage = psutil.cpu_percent(
            interval=0.1
        )

        memory_usage = psutil.virtual_memory().percent

        telemetry = {

            "timestamp": datetime.now().strftime(
                "%Y-%m-%d %H:%M:%S"
            ),

            "service": "product-service",

            "status_code": response.status_code,

            "response_time_ms": round(
                response_time,
                2
            ),

            "cpu_percent": round(
                cpu_usage,
                2
            ),

            "memory_percent": round(
                memory_usage,
                2
            ),

            "healthy": response.status_code == 200
        }

        print(telemetry)

        # Save locally
        save_telemetry(telemetry)

        # Send to Monitoring API
        send_to_monitoring_api(telemetry)


    except requests.exceptions.RequestException:

        end_time = time.perf_counter()

        response_time = (
            end_time - start_time
        ) * 1000

        cpu_usage = psutil.cpu_percent(
            interval=0.1
        )

        memory_usage = psutil.virtual_memory().percent

        telemetry = {

            "timestamp": datetime.now().strftime(
                "%Y-%m-%d %H:%M:%S"
            ),

            "service": "product-service",

            "status_code": None,

            "response_time_ms": round(
                response_time,
                2
            ),

            "cpu_percent": round(
                cpu_usage,
                2
            ),

            "memory_percent": round(
                memory_usage,
                2
            ),

            "healthy": False
        }

        print(telemetry)

        # Save locally
        save_telemetry(telemetry)

        # Send failure information to Monitoring API
        send_to_monitoring_api(telemetry)


# -----------------------------------
# Main
# -----------------------------------

if __name__ == "__main__":

    print("SystemPulse Collector Started")
    print("--------------------------------")
    print("Monitoring Product Service...")
    print("Collecting:")
    print("  - Response Time")
    print("  - CPU Usage")
    print("  - Memory Usage")
    print("Saving to telemetry.csv")
    print("Sending metrics to Monitoring API :8003")
    print("Press CTRL+C to stop.\n")

    while True:

        check_product_service()

        time.sleep(MONITOR_INTERVAL)