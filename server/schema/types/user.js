import { GraphQLID, GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    // _id should *never* be null
    _id: { type: new GraphQLNonNull(GraphQLID) },
    // No empty usernames
    username: { type: new GraphQLNonNull(GraphQLString) },
    about: { type: GraphQLString },
  }),
});

export default UserType;
