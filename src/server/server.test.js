import { app } from "./server.js"
import request from "supertest"
import { describe, test, expect, beforeAll, afterAll, jest, beforeEach } from "@jest/globals"

process.env.NODE_ENV = "test"

let server

beforeAll((done) => {
  server = app.listen(0, () => {
    global.agent = request.agent(server)
    done()
  })
})

afterAll((done) => {
  server.close(done)
})

beforeEach(() => {
  jest.resetAllMocks()
})

describe("Server", () => {
  test("GET / should serve index.html", async () => {
    const response = await global.agent.get("/")
    expect(response.status).toBe(200)
    expect(response.text.toLowerCase()).toContain("<!doctype html>")
  })

  test("GET /test should return json", async () => {
    const response = await global.agent.get("/test")
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ message: "Test route working" })
  })

  test("GET /weather should return weather data", async () => {
    // Mock fetch is handled in server.js for test environment
    const response = await global.agent.get("/weather").query({ lat: "48.85341", lon: "2.3488" })
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("success")
  })

  test("GET /image should return image data", async () => {
    // Mock fetch is handled in server.js for test environment
    const response = await global.agent.get("/image").query({ city: "Paris" })
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("success")
  })
})
