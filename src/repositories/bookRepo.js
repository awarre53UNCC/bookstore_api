import prisma from '../config/db.js';

export async function getAll({ search, category, author, sortBy, order, offset, limit }) {
  let where = {};
  // console.log({ search, category, author })
  if (search) {
    where.title = {
      contains: search,
      mode: 'insensitive',
    };
  }

  if (category) {
    where.bookCategories = {
      some: {
        category: {
          categoryName: {
            contains: category,
            mode: 'insensitive',
          },
        },
      },
    };
  }

  if (author) {
    where.bookAuthors = {
      some: {
        author: {
          fullName: {
            contains: author,
            mode: 'insensitive',
          },
        },
      },
    };
  }

  const books = await prisma.book.findMany({
    where,
    orderBy: { [sortBy]: order },
    take: limit,
    skip: offset,
  });
  // console.log(books)

  let finalBooks = [];

  for (let i = 0; i < books.length; i++) {

    //Author
    const bookAuthors = await prisma.bookAuthor.findMany({ where: {bookId: books[i].id}})
    let authors = [];
    for (let i = 0; i < bookAuthors.length; i++) {
      authors[i] = await prisma.author.findUnique({ where: {id: bookAuthors[i].authorId}})
    }

    //Category
    const bookCategories = await prisma.bookCategory.findMany({ where: {bookId: books[i].id}})
    let categories = [];
    for (let i = 0; i < bookCategories.length; i++) {
      categories[i] = await prisma.category.findUnique({ where: {id: bookCategories[i].categoryId}})
    }
    // console.log(authors);
    // console.log(categories);

    const finalBook = {
      id: books[i].id,
      title: books[i].title,
      price: books[i].price,
      stock: books[i].stock,
      publicationYear: books[i].publicationYear,
      authors: authors,
      categories: categories,
    }
    finalBooks[i] = finalBook;
  }
  // console.log(finalBooks);

  return finalBooks;
}

export async function getById(id) {
  const book = await prisma.book.findUnique({ where: { id } });

  if (!book) {
    return null;
  }
  
  const bookAuthors = await prisma.bookAuthor.findMany({ where: {bookId: id}})
  let authors = [];
  for (let i = 0; i < bookAuthors.length; i++) {
    authors[i] = await prisma.author.findUnique({ where: {id: bookAuthors[i].authorId}})
  }
  // console.log(bookAuthors);
  // console.log(authors);

  const bookCategories = await prisma.bookCategory.findMany({ where: {bookId: id}})
  let categories = [];
  for (let i = 0; i < bookCategories.length; i++) {
    categories[i] = await prisma.category.findUnique({ where: {id: bookCategories[i].categoryId}})
  }
  // console.log(bookCategories);
  // console.log(categories);

  const finalBook = {
    id: book.id,
    title: book.title,
    price: book.price,
    stock: book.stock,
    publicationYear: book.publicationYear,
    authors: authors,
    categories: categories,
  }

  // console.log(finalBook);
  return finalBook;
}

export async function create({ title, price, stock, publicationYear, authorIds, categoryIds}) {

  const newBook = await prisma.book.create({
    data: {
      title,
      price,
      stock,
      publicationYear,
      // bookCategories: categoryIds,
      // bookAuthors: authorIds,
    }
  });


  //checks

  if (authorIds == null && categoryIds == null) {
    const error = new Error(`Bad request: authorIds & categoryIds invalid/notFound`);
    error.status = 400;
    throw error;
  }
  if (authorIds == null) {
    const error = new Error(`Bad request: authorIds invalid/notFound`);
    error.status = 400;
    throw error;
  }
  if (categoryIds == null) {
    const error = new Error(`Bad request: categoryIds invalid/notFound`);
    error.status = 400;
    throw error;
  }

  const authorsCheck = await prisma.author.findMany({});
  const categoriesCheck = await prisma.category.findMany({});

  let authorFlag = false;

  for (let i = 0; i < authorIds.length; i++) {
    if (authorsCheck.length < authorIds[i]) {
      authorFlag = true;
      break;
    }
  }

  let categoryFlag = false;

  for (let i = 0; i < categoryIds.length; i++) {
    if (categoriesCheck.length < categoryIds[i]) {
      categoryFlag = true;
      break;
    }
  }
  if (authorFlag && categoryFlag) {
    const error = new Error(`Bad request: authorIds & categoryIds invalid/notFound`);
    error.status = 400;
    throw error;
  }
  if (authorFlag) {
    const error = new Error(`Bad request: authorIds invalid/notFound`);
    error.status = 400;
    throw error;
  }
  if (categoryFlag) {
    const error = new Error(`Bad request: categoryId(s) invalid/notFound`);
    error.status = 400;
    throw error;
  }


  // end checks

  const categoryData = categoryIds.map(id => ({
    bookId: newBook.id,
    categoryId: id,
  }));
  const authorData = authorIds.map(id => ({
    bookId: newBook.id,
    authorId: id,
  }));
  await prisma.bookCategory.createMany({ data: categoryData });
  await prisma.bookAuthor.createMany({ data: authorData });

  const bookAuthors = await prisma.bookAuthor.findMany({ where: {bookId: newBook.id}})
  let authors = [];
  for (let i = 0; i < bookAuthors.length; i++) {
    authors[i] = await prisma.author.findUnique({ where: {id: bookAuthors[i].authorId}})
  }
  // console.log(bookAuthors);
  // console.log(authors);

  const bookCategories = await prisma.bookCategory.findMany({ where: {bookId: newBook.id}})
  let categories = [];
  for (let i = 0; i < bookCategories.length; i++) {
    categories[i] = await prisma.category.findUnique({ where: {id: bookCategories[i].categoryId}})
  }
  // console.log(bookCategories);
  // console.log(categories);

  const finalBook = {
    id: newBook.id,
    title: newBook.title,
    price: newBook.price,
    stock: newBook.stock,
    publicationYear: newBook.publicationYear,
    authors: authors,
    categories: categories,
  }
  return finalBook;
}

export async function update(id, updatedData) {
  try {
    const updatedBook = await prisma.book.update({
      where: { id },
      data: updatedData,
    });
    const bookAuthors = await prisma.bookAuthor.findMany({ where: {bookId: updatedBook.id}})
    let authors = [];
    for (let i = 0; i < bookAuthors.length; i++) {
      authors[i] = await prisma.author.findUnique({ where: {id: bookAuthors[i].authorId}})
    }
    

    const bookCategories = await prisma.bookCategory.findMany({ where: {bookId: updatedBook.id}})
    let categories = [];
    for (let i = 0; i < bookCategories.length; i++) {
      categories[i] = await prisma.category.findUnique({ where: {id: bookCategories[i].categoryId}})
    }


    const finalBook = {
      id: updatedBook.id,
      title: updatedBook.title,
      price: updatedBook.price,
      stock: updatedBook.stock,
      publicationYear: updatedBook.publicationYear,
      authors: authors,
      categories: categories,
    }
    return finalBook;
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

export async function createCategory({ name }) {
  const createdCategory = await prisma.category.create({
    data: {
      categoryName: name
    }
  });
  return createdCategory;
}

export async function createAuthor({ name }) {
  const createdAuthor = await prisma.author.create({
    data: {
      fullName: name
    }
  });
  return createdAuthor;
}

export async function getAllCategories() {
  const categories = await prisma.category.findMany();
  // console.log(categories);
  return categories;
}

export async function getAllAuthors() {
  const authors = await prisma.author.findMany();
  // console.log(categories);
  return authors;
}