import { notAuth } from "./handle_errors";

export const isAdmin = (req, res, next) => {
  const { roleId } = req.user;
  if (roleId !== 1) return notAuth("Require role Admin", res);
  next();
};

export const isCreator = (req, res, next) => {
  const { roleId } = req.user;
  if (roleId !== 2) return notAuth("Require role Creator", res);
  next();
};

export const isModeratorOrAdmin = (req, res, next) => {
  const { roleId } = req.user;
  if (roleId !== 1 && roleId !== 2)
    return notAuth("Require role Admin or Creator ", res);
  next();
};
