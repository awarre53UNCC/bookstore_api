import prisma from '../config/db.js';

export const authorizeAuthor = async (req, res, next) => {
  const { name } = req.body;
  const author = await prisma.author.findUnique({
    where: { fullName: name },
  });
  if (author) {
    const error = new Error('Conflict: duplicate author');
    error.status = 409;
    return next(error);
  }
  next();
};