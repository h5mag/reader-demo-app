import React from 'react';
import renderer from 'react-test-renderer';
import EditionReader from '../src/components/EditionReader';

test('renders correctly', () => {
  const tree = renderer.create(<EditionReader />).toJSON();
  expect(tree).toMatchSnapshot();
});
