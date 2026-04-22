import prisma from '../config/db.js';

export async function getAll({ search, sortBy, order, offset, limit }) {
  let where = {};

  if (search) {
    where.comment = {
      contains: search,
      mode: 'insensitive',
    };
  }

  const reviews = await prisma.review.findMany({
    where,
    orderBy: { [sortBy]: order },
    take: limit,
    skip: offset,
  });
  return reviews;
}

export async function getById(id) {
  const review = await prisma.review.findUnique({ where: { id } });
  return review;
}

export async function getByBookId(id) {
  const reviews = await prisma.review.findMany({ where: { bookId: id } });
  return reviews;
}

export async function create(reviewData, user) {
  try {
    const newReview = await prisma.review.create({ 
      data: {
          rating: reviewData.rating,
          comment: reviewData.comment,
          bookId: reviewData.bookId,
          userId: user.id,
      } 
    });
    return newReview;
  } catch (error) {
    if (error.code === 'P2002') {
        const err = new Error(`Conflict: cannot review the same book more than once`);
        err.status = 409;
        throw err;
    }
    if (error.code === 'P2025') return null;
  }
}

export async function update(id, updatedData) {
  try {
    const updatedReview = await prisma.review.update({
      where: { id },
      data: updatedData,
    });
    return updatedReview;
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}

export async function remove(id) {
  try {
    const deletedReview = await prisma.review.delete({
      where: { id },
    });
    return deletedReview;
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}
