import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  title?: string;
  description?: string;
  retryLabel?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  private retry = () => {
    try {
      sessionStorage.setItem("notulen-recovery-pending", "true");
    } catch {
      // Storage may be unavailable in private browsing; reload still works.
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background px-5 py-10">
          <div
            role="alert"
            className="w-full max-w-xl overflow-hidden rounded-[2rem] border border-[#e8e6f3] bg-card shadow-[0_24px_80px_-32px_rgba(76,61,145,0.35)] dark:border-white/10"
          >
            <div className="relative flex justify-center overflow-hidden bg-gradient-to-br from-[#f1efff] via-[#faf9ff] to-[#e5f5f0] px-8 pb-8 pt-10 dark:from-[#211e3d] dark:via-[#171923] dark:to-[#142b29]">
              <div className="absolute -left-10 -top-14 h-36 w-36 rounded-full bg-[#b9b0ff]/25 blur-2xl" />
              <div className="absolute -bottom-16 -right-8 h-40 w-40 rounded-full bg-[#9edbc9]/25 blur-2xl" />
              <div className="relative flex h-28 w-28 items-center justify-center rounded-[2rem] border border-white/80 bg-white/70 shadow-[0_16px_32px_-16px_rgba(76,61,145,0.5)] backdrop-blur dark:border-white/15 dark:bg-white/10">
                <div className="absolute inset-3 rounded-[1.4rem] border border-[#d9d4ff] dark:border-white/15" />
                <AlertTriangle
                  className="relative h-11 w-11 text-[#655bd7] dark:text-[#b8b1ff]"
                  strokeWidth={1.7}
                />
                <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-[#e7a84b] shadow-[0_0_0_5px_rgba(231,168,75,0.16)]" />
              </div>
            </div>
            <div className="flex flex-col items-center px-7 pb-8 pt-7 sm:px-10">
              <span className="mb-3 rounded-full bg-[#f4f1ff] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#655bd7] dark:bg-[#2c2850] dark:text-[#c5c0ff]">
                Pemulihan workspace
              </span>
              <h2 className="mb-3 text-center font-display text-2xl font-semibold tracking-tight">
                {this.props.title ?? "Terjadi gangguan pada aplikasi"}
              </h2>
              <p className="mb-6 max-w-md text-center text-sm leading-6 text-muted-foreground">
                {this.props.description ??
                  "Muat ulang halaman untuk mencoba menjalankan aplikasi kembali."}
              </p>
              <button
                onClick={this.retry}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold",
                  "bg-primary text-primary-foreground shadow-lg shadow-primary/20",
                  "hover:-translate-y-0.5 hover:opacity-90"
                )}
              >
                <RotateCcw size={16} />
                {this.props.retryLabel ?? "Muat ulang halaman"}
              </button>
              {this.state.error?.stack && (
                <details className="mt-6 w-full text-left">
                  <summary className="cursor-pointer text-center text-xs font-medium text-muted-foreground hover:text-foreground">
                    Lihat detail teknis
                  </summary>
                  <pre className="mt-3 max-h-32 overflow-auto rounded-xl bg-muted p-3 text-[11px] leading-5 text-muted-foreground">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
