import "reflect-metadata";
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './db';
import { examRoutes } from './routes/exam.routes';
import { userRoutes } from './routes/user.routes';
import { statsRoutes } from './routes/stats.routes';
import { practiceRoutes } from './routes/practice.routes';
import { questionsRoutes } from './routes/questions.routes';
import {telegramBotRoutes} from "./routes/telegram.bot";
import {departmentRoutes} from "./routes/department.routes"

// Load environment variables
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;


// Middleware
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Test endpoint
app.get('/api/ping', (req, res) => {
    res.json({ message: 'pong' });
});

// Routes
app.use('/api/exam', examRoutes);
app.use('/api/user', userRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/telegram', telegramBotRoutes);
app.use('/api/departments', departmentRoutes);

// ✅ Initialize DB and start server
AppDataSource.initialize()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
        });
    })
    .catch((error) => {
        console.error('Database connection error:', error);
        process.exit(1);
    });
