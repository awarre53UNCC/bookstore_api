import prisma from '../config/db.js';

export const authorizeCategory = async (req, res, next) => {
  const { name } = req.body;
  const category = await prisma.category.findUnique({
    where: { categoryName: name },
  });
  if (category) {
    const error = new Error('Conflict: duplicate category');
    error.status = 409;
    return next(error);
  }
  next();
};