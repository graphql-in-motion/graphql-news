import express from 'express';
import path from 'path';
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
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/graphql-news';
const MONGO_DB = process.env.MONGO_DB || 'graphql-news';
const JWT_SECRET = process.env.JWT_SECRET || 'superdupersecret';

const connectDB = async () => {
  let col;

  await MongoClient.connect(MONGO_URL, { promiseLibrary: Promise, useNewUrlParser: true })
    .catch(err => console.error(err.stack))
    .then(client => {
      // Configure the server
      const response = client.db(MONGO_DB);
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
  const db = await connectDB();

  // Create WebSocket listener server
  const websocketServer = createServer(app);

  websocketServer.listen(WS_PORT, () =>
    console.log(`Websocket Server is now running on ws://localhost:${WS_PORT}/api/subscriptions`)
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
      path: '/api/subscriptions',
    }
  );
};

runSubscriptionServer();

const buildOptions = async req => {
  const db = await connectDB();

  return {
    context: {
      dataloaders: buildDataloaders(db),
      db,
      user: req.user,
    },
    schema,
    graphiql: true,
  };
};

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../../build')));
app.use(bodyParser.json());
app.use(
  jwt({
    secret: JWT_SECRET,
    credentialsRequired: false,
  })
);
app.use('/api/v1', cors(), graphqlHTTP(buildOptions));
app.get('/api/graphql', expressPlayground({ endpoint: '/api/v1' }));
// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../build/index.html'));
});
app.listen(PORT, () => {
  console.log(`Running a GraphQL API server at localhost:${PORT}/graphql`);
});
