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

export const validateCreateBook = [
  body('title')
    .exists({ values: 'falsy' })
    .withMessage('Title is required')
    .bail()
    .trim()
    .escape()
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters'),

  body('price')
    .exists({ values: 'falsy' })
    .withMessage('Price is required')
    .bail()
    .isFloat({ min: 0.01 })
    .withMessage('Price must be a postive decimal'),

  body('stock')
    .exists({ values: 'falsy' })
    .withMessage('Stock is required')
    .bail()
    .isInt({ min: 1})
    .withMessage('Stock must be a postive integer'),

  body('publicationYear')
    .exists({ values: 'falsy' })
    .withMessage('Publication Year is required')
    .bail()
    .isInt({ min: 1800})
    .withMessage('Publication Year must be a postive integer'), 

  handleValidationErrors,
];

export const validateUpdateBook = [
  oneOf(
    [
      body('title').exists({ values: 'falsy' }),
      body('price').exists({ values: 'falsy' }),
      body('stock').exists({ values: 'falsy' }),
    ],
    { message: 'At least one field (title, price, stock) must be provided' },
  ),

  body('title')
    .optional()
    .trim()
    .escape()
    .isString()
    .withMessage('Title must be a string')
    .bail()
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters'),

  body('price')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Price must be a postive decimal'),

  body('stock')
    .optional()
    .isInt({ min: 1})
    .withMessage('Stock must be a postive integer'),

  handleValidationErrors,
];

export const validateBookQuery = [
  query('sortBy')
    .optional()
    .isIn(['id', 'title', 'publicationYear', 'stock', 'price'])
    .withMessage('sortBy must be one of id, title, publicationYear, stock, or price'),

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

export const validateCreateCategory = [
  body('name')
    .exists({ values: 'falsy' })
    .withMessage('Name (for category) is required')
    .bail()
    .trim()
    .escape()
    .isLength({ min: 3 })
    .withMessage('Name (for category) must be at least 3 characters'),

  handleValidationErrors,
];

export const validateCreateAuthor = [
  body('name')
    .exists({ values: 'falsy' })
    .withMessage('Name (full name) is required')
    .bail()
    .trim()
    .escape()
    .isLength({ min: 3 })
    .withMessage('Name (full name) must be at least 3 characters'),

  handleValidationErrors,
];
