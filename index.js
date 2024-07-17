import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
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
    origin: 'https://food-app-frontend-9vra.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 

    // origin: 'http://localhost:5173',
    // credentials: true,
    // methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
}));


app.use('/api/users', userRoutes);
// const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, 'public')));

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });



app.use('/', async (req, res) => {
    res.send("Welcome");
});

app.listen(port, () => console.log(`Server listening on ${port}`));