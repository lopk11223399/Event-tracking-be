import express from "express";
import * as controllers from "../controllers";
import { isAdmin } from "../middlewares/verify_roles";
import verifyToken from "../middlewares/verify_token";

const router = express.Router();

router.use(verifyToken);

router.get("/:id", controllers.getUser);

router.use(isAdmin);
router.get("/", controllers.getAllUsers);
router.post("/create-user", controllers.createUserByAdmin);

module.exports = router;
