import z from "zod";
import { PrismaClient } from "../../../generated/prisma/index.js";
const prisma = new PrismaClient();
export const cerateStore = async (req, res) => {
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
            where: {
                storeName
            }
        });
        if (isStoreExist) {
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
    }
    catch (error) {
        const err = error;
        res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    }
};
export const getAllStores = async (req, res) => {
    try {
        const stores = await prisma.store.findMany();
        if (!stores || stores.length === 0) {
            res.status(401).json({
                message: "No stores found"
            });
        }
        res.status(200).json({
            message: "Stores fetched successfully",
            stores: stores
        });
    }
    catch (error) {
        const err = error;
        res.status(500).json({
            message: "Internal server",
            error: err.message
        });
    }
};
//# sourceMappingURL=store.controller.js.map