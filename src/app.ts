import express, { Request, Response, NextFunction } from 'express';
import fileRoutes from './routes/file.routes';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors({
    origin: "http://localhost:8080",
}));
app.use(express.json());
app.use('/files', fileRoutes);

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Something went wrong',
  });
});

export default app;

