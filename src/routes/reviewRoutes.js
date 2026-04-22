import express from 'express';
import {
  getAllReviewsHandler,
  getReviewByIdHandler,
  createReviewHandler,
  updateReviewHandler,
  deleteReviewHandler
} from '../controllers/reviewController.js';

import {
    validateId,
    validateCreateReview,
    validateUpdateReview,
    validateReviewQuery,
} from '../middleware/reviewValidator.js';

import { authenticate } from '../middleware/authenticate.js';
// import { authorizeOwnership } from '../middleware/authorizeOwnership.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js'
import { authorizeTitle } from '../middleware/titleValidator.js'

const router = express.Router();
router.get('/', validateReviewQuery, getAllReviewsHandler);
router.get('/:id', validateId, getReviewByIdHandler);
router.post('/', authenticate, validateCreateReview, createReviewHandler);
router.put('/:id', authenticate, validateId, validateUpdateReview, updateReviewHandler);
router.delete('/:id', authenticate, validateId, deleteReviewHandler);

export default router;