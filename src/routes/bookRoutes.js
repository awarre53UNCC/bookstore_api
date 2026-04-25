import express from 'express';
import {
  getAllBooksHandler,
  getBookByIdHandler,
  createBookHandler,
  updateBookHandler,
  deleteBookHandler,
  getReviewsForBookHandler,
  createCategoryHandler,
  createAuthorHandler,
  getAllCategoriesHandler
} from '../controllers/bookController.js';

import {
    validateId,
    validateCreateBook,
    validateUpdateBook,
    validateBookQuery,
    validateCreateCategory,
    validateCreateAuthor
} from '../middleware/bookValidator.js';

import { authenticate } from '../middleware/authenticate.js';
// import { authorizeOwnership } from '../middleware/authorizeOwnership.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import { authorizeTitle, authorizeTitleUpdate} from '../middleware/titleValidator.js';
import { authorizeCategory } from '../middleware/categoryValidator.js';
import { authorizeAuthor } from '../middleware/authorValidator.js'


const router = express.Router();
router.get('/', validateBookQuery, getAllBooksHandler);
router.get('/:id', validateId, getBookByIdHandler);
router.post('/', authenticate, authorizeRoles('ADMIN'), validateCreateBook, authorizeTitle, createBookHandler);
router.put('/:id', authenticate, authorizeRoles('ADMIN'), validateId, validateUpdateBook, authorizeTitleUpdate, updateBookHandler);
router.delete('/:id', authenticate, authorizeRoles('ADMIN'), validateId, deleteBookHandler);
router.get('/:id/reviews', validateId, getReviewsForBookHandler);

export default router;
