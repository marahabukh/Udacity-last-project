// Primary object to store trip data
const tripData = {
  city: "",
  country: "",
  departureDate: "",
  returnDate: "",
  daysUntilTrip: 0,
  tripDuration: 0,
  weather: {},
  image: "",
}

/**
 * Primary function to handle form submission
 * This function orchestrates the entire process of gathering trip information,
 * fetching relevant data from APIs, and updating the UI
 * @param {Event} event - The submit event from the form
 */
export async function handleSubmit(event) {
  event.preventDefault()

  // Get input values from the form
  const city = document.getElementById("city").value
  const departureDate = document.getElementById("departure").value
  const returnDate = document.getElementById("return").value

  // Validate input to ensure all fields are filled
  if (!city || !departureDate || !returnDate) {
    alert("Please fill in all fields")
    return
  }

  try {
    // Get location data from server
    const geoResponse = await fetch(`/geo?city=${encodeURIComponent(city)}`)
    if (!geoResponse.ok) {
      throw new Error(`Geonames API error: ${geoResponse.status}`)
    }
    const geoData = await geoResponse.json()
    if (!geoData.success) {
      throw new Error(geoData.error || "Failed to get location data")
    }

    tripData.city = geoData.name
    tripData.country = geoData.countryName

    // Get weather data from server
    const weatherResponse = await fetch(`/weather?lat=${geoData.lat}&lon=${geoData.lng}&date=${departureDate}`)
    if (!weatherResponse.ok) {
      throw new Error(`Weather API error: ${weatherResponse.status}`)
    }
    const weatherData = await weatherResponse.json()
    if (!weatherData.success) {
      throw new Error(weatherData.error || "Failed to get weather data")
    }

    tripData.weather = weatherData.data

    // Get image from server
    const imageResponse = await fetch(`/image?city=${encodeURIComponent(city)}`)
    if (!imageResponse.ok) {
      throw new Error(`Image API error: ${imageResponse.status}`)
    }
    const imageData = await imageResponse.json()
    if (!imageData.success) {
      throw new Error(imageData.error || "Failed to get image")
    }

    tripData.image = imageData.url

    // Calculate trip details
    tripData.departureDate = departureDate
    tripData.returnDate = returnDate
    tripData.daysUntilTrip = calculateDaysUntil(departureDate)
    tripData.tripDuration = calculateTripDuration(departureDate, returnDate)

    // Update UI
    updateUI()
  } catch (error) {
    console.error("Error:", error)
    alert(`An error occurred: ${error.message}`)
  }
}

/**
 * Calculates the number of days until a given date
 * @param {string} date - The future date
 * @returns {number} - Number of days until the given date
 */
export function calculateDaysUntil(date) {
  const today = new Date()
  const tripDate = new Date(date)
  today.setHours(0, 0, 0, 0)
  tripDate.setHours(0, 0, 0, 0)
  const timeDiff = tripDate.getTime() - today.getTime()
  return Math.ceil(timeDiff / (1000 * 3600 * 24))
}

/**
 * Calculates the duration of a trip in days
 * @param {string} startDate - The start date of the trip
 * @param {string} endDate - The end date of the trip
 * @returns {number} - Duration of the trip in days
 */
export function calculateTripDuration(startDate, endDate) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const timeDiff = end.getTime() - start.getTime()
  return Math.ceil(timeDiff / (1000 * 3600 * 24))
}

/**
 * Updates the UI with the trip data
 * This function populates the results section of the page with
 * the fetched and calculated trip information
 */
function updateUI() {
  document.getElementById("results").innerHTML = `
        <h2>Your Trip to ${tripData.city}, ${tripData.country}</h2>
        <p>Departing: ${tripData.departureDate}</p>
        <p>Returning: ${tripData.returnDate}</p>
        <p>Trip duration: ${tripData.tripDuration} days</p>
        <p>Days until trip: ${tripData.daysUntilTrip}</p>
        <p>Weather forecast: ${tripData.weather.temp}°C, ${tripData.weather.weather.description}</p>
        <img src="${tripData.image}" alt="${tripData.city}" />
    `
}

export async function getGeoData(city) {
  const response = await fetch(`/geo?city=${encodeURIComponent(city)}`)
  const data = await response.json()
  return data
}

export async function getWeatherData(lat, lon, date) {
  const response = await fetch(`/weather?lat=${lat}&lon=${lon}&date=${date}`)
  const data = await response.json()
  return data
}

export async function getImageUrl(city) {
  const response = await fetch(`/image?city=${encodeURIComponent(city)}`)
  const data = await response.json()
  return data
}

