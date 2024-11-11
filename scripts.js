// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);

// Reference to Firebase Database
const db = firebase.database().ref('kpis');

// Listen for data changes and update the chart
db.on('value', (snapshot) => {
    const data = snapshot.val();
    updateChart(data);
});

// Function to update the chart with fetched data
function updateChart(data) {
    const timestamps = [];
    const signalStrength = [];
    const latency = [];
    const throughput = [];

    Object.keys(data).forEach(key => {
        const entry = data[key];
        timestamps.push(new Date(entry.timestamp));
        signalStrength.push(entry.signal_strength);
        latency.push(entry.latency);
        throughput.push(entry.throughput);
    });

    const trace1 = { x: timestamps, y: signalStrength, type: 'scatter', name: 'Signal Strength' };
    const trace2 = { x: timestamps, y: latency, type: 'scatter', name: 'Latency' };
    const trace3 = { x: timestamps, y: throughput, type: 'scatter', name: 'Throughput' };

    const layout = { title: '5G KPIs Over Time' };
    Plotly.newPlot('chart', [trace1, trace2, trace3], layout);
}

// Optional: Fetch Weather Data
async function fetchWeatherData() {
    try {
        const response = await fetch('https://api.oikolab.com/weather?params');
        const weatherData = await response.json();
        displayWeatherData(weatherData);  // Call a function to display weather data if needed
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

// Optional: Function to display weather data on the page
function displayWeatherData(weatherData) {
    // Implement the display logic here, e.g., update an HTML element with weather data
    console.log("Weather data:", weatherData);
}
