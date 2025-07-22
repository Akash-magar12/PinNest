import mongoose from "mongoose";
const dbConnect = async () => {
  try {
    const connection = await mongoose.connect(process.env.DB_URL, {
      dbName: "SnapNest",
    });
    console.log(`db connected ${connection.connection.host}`);
  } catch (error) {
    console.log(error.message);
  }
};

export default dbConnect;
