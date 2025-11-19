import express from 'express';
import { authMiddleware } from '../middlewares/auth-middleware';
import userController from '../controllers/user-controller';
import { formDataMiddleware } from '../middlewares/formdata-middleware';
import productController from '../controllers/product-controller';
import categoryController from '../controllers/category-controller';
import { allowedRoles } from '../middlewares/role-middleware';
import orderController from '../controllers/order-controller';

const apiRouter = express.Router();

apiRouter.use(authMiddleware);

// API Routes for user
apiRouter.get('/api/users/current', userController.get);
apiRouter.put('/api/users/current', formDataMiddleware, userController.update);
apiRouter.patch('/api/users/current/password', userController.changePassword);
apiRouter.delete('/api/users/current', userController.remove);
apiRouter.delete('/api/users/logout', userController.logout);

// API routes for product
apiRouter.get('/api/products/slug/:slug', productController.getBySlug);
apiRouter.get('/api/products/id/:id', productController.getById);
apiRouter.get('/api/products', productController.getAll);
apiRouter.post(
  '/api/products/create',
  allowedRoles(['CREATOR']),
  formDataMiddleware,
  productController.create
);
apiRouter.put('/api/products/:id', allowedRoles(['CREATOR']), formDataMiddleware, productController.update);
apiRouter.delete('/api/products/:id', allowedRoles(['CREATOR']), productController.remove);

// API routes for category
apiRouter.get('/api/categories', categoryController.getAll);
apiRouter.post('/api/categories/create', allowedRoles(['ADMIN']), categoryController.create);

// API routes for order
apiRouter.post('/api/orders', allowedRoles(['USER', 'CREATOR']), orderController.create);

export default apiRouter;
