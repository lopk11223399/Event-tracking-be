import express from "express";
import * as controllers from "../controllers";
import verifyToken from "../middlewares/verify_token";
import { isAdmin } from "../middlewares/verify_roles";
const router = express.Router();

router.use(verifyToken);
router.use(isAdmin);
router.post("/create-faculty", controllers.createFaculty);
router.put("/update-faculty/:id", controllers.updateFaculty);
router.delete("/delete-faculty/:id", controllers.deleteFaculty);
router.get("/", controllers.getAllFaculty);

module.exports = router;
