import AppRouter from '@/router/AppRouter';
import '@/styles/tokens.css';
import '@/styles/index.css';

export default function App() {
  return (
    <div className="min-h-screen bg-bg text-fg antialiased">
      <AppRouter />
    </div>
  );
}
