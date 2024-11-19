#!/bin/bash
# Update and install required packages
sudo apt update
sudo apt install -y python3 python3-pip iputils-ping iperf3 modemmanager

# Install Python dependencies
pip3 install -r requirements.txt

echo "Setup completed."
