import { PrismaClient, Role, Tag, PaymentStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const categories = [
    'Fiction',
    'Non-Fiction',
    'Science Fiction',
    'Fantasy',
    'Biography',
    'Mystery',
    'Thriller',
    'Romance',
    'Historical',
    'Self-Help',
  ];
  const categoryPromises = categories.map((name) => {
    return prisma.category.create({
      data: { name },
    });
  });
  const categoryResults = await Promise.all(categoryPromises);

  // Create authors
  const authors = [
    { name: 'Author One' },
    { name: 'Author Two' },
    { name: 'Author Three' },
    { name: 'Author Four' },
    { name: 'Author Five' },
  ];
  const authorPromises = authors.map((author) => {
    return prisma.author.create({
      data: author,
    });
  });
  const authorResults = await Promise.all(authorPromises);

  // Create publishers
  const publishers = [
    { name: 'Publisher One' },
    { name: 'Publisher Two' },
    { name: 'Publisher Three' },
  ];
  const publisherPromises = publishers.map((publisher) => {
    return prisma.publisher.create({
      data: publisher,
    });
  });
  const publisherResults = await Promise.all(publisherPromises);

  // Create product inventories
  const productInventories = Array.from({ length: 20 }).map((_, index) => {
    return prisma.productInventory.create({
      data: { quantity: 100 + index },
    });
  });
  const productInventoryResults = await Promise.all(productInventories);

  // Create books
  const books = Array.from({ length: 20 }).map((_, index) => {
    return prisma.book.create({
      data: {
        title: `Book Title ${index + 1}`,
        description: `Description for book ${index + 1}`,
        language: 'English',
        pages: 100 + index,
        publishedDate: new Date(2020, index % 12, (index % 28) + 1),
        price: 9.99 + index,
        coverImage: `coverImage${index + 1}.jpg`,
        categoryId: categoryResults[index % categoryResults.length].id,
        publisherId: publisherResults[index % publisherResults.length].id,
        productInventoryId: productInventoryResults[index].id,
        authors: {
          create: {
            author: {
              connect: {
                id: authorResults[index % authorResults.length].id,
              },
            },
          },
        },
        tag:
          index % 4 === 0
            ? Tag.NEW
            : index % 4 === 1
            ? Tag.BESTSELLER
            : index % 4 === 2
            ? Tag.INCOMING
            : Tag.DISCOUNT,
      },
    });
  });
  await Promise.all(books);

  // Create users
  const users = [
    {
      email: 'user1@example.com',
      password: 'password1',
      role: Role.USER,
      address: {
        create: {
          firstName: 'User',
          lastName: 'One',
          phone: '1234567890',
          city: 'City1',
          postcode: '111111',
          street: 'Street1',
          houseNumber: '1',
          homeNumber: '1A',
        },
      },
    },
    {
      email: 'user2@example.com',
      password: 'password2',
      role: Role.USER,
      address: {
        create: {
          firstName: 'User',
          lastName: 'Two',
          phone: '0987654321',
          city: 'City2',
          postcode: '222222',
          street: 'Street2',
          houseNumber: '2',
          homeNumber: '2B',
        },
      },
    },
  ];
  const userPromises = users.map((user) => {
    return prisma.user.create({
      data: user,
    });
  });
  await Promise.all(userPromises);

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
