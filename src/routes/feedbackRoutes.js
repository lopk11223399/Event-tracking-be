import express from "express";
import * as controllers from "../controllers";
import verifyToken from "../middlewares/verify_token";
const router = express.Router();

router.use(verifyToken);
router.post("/:eventId", controllers.createFeedback);
router.put("/:eventId", controllers.updateFeedback);

module.exports = router;
