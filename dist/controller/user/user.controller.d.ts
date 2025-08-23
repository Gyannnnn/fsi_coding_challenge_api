import { Request, Response } from "express";
export declare const Hello: (req: Request, res: Response) => void;
export declare const addNewUser: (req: Request, res: Response) => Promise<void>;
export declare const getUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUserDetails: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=user.controller.d.ts.map