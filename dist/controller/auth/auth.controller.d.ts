import { Request, Response } from "express";
export declare const signUp: (request: Request, response: Response) => Promise<void>;
export declare const signIn: (request: Request, response: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updatePassword: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=auth.controller.d.ts.map