/**
 * Enumeration representing the possible statuses for a candidate.
 * This is part of the domain model and independent of any external implementation.
 */
export enum Status {
  PENDING = 'PENDING',
  VALUATED = 'VALUATED',
  DISCARDED = 'DISCARDED',
}

/**
 * Type guard to check if a string is a valid Status
 */
export function isValidStatus(status: string): status is Status {
  return Object.values(Status).includes(status as Status);
}
