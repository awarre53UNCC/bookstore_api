import prisma from '../config/db.js';

export async function getAllAdmin({ sortBy, order, offset, limit }) {
  let where = {};

  const orders = await prisma.order.findMany({
    where,
    orderBy: { [sortBy]: order },
    take: limit,
    skip: offset,
  });
  return orders;
}

export async function getAllUser({ sortBy, order, offset, limit }, user) {
    // console.log('user: ', user);
    const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { [sortBy]: order },
    take: limit,
    skip: offset,
  });
  return orders;
}

export async function getById(id) {
  const order = await prisma.order.findUnique({ where: { id } });
  return order;
}

export async function create({ totalPrice, bookIds, bookQuantities, prices}, user) {

  const newOrder = await prisma.order.create({ 
    data: {
        totalPrice,
        userId: user.id
    } 
  });

  const length = bookIds.length;

  for (let i = 0; i < length; i++) {
    await prisma.orderItem.createMany({ 
        data: [ 
            { orderId: newOrder.id, bookId: bookIds[i], quantity: bookQuantities[i], price: prices[i] },
        ],
    });
  }

  return newOrder;
}

export async function update(id, updatedData) {
  try {
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updatedData,
    });
    return updatedOrder;
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
