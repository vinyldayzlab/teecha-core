import config from "./config.ts";
import { createServer } from "./server.ts";

const server = createServer();

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
