import { createServer } from "./server";
import { disconnectDatabase } from "./db";
import config from "./config";

const start = async () => {
  const app = await createServer();

  const server = app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });

  const shutdown = async () => {
    console.log("Shutting down...");
    await disconnectDatabase();
    server.close(() => {
      console.log("HTTP server closed");
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
