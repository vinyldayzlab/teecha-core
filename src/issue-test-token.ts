import jwt from "jsonwebtoken";
import config from "./config";

export const runIssueTestToken = () => {
  console.log("Running issuer");

  const payload = {
    sub: "c1f7f20b-7dc9-47b2-bd9a-bbffbfeee8d1",
  };

  const token = jwt.sign(payload, config.appSecret, {
    expiresIn: "1h",
    issuer: "teecha-app",
  });

  console.log(token);
};
