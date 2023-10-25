import express from "express";
import * as controllers from "../controllers";
import { isCreator, isAdmin } from "../middlewares/verify_roles";
import verifyToken from "../middlewares/verify_token";
import { uploadEvent } from "../middlewares/uploader";
const router = express.Router();

// router.get("/test", controllers.test);
router.get("/get-all-event", controllers.getAllEvent);
router.get("/detail-event/:id", controllers.getEvent);

router.use(verifyToken);

router.delete("/delete-event", isAdmin, controllers.deleteEvent);

router.put("/cancel-event/:eventId", isCreator, controllers.cancelEvent);
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

module.exports = router;
