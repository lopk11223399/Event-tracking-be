import express from "express";
import * as controllers from "../controllers";

const router = express.Router();

router.get("/", controllers.insertDataUser);
router.get("/event", controllers.insertDataEvent);

module.exports = router;
