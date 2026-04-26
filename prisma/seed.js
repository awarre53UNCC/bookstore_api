import 'dotenv/config';
import prisma from '../src/config/db.js';
import bcrypt from 'bcrypt';

console.log(process.env.DATABASE_URL);
console.log('Clearing database...');

// Reset DB

await prisma.$transaction([
  prisma.orderItem.deleteMany(),
  prisma.review.deleteMany(),
  prisma.bookAuthor.deleteMany(),
  prisma.bookCategory.deleteMany(),
  prisma.order.deleteMany(),
  prisma.book.deleteMany(),
  prisma.author.deleteMany(),
  prisma.category.deleteMany(),
  prisma.user.deleteMany(),
]);

console.log('Database cleared!');


const password = await bcrypt.hash('password123', 10);

// 1 admin, 1 user
const [admin, user] = await Promise.all([
  prisma.user.create({
    data: {
      email: 'admin@test.com',
      password,
      role: 'ADMIN',
    },
  }),
  prisma.user.create({
    data: {
      email: 'user@test.com',
      password,
      role: 'USER',
    },
  }),
]);

// 5 authors
const authors = await prisma.author.createMany({
  data: [
    { fullName: 'Robert C. Martin' },
    { fullName: 'J.K. Rowling' },
    { fullName: 'George Orwell' },
    { fullName: 'Mark Twain' },
    { fullName: 'Jane Austen' },
  ],
});

// 5 categories
await prisma.category.createMany({
  data: [
    { categoryName: 'Programming' },
    { categoryName: 'Fantasy' },
    { categoryName: 'Classic' },
    { categoryName: 'Fiction' },
    { categoryName: 'Science' },
  ],
});

// 5 books
const books = await Promise.all([
  prisma.book.create({
    data: {
      title: 'Clean Code',
      price: 39.99,
      stock: 10,
      publicationYear: 2008,
    },
  }),
  prisma.book.create({
    data: {
      title: 'Harry Potter',
      price: 29.99,
      stock: 15,
      publicationYear: 1997,
    },
  }),
  prisma.book.create({
    data: {
      title: '1984',
      price: 19.99,
      stock: 20,
      publicationYear: 1949,
    },
  }),
  prisma.book.create({
    data: {
      title: 'Tom Sawyer',
      price: 14.99,
      stock: 8,
      publicationYear: 1876,
    },
  }),
  prisma.book.create({
    data: {
      title: 'Pride and Prejudice',
      price: 24.99,
      stock: 12,
      publicationYear: 1813,
    },
  }),
]);


const allAuthors = await prisma.author.findMany();
const allCategories = await prisma.category.findMany();

// 5 authors
await prisma.bookAuthor.createMany({
  data: [
    { bookId: books[0].id, authorId: allAuthors[0].id },
    { bookId: books[0].id, authorId: allAuthors[1].id },
    { bookId: books[1].id, authorId: allAuthors[1].id },
    { bookId: books[2].id, authorId: allAuthors[2].id },
    { bookId: books[3].id, authorId: allAuthors[3].id },
    { bookId: books[3].id, authorId: allAuthors[4].id },
    { bookId: books[4].id, authorId: allAuthors[4].id },
  ],
});

// 5 categories
await prisma.bookCategory.createMany({
  data: [
    { bookId: books[0].id, categoryId: allCategories[0].id },
    { bookId: books[0].id, categoryId: allCategories[4].id },
    { bookId: books[1].id, categoryId: allCategories[1].id },
    { bookId: books[2].id, categoryId: allCategories[2].id },
    { bookId: books[2].id, categoryId: allCategories[3].id },
    { bookId: books[3].id, categoryId: allCategories[3].id },
    { bookId: books[4].id, categoryId: allCategories[3].id },
    { bookId: books[4].id, categoryId: allCategories[2].id },
  ],
});

// 5 reviews
await prisma.review.createMany({
  data: [
    { rating: 5, comment: 'Excellent!', userId: user.id, bookId: books[0].id },
    { rating: 4, comment: 'Very useful', userId: admin.id, bookId: books[0].id },
    { rating: 4, comment: 'Great read', userId: user.id, bookId: books[1].id },
    { rating: 5, comment: 'Amazing!', userId: admin.id, bookId: books[1].id },
    { rating: 5, comment: 'Classic!', userId: admin.id, bookId: books[2].id },
    { rating: 3, comment: 'Pretty good', userId: user.id, bookId: books[3].id },
    { rating: 4, comment: 'Loved it', userId: admin.id, bookId: books[4].id },
  ],
});

// 5 orders
const orders = await Promise.all([
  prisma.order.create({
    data: {
      totalPrice: 99.97,
      status: 'PENDING',
      userId: user.id,
    },
  }),
  prisma.order.create({
    data: {
      totalPrice: 64.96,
      status: 'SHIPPING',
      userId: user.id,
    },
  }),
  prisma.order.create({
    data: {
      totalPrice: 49.98,
      status: 'DELIVERED',
      userId: admin.id,
    },
  }),
  prisma.order.create({
    data: {
      totalPrice: 49.98,
      status: 'PENDING',
      userId: user.id,
    },
  }),
  prisma.order.create({
    data: {
      totalPrice: 79.98,
      status: 'DELIVERED',
      userId: admin.id,
    },
  }),
]);

// 5 orders
await prisma.orderItem.createMany({
  data: [
    { orderId: orders[0].id, bookId: books[0].id, quantity: 1, price: 39.99 },
    { orderId: orders[0].id, bookId: books[1].id, quantity: 2, price: 29.99 },
    { orderId: orders[1].id, bookId: books[2].id, quantity: 1, price: 19.99 },
    { orderId: orders[1].id, bookId: books[3].id, quantity: 3, price: 14.99 },
    { orderId: orders[2].id, bookId: books[4].id, quantity: 2, price: 24.99 },
    { orderId: orders[3].id, bookId: books[1].id, quantity: 1, price: 29.99 },
    { orderId: orders[3].id, bookId: books[2].id, quantity: 1, price: 19.99 },
    { orderId: orders[4].id, bookId: books[0].id, quantity: 2, price: 39.99 },
  ],
});

console.log('Database seeded successfully!');

await prisma.$disconnect();