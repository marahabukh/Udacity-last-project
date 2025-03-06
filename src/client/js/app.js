// API URLs and keys
const CITY_API_URL = "http://api.geonames.org/searchJSON";
const WEATHER_API_URL = "https://api.weatherbit.io/v2.0/forecast/daily";
const IMAGE_API_URL = "https://pixabay.com/api/";
const CITY_API_USERNAME = process.env.CITY_API_USERNAME;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const IMAGE_API_KEY = process.env.IMAGE_API_KEY;

// Object to store travel details
let travelDetails = {
  destinationCity: "",
  destinationCountry: "",
  startDate: "",
  endDate: "",
  daysUntilTravel: 0,
  travelDuration: 0,
  forecast: {},
  cityImage: "",
};

/**
 * Handles the form submission
 * Collects travel data, fetches information from APIs, and updates the user interface
 * @param {Event} event - The form submit event
 */
async function handleFormSubmission(event) {
  event.preventDefault();

  // Extract city and date information from the form
  const cityName = document.getElementById("city").value;
  const startTravelDate = document.getElementById("departure").value;
  const endTravelDate = document.getElementById("return").value;

  // Ensure all fields are filled in
  if (!cityName || !startTravelDate || !endTravelDate) {
    alert("Please complete all fields");
    return;
  }

  try {
    // Gather travel data and update the travelDetails object
    await gatherTravelData(cityName, startTravelDate, endTravelDate);
    refreshUI();
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred. Please try again.");
  }
}

/**
 * Fetches necessary travel data and updates the travelDetails object
 * @param {string} cityName - Name of the destination city
 * @param {string} startTravelDate - Travel start date
 * @param {string} endTravelDate - Travel end date
 */
async function gatherTravelData(cityName, startTravelDate, endTravelDate) {
  try {
    const geoData = await fetchCityData(cityName);
    const weatherData = await fetchWeatherForecast(geoData.latitude, geoData.longitude, startTravelDate);
    const cityImageUrl = await fetchCityImage(cityName);

    travelDetails = {
      destinationCity: geoData.name,
      destinationCountry: geoData.countryName,
      startDate: startTravelDate,
      endDate: endTravelDate,
      daysUntilTravel: calculateDaysUntil(startTravelDate),
      travelDuration: calculateTravelDuration(startTravelDate, endTravelDate),
      forecast: weatherData,
      cityImage: cityImageUrl,
    };
  } catch (error) {
    throw new Error("Unable to fetch travel data.");
  }
}

/**
 * Fetches city data (latitude, longitude, etc.) using the Geonames API
 * @param {string} cityName - Name of the city
 * @returns {Object} - Object containing geographical data of the city
 */
async function fetchCityData(cityName) {
  const response = await fetch(`${CITY_API_URL}?q=${cityName}&maxRows=1&username=${CITY_API_USERNAME}`);
  const data = await response.json();
  if (data.geonames.length === 0) {
    throw new Error("City not found");
  }
  return data.geonames[0];
}

/**
 * Fetches weather data for the destination city using the Weatherbit API
 * @param {number} lat - Latitude of the city
 * @param {number} lon - Longitude of the city
 * @param {string} date - Date to get the weather forecast for
 * @returns {Object} - Weather data for the specified date
 */
async function fetchWeatherForecast(lat, lon, date) {
  const response = await fetch(`${WEATHER_API_URL}?lat=${lat}&lon=${lon}&key=${WEATHER_API_KEY}`);
  const data = await response.json();
  const forecastDate = new Date(date);
  const forecast = data.data.find((day) => new Date(day.datetime).getTime() === forecastDate.getTime());
  return forecast || data.data[0]; // Return the first available day's forecast if no exact match
}

/**
 * Fetches an image of the city from the Pixabay API
 * @param {string} cityName - Name of the city
 * @returns {string} - URL of an image representing the city
 */
async function fetchCityImage(cityName) {
  const response = await fetch(`${IMAGE_API_URL}?key=${IMAGE_API_KEY}&q=${cityName}+city&image_type=photo`);
  const data = await response.json();
  return data.hits.length > 0 ? data.hits[0].webformatURL : "";
}

/**
 * Calculates the number of days until the specified date
 * @param {string} date - The future date
 * @returns {number} - Number of days until the specified date
 */
function calculateDaysUntil(date) {
  const today = new Date();
  const travelDate = new Date(date);
  return Math.ceil((travelDate - today) / (1000 * 3600 * 24));
}

/**
 * Calculates the duration of the trip in days
 * @param {string} startDate - The trip's start date
 * @param {string} endDate - The trip's end date
 * @returns {number} - The duration of the trip in days
 */
function calculateTravelDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.ceil((end - start) / (1000 * 3600 * 24));
}

/**
 * Updates the user interface with the gathered travel data
 */
function refreshUI() {
  document.getElementById("results").innerHTML = `
    <h2>Your Travel to ${travelDetails.destinationCity}, ${travelDetails.destinationCountry}</h2>
    <p>Departure Date: ${travelDetails.startDate}</p>
    <p>Return Date: ${travelDetails.endDate}</p>
    <p>Trip Duration: ${travelDetails.travelDuration} days</p>
    <p>Days Remaining: ${travelDetails.daysUntilTravel}</p>
    <p>Weather Forecast: ${travelDetails.forecast.temp}°C, ${travelDetails.forecast.weather.description}</p>
    <img src="${travelDetails.cityImage}" alt="${travelDetails.destinationCity}" />
  `;
}

// Export functions for testing
export { calculateDaysUntil, calculateTravelDuration, fetchCityData, fetchWeatherForecast, fetchCityImage };
