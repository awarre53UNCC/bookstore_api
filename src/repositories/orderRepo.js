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

export function create(orderData) {
  const newOrder = prisma.order.create({ data: orderData });
  return newOrder;
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
