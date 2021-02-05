import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.log(error);
  }
  render() {
    if (this.state.hasError)
      return this.props.fallback || <h2>Error Occured...</h2>;
    return this.props.children;
  }
}

export default ErrorBoundary;
