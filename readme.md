# Prisma Nexus Products API

👋 Welcome!

This repo contains a GraphQL API build with Nexus backed by a SQLite database modeled and accessed using Prisma.

## Download and Install

Clone the repository and install dependencies:

```bash
npm install
```

## Run the Migrations

There is a file called `schema.prisma` found in the `prisma` directory. This is the definition for the database model. To create the tables for the database, we need to run migrations.

Start by saving a new migration.

```bash
npx prisma migrate save --experimental
```

Then run the migartion to create the tables.

```bash
npx prisma migrate up --experimental
```

Then generate the Prisma types for the data model.

```bash
npx prisma generate
```

## Run the App

The API is built using Nexus with TypeScript and uses `ts-node-dev` for development. There is a script in `package.json` that runs the app in development mode.

```bash
npm run dev
```

## The Database

This repo uses SQLite, a file-system database that is great for development and proof-of-concept work but is not well-suited to production. The data that we create and read here is found in the file called `dev.db` in the `prisma` directory. You are free to use a different database such as MySQL or Postgres if you like. To do so, adjust the `datasource` configuration in the `schema.prisma` file.

## License

MIT
