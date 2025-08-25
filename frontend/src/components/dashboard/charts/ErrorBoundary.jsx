
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Error Boundary Component for Dashboard Widgets
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Dashboard Error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const { dir = 'rtl' } = this.props;
      
      return (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              {dir === 'rtl' ? 'خطأ في التحميل' : 'Loading Error'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {dir === 'rtl' 
                ? 'حدث خطأ أثناء تحميل هذا المكون. يرجى المحاولة مرة أخرى.'
                : 'An error occurred while loading this component. Please try again.'
              }
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                {this.state.error.toString()}
              </pre>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={this.handleReset}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              {dir === 'rtl' ? 'إعادة المحاولة' : 'Retry'}
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
