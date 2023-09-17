import express from "express";
import * as controllers from "../controllers";

const router = express.Router();

router.post("/login", controllers.login);
router.post("/refresh-token", controllers.refreshTokenController);

module.exports = router;
