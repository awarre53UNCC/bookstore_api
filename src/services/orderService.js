import {
  getAllAdmin,
  getAllUser,
  getById,
  create,
  update,
  remove,
} from '../repositories/orderRepo.js';

export async function getAllOrdersAdmin(options) {
  return getAllAdmin(options);
}

export async function getAllOrdersUser(options, user) {
  return getAllUser(options, user);
}

export async function getOrderById(id) {
  const order = await getById(id);
  if (order) return order;
  else {
    const error = new Error(`Order ${id} not found`);
    error.status = 404;
    throw error;
  }
}

export async function createBook(orderData) {
  return create(orderData);
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
