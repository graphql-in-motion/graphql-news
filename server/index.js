import express from 'express';
import graphqlHTTP from 'graphql-in-motion_express-graphql';
import { MongoClient } from 'mongodb';
import jwt from 'express-jwt';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import cors from 'cors';
// Schema
import schema from './schema';
// Local utility files
import auth from './utils/auth';
import buildDataloaders from './utils/dataloader';

// Global constants
const MONGO_URL = 'mongodb://localhost:27017/test';
const PORT = 4000;
const WS_PORT = 4040;

const start = async () => {
  const app = express();

  await MongoClient.connect(MONGO_URL, { promiseLibrary: Promise })
    .catch(err => console.error(err.stack)) // eslint-disable-line no-console
    .then(client => {
      // Configure the server
      const response = client.db('test');
      // Reference the database
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
          subscriptionsEndpoint: `ws://localhost:${WS_PORT}/subscriptions`,
        };
      };

      app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header(
          'Access-Control-Allow-Headers',
          'Origin, X-Requested-With, Content-Type, Accept'
        );
        next();
      });

      app.use(
        '/graphql',
        jwt({
          secret: 'token-example@gmail.com',
          requestProperty: 'auth',
          credentialsRequired: false,
        })
      );
      app.use('/graphql', cors(), graphqlHTTP(buildOptions));

      app.listen(PORT, () => {
        console.log(`Running a GraphQL API server at localhost:${PORT}/graphql`); // eslint-disable-line no-console
      });

      // Create WebSocket listener server
      const websocketServer = createServer(app);

      // Bind it to port and start listening
      websocketServer.listen(
        WS_PORT,
        () =>
          console.log(`Websocket Server is now running on ws://localhost:${WS_PORT}/subscriptions`) // eslint-disable-line no-console
      );

      // eslint-disable-next-line no-new
      new SubscriptionServer(
        {
          onConnect: () => console.log('Websocket connection established'), // eslint-disable-line no-console
          onDisconnect: () => console.log('Websocket connection terminated'), // eslint-disable-line no-console
          schema,
          execute,
          subscribe,
          // eslint-disable-next-line no-unused-vars
          onOperation: (message, params, webSocket) =>
            Object.assign(params, { context: { db, dataloaders: buildDataloaders(db) } }),
        },
        {
          server: websocketServer,
          path: '/subscriptions',
        }
      );
    });
};

start();
