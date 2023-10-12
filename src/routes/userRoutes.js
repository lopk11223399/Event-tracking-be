import express from "express";
import * as controllers from "../controllers";
import { isAdmin } from "../middlewares/verify_roles";
import verifyToken from "../middlewares/verify_token";
import { uploadUser } from "../middlewares/uploader";
const router = express.Router();

router.use(verifyToken);

router.get("/get-current-user", controllers.getUser); // xóa eventDataJoined
router.put("/update-user", uploadUser.single("avatar"), controllers.updateUser);
router.post("/change-password", controllers.changePassword);

router.use(isAdmin);
router.put(
  "/update-admin/:id",
  uploadUser.single("avatar"),
  controllers.updateInfoAdmin
);
router.delete("/:id", controllers.deleteUserByAdmin);
router.get("/", controllers.getAllUsers);
router.post("/create-user", controllers.createUserByAdmin);

module.exports = router;
