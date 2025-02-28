export const ErrorType = {
  BadRequest: "BadRequest",
  Unauthenticated: "Unauthenticated",
  Unauthorized: "Unauthorized",
  NotFound: "NotFound",
  Internal: "Internal",
} as const;
export type ErrorType = (typeof ErrorType)[keyof typeof ErrorType];
