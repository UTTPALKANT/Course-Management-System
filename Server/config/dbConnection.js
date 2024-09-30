import mongoose from "mongoose";
mongoose.set("strictQuery", false);

const MONGODB_URL =
  process.env.MONGO_URI || "mongodb://localhost:27017/my_databse";

const connectionToDb = async () => {
  try {
    const { connection } = await mongoose.connect(MONGODB_URL);
    if (connection) {
      console.log(`Connected To DB : ${connection.host}`);
    }
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
};

export default connectionToDb;
