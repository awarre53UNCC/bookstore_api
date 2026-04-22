import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from '../services/bookService.js';

export async function getAllBooksHandler(req, res) {
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
  let books = await getAllBooks(options);
  res.status(200).json(books);
}

export async function getBookByIdHandler(req, res) {
  const id = parseInt(req.params.id);
  const book = await getBookById(id);
  res.status(200).json(book);
}

export async function createBookHandler(req, res) {
  const { title, price, stock, publicationYear } = req.body;
  const newBook = await createBook({ title, price, stock, publicationYear});
  res.status(201).json(newBook);
}

export async function updateBookHandler(req, res) {
  const id = parseInt(req.params.id);
  const { title, price, stock } = req.body;
  const updatedBook = await updateBook(id, { title, price, stock });
  res.status(200).json(updatedBook);
}

export async function deleteBookHandler(req, res) {
  const id = parseInt(req.params.id);
  await deleteBook(id);
  res.status(204).send();
}
