const express = require("express");
const config = require("config");
const { default: mongoose } = require("mongoose");
const cookieParser = require("cookie-parser");
const routes = require("./routes");

const app = express();
const PORT = config.get("port") || 4411;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(cookieParser());

app.use("/api", routes);

app.listen(PORT, async () => {
  await mongoose.connect(config.get("mongodburi")).then(() => {
    console.log("Connected to MongoDB");
  });
  console.log(`Server http://${config.get("ip_address")}:${PORT}`);
});
