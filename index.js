import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import userRoutes from './routes/userRoutes.js';
import connectDB from './config/db.js';
import cors from 'cors';


dotenv.config();
const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
    origin: ['https://food-app-frontend-9vra.vercel.app'],
    credentials : true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],

  }));

app.use(cors());
app.options("*", cors());

app.use('/api/users', userRoutes);
app.use('/', async (req, res) =>{
    res.send("welcome");
});


app.listen(port, () => console.log(`Server listening on ${port}`));