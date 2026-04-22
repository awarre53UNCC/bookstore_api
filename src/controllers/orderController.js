import {
  getAllOrdersAdmin,
  getAllOrdersUser,
  getOrderById,
  createBook,
  updateBook,
  deleteBook,
} from '../services/orderService.js';

export async function getAllOrdersHandler(req, res) {
  const {
    sortBy = 'id',
    order = 'asc',
    offset = 0,
    limit = 5,
  } = req.query;

  const options = {
    sortBy,
    order,
    offset: parseInt(offset),
    limit: parseInt(limit),
  };
//   console.log('Role: ', req.user.role);
  if (req.user.role === 'ADMIN') {
    let orders = await getAllOrdersAdmin(options);
    res.status(200).json(orders);
  }
  else {
    // console.log('Not admin')
    //console.log(req.user.id)
    let orders = await getAllOrdersUser(options, req.user);
    res.status(200).json(orders);
  }
}

export async function getOrderByIdHandler(req, res) {
  if (req.user.role === 'ADMIN') {
    const id = parseInt(req.params.id);
    const order = await getOrderById(id);
    res.status(200).json(order);
  }
  else {
    const id = parseInt(req.params.id);
    const order = await getOrderById(id);
    if (order.userId == req.user.id) {
        res.status(200).json(order);
    }
    else {
        const error = new Error(`Forbidden: Not your order`);
        error.status = 403;
        throw error;
    }
  }
  
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
