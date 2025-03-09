export type ErrorType = string | { message: string; details?: any };

export class Result<T> {
  private constructor(
    private isSuccess: boolean,
    private error?: ErrorType,
    private value?: T,
  ) {}

  public isOk(): boolean {
    return this.isSuccess;
  }

  public isFail(): boolean {
    return !this.isSuccess;
  }

  public getValue(): T {
    if (!this.isSuccess) {
      throw new Error('Cant retrieve value from a failed result');
    }
    return this.value as T;
  }

  public getError(): ErrorType {
    if (this.isSuccess) {
      throw new Error('Cant retrieve error from a successful result');
    }
    return this.error as ErrorType;
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, undefined, value);
  }

  public static fail<U>(error: ErrorType): Result<U> {
    return new Result<U>(false, error);
  }
} 