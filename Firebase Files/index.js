// Importing Firebase function for creating scheduled tasks
const { onSchedule } = require("firebase-functions/v2/scheduler");

// Importing Firebase Admin SDK for interacting with Firebase services
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK if not already initialized
// This allows access to Firebase Realtime Database and other Firebase services
if (!admin.apps.length) {
    admin.initializeApp();
}

// Set your Oikolab API key to access weather data
// Replace with your actual API key from Oikolab
const oikolabApiKey = "39b0524ef02d43838a3baf55b2bfec3a";

// Define a function that retrieves weather data from Oikolab API for a specific timestamp
async function fetchWeatherData(timestamp) {
    // Import node-fetch dynamically, allowing us to use import syntax
    const { default: fetch } = await import("node-fetch");

    // Set up the API URL with query parameters for location, timestamp, and API key
    // The location is hard-coded to specific latitude and longitude values (e.g., Williamsville, NY)
    const apiUrl = https://api.oikolab.com/weather?location=42.9634,-78.7378& +
                   timestamp=${timestamp}&apikey=${oikolabApiKey};

    // Make a request to the Oikolab API and wait for the response
    const response = await fetch(apiUrl);

    // Check if the response is not successful (e.g., a 404 or 500 error)
    // Throw an error if the request was unsuccessful
    if (!response.ok) {
        throw new Error(Error fetching weather data: ${response.statusText});
    }

    // Parse the response as JSON to retrieve the weather data object
    const weatherData = await response.json();

    // Extract relevant weather information and return it in an organized format
    return {
        temperature: weatherData.temperature,                 // Temperature in degrees Celsius
        relative_humidity: weatherData.relative_humidity,     // Humidity percentage
        wind_speed: weatherData.wind_speed,                   // Wind speed in m/s or other units
        total_cloud_cover: weatherData.total_cloud_cover,     // Cloud cover percentage
        total_precipitation: weatherData.total_precipitation, // Precipitation in mm
        snowfall: weatherData.snowfall,                       // Snowfall in mm
        snow_depth: weatherData.snow_depth                    // Snow depth in mm
    };
}

// Scheduled function to check for missing weather data in all existing KPI entries
// Runs automatically at specified intervals (e.g., every 24 hours)
exports.checkAndAddMissingWeatherData = onSchedule("every 24 hours", async () => {
    // Get a reference to the Firebase Realtime Database
    const db = admin.database();

    // Reference the "/kpis" path in the database where KPI entries are stored
    const kpiRef = db.ref("/kpis");

    // Retrieve all KPI entries under "/kpis" as a single snapshot
    const snapshot = await kpiRef.once("value");

    // Loop through each child entry in the snapshot
    snapshot.forEach(async (childSnapshot) => {
        // Get the data for the current entry
        const entry = childSnapshot.val();

        // Retrieve the timestamp for the current KPI entry
        const timestamp = entry.timestamp;

        // Check if weather data is missing and if a valid timestamp exists
        if (!entry.weather && timestamp) {
            try {
                // Fetch weather data for the specific timestamp using the helper function
                const weatherData = await fetchWeatherData(timestamp);

                // Store the fetched weather data under the "weather" key of the current entry
                await childSnapshot.ref.child("weather").set(weatherData);
                
                // Log a message indicating successful addition of weather data
                console.log(Weather data added for timestamp: ${timestamp});
            } catch (error) {
                // Log an error message if fetching or storing weather data fails
                console.error(Failed to fetch weather data for timestamp: ${timestamp}, error);
            }
        }
    });
});