import requests
import time
import csv
import os
import psutil
from datetime import datetime


# ============================================================
# SystemPulse Telemetry Collector
#
# Measures the DEPLOYED product service and sends telemetry
# to the DEPLOYED monitoring API.
# ============================================================


# ============================================================
# Configuration
# ============================================================

PRODUCT_SERVICE_URL = os.getenv(
    "PRODUCT_SERVICE_URL",
    "https://systempulse.onrender.com/products"
)

MONITORING_API_URL = os.getenv(
    "MONITORING_API_URL",
    "https://systempulse-monitoring.onrender.com/api/metrics"
)

MONITOR_INTERVAL = int(
    os.getenv("MONITOR_INTERVAL", "5")
)

CSV_FILE = os.path.join(
    os.path.dirname(__file__),
    "telemetry.csv"
)


# ============================================================
# Save telemetry to CSV
# ============================================================

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


# ============================================================
# Send telemetry to Monitoring API
# ============================================================

def send_to_monitoring_api(telemetry):

    try:

        response = requests.post(
            MONITORING_API_URL,
            json=telemetry,
            timeout=10
        )

        if response.status_code == 200:

            print(
                "-> Monitoring API: metric sent successfully"
            )

        else:

            print(
                "-> Monitoring API error: "
                f"HTTP {response.status_code}"
            )

            print(
                f"   Response: {response.text}"
            )

    except requests.exceptions.RequestException as error:

        print(
            "-> Monitoring API unavailable: "
            f"{error}"
        )


# ============================================================
# Check Product Service
# ============================================================

def check_product_service():

    start_time = time.perf_counter()

    try:

        response = requests.get(
            PRODUCT_SERVICE_URL,
            timeout=10
        )

        end_time = time.perf_counter()

        response_time = (
            end_time - start_time
        ) * 1000

        # ----------------------------------------------------
        # Local machine resource metrics
        # ----------------------------------------------------

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

        print()
        print("------------------------------------------------")
        print("Telemetry")
        print("------------------------------------------------")
        print(f"Time           : {telemetry['timestamp']}")
        print(f"Service        : {telemetry['service']}")
        print(f"Status code    : {telemetry['status_code']}")
        print(
            f"Response time  : "
            f"{telemetry['response_time_ms']} ms"
        )
        print(
            f"CPU            : "
            f"{telemetry['cpu_percent']} %"
        )
        print(
            f"Memory         : "
            f"{telemetry['memory_percent']} %"
        )
        print(
            f"Healthy        : "
            f"{telemetry['healthy']}"
        )
        print("------------------------------------------------")

        # ----------------------------------------------------
        # Save locally
        # ----------------------------------------------------

        save_telemetry(telemetry)

        # ----------------------------------------------------
        # Send to deployed Monitoring API
        # ----------------------------------------------------

        send_to_monitoring_api(telemetry)

    except requests.exceptions.RequestException as error:

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

        print()
        print("------------------------------------------------")
        print("Product Service ERROR")
        print("------------------------------------------------")
        print(f"Error: {error}")
        print(
            f"Response time: "
            f"{telemetry['response_time_ms']} ms"
        )
        print("------------------------------------------------")

        # Save failure telemetry
        save_telemetry(telemetry)

        # Send failure telemetry
        send_to_monitoring_api(telemetry)


# ============================================================
# Main
# ============================================================

if __name__ == "__main__":

    print()
    print("==============================================")
    print("SystemPulse Collector Started")
    print("==============================================")
    print()
    print("Monitoring deployed Product Service:")
    print(PRODUCT_SERVICE_URL)
    print()
    print("Sending telemetry to deployed Monitoring API:")
    print(MONITORING_API_URL)
    print()
    print("Collection interval:")
    print(f"{MONITOR_INTERVAL} seconds")
    print()
    print("Collecting:")
    print("  - Response Time")
    print("  - CPU Usage")
    print("  - Memory Usage")
    print("  - HTTP Status")
    print()
    print("Saving telemetry to:")
    print(CSV_FILE)
    print()
    print("Press CTRL+C to stop.")
    print("==============================================")
    print()

    while True:

        check_product_service()

        time.sleep(MONITOR_INTERVAL)