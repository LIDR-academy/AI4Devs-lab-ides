import "@testing-library/jest-dom"
import { cleanup } from "@testing-library/react"
import { afterEach, expect } from "vitest"

// Se ejecuta después de cada prueba
afterEach(() => {
  cleanup()
})

// Extender expect
expect.extend({
  // Aquí puedes añadir tus propios matchers
})
