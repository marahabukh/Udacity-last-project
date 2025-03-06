import { app } from "./server.js";
import request from "supertest";
import { describe, test, expect, beforeAll, afterAll, jest, beforeEach } from "@jest/globals";
import axios from "axios";

// Mocking the external API calls
jest.mock("axios");

process.env.NODE_ENV = "test";

let server;

beforeAll((done) => {
  server = app.listen(0, () => {
    global.agent = request.agent(server);
    done();
  });
});

afterAll((done) => {
  server.close(done);
});

beforeEach(() => {
  jest.resetAllMocks();
});

describe("Server", () => {
  // Test to serve index.html
  test("GET / should serve index.html", async () => {
    const response = await global.agent.get("/");
    expect(response.status).toBe(200);
    expect(response.text.toLowerCase()).toContain("<!doctype html>");
  });

  // Test the /test route for response
  test("GET /test should return json", async () => {
    const response = await global.agent.get("/test");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Test route working" });
  });

  // Test the /weather route with mocked data
  test("GET /weather should return weather data", async () => {
    const mockWeatherData = {
      data: [{ temp: 25, weather: { description: "Sunny" } }],
    };

    // Mock the external API call (assuming you use axios to fetch the weather)
    axios.get.mockResolvedValueOnce(mockWeatherData);

    const response = await global.agent.get("/weather").query({ lat: "48.85341", lon: "2.3488" });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data[0].weather.description).toBe("Sunny");
  });

  // Test the /image route with mocked data
  test("GET /image should return image data", async () => {
    const mockImageData = {
      hits: [{ webformatURL: "https://example.com/image.jpg" }],
    };

    // Mock the external API call (assuming you use axios to fetch the image)
    axios.get.mockResolvedValueOnce(mockImageData);

    const response = await global.agent.get("/image").query({ city: "Paris" });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("hits");
    expect(response.body.hits[0].webformatURL).toBe("https://example.com/image.jpg");
  });
});
