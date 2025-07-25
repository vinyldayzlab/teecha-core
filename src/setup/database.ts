import mongoose from "mongoose";
import config from "@/config";
import DatabaseConnectionError from "@/errors/DatabaseConnectionError";

export const connectToDatabase = async () => {
  try {
    mongoose.Promise = Promise;
    await mongoose.connect(config.mongoURL);
    console.log("MongoDB connected");
  } catch (error) {
    throw new DatabaseConnectionError({
      message: `Couldn't connect to MongoDB: ${error}`,
      statusCode: 500,
      code: "ERR_DB",
    });
  }
};

export const disconnectDatabase = async () => {
  await mongoose.disconnect();
  console.log("MongoDB disconnected");
};
