import axios from 'axios';

describe('The Link query', () => {
  test('Queries for a link with a given _id attribute',
  async () => {
    const response = {
      _id: '5a667e7fa66a67444e14e278',
      url: 'https://google.com/',
      description: 'Google',
    };

    await axios({
      url: 'http://localhost:4000/graphql',
      method: 'post',
      data: {
        query: `
          query LinkWithId {
            link(_id: "5a667e7fa66a67444e14e278") {
              _id
              url
              description
            }
          }
        `,
      },
    }).then(result => expect(result.toString()).toMatch(response.toString()));
  });
});
