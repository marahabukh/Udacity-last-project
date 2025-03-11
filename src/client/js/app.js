// API Configuration
const API_CONFIG = {
  GEONAMES: {
    URL: "http://api.geonames.org/searchJSON",
    USERNAME: process.env.GEONAMES_USERNAME,
  },
  WEATHERBIT: {
    URL: "https://api.weatherbit.io/v2.0/forecast/daily",
    API_KEY: process.env.WEATHERBIT_API_KEY,
  },
  PIXABAY: {
    URL: "https://pixabay.com/api/",
    API_KEY: process.env.PIXABAY_API_KEY,
  },
};

// Trip Data Storage
const tripDetails = {
  destination: "",
  country: "",
  departureDate: "",
  returnDate: "",
  daysUntilTrip: 0,
  duration: 0,
  weather: {},
  imageUrl: "",
};

/**
 * Handles form submission, validates input, fetches required data, and updates UI.
 * @param {Event} event - The form submission event.
 */
export async function handleFormSubmit(event) {
  event.preventDefault();

  const city = document.getElementById("city").value.trim();
  const departureDate = document.getElementById("departure").value;
  const returnDate = document.getElementById("return").value;

  if (!city || !departureDate || !returnDate) {
    return alert("Please complete all fields.");
  }

  try {
    await gatherTripData(city, departureDate, returnDate);
    updateUI();
  } catch (error) {
    console.error("Error fetching trip data:", error);
    alert("Unable to fetch trip details. Please try again.");
  }
}

/**
 * Gathers trip data including location, weather, and images.
 * @param {string} city - Destination city.
 * @param {string} departure - Departure date.
 * @param {string} returnDate - Return date.
 */
async function gatherTripData(city, departure, returnDate) {
  const locationData = await fetchLocationData(city);
  const weatherData = await fetchWeatherData(locationData.lat, locationData.lon, departure);
  const imageUrl = await fetchCityImage(city);

  tripDetails.destination = locationData.name;
  tripDetails.country = locationData.country;
  tripDetails.departureDate = departure;
  tripDetails.returnDate = returnDate;
  tripDetails.daysUntilTrip = calculateDaysUntil(departure);
  tripDetails.duration = calculateTripDuration(departure, returnDate);
  tripDetails.weather = weatherData;
  tripDetails.imageUrl = imageUrl;
}

/**
 * Fetches location details from GeoNames API.
 * @param {string} city - The city name.
 * @returns {Promise<Object>} - City details including name, country, latitude, and longitude.
 */
async function fetchLocationData(city) {
  const url = `${API_CONFIG.GEONAMES.URL}?q=${city}&maxRows=1&username=${API_CONFIG.GEONAMES.USERNAME}`;
  const response = await fetch(url);
  const data = await response.json();

  if (!data.geonames.length) {
    throw new Error("City not found.");
  }

  const { name, countryName, lat, lng } = data.geonames[0];
  return { name, country: countryName, lat, lon: lng };
}

/**
 * Fetches weather data for a location using Weatherbit API.
 * @param {number} lat - Latitude.
 * @param {number} lon - Longitude.
 * @param {string} date - Travel date.
 * @returns {Promise<Object>} - Weather data including temperature and description.
 */
async function fetchWeatherData(lat, lon, date) {
  const url = `${API_CONFIG.WEATHERBIT.URL}?lat=${lat}&lon=${lon}&key=${API_CONFIG.WEATHERBIT.API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();

  const targetDate = new Date(date);
  const forecast = data.data.find((day) => new Date(day.datetime).getTime() === targetDate.getTime());

  return forecast || data.data[0]; // Use the first available forecast if exact date is unavailable.
}

/**
 * Fetches an image URL from Pixabay API for the given city.
 * @param {string} city - City name.
 * @returns {Promise<string>} - Image URL or an empty string if no image is found.
 */
async function fetchCityImage(city) {
  const url = `${API_CONFIG.PIXABAY.URL}?key=${API_CONFIG.PIXABAY.API_KEY}&q=${encodeURIComponent(city)}&image_type=photo`;
  const response = await fetch(url);
  const data = await response.json();

  return data.hits.length > 0 ? data.hits[0].webformatURL : "";
}

/**
 * Calculates days until the departure date.
 * @param {string} date - The departure date.
 * @returns {number} - Days until departure.
 */
function calculateDaysUntil(date) {
  const today = new Date();
  const tripDate = new Date(date);
  return Math.ceil((tripDate - today) / (1000 * 60 * 60 * 24));
}

/**
 * Calculates the trip duration.
 * @param {string} start - Start date.
 * @param {string} end - End date.
 * @returns {number} - Trip duration in days.
 */
function calculateTripDuration(start, end) {
  return Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));
}

/**
 * Updates the UI with trip details.
 */
function updateUI() {
  document.getElementById("results").innerHTML = `
    <h2>Trip to ${tripDetails.destination}, ${tripDetails.country}</h2>
    <p>Departure: ${tripDetails.departureDate}</p>
    <p>Return: ${tripDetails.returnDate}</p>
    <p>Trip Duration: ${tripDetails.duration} days</p>
    <p>Days Until Trip: ${tripDetails.daysUntilTrip}</p>
    <p>Weather Forecast: ${tripDetails.weather.temp}°C, ${tripDetails.weather.weather.description}</p>
    <img src="${tripDetails.imageUrl}" alt="Image of ${tripDetails.destination}" />
  `;
}

// Export functions for testing
export { fetchLocationData, fetchWeatherData, fetchCityImage, calculateDaysUntil, calculateTripDuration };
