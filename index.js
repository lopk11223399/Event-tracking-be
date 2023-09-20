const express = require("express");
require("dotenv").config();
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import initRoutes from "./src/routes";
require("./connect_DB");

const app = express();
const port = process.env.PORT || 3000;

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, please try again in an hour!",
});

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use("/api", limiter);
app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

initRoutes(app);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
