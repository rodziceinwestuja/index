import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Unhandled error in ErrorBoundary:', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-bgLight px-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
            <i aria-hidden="true" className="fas fa-triangle-exclamation text-3xl"></i>
          </div>
          <h1 className="font-display font-bold text-2xl text-primary mb-3">
            Coś poszło nie tak
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Wystąpił nieoczekiwany błąd. Odśwież stronę, aby spróbować ponownie. Jeśli problem się powtarza, skontaktuj się z nami.
          </p>
          <button type="button"
            onClick={this.handleReload}
            className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            Odśwież stronę
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
