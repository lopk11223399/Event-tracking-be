import express from "express";
import * as controllers from "../controllers";
import {
  isCreator,
  isAdmin,
  isModeratorOrAdmin,
} from "../middlewares/verify_roles";
import verifyToken from "../middlewares/verify_token";
import { uploadEvent } from "../middlewares/uploader";
const router = express.Router();

// router.get("/test", controllers.test);
router.get("/get-all-event", controllers.getAllEvent);
router.get("/detail-event/:id", controllers.getEvent);

router.use(verifyToken);
router.put("/scanQr", controllers.scanQR);
router.get("/get-event-joined", controllers.getEventJoined);

router.put("/cancel-event/:eventId", isCreator, controllers.cancelEvent);
router.get("/get-event-author", isCreator, controllers.getAllEventOfAuthor);
router.post(
  "/",
  uploadEvent.single("image"),
  isCreator,
  controllers.createEvent
);
router.put(
  "/update-event/:id",
  uploadEvent.single("image"),
  isCreator,
  controllers.updateEvent
);

router.delete(
  "/delete-event",
  isModeratorOrAdmin,
  controllers.deleteEventByAdminAndCreator
);

module.exports = router;
