import express from 'express';
import jwt from 'express-jwt';
import bodyParser from 'body-parser';
import graphqlHTTP from 'graphql-in-motion_express-graphql';
import cors from 'cors';
import expressPlayground from 'graphql-playground-middleware-express';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { MongoClient } from 'mongodb';
// Schema
import schema from './schema';
// Local utility files
import buildDataloaders from './utils/dataloader';

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;
const WS_PORT = process.env.WS_PORT || 4040;
const MONGO_URL = process.env.MONGO_URL; // eslint-disable-line prefer-destructuring

const mongoInit = async () => {
  let col;

  await MongoClient.connect(MONGO_URL, { promiseLibrary: Promise, useNewUrlParser: true })
    .catch(err => console.error(err.stack))
    .then(client => {
      // Configure the server
      const response = client.db(process.env.MONGO_DB);
      // Reference the database
      col = {
        Links: response.collection('links'),
        Users: response.collection('users'),
        Comments: response.collection('comments'),
      };
    });

  return col;
};

const runSubscriptionServer = async () => {
  const db = await mongoInit();

  // Create WebSocket listener server
  const websocketServer = createServer(app);

  websocketServer.listen(WS_PORT, () =>
    console.log(`Websocket Server is now running on ws://localhost:${WS_PORT}/subscriptions`)
  );

  // eslint-disable-next-line no-new
  new SubscriptionServer(
    {
      onConnect: () => console.log('Websocket connection established'),
      onDisconnect: () => console.log('Websocket connection terminated'),
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
};

runSubscriptionServer();

const buildOptions = async req => {
  const db = await mongoInit();

  return {
    context: {
      dataloaders: buildDataloaders(db),
      db,
      user: req.user,
    },
    schema,
    graphiql: false,
    subscriptionsEndpoint: `ws://localhost:${WS_PORT}/subscriptions`,
  };
};

app.use(bodyParser.json());
app.use(
  jwt({
    secret: process.env.JWT_SECRET,
    credentialsRequired: false,
  })
);
app.use('/v1', cors(), graphqlHTTP(buildOptions));
app.get('/graphql', expressPlayground({ endpoint: '/v1' }));

if (process.env.TARGET === 'now') {
  module.exports = app;
} else {
  app.listen(PORT, () => {
    console.log(`Running a GraphQL API server at localhost:${PORT}/graphql`);
  });
}
