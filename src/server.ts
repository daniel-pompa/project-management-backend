import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB, corsConfig } from './config';
import projectRoutes from './routes/project-routes';

dotenv.config();

connectDB();

const app = express();

// Middlewares
app.use(cors(corsConfig));
app.use(express.json());

// Routes
app.use('/api/projects', projectRoutes);

export default app;
