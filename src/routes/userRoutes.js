import express from "express";
import * as controllers from "../controllers";
import {
  isAdmin,
  isCreator,
  isModeratorOrAdmin,
} from "../middlewares/verify_roles";
import verifyToken from "../middlewares/verify_token";
import { uploadUser } from "../middlewares/uploader";
const router = express.Router();

router.use(verifyToken);
router.get("/get-event-joined", controllers.getAllEventByUserId);
router.get("/get-current-user", controllers.getUser);
router.put("/update-user", uploadUser.single("avatar"), controllers.updateUser);
router.post("/change-password", controllers.changePassword);

router.delete(
  "/delete-user",
  isModeratorOrAdmin,
  controllers.deleteUserByAdminAndCreator
);

router.use(isAdmin);
router.put(
  "/update-admin/:id",
  uploadUser.single("avatar"),
  controllers.updateInfoAdmin
);
router.get("/", controllers.getAllUsers);
router.post("/create-user", controllers.createUserByAdmin);
router.put("/update-role", controllers.updateRole);

module.exports = router;
