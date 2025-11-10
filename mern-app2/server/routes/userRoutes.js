import express from 'express';
import {Logout, registerUser, verifyEmail, verifyOtp} from '../controllers/userController.js'
import { loginUser } from '../controllers/userController.js';
import { userAuth } from '../middleware/userAuth.js';
const userRoutes = express.Router()
userRoutes.post('/register',registerUser )
userRoutes.post('/login',loginUser)
userRoutes.post('/logout',Logout)
userRoutes.post('/send-verify-otp',verifyOtp);
userRoutes.post('/verify-account',userAuth,verifyEmail);

export default userRoutes;