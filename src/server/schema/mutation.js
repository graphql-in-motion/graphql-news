import { GraphQLID, GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import 'isomorphic-fetch';
import moment from 'moment';
import Mercury from '@postlight/mercury-parser';
import { AuthenticationError, UserInputError } from 'apollo-server';

import LinkType from './types/link';
import UserType from './types/user';
import CommentType from './types/comment';
import { AuthProvider, SignInPayload } from './types/auth';
import { LINK_VOTED, COMMENT_CREATED, pubsub } from '../constants';

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createComment: {
      type: CommentType,
      args: {
        link: { type: new GraphQLNonNull(GraphQLID) },
        parent: { type: GraphQLID },
        content: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, data, { db: { Comments }, user }) => {
        if (!user) {
          throw new Error('You must be logged in to comment');
        }

        const { link, content, parent } = data;

        const comment = {
          author: ObjectId(user.id),
          comments: [],
          content,
          created_at: moment(Date.now()).format('{YYYY} MM-DDTHH:mm:ss SSS [Z] A'),
          link: ObjectId(link),
          parent: parent ? ObjectId(parent) : null,
        };

        const response = await Comments.insert(comment);

        const commentObj = Object.assign({ _id: response.insertedIds[0] }, comment);

        pubsub.publish(COMMENT_CREATED, { commentCreated: commentObj });
        console.log(pubsub.publish(COMMENT_CREATED, { commentCreated: commentObj }));

        return commentObj;
      },
    },
    createLink: {
      type: LinkType,
      args: {
        url: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { url }, { db: { Links }, user }) => {
        if (!user) {
          throw new Error('You must be logged in to submit links');
        }

        let linkTitle;

        const getTitle = async qs =>
          await Mercury.parse(qs).then(response => {
            const { title } = response;

            linkTitle = title;
          });

        await getTitle(url);

        const link = {
          author: user.id,
          created_at: moment(Date.now()).format('{YYYY} MM-DDTHH:mm:ss SSS [Z] A'),
          score: 0,
          comments: [],
          description: linkTitle,
          url,
        };

        const response = await Links.insert(link);

        return Object.assign({ _id: response.insertedIds[0] }, link);
      },
    },
    destroyLink: {
      type: LinkType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, { id }, { db: { Links }, user }) => {
        if (!user) {
          throw new Error('You must be logged in to remove a link');
        }

        const link = await Links.findOne(ObjectId(id));

        if (!link) {
          throw new Error('Link does not exist');
        }

        const response = await Links.deleteOne({ _id: ObjectId(id) });

        if (response.deletedCount === 1) {
          return link;
        }

        throw new Error('Link could not be destroyed');
      },
    },
    createUser: {
      type: UserType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        provider: { type: new GraphQLNonNull(AuthProvider) },
      },
      resolve: async (_, { username, provider }, { db: { Users } }) => {
        const hash = await bcrypt.hash(provider.password, 10);

        const newUser = {
          username,
          email: provider.email,
          password: hash,
          created_at: moment(Date.now()).format('{YYYY} MM-DDTHH:mm:ss SSS [Z] A'),
        };
        const response = await Users.insert(newUser);

        return Object.assign({ _id: response.insertedIds[0] }, newUser);
      },
    },
    signInUser: {
      type: SignInPayload,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { email, password }, { db: { Users } }) => {
        const user = await Users.findOne({ email });

        if (!user) {
          throw new UserInputError('No user exists with that email address. Please try again');
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
          throw new UserInputError('Incorrect password. Please try again.');
        }

        const token = jsonwebtoken.sign(
          {
            id: user._id,
            email: user.email,
          },
          process.env.JWT_SECRET,
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
          throw new AuthenticationError('You must be logged in to vote');
        }

        const link = await Links.findOneAndUpdate({ _id: ObjectId(_id) }, { $inc: { score: 1 } });

        const { score } = link.value;

        pubsub.publish(LINK_VOTED, { vote: { _id, score: score + 1 } });

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
          throw new AuthenticationError('You must be logged in to vote');
        }

        const link = await Links.findOneAndUpdate({ _id: ObjectId(_id) }, { $inc: { score: -1 } });

        const { score } = link.value;

        pubsub.publish(LINK_VOTED, { vote: { _id, score: score - 1 } }); // eslint-disable-line prettier/prettier

        return Links.findOne(ObjectId(_id));
      },
    },
  }),
});

export default MutationType;
