import { describe, it, expect, vi } from "vitest";
import { auth } from "express-oauth2-jwt-bearer";
import authenticateUser from "@/middleware/authenticate-user";

vi.unmock("@/middleware/authenticate-user"); // cancels the global mock for this test file to test itself

vi.mock("express-oauth2-jwt-bearer", () => ({
  auth: vi.fn().mockReturnValue("mocked-auth-middleware"),
}));

vi.mock("@/config", () => ({
  default: {
    audience: "test-audience",
    issuerBaseUrl: "https://test-issuer.com",
  },
}));

describe("authenticateUser middleware", () => {
  it("should call auth with correct config and return middleware", () => {
    expect(auth).toHaveBeenCalledWith({
      audience: "test-audience",
      issuerBaseURL: "https://test-issuer.com",
    });

    expect(authenticateUser).toBe("mocked-auth-middleware");
  });
});
