import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

// Extend Express Request type
declare module "express-serve-static-core" {
  interface Request {
    user?: string | JwtPayload; // or the exact type of decoded token
  }
}
