import { Request, Response } from "express";
import z from "zod";
import { PrismaClient, role } from "../../../generated/prisma/index.js";
const prisma = new PrismaClient();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const Hello = (req: Request, res: Response) => {
  const user = req.user;
  res.status(200).json({
    message: "Working fine :>",
    user,
  });
};

const roleEnum = z.enum(["systemAdmin", "user", "storeOwner"]);

export const addNewUser = async (req: Request, res: Response) => {
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
      role: roleEnum,
    });
    const results = schema.safeParse(req.body);
    if (!results.success) {
      res.status(400).json({
        message: results.error,
      });
      return;
    }
    const { userEmail, userPassword, userName, userAddress, role } =
      results.data;
    const hashedUserPassword = bcrypt.hashSync(userPassword, 10);
    const existingUser = await prisma.user.findUnique({ where: { userEmail } });
    if (existingUser) {
      res.status(409).json({
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
        userRole: role,
      },
    });
    if (!newUser) {
      res.status(500).json({
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

    res.status(200).json({
      message: "User Created successfully",
      newUser: newUser,
      token: token,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      messsage: "Internal Server Error",
      error: err.message,
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { userrole } = req.params;
  if (!userrole?.trim()) {
    res.status(400).json({
      message: "All fields are required",
    });
    return;
  }
  if (!(userrole in role)) {
    return res.status(400).json({ message: "Invalid role" });
  }
  try {
    const users = await prisma.user.findMany({
      where: {
        userRole: userrole as role,
      },
    });
    if (!users || users.length === 0) {
      res.status(401).json({
        message: "No Users found",
      });
      return;
    }
    res.status(200).json({
      message: `${userrole}s fetched successfully`,
      users,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const getUserDetails = async (req: Request, res: Response) => {
  const { userid } = req.params;
  if (!userid?.trim()) {
    res.status(400).json({
      message: "All fields are requiered",
    });
    return;
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userid,
      },
    });
    if (!user) {
      res.status(400).json({
        message: "No users found !",
      });
      return;
    }
    res.status(200).json({
      message: "User details fetched successfully",
      user,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const getTotalUsers = async (req: Request, res: Response) => {
  try {
    const totalusers = await prisma.user.count();
    if (!totalusers) {
      res.status(404).json({
        message: "Failed to cound total users",
      });
    }
    res.status(200).json({
      message: "Succeefully count the users",
      count: totalusers,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      message: "Internal Server error",
    });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await prisma.user.findMany();
    if (!allUsers || allUsers.length === 0) {
      res.status(404).json({
        message: "No Users Found",
      });
      return;
    }
    res.status(200).json({
      message: "Users fetched successfully",
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};
