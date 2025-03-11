interface RetryConfig {
  maxAttempts?: number;
  delay?: number;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  { maxAttempts = 3, delay = 1000 }: RetryConfig = {}
): Promise<T> {
  let lastError: Error = new Error("Operation failed");

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === maxAttempts) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError;
}
