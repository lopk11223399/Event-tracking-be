import express from "express";
import * as controllers from "../controllers";
import verifyToken from "../middlewares/verify_token";
const router = express.Router();

router.post("/");

module.exports = router;
