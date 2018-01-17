import express from 'express';
import graphqlHTTP from 'express-graphql';
import { makeExecutableSchema } from 'graphql-tools';
import { find } from 'lodash';

// Construct a schema, using GraphQL schema language
const typeDefs = `
  type Link {
    id: Int! @unique
    url: String!
    description: String
  }

  type User {
    id: Int! @unique
    username: String!
    about: String!
  }

  type Query {
    allLinks: [Link]
    link(id: Int!): Link
    allUsers: [User]
    user(id: Int!): User
  }
`;

const links = [
  { id: 0, url: 'https://google.com/', description: 'Google' },
  { id: 1, url: 'https://facebook.com/', description: 'Facebook' },
];

const users = [
  { id: 0, username: 'user1', about: 'The first user' },
  { id: 1, username: 'user2', about: 'The second user' },
];

const resolvers = {
  Query: {
    allLinks: () => links,
    link: (obj, args, context, info) => find(links, { id: args.id }), // eslint-disable-line no-unused-vars
    allUsers: () => users,
    user: (obj, args, context, info) => find(users, { id: args.id }), // eslint-disable-line no-unused-vars
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();

app.use('/graphql', graphqlHTTP({ schema, graphiql: true }));

app.listen(4000, () => console.log('Running a GraphQL API server at localhost:4000/graphql')); // eslint-disable-line no-console
