# 5G Data Visualization Dashboard

This project is a web-based data visualization dashboard for real-time monitoring and analysis of key performance indicators (KPIs) in a 5G network environment. Built with Firebase for backend data storage and Plotly.js for front-end graphing, the dashboard receives KPI data (signal strength, latency, and throughput) from a Raspberry Pi with a 5G hat and SIM card. The dashboard also integrates real-time weather data to provide insights into 5G performance under varying weather conditions.

## Features
- **Real-Time Data Display**: Fetches and displays live 5G KPIs such as signal strength, latency, and throughput.
- **Weather Overlay**: Integrates weather data using a weather API for correlation with 5G performance metrics.
- **Data Analysis Tools**: Provides calculated metrics, trends, and easy-to-interpret visualizations.

## Project Structure
- `index.html`: Main HTML file containing the structure of the dashboard and includes scripts for Firebase and Plotly.
- `scripts/scripts.js`: JavaScript file with Firebase initialization, data fetching, real-time updates, and chart generation.
- `README.md`: Documentation for setting up and using the dashboard.

## Prerequisites
- **Firebase**: Set up a Firebase project and configure the Realtime Database.
- **Raspberry Pi with 5G hat and SIM card**: This is the data source for sending KPI data to Firebase.

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/username/5G-data-visualization.git
cd 5G-data-visualization
