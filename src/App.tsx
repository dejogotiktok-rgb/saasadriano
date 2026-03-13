import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CatalogProvider } from "@/contexts/CatalogContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/DashboardLayout";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CatalogCreator from "./pages/CatalogCreator";
import MessageGenerator from "./pages/MessageGenerator";
import FindClients from "./pages/FindClients";
import DemoCreator from "./pages/DemoCreator";
import Niches from "./pages/Niches";
import AITools from "./pages/AITools";
import PublicCatalog from "./pages/PublicCatalog";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function DashboardRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <CatalogProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </CatalogProvider>
    </ProtectedRoute>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/catalogo/:slug" element={<PublicCatalog />} />
              <Route path="/dashboard" element={<DashboardRoute><Dashboard /></DashboardRoute>} />
              <Route path="/dashboard/catalogo" element={<DashboardRoute><CatalogCreator /></DashboardRoute>} />
              <Route path="/dashboard/mensagem" element={<DashboardRoute><MessageGenerator /></DashboardRoute>} />
              <Route path="/dashboard/clientes" element={<DashboardRoute><FindClients /></DashboardRoute>} />
              <Route path="/dashboard/demo" element={<DashboardRoute><DemoCreator /></DashboardRoute>} />
              <Route path="/dashboard/nichos" element={<DashboardRoute><Niches /></DashboardRoute>} />
              <Route path="/dashboard/ferramentas" element={<DashboardRoute><AITools /></DashboardRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
