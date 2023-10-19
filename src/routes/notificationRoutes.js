import express from "express";
import * as controllers from "../controllers";
import verifyToken from "../middlewares/verify_token";

const router = express.Router();

router.use(verifyToken);
router.get("/", controllers.getNotifications);
router.put("/:eventId", controllers.updateNotification);

module.exports = router;
