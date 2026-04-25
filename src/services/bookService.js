import {
  getAll,
  getById,
  create,
  update,
  remove,
  createCategory,
  createAuthor,
  getAllCategories,
  getAllAuthors
} from '../repositories/bookRepo.js';

export async function getAllBooks(options) {
  return getAll(options);
}

export async function getBookById(id) {
  const book = await getById(id);
  if (book) return book;
  else {
    const error = new Error(`Book ${id} not found`);
    error.status = 404;
    throw error;
  }
}

export async function createBook({ title, price, stock, publicationYear, authorIds, categoryIds}) {
  if (price <= 0) {
    const error = new Error("Price must be greater than 0");
    error.status = 400;
    throw error;
}
  return create({ title, price, stock, publicationYear, authorIds, categoryIds});
}

export async function updateBook(id, updatedData) {
  const updatedBook = await update(id, updatedData);
  if (updatedBook) return updatedBook;
  else {
    const error = new Error(`Book ${id} not found`);
    error.status = 404;
    throw error;
  }
}

export async function deleteBook(id) {
  const result = await remove(id);
  if (result) return;
  else {
    const error = new Error(`Book ${id} not found`);
    error.status = 404;
    throw error;
  }
}

export async function createNewCategory({ name }) {
  return await createCategory({ name });
}

export async function createNewAuthor({ name }) {
  return await createAuthor({ name });
}

export async function getAllTheCategories() {
   return await getAllCategories();
}

export async function getAllTheAuthors() {
   return await getAllAuthors();
}
