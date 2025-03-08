/**
 * Enumeration representing the possible statuses for a candidate.
 * This is part of the domain model and independent of any external implementation.
 */
export enum Status {
  PENDING = 'PENDING',
  EVALUATED = 'EVALUATED',
  REJECTED = 'REJECTED',
  INTERVIEW = 'INTERVIEW',
  OFFERED = 'OFFERED',
  HIRED = 'HIRED',
}

/**
 * Type guard to check if a string is a valid Status
 */
export function isValidStatus(status: string): boolean {
  return Object.values(Status).includes(status as Status);
}
