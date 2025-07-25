// import { beforeAll, afterEach, afterAll } from "vitest";
// import supertest, { SuperTest, Test } from "supertest";
// import { Server } from "http";

// import * as db from "./database";
// import configureApp from "../src/configureApp";

// const app = configureApp();

// let server: Server;
// let request: SuperTest<Test>;

// beforeAll(async () => {
//   await db.connect();
//   server = app.listen(0);
//   request = supertest(app);
// });

// afterEach(async () => {
//   t;
//   await db.clearDatabase();
// });

// afterAll(async () => {
//   await db.closeDatabase();
//   server.close();
// });

// export { request };
