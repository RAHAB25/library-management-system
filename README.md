# Library Management System

A library management API built with NestJS, Prisma and PostgreSQL.

## Getting Started

1. `cd api`
2. Copy `.env.example` to `.env` and fill in your database credentials
3. `npm install`
4. `npx prisma migrate dev`
5. `npx prisma db seed`
6. `npm run start:dev`

## Schema Decisions

**Why Book references Genre instead of embedding it**

Each Book stores a `genreId` foreign key pointing to a row in the Genre table,
rather than copying the genre's name into every book.

- **One source of truth:** a genre's name lives in one place. Renaming
  "Science" to "Natural Science" is a single update, not an edit to every book.
- **No inconsistent data:** embedding the genre as free text would allow
  typos and variants such as "Sci-Fi", "scifi" and "Science Fiction".
- **Referential integrity:** the foreign key means a book cannot point to a
  genre that doesn't exist.
- **Easy queries:** listing all books in a genre, or counting books per
  genre, is a simple relational query.

A genre has many books, but each book belongs to one genre, so this is a
one-to-many relationship, which relational databases like PostgreSQL model
with a foreign key on the "many" side.