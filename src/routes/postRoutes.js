import express from "express";
import * as controllers from "../controllers";
import { isCreator } from "../middlewares/verify_roles";
import verifyToken from "../middlewares/verify_token";
import uploadCloud from "../middlewares/uploader";
const router = express.Router();

router.get("/get-event-hot", controllers.filterEventHot);
router.get("/get-all-event", controllers.getAllEvent);
router.get("/get-event-today", controllers.filterEventToday);
router.post("/detail-event/:id", controllers.detailEvent);

router.use(verifyToken);
router.use(isCreator);
router.post("/", controllers.createEvent);
router.get("/get-event", controllers.getEvent);
router.put("/update-event/:id", controllers.updateEvent);

module.exports = router;
