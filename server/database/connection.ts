import mongoose from "mongoose";

import { Logger } from "../logs/logger";

const connect = async () => {
  try {
    const connectionString = process.env.DB_CONNECTION_STRING;

    if (!connectionString) {
      console.error("DB_CONNECTION_STRING IS NOT DEFINED");
      return;
    }

    await mongoose.connect(connectionString);

    Logger.success("Data-base Connected");
  } catch (err) {
    Logger.error("Can't Connect to data-base", err);
  }
};

export { connect };
