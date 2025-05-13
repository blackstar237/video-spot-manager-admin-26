
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "./components/layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import SpotsList from "./pages/SpotsList";
import SpotsListSupabase from "./pages/SpotsListSupabase";
import AddEditSpot from "./pages/AddEditSpot";
import Categories from "./pages/Categories";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./providers/ThemeProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <div className="relative min-h-screen dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-gray-800 dark:via-gray-900 dark:to-black">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<AdminLayout />}>
                <Route path="/" element={<Navigate to="/spots" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/spots" element={<SpotsListSupabase />} />
                <Route path="/spots-mock" element={<SpotsList />} />
                <Route path="/spots/new" element={<AddEditSpot />} />
                <Route path="/spots/:id" element={<AddEditSpot />} />
                <Route path="/categories" element={<Categories />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
