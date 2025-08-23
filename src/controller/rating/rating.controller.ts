import { Request, Response } from "express";
import z from "zod";
import { PrismaClient } from "../../../generated/prisma/index.js";
const prisma = new PrismaClient();

export const createRating = async (req: Request, res: Response) => {
  const schema = z.object({
    rating: z.number().max(5),
    storeId: z.string(),
    userId: z.string(),
  });

  const results = schema.safeParse(req.body);
  if (!results.success) {
    res.status(400).json({
      message: "Zod error",
      error: results.error,
    });
    return;
  }

  const { rating, storeId, userId } = results.data;

  try {
    // Create rating
    await prisma.rating.create({
      data: {
        rating,
        storeId,
        userId,
      },
    });

    // Fetch store
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    // Calculate new average
    const oldRatingCount = store.ratingCount;
    const oldAverage = store.averageRating;
    const newRatingCount = oldRatingCount + 1;
    const newAverage = (oldAverage * oldRatingCount + rating) / newRatingCount;

    // Update store
    await prisma.store.update({
      where: { id: storeId },
      data: {
        ratingCount: newRatingCount,
        averageRating: newAverage,
      },
    });

    res.status(200).json({ message: "Rating created successfully" });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      message: "Failed to create rating",
      err,
    });
  }
};

export const getAllRatings = async (req: Request, res: Response)=>{
    try {
        const ratings = await prisma.rating.findMany();
        if(!ratings || ratings.length === 0){
            res.status(404).json({
                message: "No Ratings found"
            })
        }
        res.status(200).json({
            messaeg: "Ratings fetched succesfully",
            ratings:ratings
        })
    } catch (error) {
        const err = error as Error
        res.status(500).json({
            message: "Internal server  error",
            error: err.message
        })
    }
}
