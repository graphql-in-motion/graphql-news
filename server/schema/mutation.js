/* globals fetch */
import { GraphQLID, GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import 'isomorphic-fetch';

import LinkType from './types/link';
import UserType from './types/user';
import CommentType from './types/comment';
import { AuthProvider, SignInPayload } from './types/auth';

const pubsub = new PubSub();

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createComment: {
      type: CommentType,
      args: {
        // Comments must have a parent link
        link: { type: new GraphQLNonNull(GraphQLID) },
        parent: { type: GraphQLID },
        // No empty comments
        content: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, data, { db: { Comments }, user }) => {
        if (!user) {
          throw new Error('You must be logged in to comment');
        }

        const response = await Comments.insert(data);

        return Object.assign({ _id: response.insertedIds[0] }, data);
      },
    },
    createLink: {
      type: LinkType,
      args: {
        url: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { url }, { db: { Links }, user }) => {
        if (!user) {
          throw new Error('You must be logged in to vote');
        }

        let linkTitle;

        const getTitle = async qs =>
          await fetch(`https://mercury.postlight.com/parser?url=${qs}`, {
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': 'cHI79Z6O2dAzC5HhruDfYpbgyhlo3VFVMUe87CKF',
            },
          })
            .then(response => response.json())
            .then(response => {
              const { title } = response;

              linkTitle = title;
            });

        await getTitle(url);

        const link = {
          author: user._id,
          created_at: Date.now().toString(),
          score: 0,
          comments: [],
          description: linkTitle,
          url,
        };

        const response = await Links.insert(link);

        return Object.assign({ _id: response.insertedIds[0] }, link);
      },
    },
    createUser: {
      type: UserType,
      args: {
        // No empty usernames
        username: { type: new GraphQLNonNull(GraphQLString) },
        // We can't create a user without the proper credentials
        provider: { type: new GraphQLNonNull(AuthProvider) },
      },
      resolve: async (_, { username, provider }, { db: { Users } }) => {
        const hash = await bcrypt.hash(provider.password, 10);

        const newUser = {
          username,
          email: provider.email,
          password: hash,
        };
        const response = await Users.insert(newUser);

        return Object.assign({ _id: response.insertedIds[0] }, newUser);
      },
    },
    signInUser: {
      type: SignInPayload,
      args: {
        // We can't sign in a user w/o credentials
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { email, password }, { db: { Users } }) => {
        const user = await Users.findOne({ email });

        if (!user) {
          throw new Error('No user exists with that email address.');
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
          throw new Error('Incorrect password. Please try again.');
        }

        const token = jsonwebtoken.sign(
          {
            id: user._id,
            email: user.email,
          },
          'superdupersecret',
          { expiresIn: '3w' }
        );

        return { token, user };
      },
    },
    upvoteLink: {
      type: LinkType,
      args: {
        // We can't vote on a link w/o its ID
        _id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, { _id }, { user, db: { Links } }) => {
        if (!user) {
          throw new Error('You must be logged in to vote');
        }

        const link = await Links.findOneAndUpdate({ _id: ObjectId(_id) }, { $inc: { score: 1 } });

        const { score } = link.value;

        pubsub.publish('linkVoted', { 'linkVoted': { _id, score: score + 1 } }); // eslint-disable-line prettier/prettier

        return Links.findOne(ObjectId(_id));
      },
    },
    downvoteLink: {
      type: LinkType,
      args: {
        _id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, { _id }, { user, db: { Links } }) => {
        if (!user) {
          throw new Error('You must be logged in to vote');
        }

        const link = await Links.findOneAndUpdate({ _id: ObjectId(_id) }, { $inc: { score: -1 } });

        const { score } = link.value;

        pubsub.publish('linkVoted', { 'linkVoted': { _id, score: score - 1 } }); // eslint-disable-line prettier/prettier

        return Links.findOne(ObjectId(_id));
      },
    },
  }),
});

export default MutationType;
