import { describe, it, expect, vi } from "vitest";
import jwt from "jsonwebtoken";
import { runIssueTestToken } from "@/issue-test-token";
import config from "@/config";

describe("runIssueTestToken", () => {
  it("should log a valid JWT token with correct issuer and subject", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    runIssueTestToken();

    expect(consoleSpy).toHaveBeenCalledTimes(2);

    const token = consoleSpy.mock.calls[1][0];
    const decoded = jwt.verify(token, config.appSecret);

    expect(decoded).toMatchObject({
      sub: "c1f7f20b-7dc9-47b2-bd9a-bbffbfeee8d1",
      iss: "teecha-app",
    });

    consoleSpy.mockRestore();
  });
});
