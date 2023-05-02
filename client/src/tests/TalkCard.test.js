import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import TalkCard from '../components/TalkCard';
import '@testing-library/jest-dom/extend-expect';

test('renders TalkCard component without crashing', () => {
  const talk = {
    title: 'Test Title',
    content: 'Test Content',
    likes: 5,
    id: 1,
    createdAt: '2023-04-24',
  };

  const cardType = 'home';
  const isLoggedin = true;
  const userId = 12345;

  const { container } = render(
    <Router>
      <TalkCard talk={talk} cardType={cardType} isLoggedin={isLoggedin} userId={userId} />
    </Router>
  );

  expect(container).toBeInTheDocument();
});
