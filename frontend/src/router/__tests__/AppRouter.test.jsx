import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import AppRouter, { routes } from '@/router/AppRouter';
import { useAuth } from '@/context/AuthContext';

jest.mock('@/context/AuthContext', () => {
  const React = require('react');
  return {
    AuthProvider: ({ children }) => <>{children}</>,
    useAuth: jest.fn(),
  };
});

jest.mock('@/components/organisms/Login', () => () => <div>Login Page</div>);
jest.mock('@/pages/Dashboard', () => () => <div>Dashboard Page</div>);
jest.mock('@/components/editor/DocumentEditor', () => () => <div>Editor Page</div>);
jest.mock('@/components/common/Spinners/AuthSpinner', () => () => (
  <div role="status">Loading...</div>
));

const renderRouter = (initialEntries = ['/']) => {
  const router = createMemoryRouter(routes, { initialEntries });
  return { ...render(<RouterProvider router={router} />), router };
};

describe('AppRouter navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows a unified spinner while auth state is loading', () => {
    useAuth.mockReturnValue({ user: null, isLoading: true });

    render(<AppRouter />);

    expect(screen.getByRole('status')).toHaveTextContent('Loading...');
  });

  it('redirects unauthenticated users from root to the login flow', async () => {
    useAuth.mockReturnValue({ user: null, isLoading: false });

    const { router } = renderRouter(['/']);

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/login');
    });
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('keeps authenticated users in the dashboard flow from root', async () => {
    useAuth.mockReturnValue({ user: { id: 1 }, isLoading: false });

    const { router } = renderRouter(['/']);

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/dashboard');
    });
    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
  });

  it('prevents authenticated users from visiting the login page', async () => {
    useAuth.mockReturnValue({ user: { id: 1 }, isLoading: false });

    const { router } = renderRouter(['/login']);

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/dashboard');
    });
    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
  });
});
