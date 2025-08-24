import { Request, Response } from "express";
import z from "zod";
import { PrismaClient } from "../../../generated/prisma/index.js";
const prisma = new PrismaClient();

export const cerateStore = async (req: Request, res: Response) => {
  const schema = z.object({
    storeName: z.string().min(20).max(60),
    storeAddress: z.string().min(5).max(400),
    storeOwnerId: z.cuid(),
  });

  const results = schema.safeParse(req.body);
  if (!results.success) {
    res.status(400).json({
      message: "Zod error",
      error: results.error,
    });
    return;
  }
  const { storeName, storeAddress, storeOwnerId } = results.data;

  try {
    const isStoreExist = await prisma.store.findFirst({
        where:{
            storeName
        }
    })
    if(isStoreExist){
        res.status(409).json({
            message: `${storeName} already exists`
        });
        return;
    }
    const response = await prisma.store.create({
      data: {
        storeName,
        storeAddress,
        storeOwnerId,
      },
    });
    if (!response) {
      res.status(500).json({
        message: "Failed to create store",
      });
      return;
    }
    res.status(200).json({
      message: `${storeName} store created successfully`,
      response
    });
  } catch (error) {
    const err = error as Error;
     res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};




export const getAllStores = async(req:Request, res:Response)=>{
    try {
        const stores = await prisma.store.findMany();
        if(!stores || stores.length === 0){
            res.status(401).json({
                message: "No stores found"
            });
        }
        res.status(200).json({
            message: "Stores fetched successfully",
            stores: stores
        })
    } catch (error) {
        const err = error as Error
        res.status(500).json({
            message: "Internal server",
            error: err.message
        })
    }
}



export const getStoreDetails  = async(req: Request, res: Response)=>{
    const {storeid} = req.params
    if(!storeid?.trim()){
        res.status(400).json({
            message: "All fields are required"
        });
        return
    }


    try {
        const store = await prisma.store.findFirst({
            where:{
                id:storeid
            }
        })
        if(!store){
            res.status(404).json({
                message: "No store found"
            });
            return
        }
        res.status(200).json({
            message: `${store.storeName} details fetched successfully`
        })
    } catch (error) {
        const err = error as Error
        res.status(500).json({
            message: "Internal servere error"
        })
    }

}


export const getTotalStore = async (req: Request, res: Response) => {
  try {
    const totalusers = await prisma.store.count();
    if (!totalusers) {
      res.status(404).json({
        message: "Failed to cound total stores",
      });
    }
    res.status(200).json({
      message: "Succeefully count the stores",
      count: totalusers,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      message: "Internal Server error",
    });
  }
};

