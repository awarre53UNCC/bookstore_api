import {
  getAll,
  getById,
  create,
  update,
  remove,
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

export async function createBook(bookData) {
  return create(bookData);
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
