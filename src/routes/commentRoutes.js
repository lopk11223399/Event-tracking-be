import express from "express";
import * as controllers from "../controllers";
import verifyToken from "../middlewares/verify_token";
import { isCreator } from "../middlewares/verify_roles";
const router = express.Router();

router.use(verifyToken);

router.post("/post-comment", controllers.postComment);
router.put("/update-comment", controllers.updateComment);
router.delete("/delete-comment", controllers.deleteComment);

router.post(
  "/response-comment/:commentId",
  isCreator,
  controllers.responseComment
);

module.exports = router;
