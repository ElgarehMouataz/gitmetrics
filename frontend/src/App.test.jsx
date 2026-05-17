import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock global fetch
global.fetch = vi.fn();

describe('App Component', () => {
  it('renders header, subtitle, and search input correctly', () => {
    render(<App />);
    expect(screen.getByText('Gitmetrics')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter GitHub username...')).toBeInTheDocument();
  });

  it('displays Quick Explore sample profile buttons', () => {
    render(<App />);
    expect(screen.getByText('sobolevn')).toBeInTheDocument();
    expect(screen.getByText('torvalds')).toBeInTheDocument();
  });

  it('fetches and displays profile metrics on search', async () => {
    const mockData = {
      username: 'testuser',
      total_repos: 12,
      total_stars: 150,
      languages: { Python: 8, JavaScript: 4 },
      repos: [
        { name: 'repo-1', stars: 100, forks: 20, language: 'Python', url: 'https://github.com/testuser/repo-1' }
      ]
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(<App />);
    
    const input = screen.getByPlaceholderText('Enter GitHub username...');
    const button = screen.getByRole('button', { name: /Get Metrics/i });

    fireEvent.change(input, { target: { value: 'testuser' } });
    fireEvent.click(button);

    expect(await screen.findByText('User: testuser')).toBeInTheDocument();
    expect(screen.getByText('150 Stars across 12 Repos')).toBeInTheDocument();
  });

  it('displays error message on API failure', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ detail: 'User not found' }),
    });

    render(<App />);
    
    const input = screen.getByPlaceholderText('Enter GitHub username...');
    const button = screen.getByRole('button', { name: /Get Metrics/i });

    fireEvent.change(input, { target: { value: 'invaliduser' } });
    fireEvent.click(button);

    expect(await screen.findByText('User not found')).toBeInTheDocument();
  });
});
