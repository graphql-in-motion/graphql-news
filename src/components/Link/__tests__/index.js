import React from 'react';
import TestRenderer from 'react-test-renderer';
import { MockedProvider } from 'react-apollo/test-utils';
import { MemoryRouter } from 'react-router';

import Link from '../index';

describe('the <Link /> component', async () => {
  test('should look like this', async () => {
    const tree = TestRenderer.create(
      <MockedProvider>
        <MemoryRouter>
          <Link
            _id="5c7e92d9b7e6d953fb9f35e9"
            author="example"
            authorId="5c786210614c53755f6de7d2"
            url="https://google.com"
            description="Google"
            commentsLength={25}
            score={10}
            createdAt="{2019} 03-05T10:19:35 665 Z AM"
          />
        </MemoryRouter>
      </MockedProvider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
