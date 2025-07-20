import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createHashRouter,
  RouterProvider,
  Outlet,
  useRouteError,
  isRouteErrorResponse,
} from 'react-router-dom';
import App from './App';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import DashboardPage from './DashboardPage';

// A generic error page to catch routing errors and rendering errors.
// This will provide more detailed feedback than the default 404.
function ErrorBoundary() {
  const error = useRouteError();
  const { theme } = useTheme(); // Use theme for consistent styling

  let title = 'An Error Occurred!';
  let message = 'Something went wrong.';

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = 'Page Not Found';
      message = "Sorry, we couldn't find the page you're looking for.";
    } else {
      title = `${error.status} Error`;
      message = error.statusText || 'An unexpected error occurred.';
    }
  } else if (error instanceof Error) {
    // This will catch rendering errors from child components
    title = 'Application Error';
    message = error.message;
    console.error(error);
  }

  return (
    <div className={`min-h-screen flex items-center justify-center text-center px-4 ${theme === 'dark' ? 'bg-slate-900 text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
      <div>
        <h1 className="text-4xl font-bold text-red-500">{title}</h1>
        <p className="mt-4 text-lg">{message}</p>
        <a href="#/" className="mt-8 inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 transition-colors">
          Go Home
        </a>
      </div>
    </div>
  );
}

// A root layout component that provides the Theme context to all routes.
const RootLayout = () => {
  return (
    <ThemeProvider>
      {/* Outlet renders the matched child route */}
      <Outlet />
    </ThemeProvider>
  );
};

// Wrap the ErrorBoundary in the ThemeProvider so it can use the theme context.
const ThemedErrorBoundary = () => (
    <ThemeProvider>
        <ErrorBoundary />
    </ThemeProvider>
);

// The router configuration with a root layout and error boundary.
const router = createHashRouter([
  {
    element: <RootLayout />,
    // The error boundary will be rendered if any child route throws an error.
    errorElement: <ThemedErrorBoundary />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/*', // The splat route catches all paths not matched above
        element: <App />,
      },
    ],
  },
]);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// Register the service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, err => {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}