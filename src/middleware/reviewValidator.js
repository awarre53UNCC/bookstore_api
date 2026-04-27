import { param, body, oneOf, query } from 'express-validator';
import { handleValidationErrors } from './handleValidationErrors.js';

export const validateId = [
  param('id')
    .trim()
    .escape()
    .isInt({ min: 1 })
    .withMessage('Id must be a positive integer'),

  handleValidationErrors,
];

export const validateCreateReview = [
  body('comment')
    .exists({ values: 'falsy' })
    .withMessage('Comment is required')
    .bail()
    .trim()
    .escape()
    .isLength({ min: 3 })
    .withMessage('Comment must be at least 3 characters'),

  body('rating')
    .exists({ values: 'falsy' })
    .withMessage('Rating is required')
    .bail()
    .isInt({ min: 1, max: 5})
    .withMessage('Rating must be a positive integer (1-5)'),

  body('bookId')
    .exists({ values: 'falsy' })
    .withMessage('bookId is required')
    .bail()
    .isInt({ min: 1})
    .withMessage('bookId must be a positive integer'),
    
  handleValidationErrors,
];

export const validateUpdateReview = [
  oneOf(
    [
      body('rating').exists({ values: 'falsy' }),
      body('comment').exists({ values: 'falsy' }),
    ],
    { message: 'At least one field (rating or comment) must be provided' },
  ),

  body('rating')
    .isInt({ min: 1, max: 5})
    .withMessage('Rating must be a positive integer (1-5)'),

  body('comment')
    .trim()
    .escape()
    .isLength({ min: 3 })
    .withMessage('Comment must be at least 3 characters'),

  handleValidationErrors,
];

export const validateReviewQuery = [
  query('sortBy')
    .optional()
    .isIn(['rating', 'userId', 'bookId', 'comment', 'createdAt'])
    .withMessage('sortBy must be one of userId, bookId, rating, comment, or createdAt'),

  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('order must be either asc or desc'),

  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('offset must be a non-negative integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('limit must be an integer between 1 and 50'),

  handleValidationErrors,
];
