import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from "vitest";
import DatabaseConnectionError from "@/errors/DatabaseConnectionError";
import { connectToDatabase, disconnectDatabase } from "@setup/database";

vi.mock("mongoose", async () => {
  const actual = await vi.importActual<typeof import("mongoose")>("mongoose");
  return {
    default: {
      ...actual,
      connect: vi.fn(),
      disconnect: vi.fn(),
    },
  };
});

import mongoose from "mongoose";

describe("connectToDatabase", () => {
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it("should connect successfully to MongoDB and log it", async () => {
    (mongoose.connect as Mock).mockResolvedValueOnce({});

    await expect(connectToDatabase()).resolves.not.toThrow();

    expect(mongoose.connect).toHaveBeenCalledWith("mongodb://localhost:27017/test");
    expect(logSpy).toHaveBeenCalledWith("MongoDB connected");
  });

  it("should throw DatabaseConnectionError on failure", async () => {
    (mongoose.connect as Mock).mockRejectedValueOnce(new Error("Connection failed"));

    await expect(connectToDatabase()).rejects.toThrow(DatabaseConnectionError);
    expect(mongoose.connect).toHaveBeenCalled();
    expect(logSpy).not.toHaveBeenCalledWith("MongoDB connected");
  });
});

describe("disconnectDatabase", () => {
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it("should disconnect from MongoDB and log it", async () => {
    (mongoose.disconnect as Mock).mockResolvedValueOnce(undefined);

    await expect(disconnectDatabase()).resolves.not.toThrow();

    expect(mongoose.disconnect).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith("MongoDB disconnected");
  });
});
