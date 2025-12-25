import express from 'express';
import userController from '../controllers/user-controller';
import orderController from '../controllers/order-controller';
import categoryController from '../controllers/category-controller';
import productController from '../controllers/product-controller';
const publicRouter = express.Router();

publicRouter.post('/api/users/register', userController.register);
publicRouter.post('/api/users/login', userController.login);

publicRouter.post('/api/payment/notification-handler', orderController.paymentNotificationHandler);

publicRouter.get('/api/products/similiar', productController.getSimiliarProductsByCategory);
publicRouter.get('/api/products/slug/:slug', productController.getBySlug);
publicRouter.get('/api/products', productController.getAll);

publicRouter.get('/api/categories', categoryController.getAll);

export default publicRouter;
