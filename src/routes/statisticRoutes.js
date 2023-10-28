import express from "express";
import * as controllers from "../controllers";
import verifyToken from "../middlewares/verify_token";
import { isAdmin, isCreator } from "../middlewares/verify_roles";

const router = express.Router();

router.use(verifyToken);
router.get("/", isAdmin, controllers.eventByMonth);
router.get("/:eventId", isCreator, controllers.byGenderOfEvent);

module.exports = router;
