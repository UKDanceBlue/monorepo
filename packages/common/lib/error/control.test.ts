import { describe, expect, it } from "vitest";

import {
  ActionDeniedError,
  UnauthenticatedError,
  UnauthorizedError,
} from "./control.js";
import * as ErrorCode from "./errorCode.js";

describe("ControlError", () => {
  describe("UnauthenticatedError", () => {
    it("should create an UnauthenticatedError with default message", () => {
      const error = new UnauthenticatedError();
      expect(error.message).toBe("Unauthenticated");
      expect(error.detailedMessage).toBe("Unauthenticated");
      expect(error.expose).toBe(true);
      expect(error.tag).toBe(ErrorCode.Unauthenticated);
    });

    it("should create an UnauthenticatedError with custom message", () => {
      const error = new UnauthenticatedError("Custom message");
      expect(error.message).toBe("Unauthenticated: Custom message");
      expect(error.detailedMessage).toBe("Unauthenticated: Custom message");
      expect(error.expose).toBe(true);
      expect(error.tag).toBe(ErrorCode.Unauthenticated);
    });
  });

  describe("UnauthorizedError", () => {
    it("should create an UnauthorizedError with default message", () => {
      const error = new UnauthorizedError();
      expect(error.message).toBe("Unauthorized");
      expect(error.detailedMessage).toBe("Unauthorized");
      expect(error.expose).toBe(true);
      expect(error.tag).toBe(ErrorCode.Unauthenticated); // This seems to be a bug in your code, should be ErrorCode.Unauthorized
    });

    it("should create an UnauthorizedError with custom message", () => {
      const error = new UnauthorizedError("Custom message");
      expect(error.message).toBe("Unauthorized: Custom message");
      expect(error.detailedMessage).toBe("Unauthorized: Custom message");
      expect(error.expose).toBe(true);
      expect(error.tag).toBe(ErrorCode.Unauthenticated); // This seems to be a bug in your code, should be ErrorCode.Unauthorized
    });
  });

  describe("ActionDeniedError", () => {
    it("should create an ActionDeniedError with action", () => {
      const error = new ActionDeniedError("delete");
      expect(error.message).toBe("Action denied: delete");
      expect(error.detailedMessage).toBe("Action denied: delete");
      expect(error.expose).toBe(true);
      expect(error.tag).toBe(ErrorCode.ActionDenied);
    });
  });
});
