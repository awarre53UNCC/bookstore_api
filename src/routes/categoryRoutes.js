import express from 'express';
import {
  createCategoryHandler,
  getAllCategoriesHandler,
} from '../controllers/bookController.js';
import {
    validateCreateCategory,
} from '../middleware/bookValidator.js';
import { authorizeCategory } from '../middleware/categoryValidator.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';


const router = express.Router();
router.get('/', getAllCategoriesHandler);
router.post('/', authenticate, authorizeRoles('ADMIN'), validateCreateCategory, authorizeCategory, createCategoryHandler);


export default router;