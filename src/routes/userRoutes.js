import express from "express";
import * as controllers from "../controllers";
import { isAdmin } from "../middlewares/verify_roles";
import verifyToken from "../middlewares/verify_token";
import uploadCloud from "../middlewares/uploader";
const router = express.Router();

router.use(verifyToken);

router.get("/:id", controllers.getUser);
router.put("/:id", uploadCloud.single("avatar"), controllers.updateUser);
router.delete("/:id", controllers.deleteUser);

router.use(isAdmin);
router.put(
  "/update-admin/:id",
  uploadCloud.single("avatar"),
  controllers.updateInfoAdmin
);
router.get("/", controllers.getAllUsers);
router.post("/create-user", controllers.createUserByAdmin);

module.exports = router;
