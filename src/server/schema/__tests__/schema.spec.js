import { graphql } from 'graphql';
import { addMockFunctionsToSchema } from 'graphql-tools';
import schema from '../index';

// eslint-disable-next-line
jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

addMockFunctionsToSchema({
  schema,
  mocks: {
    Link: () => ({
      _id: 1,
      url: 'https://example.com',
      description: 'example',
      score: 6,
    }),
    User: () => ({
      _id: 2,
      username: 'example',
      about: 'lorem ipsum',
    }),
  },
});

describe('the graphql-news schema', async () => {
  test('can query for a link with a given _id', async () => {
    const query = `
      query taskForLink {
        link(_id: 1) {
          _id
          url
          description
          score
        }
      }  
    `;

    const res = await graphql(schema, query);

    expect(res.data).toMatchSnapshot();
  });

  test('can query for a list of links', async () => {
    const query = `
      query taskforAllLinks {
        allLinks {
          _id
        }
      }
    `;

    const res = await graphql(schema, query);

    expect(res.data).toMatchSnapshot();
  });

  test('can query for a user with a given _id', async () => {
    const query = `
      query taskForUser {
        user(_id: 2) {
          _id
          username
          about
        }
      }  
    `;

    const res = await graphql(schema, query);

    expect(res.data).toMatchSnapshot();
  });
});
