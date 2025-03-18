import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import userRoutes from './routes/user-routes';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { Helper } from './utils/helper';
// import foodRoutes from './routes/food-routes';
// import cartRoutes from './routes/cart-routes';
// import paymentRoutes from './routes/payment-routes';
import { config } from './config/config';
// import orderRoutes from './routes/order-routes';
import * as http from 'http';
import { Server as SocketIO } from 'socket.io';
import Stripe from 'stripe';
import { Types } from 'mongoose';
import courseRoutes from './routes/course-routes';
import resourceRoutes from './routes/resource-routes';
import moduleRoutes from './routes/module-routes';
// import statusRoutes from './routes/status-routes';

dotenv.config();
connectDB();
const app: Application = express();
const stripe = new Stripe(config.STRIPE_SECRET_KEY || '', { apiVersion: '2024-12-18.acacia' });

const server = http.createServer(app);

// Initialize Socket.IO
const io = new SocketIO(server, {
  cors: {
    origin: '*', // Allow all origins (Update for production)
  },
});
export { io, stripe };
app.use(cors());
app.use(express.json());  // For JSON bodies
app.use(express.urlencoded({ extended: true }));  // For URL-encoded bodies


// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Emit order status updates
export const sendOrderStatus = (orderId:Types.ObjectId, status:string, statusId:Types.ObjectId) => {
  io.emit('order-updated', {
    event: 'order-status',
    orderId: orderId,
    status: status,
    statusId: statusId,
  });
};
export const sendUpdateStatus = (statusId:Types.ObjectId, status:string, userId:Types.ObjectId, orderId:Types.ObjectId, updatedAt:Date) => {
  io.emit('status-updated', {
    event: 'status-updated',
    statusId: statusId,
    userId: userId,
    orderId: orderId,
    status: status,
    updatedAt: updatedAt,
  });
};

// Middleware setup
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// Route setups
app.use('/auth', userRoutes);
app.use('/api', Helper.verifyToken);
app.use('/api/course', courseRoutes);
app.use('/api/resource', resourceRoutes)
app.use('/api/module', moduleRoutes);
// app.use('/api/food', foodRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/order', orderRoutes);
// app.use('/payment', paymentRoutes);
// app.use('/api/status', statusRoutes);
app.use((err:any, req:any, res:any, next:any) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});


// Start the server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
