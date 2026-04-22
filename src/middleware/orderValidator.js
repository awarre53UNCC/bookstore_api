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

export const validateCreateOrder = [
  body('items')
    .exists({ values: 'falsy' })
    .withMessage('Items are required')
    .bail()
    .isArray({ min: 1})
    .withMessage('Items must be an non-empty array'),

   body('items.*.bookId')
    .exists({ values: 'falsy' })
    .withMessage('bookId is required')
    .bail()
    .isInt({ min: 1 })
    .withMessage('bookId must be a positive integer'),

   body('items.*.quantity')
    .exists({ values: 'falsy' })
    .withMessage('quantity is required')
    .bail()
    .isInt({ min: 1 })
    .withMessage('quantity must be a positive integer'),

  handleValidationErrors,
];

export const validateUpdateOrder = [

    body('status')
    .exists({ values: 'falsy' })
    .withMessage('status is required')
    .bail()
    .trim()
    .escape()
    .isIn(['PENDING', 'SHIPPING', 'DELIVERED'])
    .withMessage('status must be PENDING, SHIPPING, or DELIVERED'),
  handleValidationErrors,
];

export const validateOrderQuery = [
  query('sortBy')
    .optional()
    .isIn(['id', 'createdAt', 'status', 'totalPrice', 'userId'])
    .withMessage('sortBy must be one of id, created_at, status, total_price, or user_id'),

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