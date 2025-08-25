/**
 * ErrorBoundary.jsx
 * Catches errors per widget.
 * i18n keys: 'dashboard.error', 'dashboard.retry'
 */

import { Component } from 'react';
import { Button } from '@/components/ui/button';
import { withTranslation } from 'react-i18next';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  handleRetry = () => {
    this.setState({ hasError: false });
    this.props.onRetry?.();
  };
  render() {
    const { t } = this.props;
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center space-y-4">
          <p>{t('dashboard.error')}</p>
          <Button onClick={this.handleRetry}>{t('dashboard.retry')}</Button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default withTranslation()(ErrorBoundary);
