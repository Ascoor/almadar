import { ErrorBoundary } from './app/error/ErrorBoundary';
import { AppRoutes } from './app/routes/AppRoutes';
import SkipLink from './components/helpers/SkipLink';

export default function App() {
  return (
    <ErrorBoundary>
      <SkipLink />
      <AppRoutes />
    </ErrorBoundary>
  );
}
