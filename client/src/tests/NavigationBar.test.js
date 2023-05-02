import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';

describe('NavigationBar component', () => {
  test('renders navigation links', () => {
    render(
      <BrowserRouter>
        <NavigationBar />
      </BrowserRouter>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Add Talk')).toBeInTheDocument();
  });
});

