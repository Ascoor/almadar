import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Report to error monitoring service in production
    if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
      // Example: Sentry.captureException(error, { contexts: { errorBoundary: errorInfo } });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="flex justify-center">
              <AlertTriangle className="h-16 w-16 text-destructive" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                حدث خطأ غير متوقع
              </h1>
              <p className="text-muted-foreground">
                نعتذر، حدث خطأ في النظام. يرجى المحاولة مرة أخرى.
              </p>
              {import.meta.env.DEV && this.state.error && (
                <details className="mt-4 text-right">
                  <summary className="text-sm text-muted-foreground cursor-pointer">
                    تفاصيل الخطأ (لوضع التطوير)
                  </summary>
                  <pre className="mt-2 text-xs bg-muted p-4 rounded text-right overflow-auto">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <Button onClick={this.handleReset} className="w-full">
                <RefreshCw className="h-4 w-4 ml-2" />
                المحاولة مرة أخرى
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'}
                className="w-full"
              >
                العودة للصفحة الرئيسية
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}