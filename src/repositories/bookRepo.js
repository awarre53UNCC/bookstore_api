import prisma from '../config/db.js';

export async function getAll({ search, category, author, sortBy, order, offset, limit }) {
  let where = {};
  // console.log({ search, category, author })
  if (search) {
    where.title = {
      contains: search,
      mode: 'insensitive',
    };
  }

  if (category) {
    where.bookCategories = {
      some: {
        category: {
          categoryName: {
            contains: category,
            mode: 'insensitive',
          },
        },
      },
    };
  }

  if (author) {
    where.bookAuthors = {
      some: {
        author: {
          fullName: {
            contains: author,
            mode: 'insensitive',
          },
        },
      },
    };
  }

  const books = await prisma.book.findMany({
    where,
    orderBy: { [sortBy]: order },
    take: limit,
    skip: offset,
  });
  return books;
}

export async function getById(id) {
  const book = await prisma.book.findUnique({ where: { id } });
  return book;
}

export function create(bookData) {
  const newBook = prisma.book.create({ data: bookData });
  return newBook;
}

export async function update(id, updatedData) {
  try {
    const updatedBook = await prisma.book.update({
      where: { id },
      data: updatedData,
    });
    return updatedBook;
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}

export async function remove(id) {
  try {
    const deletedBook = await prisma.book.delete({
      where: { id },
    });
    return deletedBook;
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}
