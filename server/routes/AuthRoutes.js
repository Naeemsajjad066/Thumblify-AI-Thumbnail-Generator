import express from "express";
import { loginUser, LogoutUser, registerUser, VerifyUser } from "../controllers/AuthControllers.js";
import protect from "../middlewares/Auth.js";

const AuthRouter=express.Router();

AuthRouter.post('/register',registerUser);
AuthRouter.post('/login',loginUser);
AuthRouter.get('/verify',protect,VerifyUser)
AuthRouter.post('/logout',protect,LogoutUser)

export default AuthRouter