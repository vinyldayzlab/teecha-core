import { createServer } from "./server";
import config from "./config";

const server = createServer();

server.listen(config.port, () => {
  console.log(`Server running on ${config.port}`);
});
