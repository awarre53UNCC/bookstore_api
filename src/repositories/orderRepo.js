import prisma from '../config/db.js';

export async function getAllAdmin({ sortBy, order, offset, limit }) {
  let where = {};

  const orders = await prisma.order.findMany({
    where,
    orderBy: { [sortBy]: order },
    take: limit,
    skip: offset,
  });

  let finalOrders = [];

  for (let i = 0; i < orders.length; i++) {
    const orderItems = await prisma.orderItem.findMany({
      where: { orderId: orders[i].id },
    });

    let items = [];
    for (let i = 0; i < orderItems.length; i++) {
      const book = await prisma.book.findUnique({
        where: { id: orderItems[i].bookId }
      });

      items.push({ 
        bookId: book.id, 
        title: book.title,
        quantity: orderItems[i].quantity,
        price: orderItems[i].price,
      });
    }

    const finalOrder = {
      id: orders[i].id,
      totalPrice: orders[i].totalPrice,
      status: orders[i].status,
      createdAt: orders[i].createdAt,
      userId: orders[i].userId,
      items: items,
    }
    finalOrders[i] = finalOrder;
  }
  
  return finalOrders;
}

export async function getAllUser({ sortBy, order, offset, limit }, user) {
    // console.log('user: ', user);
    const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { [sortBy]: order },
    take: limit,
    skip: offset,
  });

  let finalOrders = [];

  for (let i = 0; i < orders.length; i++) {
    const orderItems = await prisma.orderItem.findMany({
      where: { orderId: orders[i].id },
    });

    let items = [];
    for (let i = 0; i < orderItems.length; i++) {
      const book = await prisma.book.findUnique({
        where: { id: orderItems[i].bookId }
      });

      items.push({ 
        bookId: book.id, 
        title: book.title,
        quantity: orderItems[i].quantity,
        price: orderItems[i].price,
      });
    }

    const finalOrder = {
      id: orders[i].id,
      totalPrice: orders[i].totalPrice,
      status: orders[i].status,
      createdAt: orders[i].createdAt,
      userId: orders[i].userId,
      items: items,
    }
    finalOrders[i] = finalOrder;
  }
  
  return finalOrders;
}

export async function getById(id) {
  const order = await prisma.order.findUnique({ where: { id } });

  if (!order) {
    return null;
  }

  // console.log(order);
  const orderItems = await prisma.orderItem.findMany({
    where: { orderId: id },
  });
  // console.log(orderItems);

  let items = [];
  for (let i = 0; i < orderItems.length; i++) {
    const book = await prisma.book.findUnique({
      where: { id: orderItems[i].bookId }
    });

    items.push({ 
      bookId: book.id, 
      title: book.title,
      quantity: orderItems[i].quantity,
      price: orderItems[i].price,
    });
    // console.log(book);
  }

  const finalOrder = {
    id: order.id,
    totalPrice: order.totalPrice,
    status: order.status,
    createdAt: order.createdAt,
    userId: order.userId,
    items: items,
  }
  return finalOrder;
}

export async function create({ totalPrice, bookIds, bookQuantities, prices}, user) {

  const newOrder = await prisma.order.create({ 
    data: {
        totalPrice,
        userId: user.id
    } 
  });


  //checks

  // const booksLength = await prisma.book.findMany({});

  // let flag = false;
  // let badID;

  // for (let i = 0; i < bookIds.length; i++) {
  //   if (booksLength.length < bookIds[i]) {
  //     flag = true;
  //     badID = bookIds[i];
  //     break;
  //   }
  // }

  // if (flag) {
  //   const error = new Error(`Bad request: book with ID ${badID}`);
  //   error.status = 400;
  //   throw error;
  // }


  // // end checks

  const length = bookIds.length;

  for (let i = 0; i < length; i++) {
    await prisma.orderItem.createMany({ 
        data: [ 
            { orderId: newOrder.id, bookId: bookIds[i], quantity: bookQuantities[i], price: prices[i] },
        ],
    });
  }

  const orderItems = await prisma.orderItem.findMany({
    where: { orderId: newOrder.id },
  });

  let items = [];
  for (let i = 0; i < orderItems.length; i++) {
    const book = await prisma.book.findUnique({
      where: { id: orderItems[i].bookId }
    });

    items.push({ 
      bookId: book.id, 
      title: book.title,
      quantity: orderItems[i].quantity,
      price: orderItems[i].price,
    });
  }

  const finalNewOrder = {
    id: newOrder.id,
    totalPrice: newOrder.totalPrice,
    status: newOrder.status,
    createdAt: newOrder.createdAt,
    userId: newOrder.userId,
    items: items,
  }
  return finalNewOrder;
}

export async function update(id, updatedData) {
  try {
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updatedData,
    });
    const orderItems = await prisma.orderItem.findMany({
      where: { orderId: updatedOrder.id },
    });

    let items = [];
    for (let i = 0; i < orderItems.length; i++) {
      const book = await prisma.book.findUnique({
        where: { id: orderItems[i].bookId }
      });

      items.push({ 
        bookId: book.id, 
        title: book.title,
        quantity: orderItems[i].quantity,
        price: orderItems[i].price,
      });
    }

    const finalUpdatedOrder = {
      id: updatedOrder.id,
      totalPrice: updatedOrder.totalPrice,
      status: updatedOrder.status,
      createdAt: updatedOrder.createdAt,
      userId: updatedOrder.userId,
      items: items,
    }
    return finalUpdatedOrder;
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}

export async function remove(id) {
  try {
    const deletedOrder = await prisma.order.delete({
      where: { id },
    });
    return deletedOrder;
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}
