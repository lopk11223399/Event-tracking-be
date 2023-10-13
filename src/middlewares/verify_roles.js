import { notAuth } from "./handle_errors";

export const isAdmin = (req, res, next) => {
  const { roleId } = req.user;
  if (roleId !== 1)
    return res.status(200).json({ err: false, mess: "Require role Admin" });
  next();
};

export const isCreator = (req, res, next) => {
  const { roleId } = req.user;
  if (roleId !== 2)
    return res.status(200).json({ err: false, mess: "Require role Creator" });
  next();
};

export const isModeratorOrAdmin = (req, res, next) => {
  const { roleId } = req.user;
  if (roleId !== 1 && roleId !== 2)
    return res
      .status(200)
      .json({ err: false, mess: "Require role Admin or Creator" });
  next();
};
