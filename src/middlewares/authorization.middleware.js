export const isAuthorized = (role) => {
  return async (req, res, next) => {
    if (role != req.user.role)
      return next(new Error("Not Authorized!", { cause: 403 }));
    return next();
  };
};
