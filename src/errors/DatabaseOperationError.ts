import CustomError from "./CustomError";

class DatabaseOperationError extends CustomError<ErrorCode> {}
export default DatabaseOperationError;
