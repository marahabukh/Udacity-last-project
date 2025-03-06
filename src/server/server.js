import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

// Configure environment variables
dotenv.config();

// Setup empty JS object to act as endpoint for all routes
let projectData = {};

// Initialize express app
const app = express();

/* Middleware*/
// Configure express to use body-parser as middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());

// Initialize the main project folder
app.use(express.static("dist"));

// Setup Server
const port = process.env.PORT || 3000;

/**
 * GET route to retrieve all project data
 * This route sends the projectData object as a response
 */
app.get("/all", (req, res) => {
  try {
    res.status(200).send(projectData);
  } catch (error) {
    console.error("Error fetching project data:", error);
    res.status(500).send("Failed to retrieve project data.");
  }
});

/**
 * POST route to add new data to projectData
 * This route receives trip data from the client and stores it in the projectData object
 */
app.post("/add", (req, res) => {
  try {
    // Update projectData with the received data
    const { temperature, date, userResponse, city, country, weatherDescription, imageUrl } = req.body;

    projectData = {
      temperature,
      date,
      userResponse,
      city,
      country,
      weatherDescription,
      imageUrl,
    };
    res.status(201).send(projectData);
  } catch (error) {
    console.error("Error adding data:", error);
    res.status(500).send("An error occurred while adding data.");
  }
});

// API keys (accessed from environment variables for security)
const WEATHERBIT_API_KEY = process.env.WEATHERBIT_API_KEY;
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;

// Start server
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

// Export for testing
export default app;
