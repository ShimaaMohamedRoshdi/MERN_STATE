import { handleErrors } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  // get token:
  const token = req.cookies.access_token;
  if (!token) {
    return next(handleErrors(401, "UnAuthorized"));
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return next(handleErrors(403, "Forbidden"));
    }
    req.user = user;
    next();
  });
};
