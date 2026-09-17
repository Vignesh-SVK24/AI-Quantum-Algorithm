import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ThreeErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message || 'WebGL 3D Context encountered an issue' };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('[ThreeErrorBoundary] Caught 3D WebGL error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, errorMessage: '' });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="w-full p-6 rounded-2xl bg-[#FAF7EE] border border-[#E0D9C8] shadow-sm text-center space-y-3">
          <div className="w-10 h-10 mx-auto rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-[#31372B]">
            3D Hardware Acceleration Notice
          </h4>
          <p className="text-xs text-[#31372B]/75 max-w-md mx-auto">
            Your browser or device was unable to initialize WebGL hardware acceleration.
            High-fidelity 2D mathematical telemetry is active.
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
            className="px-3 py-1.5 rounded-xl bg-[#202C3D] text-[#FAF7EE] text-xs font-semibold hover:bg-[#31372B] transition-colors inline-flex items-center gap-1.5 shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry 3D Scene</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
