// import express, { Request, Response, NextFunction } from 'express';
// import fileRoutes from './routes/file.routes';
// import dotenv from 'dotenv';
// import cors from 'cors';

// dotenv.config();

// const app = express();
// // app.use(cors({
// //     origin: "http://localhost:8081",
// // }));
// app.use(express.json());
// app.use('/files', fileRoutes);

// // Global error handler
// app.use((err: any, req: Request, res: Response, next: NextFunction) => {
//   console.error(err.stack);
//   res.status(err.statusCode || 500).json({
//     message: err.message || 'Something went wrong',
//   });
// });

// export default app;

import express, { Request, Response, NextFunction } from 'express';
import fileRoutes from './routes/file.routes';
import dotenv from 'dotenv';
import cors from 'cors';
import { initDb } from './db'; // if using initDb()


dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:8081" }));
app.use(express.json());
app.use('/files', fileRoutes);

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Something went wrong',
  });
});

const PORT = process.env.PORT || 3000;

// If using initDb():
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => console.error('Failed to connect to DB:', err));

export default app;
