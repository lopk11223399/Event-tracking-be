import express from "express";
import * as controllers from "../controllers";
import { isCreator, isAdmin } from "../middlewares/verify_roles";
import verifyToken from "../middlewares/verify_token";
import { uploadEvent, uploadQr } from "../middlewares/uploader";
const router = express.Router();

router.get("/get-event-hot", controllers.filterEventHot);
router.get("/get-all-event", controllers.getAllEvent);
router.get("/get-event-today", controllers.filterEventToday); //gop vs thang getAllEvent
router.get("/detail-event/:id", controllers.getEvent);
router.get("/get-all-follower/:eventId", controllers.getAllFollower);

router.use(verifyToken);

router.post("/scanQr", controllers.scanQr);

router.delete("/delete-event", isAdmin, controllers.deleteEvent);

router.put("/cancel-event/:eventId", isCreator, controllers.cancelEvent);
router.post(
  "/",
  uploadEvent.single("image"),
  isCreator,
  controllers.createEvent
);
router.put("/update-event/:id", isCreator, controllers.updateEvent);

module.exports = router;
