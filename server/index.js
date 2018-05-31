import express from 'express';
import graphqlHTTP from 'express-graphql';
import { MongoClient } from 'mongodb';
import jwt from 'express-jwt';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';

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
          subscriptionsEndpoint: subscriptionServer, // eslint-disable-line no-use-before-define
        };
      };

      app.use(
        '/graphql',
        jwt({
          secret: 'token-example@gmail.com',
          requestProperty: 'auth',
          credentialsRequired: false,
        })
      );
      app.use('/graphql', graphqlHTTP(buildOptions));

      app.listen(4000, () => {
        console.log('Running a GraphQL API server at localhost:4000/graphql'); // eslint-disable-line no-console
      });

      const WS_PORT = 4040;

      // Create WebSocket listener server
      const websocketServer = createServer(app);

      // Bind it to port and start listening
      websocketServer.listen(
        WS_PORT,
        () => console.log(`Websocket Server is now running on http://localhost:${WS_PORT}`) // eslint-disable-line no-console
      );

      const subscriptionServer = SubscriptionServer.create(
        {
          schema,
          execute,
          subscribe,
        },
        {
          server: websocketServer,
          path: '/subscriptions',
        }
      );
    });
};

start();
