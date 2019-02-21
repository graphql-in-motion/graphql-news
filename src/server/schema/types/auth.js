import { GraphQLObjectType, GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql';

import UserType from './user';

export const AuthProvider = new GraphQLInputObjectType({
  name: 'AuthProvider',
  fields: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export const SignInPayload = new GraphQLObjectType({
  name: 'SignInPayload',
  fields: {
    token: { type: new GraphQLNonNull(GraphQLString) },
    user: { type: new GraphQLNonNull(UserType) },
  },
});
