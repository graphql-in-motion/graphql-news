import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLList,
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLBoolean,
} from 'graphql';
import { ObjectId } from 'mongodb';

import LinkType from './types/link';
import UserType from './types/user';
import CommentType from './types/comment';

const LinkFilter = new GraphQLInputObjectType({
  name: 'LinkFilter',
  fields: () => ({
    urlContains: { type: GraphQLString },
    top: { type: GraphQLBoolean },
    recent: { type: GraphQLBoolean },
    controversial: { type: GraphQLBoolean },
  }),
});

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    link: {
      type: LinkType,
      args: {
        // We must know a link's ID in order to query for it
        _id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, { _id }, { db: { Links } }) => await Links.findOne(ObjectId(_id)),
    },
    links: {
      type: new GraphQLList(LinkType),
      args: {
        first: { type: GraphQLInt },
        skip: { type: GraphQLInt },
        filter: { type: LinkFilter },
      },
      resolve: async (_, { first, skip, filter }, { db: { Links } }) => {
        const { urlContains, top, recent, controversial } = filter;

        if (urlContains) {
          return await Links.find({ url: { $regex: `.*${urlContains}.*` } }).toArray();
        }

        let links = await Links.find({}).toArray();

        if (top) {
          const compareScore = (a, b) => {
            if (a.score > b.score) {
              return -1;
            }
            if (a.score < b.score) {
              return 1;
            }
            return 0;
          };

          links = links.sort(compareScore);
        }

        if (recent) {
          const compareDates = (a, b) => {
            if (a.created_at > b.created_at) {
              return -1;
            }
            if (a.created_at < b.created_at) {
              return 1;
            }
            return 0;
          };

          links = links.sort(compareDates);
        }

        if (controversial) {
          const compareComments = (a, b) => {
            if (a.comments.length > b.comments.length) {
              return -1;
            }
            if (a.comments.length < b.comments.length) {
              return 1;
            }
            return 0;
          };

          links = links.sort(compareComments);
        }

        if (first && (!skip || skip === 0)) {
          return links.slice(0, first);
        }
        if (skip && !first) {
          return links.filter((v, i) => i > skip);
        }
        if (skip && first) {
          return links.filter((v, i) => i > skip).slice(0, first);
        }

        return links;
      },
    },
    allLinks: {
      type: new GraphQLList(LinkType),
      resolve: async (_, data, { db: { Links } }) => await Links.find({}).toArray(),
    },
    allUsers: {
      type: new GraphQLList(UserType),
      resolve: async (_, data, { db: { Users } }) => await Users.find({}).toArray(),
    },
    user: {
      type: UserType,
      args: {
        // We must know a user's ID in order to query for him/her
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, { id }, { db: { Users } }) => await Users.findOne(ObjectId(id)),
    },
    allComments: {
      type: new GraphQLList(CommentType),
      resolve: async (_, data, { db: { Comments } }) => await Comments.find({}).toArray(),
    },
    commentsForLink: {
      type: new GraphQLList(CommentType),
      args: {
        // We must know a link's ID in order to query for its comments
        _id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, data, { db: { Comments } }) => {
        const comments = await Comments.find({}).toArray();
        // eslint-disable-next-line consistent-return,array-callback-return
        return comments.filter(i => {
          if (i.link) {
            return i.link.toString() === data._id && i.parent === null;
          }
        });
      },
    },
  }),
});

export default QueryType;
