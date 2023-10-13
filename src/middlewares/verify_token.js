import jwt, { TokenExpiredError } from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token)
    return res.status(200).json({ success: false, mess: "Require login" });
  const accessToken = token.split(" ")[1];
  jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      const isChecked = err instanceof TokenExpiredError;
      if (!isChecked)
        return res
          .status(200)
          .json({ success: false, mess: "Access Token invalid" });
      if (isChecked)
        return res
          .status(200)
          .json({ success: false, mess: "Access Token expired" });
    }
    req.user = user;
    next();
  });
};

export default verifyToken;
