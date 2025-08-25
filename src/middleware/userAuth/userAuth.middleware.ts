import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const userAuthValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      message: "Unauthorised access",
    });
    return;
  }
  const token = authHeader.split(" ")[1] as string;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const role = decoded.role as string;

    if (role === "user" || role === "storeOwner" || role === "systemAdmin") {
        req.user = decoded
      next();
    } else {
      res.status(403).json({
        message: "Access denied",
      });
    }
  } catch (error) {
    res.status(403).json({
      message: "Invalid or expired token",
    });
  }
};
