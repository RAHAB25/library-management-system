import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const catalog: Record<string, [string, string][]> = {
  Fiction: [
    ['To Kill a Mockingbird', 'Harper Lee'],
    ['1984', 'George Orwell'],
    ['The Great Gatsby', 'F. Scott Fitzgerald'],
    ['Pride and Prejudice', 'Jane Austen'],
  ],
  Science: [
    ['A Brief History of Time', 'Stephen Hawking'],
    ['Cosmos', 'Carl Sagan'],
    ['The Selfish Gene', 'Richard Dawkins'],
    ['Silent Spring', 'Rachel Carson'],
  ],
  Technology: [
    ['Clean Code', 'Robert C. Martin'],
    ['The Pragmatic Programmer', 'Andrew Hunt and David Thomas'],
    ['Introduction to Algorithms', 'Thomas H. Cormen'],
    ['Designing Data-Intensive Applications', 'Martin Kleppmann'],
  ],
  History: [
    ['Sapiens', 'Yuval Noah Harari'],
    ['Guns, Germs, and Steel', 'Jared Diamond'],
    ['The Diary of a Young Girl', 'Anne Frank'],
    ["A People's History of the United States", 'Howard Zinn'],
  ],
};

async function main() {
  let n = 1;

  for (const [genreName, books] of Object.entries(catalog)) {
    const genre = await prisma.genre.upsert({
      where: { name: genreName },
      update: {},
      create: { name: genreName },
    });

    for (const [title, author] of books) {
      const isbn = `978-0-000-${String(n++).padStart(4, '0')}`; // sample ISBN
      await prisma.book.upsert({
        where: { isbn },
        update: {},
        create: { title, author, isbn, copies: 3, genreId: genre.id },
      });
    }
  }

  await prisma.user.upsert({
    where: { email: 'librarian@example.com' },
    update: {},
    create: {
      name: 'Sample Librarian',
      email: 'librarian@example.com',
      role: 'LIBRARIAN',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());