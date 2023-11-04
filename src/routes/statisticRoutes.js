import express from "express";
import * as controllers from "../controllers";
import verifyToken from "../middlewares/verify_token";
import { isAdmin, isCreator } from "../middlewares/verify_roles";

const router = express.Router();

router.use(verifyToken);
router.get("/", isAdmin, controllers.eventByMonth);
router.get("/by-faculty/:eventId", isAdmin, controllers.byFaculty);
router.get("/by-gender/:eventId", isCreator, controllers.byGenderOfEvent);
router.get("/by-age/:eventId", isCreator, controllers.byAgeOfEvent);

module.exports = router;
