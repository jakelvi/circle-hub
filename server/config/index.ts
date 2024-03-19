import { config } from "dotenv";

const configDotEnv = () => {
  config({ path: "server/config/.env" });

  const mode = process.env.NODE_ENV;
  console.log("App is running in", mode, "Mode");
  console.log("Config file:", `server/config/${mode}.env`);

  config({ path: `server/config/${mode}.env` });
};

const api = process.env.MAILGUN_API_KEY;
const domain = process.env.MAILGUN_DOMAIN;

export default configDotEnv;
export { configDotEnv, api, domain };
