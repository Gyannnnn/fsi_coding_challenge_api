import { Request, Response } from "express";
import z from "zod";
import { PrismaClient } from "../../../generated/prisma/index.js";
const prisma = new PrismaClient();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signUp = async (request: Request, response: Response) => {
  try {
    const schema = z.object({
      userName: z.string().min(10).max(60),
      userEmail: z.string().email(),
      userPassword: z
        .string()
        .min(8)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
          message:
            "Password must include uppercase, lowercase, number, and special character",
        })
        .max(16),
      userAddress: z.string().max(400),
    });
    const results = schema.safeParse(request.body);
    if (!results.success) {
      response.status(400).json({
        message: results.error,
      });
      return;
    }
    const { userEmail, userPassword, userName, userAddress } = results.data;
    const hashedUserPassword = bcrypt.hashSync(userPassword, 10);
    const existingUser = await prisma.user.findUnique({ where: { userEmail } });
    if (existingUser) {
      response.status(409).json({
        message: "User already exists",
      });
      return;
    }

    const newUser = await prisma.user.create({
      data: {
        userEmail,
        userName,
        userPassword: hashedUserPassword,
        userAddress,
      },
    });
    if (!newUser) {
      response.status(500).json({
        message: "Failed to create user",
      });
    }
    const token = jwt.sign(
      { userEmail, userName, role: newUser.userRole },
      process.env.JWT_SECRET!,
      {
        expiresIn: "30days",
      }
    );

    response.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    response.status(200).json({
      message: "User Created successfully",
      newUser: newUser,
      token: token,
    });
  } catch (error) {
    const err = error as Error;
    response.status(500).json({
      messsage: "Internal Server Error",
      error: err.message,
    });
  }
};

export const signIn = async (request: Request, response: Response) => {
  try {
    // Define and validate schema
    const schema = z.object({
      userEmail: z.string().email(),
      userPassword: z
        .string()
        .min(8)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
          message:
            "Password must include uppercase, lowercase, number, and special character",
        })
        .max(47),
    });

    const result = schema.safeParse(request.body);
    if (!result.success) {
      response.status(400).json({
        message: "Validation failed",
        errors: result.error,
      });
      return;
    }

    const { userEmail, userPassword } = result.data;

    const existingUser = await prisma.user.findUnique({
      where: { userEmail },
    });

    if (!existingUser) {
      response.status(404).json({
        message: "User not found",
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(
      userPassword,
      existingUser.userPassword
    );

    if (!isPasswordValid) {
      response.status(401).json({
        message: "Invalid password",
      });
      return;
    }

    const token = jwt.sign(
      {
        userId: existingUser.id,
        userEmail: existingUser.userEmail,
        role: existingUser.userRole,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "30d" }
    );

    response.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return response.status(200).json({
      message: "Sign in successful",
      token,
      user: {
        id: existingUser.id,
        userEmail: existingUser.userEmail,
        userName: existingUser.userName,
        role: existingUser.userRole,
      },
    });
  } catch (error) {
    const err = error as Error;
    return response.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  const { currentPassword, newPassword, userId } = req.body;
  
  if (
    !currentPassword?.trim() ||
    !newPassword?.trim() ||
    !userId.trim()
  ) {
    res.status(401).json({
      message: "All fields are required",
    });
    return;
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      res.status(401).json({
        message: "No user found",
      });
      return;
    }
    const isMatch =  bcrypt.compareSync(
      currentPassword,
      user.userPassword
    );
    if (!isMatch) {
      res.status(401).json({
        message: "Invalid password",
      });
      return;
    }
    const hashedPassword = bcrypt.hashSync(
      currentPassword,
      10
    );
    const response = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        userPassword: hashedPassword,
      },
    });
    if (!response) {
      res.status(400).json({
        message: "Failed to update password",
      });
    }
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      message: "Internal srever error",
      error: err.message,
    });
  }
};
