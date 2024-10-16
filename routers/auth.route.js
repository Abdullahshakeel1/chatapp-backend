import { Router } from "express";
import { allUSers, log_in, logout, sign_up } from "../controller/auth.controllor.js";


export const authRoute = Router();

authRoute.post("/signup",sign_up);
authRoute.post("/login",log_in);
authRoute.get("/logout",logout);
authRoute.get("/",allUSers);


