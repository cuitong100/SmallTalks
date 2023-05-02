import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import WeatherCard from '../components/WeatherCard';
import axios from 'axios';

jest.mock('axios');

describe('WeatherCard', () => {
  test('renders weather data', async () => {
    const mockedWeatherData = {
      data: {
        lat: 49,
        lon: -123,
        current: {
          weather: [
            {
              main: 'Rain',
              description: 'moderate rain',
              icon: '10d',
            },
          ],
          temp: 284.08,
        },
      },
    };

    axios.get.mockResolvedValue(mockedWeatherData);
    render(<WeatherCard />);

    // Waiting for the component to re-render with the new data
    //await waitFor(() => screen.getByText(/Rain/i));
    expect(screen.getByText(/moderate rain/i)).toBeInTheDocument();
    // expect(screen.getByText(/11°C/i)).toBeInTheDocument();
  });
});
