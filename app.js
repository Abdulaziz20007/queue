const express = require("express");
const config = require("config");
const { default: mongoose } = require("mongoose");
const cookieParser = require("cookie-parser");
const routes = require("./routes");

const app = express();
const PORT = config.get("port") || 3030;

app.use(express.json());
app.use(cookieParser());

app.use("/api", routes);

app.listen(PORT, async () => {
  await mongoose.connect(config.get("mongodburi")).then(() => {
    console.log("Connected to MongoDB");
  });
  console.log(`Server http://${config.get("ip_address")}:${PORT}`);
});
