import prisma from '../config/db.js';

export const authorizeTitle = async (req, res, next) => {
  const { title } = req.body;
  const post = await prisma.book.findUnique({
    where: { title },
  });
  if (post) {
    const error = new Error('Conflict: duplicate title');
    error.status = 409;
    return next(error);
  }
  next();
};


export const authorizeTitleUpdate = async (req, res, next) => {
  const { title } = req.body;
  if (!title) {
    next();
  }
  else {
    const post = await prisma.book.findUnique({
      where: { title },
    });
    if (post) {
      const error = new Error('Conflict: duplicate title');
      error.status = 409;
      return next(error);
    }
    next();
  }
};