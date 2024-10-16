import { Router } from "express";
import { getUserForSidebar } from "../controller/user.controllor.js";
import { isAuthenticate } from "../middleware/verifyToken.js";

export const  userRoute = Router()
userRoute.get('/',isAuthenticate, getUserForSidebar)