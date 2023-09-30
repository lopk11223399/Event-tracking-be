import express from "express";
import * as controllers from "../controllers";
import { isCreator } from "../middlewares/verify_roles";
import verifyToken from "../middlewares/verify_token";
import uploadCloud from "../middlewares/uploader";
const router = express.Router();

router.get("/get-event-hot", controllers.filterEventHot);
router.get("/get-all-event", controllers.getAllEvent);
router.get("/get-event-today", controllers.filterEventToday);
router.get("/detail-event/:id", controllers.getEvent);
router.get("/get-all-follower/:eventId", controllers.getAllFollower);

router.use(verifyToken);

router.post("/follow/:eventId", controllers.followEvent);
router.use(isCreator);
router.post("/", controllers.createEvent);
router.put("/update-event/:id", controllers.updateEvent);

module.exports = router;
