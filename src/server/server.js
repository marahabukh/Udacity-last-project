import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import dotenv from "dotenv"
import fetch from "node-fetch"
import path from "path"
import { fileURLToPath } from "url"

// Configure environment variables
dotenv.config()

// Setup directory paths for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

// Serve static files from dist folder
app.use(express.static(path.join(__dirname, "../../dist")))

// API keys
const GEONAMES_USERNAME = process.env.GEONAMES_USERNAME
const WEATHERBIT_API_KEY = process.env.WEATHERBIT_API_KEY
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY

// Validate API keys
if (!GEONAMES_USERNAME || !WEATHERBIT_API_KEY || !PIXABAY_API_KEY) {
  console.error("ERROR: Missing API keys. Please check your .env file.")
  console.error(`GEONAMES_USERNAME: ${GEONAMES_USERNAME ? "Set" : "Missing"}`)
  console.error(`WEATHERBIT_API_KEY: ${WEATHERBIT_API_KEY ? "Set" : "Missing"}`)
  console.error(`PIXABAY_API_KEY: ${PIXABAY_API_KEY ? "Set" : "Missing"}`)
}

// Geonames API endpoint
app.get("/geo", async (req, res) => {
  try {
    const { city } = req.query
    if (!city) {
      return res.status(400).json({
        success: false,
        error: "City parameter is required",
      })
    }

    console.log(`Fetching geo data for: ${city}`)
    console.log(`Using Geonames username: ${GEONAMES_USERNAME}`)

    const geonamesUrl = `http://api.geonames.org/searchJSON?q=${encodeURIComponent(city)}&maxRows=1&username=${GEONAMES_USERNAME}`
    console.log(`Geonames URL: ${geonamesUrl}`)

    const response = await fetch(geonamesUrl)

    if (!response.ok) {
      console.error(`Geonames API error: ${response.status} ${response.statusText}`)
      return res.status(response.status).json({
        success: false,
        error: `Geonames API error: ${response.status} ${response.statusText}`,
      })
    }

    const data = await response.json()
    console.log("Geonames response:", data)

    if (data.geonames && data.geonames.length > 0) {
      res.json({
        success: true,
        ...data.geonames[0],
      })
    } else {
      res.json({
        success: false,
        error: "City not found",
      })
    }
  } catch (error) {
    console.error("Geonames API error:", error)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// Weatherbit API endpoint
app.get("/weather", async (req, res) => {
  try {
    const { lat, lon } = req.query
    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        error: "Latitude and longitude parameters are required",
      })
    }

    const response = await fetch(
      `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${WEATHERBIT_API_KEY}`,
    )

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: `Weatherbit API error: ${response.status} ${response.statusText}`,
      })
    }

    const data = await response.json()

    if (data.data && data.data.length > 0) {
      res.json({
        success: true,
        data: data.data[0],
      })
    } else {
      res.json({
        success: false,
        error: "Weather data not found",
      })
    }
  } catch (error) {
    console.error("Weatherbit API error:", error)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// Pixabay API endpoint
app.get("/image", async (req, res) => {
  try {
    const { city } = req.query
    if (!city) {
      return res.status(400).json({
        success: false,
        error: "City parameter is required",
      })
    }

    const response = await fetch(
      `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(city)}+city&image_type=photo`,
    )

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: `Pixabay API error: ${response.status} ${response.statusText}`,
      })
    }

    const data = await response.json()

    if (data.hits && data.hits.length > 0) {
      res.json({
        success: true,
        url: data.hits[0].webformatURL,
      })
    } else {
      // Try searching for the country instead
      const countryResponse = await fetch(
        `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=landscape&image_type=photo`,
      )
      const countryData = await countryResponse.json()

      if (countryData.hits && countryData.hits.length > 0) {
        res.json({
          success: true,
          url: countryData.hits[0].webformatURL,
        })
      } else {
        res.json({
          success: false,
          error: "No image found",
        })
      }
    }
  } catch (error) {
    console.error("Pixabay API error:", error)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// Serve index.html for all routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../dist/index.html"))
})

// Setup Server
const port = process.env.PORT || 3000
let server

if (process.env.NODE_ENV !== "test") {
  server = app.listen(port, () => console.log(`Server running on port ${port}`))
}

export { app, server }

