import { GraphQLSchema } from 'graphql';
import QueryType from './query';
import MutationType from './mutation';
import SubscriptionType from './subscription';

const graphQLSchemaConfig = {
  query: QueryType,
  mutation: MutationType,
  subscription: SubscriptionType,
};

const schema = new GraphQLSchema(graphQLSchemaConfig);

export default schema;
