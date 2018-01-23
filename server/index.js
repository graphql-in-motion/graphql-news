import express from 'express';
import graphqlHTTP from 'express-graphql';
import { MongoClient } from 'mongodb';
import schema from './schema';

const MONGO_URL = 'mongodb://localhost:27017/test';

const start = async () => {
  const app = express();
  await MongoClient.connect(MONGO_URL, { promiseLibrary: Promise })
    .catch(err => console.error(err.stack)) // eslint-disable-line no-console
    .then(client => {
      const res = client.db('test');
      const db = {
        Links: res.collection('links'),
        Users: res.collection('users'),
        Comments: res.collection('comments'),
      };

      const buildOptions = {
        context: { db },
        schema,
        graphiql: true,
      };

      app.use('/graphql', graphqlHTTP(buildOptions));

      app.listen(4000, () => console.log('Running a GraphQL API server at localhost:4000/graphql')); // eslint-disable-line no-console
    });
};

start();
