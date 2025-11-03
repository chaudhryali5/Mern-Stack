import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser';

import { connectdb } from './config/db.js'
import productRoutes from './routes/productroutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000
const PREFIX = '/api/v1';

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true }));
app.use(cookieParser());

app.use(PREFIX, productRoutes);
app.use(PREFIX, userRoutes);

app.get('/', (req, res) => {
    res.send("hello from server")
})

connectdb();

app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
})