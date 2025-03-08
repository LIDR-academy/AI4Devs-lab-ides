import { describe, expect, it } from "vitest"
import { capitalize, formatDate, truncateText } from "../utils"

describe("Utility functions", () => {
  // Test formatDate
  describe("formatDate", () => {
    it("should format a valid date string", () => {
      const date = new Date("2023-01-01T10:00:00").toISOString()
      const formatted = formatDate(date)
      expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/) // DD/MM/YYYY format
    })

    it("should return empty string for invalid date", () => {
      expect(formatDate("")).toBe("")
    })
  })

  // Test truncateText
  describe("truncateText", () => {
    it("should truncate text longer than maxLength", () => {
      const longText = "This is a very long text that should be truncated"
      const truncated = truncateText(longText, 10)
      expect(truncated).toBe("This is a ...")
    })

    it("should not truncate text shorter than maxLength", () => {
      const shortText = "Short"
      expect(truncateText(shortText, 10)).toBe(shortText)
    })
  })

  // Test capitalize
  describe("capitalize", () => {
    it("should capitalize the first letter of a string", () => {
      expect(capitalize("hello")).toBe("Hello")
    })

    it("should handle empty string", () => {
      expect(capitalize("")).toBe("")
    })
  })
})
