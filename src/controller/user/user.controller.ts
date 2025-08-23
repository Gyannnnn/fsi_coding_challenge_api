import { Request,Response } from "express";



export const Hello = (req:Request,res:Response)=>{
    const user = req.user
    res.status(200).json({
        message: "Working fine :>",
        user
    });
    
}