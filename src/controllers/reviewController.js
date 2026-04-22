import {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} from '../services/reviewService.js';

import { getById } from '../repositories/reviewRepo.js'

export async function getAllReviewsHandler(req, res) {
  const {
    search = '',
    sortBy = 'id',
    order = 'asc',
    offset = 0,
    limit = 5,
  } = req.query;

  const options = {
    search,
    sortBy,
    order,
    offset: parseInt(offset),
    limit: parseInt(limit),
  };
  let reviews = await getAllReviews(options);
  res.status(200).json(reviews);
}

export async function getReviewByIdHandler(req, res) {
  const id = parseInt(req.params.id);
  const review = await getReviewById(id);
  res.status(200).json(review);
}

export async function createReviewHandler(req, res) {
  const { rating, comment, bookId } = req.body;
  const newReview = await createReview({ rating, comment, bookId }, req.user);
  res.status(201).json(newReview);
}

export async function updateReviewHandler(req, res) {
    const id = parseInt(req.params.id);
    let reviewId;
    try {
        const review = await getById(id);
        reviewId = review.userId;
    } catch {
        const error = new Error(`Review ${id} not found`);
        error.status = 404;
        throw error;
    }
    if (reviewId === req.user.id) {
        const { rating, comment } = req.body;
        const updatedReview = await updateReview(id, { rating, comment });
        res.status(200).json(updatedReview);
    }
    else {
        const error = new Error(`Forbidden: Not your review`);
        error.status = 403;
        throw error;
    }
}

export async function deleteReviewHandler(req, res) {
    const id = parseInt(req.params.id);
    let reviewId;
    try {
        const review = await getById(id);
        reviewId = review.userId;
    } catch {
        const error = new Error(`Review ${id} not found`);
        error.status = 404;
        throw error;
    }
    if (reviewId === req.user.id) {
        const id = parseInt(req.params.id);
        await deleteReview(id);
        res.status(204).send();
    }
    else {
        const error = new Error(`Forbidden: Not your review`);
        error.status = 403;
        throw error;
    }
}
