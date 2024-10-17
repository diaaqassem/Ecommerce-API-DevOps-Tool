const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: ".env" });
const connectDB = () => {
  mongoose.set("strictQuery", false);
  mongoose.connect(process.env.DB_URI).then((con) => {
    console.log(`Database Connected Successfully : ${con.connection.host}`);
  });
  // .catch((err) => {
  //   console.error(`Database Error : ${err}`);ٌ
  //   //stop console
  //   process.exit(1);
  // });
};

module.exports = { connectDB };
