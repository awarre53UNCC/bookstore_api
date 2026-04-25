import {
  getAllOrdersAdmin,
  getAllOrdersUser,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} from '../services/orderService.js';

import { getById } from '../repositories/bookRepo.js'

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

export async function createOrderHandler(req, res) {
  const { items } = req.body;
  let totalPrice = 0;
  let bookIds = [];
  let bookQuantities = [];
  let prices = [];
//   console.log('items: ', items);

  for (let i = 0; i < items.length; i++) {
    // console.log('bookId: ', items[i].bookId)
    // console.log('quantity: ', items[i].quantity)

    let book = await getById(items[i].bookId);
    if (!book) {
      const error = new Error(`Bad request: no book with an ID of ${items[i].bookId}`);
      error.status = 400;
      throw error;
    }
    let iterationPrice = book.price;

    // console.log('price: ', iterationPrice)

    totalPrice += (iterationPrice * items[i].quantity);
    bookIds[i] = items[i].bookId;
    bookQuantities[i] = items[i].quantity;
    prices[i] = iterationPrice;
  }


  //const status = 'PENDING';
  const newOrder = await createOrder({ totalPrice, bookIds, bookQuantities, prices}, req.user);
  res.status(201).json(newOrder);
}

export async function updateOrderHandler(req, res) {
  const id = parseInt(req.params.id);
  const { status } = req.body;
  const updatedOrder = await updateOrder(id, { status });
  res.status(200).json(updatedOrder);
}

export async function deleteOrderHandler(req, res) {
  if (req.user.role === 'ADMIN') {
    const id = parseInt(req.params.id);
    await deleteOrder(id);
    res.status(204).send();
  }
  else {
    const id = parseInt(req.params.id);
    const order = await getOrderById(id);
    if (order.userId == req.user.id) {
        await deleteOrder(id);
        res.status(204).send();
    }
    else {
        const error = new Error(`Forbidden: Not your order`);
        error.status = 403;
        throw error;
    }
  }
}
