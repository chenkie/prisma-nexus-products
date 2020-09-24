import { PrismaClient } from '@prisma/client';
import {
  queryType,
  mutationType,
  stringArg,
  makeSchema,
  objectType,
  intArg
} from '@nexus/schema';
import { ApolloServer } from 'apollo-server';

const prisma = new PrismaClient();

const Category = objectType({
  name: 'Category',
  definition(t) {
    t.id('id');
    t.string('name');
    t.list.field('products', {
      type: 'Product',
      resolve: (parent) => {
        return prisma.product.findMany({
          where: {
            categories: {
              some: {
                id: parent.id
              }
            }
          }
        });
      }
    });
  }
});

const Review = objectType({
  name: 'Review',
  definition(t) {
    t.id('id');
    t.string('title');
    t.string('body');
  }
});

const Product = objectType({
  name: 'Product',
  definition(t) {
    t.id('id');
    t.string('name');
    t.string('description');
    t.int('price');
    t.string('sku');
    t.list.field('reviews', {
      type: 'Review',
      resolve: (parent, args, context) => {
        return prisma.review.findMany({
          where: {
            productId: parent.id
          }
        });
      }
    });
    t.list.field('categories', {
      type: 'Category',
      resolve: (parent, args, context) => {
        return prisma.category.findMany({
          where: {
            products: {
              every: {
                id: parent.id
              }
            }
          }
        });
      }
    });
  }
});

const Query = queryType({
  definition(t) {
    t.list.field('products', {
      type: 'Product',
      resolve: (parent, args, context) => {
        return prisma.product.findMany();
      }
    });
    t.list.field('reviews', {
      type: 'Review',
      resolve: () => {
        return prisma.review.findMany();
      }
    });
    t.list.field('categories', {
      type: 'Category',
      resolve: () => {
        return prisma.category.findMany();
      }
    });
  }
});

const Mutation = mutationType({
  definition(t) {
    t.field('createProduct', {
      type: 'Product',
      args: {
        name: stringArg({ nullable: false }),
        description: stringArg({ nullable: false }),
        price: intArg({ nullable: false }),
        sku: stringArg({ nullable: false })
      },
      resolve: (parent, args, context) => {
        return prisma.product.create({ data: args });
      }
    });
    t.field('createReview', {
      type: 'Review',
      args: {
        title: stringArg({ nullable: false }),
        body: stringArg({ nullable: false }),
        productId: stringArg({ nullable: false })
      },
      resolve: (_, { title, body, productId }) => {
        return prisma.review.create({
          data: {
            title,
            body,
            product: {
              connect: {
                id: productId
              }
            }
          }
        });
      }
    });
    t.field('createCategory', {
      type: 'Category',
      args: {
        name: stringArg({ nullable: false })
      },
      resolve: (_, { name }) => {
        return prisma.category.create({
          data: {
            name
          }
        });
      }
    });
    t.field('categorizeProduct', {
      type: 'Product',
      args: {
        productId: stringArg({ nullable: false }),
        categoryId: stringArg({ nullable: false })
      },
      resolve: (_, { productId, categoryId }) => {
        return prisma.product.update({
          where: {
            id: productId
          },
          data: {
            categories: {
              connect: {
                id: categoryId
              }
            }
          }
        });
      }
    });
  }
});

const schema = makeSchema({
  types: [Product, Review, Category, Query, Mutation],
  outputs: {
    schema: __dirname + '/generated/schema.graphql',
    typegen: __dirname + '/generated/typings.ts'
  }
});

const server: ApolloServer = new ApolloServer({
  schema
});

server.listen().then(({ port }) => {
  console.log(
    `Server listening on http://localhost:${port}`
  );
});
