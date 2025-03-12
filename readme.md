# FEND Capstone - Travel App

## Overview
This Travel App is a capstone project for the Udacity Front End Web Developer Nanodegree. It allows users to plan trips by entering their destination and travel dates, then provides weather forecasts and images of their destination.

## Features
- Enter destination city and travel dates
- View weather forecast for the destination
- See images of the destination
- Calculate trip duration and days until departure
- Responsive design for all device sizes
- Offline functionality with service workers

## Technologies Used
- **Frontend**: HTML5, SCSS, JavaScript (ES6+)
- **Backend**: Node.js, Express
- **Build Tool**: Webpack (with separate dev and prod configurations)
- **Testing**: Jest for unit and integration tests, Cypress for end-to-end testing
- **CI/CD**: GitHub Actions workflow for continuous integration
- **APIs**: Geonames, Weatherbit, Pixabay

## API Integrations
This project integrates with three external APIs:
1. **Geonames API**: For geographical data and coordinates
2. **Weatherbit API**: For weather forecasts based on location and date
3. **Pixabay API**: For destination images

## Installation and Setup

### Prerequisites
Ensure you have the following installed:
- **Node.js** (v18.0 or higher, recommended v20+)
- **npm** (included with Node.js)
- **API keys** for Geonames, Weatherbit, and Pixabay

### Steps to Set Up the Project
1. **Clone the Repository**  
   Run the following command in your terminal:
   ```sh
   git clone <repository-url>
   ```
2. **Navigate to the Project Directory**  
   ```sh
   cd <project-folder>
   ```
3. **Install Dependencies**  
   ```sh
   npm install
   ```
4. **Set Up Environment Variables**  
   Create a `.env` file in the project root and add your API keys:
   ```sh
   GEONAMES_USERNAME=your_geonames_username
   WEATHERBIT_API_KEY=your_weatherbit_api_key
   PIXABAY_API_KEY=your_pixabay_api_key
   ```
5. **Run the Development Server**  
   ```sh
   npm run dev
   ```
6. **Build for Production**  
   ```sh
   npm run build
   ```
7. **Start the Production Server**  
   ```sh
   npm start
   ```

## Testing
To run unit and integration tests:
```sh
npm run test
```

## License
This project is licensed under the MIT License.

---

Feel free to modify as needed! 🚀

