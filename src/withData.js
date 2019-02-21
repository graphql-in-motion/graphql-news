export const initialState = {
  user: {
    __typename: 'User',
    _id: null,
    about: null,
    comments: [],
    created_at: null,
    links: [],
    username: null
  },
};

export const resolvers = {
  Mutation: {
    storeUser: (_, { user }, { cache }) => {
      const data = { user, __typename: 'User' };
      cache.writeData({ data });
    },
  }
}
