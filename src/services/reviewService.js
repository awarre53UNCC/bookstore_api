import {
  getAll,
  getById,
  getByBookId,
  create,
  update,
  remove,
} from '../repositories/reviewRepo.js';

export async function getAllReviews(options) {
  return getAll(options);
}

export async function getReviewById(id) {
  const review = await getById(id);
  if (review) return review;
  else {
    const error = new Error(`Review ${id} not found`);
    error.status = 404;
    throw error;
  }
}

export async function getReviewByBookId(id) {
  const review = await getByBookId(id);
  if (review.length === 0) {
    const error = new Error(`Book ${id} not found`);
    error.status = 404;
    throw error;
  }
  return review;
}

export async function createReview(reviewData, user) {
  const review = await create(reviewData, user);
  if (review) return review;
  else {
    const error = new Error(`Review invalid: Book ${reviewData.bookId} not found`);
    error.status = 404;
    throw error;
  }
}

export async function updateReview(id, updatedData) {
  const updatedReview = await update(id, updatedData);
  if (updatedReview) return updatedReview;
  else {
    const error = new Error(`Review ${id} not found`);
    error.status = 404;
    throw error;
  }
}

export async function deleteReview(id) {
  const result = await remove(id);
  if (result) return;
  else {
    const error = new Error(`Review ${id} not found`);
    error.status = 404;
    throw error;
  }
}
