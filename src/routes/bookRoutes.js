import express from 'express';
import {
  getAllBooksHandler,
  getBookByIdHandler,
  createBookHandler,
  updateBookHandler,
  deleteBookHandler
} from '../controllers/bookController.js';

import {
    validateId,
    validateCreateBook,
    validateUpdateBook,
    validateBookQuery,
} from '../middleware/bookValidator.js';

import { authenticate } from '../middleware/authenticate.js';
// import { authorizeOwnership } from '../middleware/authorizeOwnership.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js'
import { authorizeTitle } from '../middleware/titleValidator.js'

const router = express.Router();
router.get('/', validateBookQuery, getAllBooksHandler);
router.get('/:id', validateId, getBookByIdHandler);
router.post('/', authenticate, authorizeRoles('ADMIN'), validateCreateBook, authorizeTitle, createBookHandler);
router.put('/:id', authenticate, authorizeRoles('ADMIN'), validateId, validateUpdateBook, updateBookHandler);
router.delete('/:id', authenticate, authorizeRoles('ADMIN'), validateId, deleteBookHandler);

export default router;
