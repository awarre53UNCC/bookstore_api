import express from 'express';
import {
  getAllOrdersHandler,
  getOrderByIdHandler,
//   createBookHandler,
//   updateBookHandler,
//   deleteBookHandler
} from '../controllers/orderController.js';

import {
    validateId,
    // validateCreateBook,
    // validateUpdateBook,
    validateOrderQuery,
} from '../middleware/orderValidator.js';

import { authenticate } from '../middleware/authenticate.js';
// import { authorizeOwnership } from '../middleware/authorizeOwnership.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js'

const router = express.Router();
router.get('/', authenticate, validateOrderQuery, getAllOrdersHandler);
router.get('/:id', authenticate, validateId, getOrderByIdHandler);
// router.post('/', authenticate, authorizeRoles('ADMIN'), validateCreateBook, authorizeTitle, createBookHandler);
// router.put('/:id', authenticate, authorizeRoles('ADMIN'), validateId, validateUpdateBook, updateBookHandler);
// router.delete('/:id', authenticate, authorizeRoles('ADMIN'), validateId, deleteBookHandler);

export default router;
