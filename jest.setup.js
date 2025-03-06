import { jest } from "@jest/globals"

global.fetch = jest.fn()

beforeEach(() => {
  jest.resetAllMocks()
})

afterEach(() => {
  jest.clearAllMocks()
})

