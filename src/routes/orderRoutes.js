import express from 'express';
import {
  getAllOrdersHandler,
  getOrderByIdHandler,
  createOrderHandler,
  updateOrderHandler,
  deleteOrderHandler
} from '../controllers/orderController.js';

import {
    validateId,
    validateCreateOrder,
    validateUpdateOrder,
    validateOrderQuery,
} from '../middleware/orderValidator.js';

import { authenticate } from '../middleware/authenticate.js';
// import { authorizeOwnership } from '../middleware/authorizeOwnership.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js'

const router = express.Router();
router.get('/', authenticate, validateOrderQuery, getAllOrdersHandler);
router.get('/:id', authenticate, validateId, getOrderByIdHandler);
router.post('/', authenticate, validateCreateOrder, createOrderHandler);
router.put('/:id', authenticate, authorizeRoles('ADMIN'), validateId, validateUpdateOrder, updateOrderHandler);
router.delete('/:id', authenticate, validateId, deleteOrderHandler);

export default router;
