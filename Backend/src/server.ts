import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import transferRoutes from './routes/transferRoutes';
import customerRoutes from './routes/customerRoutes';

const app: Application = express();

// Middleware
const corsOptions = {
  origin: ['http://localhost:5173', 'https://basic-banking-app-nine.vercel.app'], // Specify the allowed origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/transfer', transferRoutes);
app.use('/api/customer', customerRoutes);

// Health Check Route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP' });
});

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'An unexpected error occurred!' });
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
