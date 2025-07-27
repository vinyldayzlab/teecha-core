import express, { type Request, type Response } from "express";
import request from "supertest";
import { createTestApp } from "@tests/utils/create-app";
import errorHandler from "@middleware/error-handler";
import { describe, it, expect, vi, type Mock, beforeEach } from "vitest";
import AuthenticationError from "@errors/AuthenticationError";
import DatabaseOperationError from "@errors/DatabaseOperationError";
import EntityNotFoundError from "@/errors/EntityNotFoundError";
import { setDebug } from "@tests/vitest.setup";

vi.mock("@routes/v1/teachers/controller", async () => {
  const actual = await vi.importActual<typeof import("@routes/v1/teachers/controller")>("@routes/v1/teachers/controller");
  return {
    ...actual,
    validateTeacherController: (req: Request, res: Response) => {
      res.status(200).json({ _id: "a1b2c3d4e5f6g7h8i9j10" });
    },
  };
});

vi.mock("@routes/v1/users/service", () => ({
  verifyUserExists: vi.fn(),
  initializeUser: vi.fn(),
}));

vi.mock("@routes/v1/teachers/service/functions", async () => {
  const actual = await vi.importActual<typeof import("@routes/v1/teachers/service/functions")>("@routes/v1/teachers/service/functions");
  return {
    ...actual,
    generateTeacherCode: vi.fn(),
  };
});

vi.mock("@db/users", async () => {
  const actual = await vi.importActual<typeof import("@db/users")>("@db/users");
  return {
    ...actual,
    createUser: vi.fn(),
    default: actual.default,
  };
});

vi.mock("@db/teachers", async () => {
  const actual = await vi.importActual<typeof import("@db/teachers")>("@db/teachers");
  return {
    ...actual,
    getTeacherByCode: vi.fn(),
  };
});

import * as UserService from "@routes/v1/users/service";
import * as UserDb from "@db/users";
import * as TeacherDb from "@db/teachers";
import * as TeacherService from "@routes/v1/teachers/service";
import * as TeacherServiceFunctions from "@routes/v1/teachers/service/functions";
import teachers from "@routes/v1/teachers";
import { ObjectId } from "mongodb";

describe("routes", () => {
  let app: express.Express;

  beforeEach(() => {
    app = createTestApp();
    app.use("/teachers", teachers);
    app.use(errorHandler);
  });

  describe("POST /teachers/validate", () => {
    it("should return 200 and teacherId when authorized", async () => {
      const response = await request(app).post("/teachers/validate").send({ teacher_code: "ABC123" });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ _id: "a1b2c3d4e5f6g7h8i9j10" });
    });
  });
});

describe("initializeTeacher", () => {
  const auth0_id = "a1b2c3d4e5f6g7h8i9j10";
  const teacherCode = "TCH123";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw if the user already exists", async () => {
    (UserService.verifyUserExists as Mock).mockResolvedValue({ auth0_id });

    try {
      await TeacherService.initializeTeacher(auth0_id, ["teacher"]);
      throw new Error("Forced error throw because expected initializeTeacher to throw, but it did not.");
    } catch (err) {
      expect(err).toBeInstanceOf(AuthenticationError);
      const authErr = err as AuthenticationError;
      expect(authErr.message).toBe("User is already in the database");
      expect(authErr.statusCode).toBe(500);
      expect(authErr.code).toBe("ERR_AUTH");
    }

    expect(UserService.verifyUserExists).toHaveBeenCalledWith(auth0_id);
    expect(UserService.initializeUser).not.toHaveBeenCalled();
  });

  it("should throw if roles do not include teacher", async () => {
    (UserService.verifyUserExists as Mock).mockResolvedValue(undefined);
    (UserService.initializeUser as Mock).mockReturnValue({ auth0_id });

    try {
      await TeacherService.initializeTeacher(auth0_id, ["student"]);
      throw new Error("Forced error throw because expected initializeTeacher to throw, but it did not.");
    } catch (err) {
      expect(err).toBeInstanceOf(AuthenticationError);
      const authErr = err as AuthenticationError;
      expect(authErr.message).toBe("User is not a teacher");
      expect(authErr.statusCode).toBe(500);
      expect(authErr.code).toBe("ERR_AUTH");
    }

    expect(UserService.initializeUser).toHaveBeenCalledWith(auth0_id);
  });

  it("should throw if createUser returns null", async () => {
    setDebug(false);
    (UserService.verifyUserExists as Mock).mockResolvedValue(undefined);
    (UserService.initializeUser as Mock).mockReturnValue({ auth0_id });
    (TeacherServiceFunctions.generateTeacherCode as Mock).mockResolvedValue(teacherCode);
    (UserDb.createUser as Mock).mockResolvedValue(null);

    try {
      await TeacherService.initializeTeacher(auth0_id, ["teacher"]);
      throw new Error("Forced error throw because expected initializeTeacher to throw, but it did not.");
    } catch (err) {
      expect(err).toBeInstanceOf(DatabaseOperationError);
      const dbErr = err as DatabaseOperationError;
      expect(dbErr.message).toBe("Could not create user");
      expect(dbErr.statusCode).toBe(500);
      expect(dbErr.code).toBe("ERR_DB");
    }

    expect(UserDb.createUser).toHaveBeenCalled();
  });

  it("should create and return a new teacher if user does not exist and role is teacher", async () => {
    const userInfo = { auth0_id };
    const createdUser = {
      auth0_id,
      teacher_code: teacherCode,
      contracts: [],
    };

    (UserService.verifyUserExists as Mock).mockResolvedValue(undefined);
    (UserService.initializeUser as Mock).mockReturnValue(userInfo);
    (TeacherServiceFunctions.generateTeacherCode as Mock).mockResolvedValue(teacherCode);
    (UserDb.createUser as Mock).mockResolvedValue(createdUser);
    const result = await TeacherService.initializeTeacher(auth0_id, ["teacher"]);

    expect(result).toEqual(createdUser);
    expect(UserService.initializeUser).toHaveBeenCalledWith(auth0_id);
    expect(TeacherServiceFunctions.generateTeacherCode).toHaveBeenCalled();
    expect(UserDb.createUser).toHaveBeenCalledWith({
      auth0_id,
      contracts: [],
      teacher_code: teacherCode,
    });
  });
});

describe("validateTeacher", () => {
  const mockTeacher = { _id: new ObjectId("155fe1e279483e33811768fb") };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return the teacher when found", async () => {
    (TeacherDb.getTeacherByCode as Mock).mockResolvedValue(mockTeacher);

    const result = await TeacherService.validateTeacher("XYZ123");

    expect(TeacherDb.getTeacherByCode).toHaveBeenCalledWith("XYZ123");
    expect(result).toEqual(mockTeacher);
    expect(result).toBeTruthy();
    expect(result?._id.toString()).toBe(mockTeacher._id.toString());
  });

  it("should throw EntityNotFoundError if teacher not found", async () => {
    (TeacherDb.getTeacherByCode as Mock).mockResolvedValue(null);

    try {
      await TeacherService.validateTeacher("XYZ123");
      throw new Error("Forced error throw because expected validateTeacher to throw, but it did not.");
    } catch (err) {
      expect(err).toBeInstanceOf(EntityNotFoundError);
      const nfErr = err as EntityNotFoundError;
      expect(nfErr.message).toBe("Teacher code not found");
      expect(nfErr.statusCode).toBe(404);
      expect(nfErr.code).toBe("ERR_NF");
    }

    expect(TeacherDb.getTeacherByCode).toHaveBeenCalledWith("XYZ123");
  });
});
