import mongoose from "mongoose";
import { databaseName } from "../constants.js";
const connectDb = async () => {
  try {
    const data = await mongoose.connect(`${process.env.TZ}/${databaseName}`);
    const connectedData = data.connection.host;
    console.log(connectedData);
    return connectedData;
  } catch (error) {
    process.exit(1);
  }
};

export default connectDb;
