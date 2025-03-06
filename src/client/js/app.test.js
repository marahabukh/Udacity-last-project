import { calculateDaysUntil, calculateTravelDuration, fetchCityData, fetchWeatherForecast, fetchCityImage } from "./app.js";
import { jest, describe, test, expect, beforeEach } from "@jest/globals";

global.fetch = jest.fn();

describe("Client-side functions", () => {
  beforeEach(() => {
    global.fetch.mockClear();
  });

  test("calculateDaysUntil returns correct number of days", () => {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 5);
    expect(calculateDaysUntil(futureDate)).toBe(5);
  });

  test("calculateTravelDuration returns correct duration", () => {
    const startDate = "2023-07-01";
    const endDate = "2023-07-10";
    expect(calculateTravelDuration(startDate, endDate)).toBe(9);
  });

  test("fetchCityData fetches and returns location data", async () => {
    const mockResponse = {
      geonames: [{ name: "Paris", countryName: "France", lat: "48.85341", lng: "2.3488" }],
    };

    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    );

    const result = await fetchCityData("Paris");
    expect(result).toEqual(mockResponse.geonames[0]);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test("fetchWeatherForecast fetches and returns weather data", async () => {
    const mockResponse = {
      data: [{ temp: 25, weather: { description: "Sunny" } }],
    };

    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    );

    const result = await fetchWeatherForecast(48.85341, 2.3488, "2023-07-01");
    expect(result).toEqual(mockResponse.data[0]);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test("fetchCityImage fetches and returns image URL", async () => {
    const mockResponse = {
      hits: [{ webformatURL: "https://example.com/image.jpg" }],
    };

    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    );

    const result = await fetchCityImage("Paris");
    expect(result).toBe("https://example.com/image.jpg");
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
