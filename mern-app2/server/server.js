import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import { connectdb } from './config/db.js'
import productRoutes from './routes/productroutes.js';
import userRoutes from './routes/userRoutes.js';


const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000
const PREFIX = '/api/v1';

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors({credentials:true}));
app.use(PREFIX, productRoutes);
app.use(PREFIX, userRoutes);


app.get('/', (req, res) => {
    res.send("hello from server")
})


app.listen(PORT, () => {
    connectdb();
    console.log(`server is running at http://localhost:${PORT}`);

})