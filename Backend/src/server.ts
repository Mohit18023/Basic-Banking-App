import express, { Application } from 'express';
import userRoutes from './routes/userRoutes';
import transferRoutes from './routes/transferRoutes';
import customerRoutes from './routes/customerRoutes';
import cors from 'cors';

const app: Application = express();
app.use(cors());
app.use(express.json());
app.use('/api/user', userRoutes);
app.use('/api/transfer', transferRoutes);
app.use('/api/customer', customerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
