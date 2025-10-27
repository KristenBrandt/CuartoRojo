import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";
import Construction from "./pages/IndexOld";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import ProjectDetail from "./pages/ProjectDetail";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Dashboard from "./pages/admin/Dashboard";
import Projects from "./pages/admin/Projects";
import Users from "./pages/admin/Users";
import Settings from "./pages/admin/Settings";
import ProjectForm from "./pages/admin/ProjectForm";
import Categories from "./pages/admin/Categories";
import Team from "./pages/admin/Team";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Construction />} />
            <Route path="/landing" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/portfolio/:slug" element={<ProjectDetail />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Admin routes - protected */}
            <Route path="/admin" element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            } />
            <Route path="/admin/proyectos" element={
              <AuthGuard>
                <Projects />
              </AuthGuard>
            } />
            <Route path="/admin/proyectos/new" element={
              <AuthGuard>
                <ProjectForm />
              </AuthGuard>
            } />
            <Route path="/admin/proyectos/:id" element={
              <AuthGuard>
                <ProjectForm />
              </AuthGuard>
            } />
            <Route path="/admin/categorias" element={
              <AuthGuard>
                <Categories />
              </AuthGuard>
            } />
            <Route path="/admin/equipo" element={
              <AuthGuard>
                <Team />
              </AuthGuard>
            } />
            <Route path="/admin/usuarios" element={
              <AuthGuard>
                <Users />
              </AuthGuard>
            } />
            <Route path="/admin/ajustes" element={
              <AuthGuard>
                <Settings />
              </AuthGuard>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
