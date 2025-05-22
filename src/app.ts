
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import * as dotenv from 'dotenv';

// Import routes
import apiRoutes from './routes';

dotenv.config();

const app: Express = express();

// Get client URL from environment variables or use default
const clientUrl = process.env.CLIENT_URL || 'http://192.168.100.3:8080';

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Middleware
app.use(helmet({ contentSecurityPolicy: false })); // Security headers
app.use(morgan('dev')); // Logging
// Parse JSON request bodies// Parse URL-encoded request bodies

// Configure CORS
app.use(cors({
    origin: clientUrl,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// API routes
app.use('/api', apiRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Server error'
    });
});

// Catch-all route handler
app.use('*', (req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

export default app;
