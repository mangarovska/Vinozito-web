// ErrorBoundary.jsx
import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Blob rendering error:", error, errorInfo);
  }
  

  render() {
    return this.state.hasError 
      ? <div className="error-fallback">Graphical error</div>
      : this.props.children;
  }
}
