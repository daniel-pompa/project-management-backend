import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB, corsConfig } from './config';
import authRoutes from './routes/auth-routes';
import projectRoutes from './routes/project-routes';

dotenv.config();

connectDB();

const app = express();

// Middlewares
app.use(cors(corsConfig)); // To allow cross-origin requests
app.use(morgan('dev')); // To log HTTP requests
app.use(express.json()); // To parse JSON bodies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

export default app;
