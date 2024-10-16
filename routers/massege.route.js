import { Router } from "express";
import { getmessage, sendmessage } from "../controller/message.controllor.js";
import { isAuthenticate } from "../middleware/verifyToken.js";


export const messageRoute = Router();

    messageRoute.post("/send/:id",isAuthenticate, sendmessage);
    messageRoute.get("/:id",isAuthenticate, getmessage);



    // 66bd0128fe81b9316a1d09f6 reciver