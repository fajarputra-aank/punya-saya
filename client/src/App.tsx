import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import { useEffect } from "react";
import { toast } from "sonner";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/rapat" component={Home} />
      <Route path="/rapat/:id" component={Home} />
      <Route path="/rekaman" component={Home} />
      <Route path="/action-item" component={Home} />
      <Route path="/pengaturan" component={Home} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function RecoveryNotice() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem("notulen-recovery-pending") !== "true") {
        return;
      }
      sessionStorage.removeItem("notulen-recovery-pending");
      toast.success("Workspace berhasil dipulihkan", {
        description: "Aplikasi sudah siap digunakan kembali.",
      });
    } catch {
      // Storage may be unavailable in private browsing.
    }
  }, []);

  return null;
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <TooltipProvider>
          <Toaster position="top-right" richColors />
          <RecoveryNotice />
          <ErrorBoundary
            title="Workspace tidak dapat dimuat"
            description="Terjadi gangguan saat menampilkan halaman workspace. Data Anda tetap aman; coba muat ulang untuk melanjutkan."
            retryLabel="Coba lagi"
          >
            <Router />
          </ErrorBoundary>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
