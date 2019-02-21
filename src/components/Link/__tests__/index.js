import React from 'react';
import TestRenderer from 'react-test-renderer';
import Link from '../index';

describe('the <Link /> component', async () => {
  test('should look like this', async () => {
    const tree = TestRenderer.create(
      <Link
        author="anonymous"
        url="https://google.com"
        description="The internet's front door"
        comments={70}
        score={275}
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
