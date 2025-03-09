/**
 * Global type declarations for modules that don't have their own type definitions
 */

// Declare missing module types
declare module "@mui/material" {
  export const TextField: any
  export const Button: any
  export const Select: any
  export const MenuItem: any
  export const FormControl: any
  export const InputLabel: any
  export const FormHelperText: any
}

// Declare global environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_API_URL: string
      NODE_ENV: "development" | "production" | "test"
    }
  }
}

export {}
