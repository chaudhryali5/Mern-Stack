import express from 'express';
import {Logout, registerUser} from '../controllers/userController.js'
import { loginUser } from '../controllers/userController.js';
const userRoutes = express.Router()
userRoutes.post('/register',registerUser )
userRoutes.post('/login',loginUser)
userRoutes.post('/logout',Logout)

export default userRoutes;