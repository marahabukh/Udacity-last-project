import { jest, beforeEach } from "@jest/globals"

// Create a mock fetch function
global.fetch = jest.fn((url) => {
  // Mock different responses based on the URL
  if (url.includes("geonames")) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        geonames: [{ name: "Paris", countryName: "France", lat: "48.85341", lng: "2.3488" }]
      })
    })
  } else if (url.includes("weatherbit")) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        data: [{ temp: 25, weather: { description: "Sunny" } }]
      })
    })
  } else if (url.includes("pixabay")) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        hits: [{ webformatURL: "https://example.com/image.jpg" }]
      })
    })
  }
  
  // Default response
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({})
  })
})

// Reset all mocks before each test
beforeEach(() => {
  jest.resetAllMocks()
})
