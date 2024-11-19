import os
import time
import subprocess
from firebase_config import send_data_to_firebase

def get_signal_strength():
    """Get 5G signal strength in dBm."""
    try:
        result = subprocess.check_output(["sudo", "mmcli", "-m", "0", "--signal"], text=True)
        for line in result.splitlines():
            if "rssi:" in line:  # Adjust this based on your 5G modem
                return int(line.split(":")[-1].strip())
    except Exception as e:
        print("Error fetching signal strength:", e)
    return None

def get_latency():
    """Get network latency using ping."""
    try:
        result = subprocess.check_output(["ping", "-c", "10", "8.8.8.8"], text=True)
        for line in result.splitlines():
            if "avg" in line:
                latency = line.split("=")[1].split("/")[1]
                return float(latency)
    except Exception as e:
        print("Error fetching latency:", e)
    return None

def get_throughput():
    """Calculate throughput using iperf3."""
    try:
        result = subprocess.check_output(["iperf3", "-c", "<server_ip>", "-J"], text=True)  # Replace with your iPerf3 server IP
        throughput = eval(result)["end"]["sum_sent"]["bits_per_second"] / 1e6  # Convert to Mbps
        return round(throughput, 2)
    except Exception as e:
        print("Error fetching throughput:", e)
    return None

def get_packet_loss():
    """Get packet loss using ping."""
    try:
        result = subprocess.check_output(["ping", "-c", "10", "8.8.8.8"], text=True)
        for line in result.splitlines():
            if "packet loss" in line:
                loss = line.split("%")[0].split(" ")[-1]
                return int(loss)
    except Exception as e:
        print("Error fetching packet loss:", e)
    return None

def log_and_transmit_kpi_data():
    """Log and transmit KPI data to Firebase."""
    while True:
        signal_strength = get_signal_strength()
        latency = get_latency()
        throughput = get_throughput()
        packet_loss = get_packet_loss()

        data = {
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "signal_strength": signal_strength,
            "latency": latency,
            "throughput": throughput,
            "packet_loss": packet_loss,
        }

        send_data_to_firebase(data)
        time.sleep(60)  # Log every minute

if __name__ == "__main__":
    log_and_transmit_kpi_data()
