import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';  // To parse cookies
import {errorHandler} from "./middlewares/error.middleware.js";
import userRoutes from './routes/user.route.js';
import adminRoute from './routes/admin.route.js';
import { configDotenv } from 'dotenv';
configDotenv();
const app = express();
const PORT = 8080;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Multiple frontend URLs
    credentials: true,
    
                                          // Allow cookies to be sent
}));

app.use(express.json());
app.use(cookieParser());  // Enable reading cookies

// Routes
app.use('/users', userRoutes);
app.use('/admin', adminRoute);
app.use(errorHandler);
// Start server
app.get('/', (req, res) => {
    res.send('Hello');
  });
  
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
