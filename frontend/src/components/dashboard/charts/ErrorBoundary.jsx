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
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
  fallback: PropTypes.string,
};
