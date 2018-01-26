import express from 'express';
import graphqlHTTP from 'express-graphql';
import { MongoClient } from 'mongodb';
import jwt from 'express-jwt';

import schema from './schema';
import auth from './utils/auth';
import buildDataloaders from './utils/dataloader';

const MONGO_URL = 'mongodb://localhost:27017/test';

const start = async () => {
  const app = express();
  await MongoClient.connect(MONGO_URL, { promiseLibrary: Promise })
    .catch(err => console.error(err.stack)) // eslint-disable-line no-console
    .then(client => {
      const response = client.db('test');
      const db = {
        Links: response.collection('links'),
        Users: response.collection('users'),
        Comments: response.collection('comments'),
      };

      const buildOptions = async req => {
        const user = await auth(req, db.Users);

        return {
          context: {
            dataloaders: buildDataloaders(db),
            db,
            user,
          },
          schema,
          graphiql: true,
        };
      };

      app.use(
        '/graphql',
        jwt({
          secret: 'token-tyler.reckart@gmail.com',
          requestProperty: 'auth',
          credentialsRequired: false,
        })
      );
      app.use('/graphql', graphqlHTTP(buildOptions));

      app.listen(4000, () => console.log('Running a GraphQL API server at localhost:4000/graphql')); // eslint-disable-line no-console
    });
};

start();
