import express from 'express';
import userController from '../controllers/user-controller';
import orderController from '../controllers/order-controller';
const publicRouter = express.Router();

publicRouter.post('/api/users/register', userController.register);
publicRouter.post('/api/users/login', userController.login);

publicRouter.post('/api/payment/notification-handler', orderController.paymentNotificationHandler);

export default publicRouter;
