export const resolvers = {
  Mutation: {
    storeUser: (_, { user }, { cache }) => {
      const data = { User: user, __typename: 'User' };
      cache.writeData({ data });
    },
  },
};
