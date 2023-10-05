import express from "express";
import * as controllers from "../controllers";
import verifyToken from "../middlewares/verify_token";

const router = express.Router();

router.use(verifyToken);
router.post("/:eventId", controllers.joinEvent);
router.put("/update-room/:eventId", controllers.updateRoom);

module.exports = router;
