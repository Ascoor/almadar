<<<<<<< HEAD

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
            <p className="text-sm text-muted">
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

=======
import { Component } from 'react';
import PropTypes from 'prop-types';
import { ErrorState } from './EmptyStates';

/**
 * Catches rendering errors for a widget and shows a friendly message.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorState message={this.props.fallback} />;
    }
>>>>>>> d9039229ee7b761f0a81db294b0be7d0ad02d048
    return this.props.children;
  }
}

<<<<<<< HEAD
export default ErrorBoundary;
=======
ErrorBoundary.propTypes = {
  children: PropTypes.node,
  fallback: PropTypes.string,
};
>>>>>>> d9039229ee7b761f0a81db294b0be7d0ad02d048
