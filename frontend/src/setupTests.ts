// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Suppress TouchRipple warnings to keep test output clean.
const originalError = console.error;
console.error = (...args: any[]) => {
  // Convert every argument to string and check if it includes "TouchRipple"
  if (
    args.some(
      (arg) =>
        String(arg).includes("TouchRipple") ||
        String(arg).includes("MuiTouchRipple"),
    )
  ) {
    return;
  }
  originalError(...args);
};
