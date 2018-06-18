import axios from 'axios';
import response from './__mocks__/response.json';

describe('the link(_id: "") query', () => {
  test('that it queries for a link with a given _id', async () => {
    await axios({
      url: 'http://localhost:4000/graphql',
      method: 'post',
      data: {
        query: `
          query {
            link(_id: "5a667e7fa66a67444e14e278") {
              _id
              url
              description
            }
          }
        `,
      },
    }).then(result => expect(result.data).toEqual(response));
  });
});
