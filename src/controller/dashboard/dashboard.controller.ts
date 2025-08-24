import { Request, Response } from "express";
import z from "zod";
import { PrismaClient } from "../../../generated/prisma/index.js";
const prisma = new PrismaClient();

export const analyticsCount = async (req: Request, res: Response) => {
  try {
    const [usersCount, storeCount, ratingsCount] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count(),
    ]);

    res.status(200).json({
      message: "Analytics fetched successfully",
      usersCount,
      storeCount,
      ratingsCount,
    });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};


export const details = async(req: Request, res: Response)=>{
    try {
        const [users,stores] = await Promise.all([
            prisma.user.findMany({
                select:{
                    id:true,
                    userName:true,
                    userEmail:true,
                    userAddress:true,
                    userRole:true
                }
            }),
            prisma.store.findMany({
                select:{
                    id:true,
                    storeName:true,
                    storeAddress:true,
                    averageRating:true,
                    storeOwner:true
                }
            })            
        ])

        res.status(200).json({
            message: "Data fetched successfully",
            userData:users,
            storeData:stores
        })
        
    } catch  {
        res.status(500).json({
            message: "Internal server error"
        })
    }
}
