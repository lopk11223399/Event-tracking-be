const express = require("express");
require("dotenv").config();
import initRoutes from "./src/routes";
require("./connect_DB");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

initRoutes(app);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
