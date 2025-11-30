const connectDB = require("./db");

connectDB()
  .then(() => {
    console.log("DB test OK");
    process.exit(0);
  })
  .catch(err => {
    console.error("DB test failed:", err.message);
    process.exit(1);
  });