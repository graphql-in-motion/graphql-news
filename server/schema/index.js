import { GraphQLInt, GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList } from 'graphql';
import { find } from 'lodash';

const links = [
  {
    id: 0,
    author: 0,
    score: 5,
    url: 'https://google.com/',
    description: 'Google',
    comments: [0, 4],
  },
  {
    id: 1,
    author: 1,
    score: 10,
    url: 'https://facebook.com/',
    description: 'Facebook',
    comments: null,
  },
];

const users = [
  { id: 0, username: 'user1', about: 'The first user' },
  { id: 1, username: 'user2', about: 'The second user' },
  { id: 2, username: 'user3', about: 'The third user' },
];

const commentsList = [
  { id: 0, parent: null, author: 0, content: 'Comment 1' },
  { id: 1, parent: 0, author: 1, content: 'Comment 2' },
  { id: 2, parent: 1, author: 0, content: 'Comment 3' },
  { id: 3, parent: 0, author: 2, content: 'Comment 4' },
  { id: 4, parent: null, author: 2, content: 'Comment 5' },
];

const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLInt },
    username: { type: GraphQLString },
    about: { type: GraphQLString },
  }),
});

function getComments(commentID) {
  const comments = commentsList.filter(comment => comment.parent === commentID);
  if (comments.length > 0) {
    return comments;
  }
  return null;
}

const commentsType = new GraphQLObjectType({
  name: 'Comments',
  fields: () => ({
    id: { type: GraphQLInt },
    parent: { type: commentsType },
    comments: {
      type: new GraphQLList(commentsType),
      args: {
        id: { type: GraphQLInt },
      },
      resolve: ({ id }) => getComments(id),
    },
    author: {
      type: userType,
      args: {
        author: { type: GraphQLInt },
      },
      resolve: ({ author }) => find(users, { id: author }),
    },
    content: { type: GraphQLString },
  }),
});

const linkType = new GraphQLObjectType({
  name: 'Link',
  fields: () => ({
    id: { type: GraphQLInt },
    url: { type: GraphQLString },
    description: { type: GraphQLString },
    author: {
      type: userType,
      args: {
        author: { type: GraphQLInt },
      },
      resolve: ({ author }) => find(users, { id: author }),
    },
    comments: {
      type: new GraphQLList(commentsType),
      resolve: ({ comments }) => comments.map(i => find(commentsList, { id: i })),
    },
    score: { type: GraphQLInt },
  }),
});

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    allLinks: {
      type: new GraphQLList(linkType),
      resolve: () => links,
    },
    link: {
      type: linkType,
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (_, { id }) => find(links, { id }),
    },
    allUsers: {
      type: new GraphQLList(userType),
      resolve: () => users,
    },
    user: {
      type: userType,
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (_, { id }) => find(users, { id }),
    },
  }),
});

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    upvoteLink: {
      type: linkType,
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (_, { id }) => {
        const link = find(links, { id });
        if (!link) {
          throw new Error(`Couldn't find link with id ${id}`);
        }
        link.score += 1;
        return link;
      },
    },
    downvoteLink: {
      type: linkType,
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (_, { id }) => {
        const link = find(links, { id });
        if (!link) {
          throw new Error(`Couldn't find link with id ${id}`);
        }
        link.score -= 1;
        return link;
      },
    },
  }),
});

const graphQLSchemaConfig = {
  query: queryType,
  mutation: mutationType,
};

const schema = new GraphQLSchema(graphQLSchemaConfig);

export default schema;
