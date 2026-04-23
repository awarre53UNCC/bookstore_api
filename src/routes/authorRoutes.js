import express from 'express';
import {
  createAuthorHandler,
  getAllAuthorsHandler,
} from '../controllers/bookController.js';
import {
    validateCreateAuthor,
} from '../middleware/bookValidator.js';
import { authorizeAuthor } from '../middleware/authorValidator.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';


const router = express.Router();
router.get('/', getAllAuthorsHandler);
router.post('/', authenticate, authorizeRoles('ADMIN'), validateCreateAuthor, authorizeAuthor, createAuthorHandler);


export default router;