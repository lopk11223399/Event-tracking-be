import auth from "./authRoutes";
import user from "./userRoutes";
import post from "./postRoutes";
import comment from "./commentRoutes";
import notification from "./notificationRoutes";
import { notFound } from "../middlewares/handle_errors";

const initRoutes = (app) => {
  app.use("/api/v1/auth", auth);
  app.use("/api/v1/user", user);
  app.use("/api/v1/post", post);
  app.use("/api/v1/notification", notification);
  app.use("/api/v1/comment", comment);

  app.use(notFound);
};

export default initRoutes;
