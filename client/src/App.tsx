import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { queryClient } from "./lib/queryClient";
import { LanguageProvider } from "./contexts/LanguageContext";
import { useWebSocket } from "./hooks/useWebSocket";
import { InstallPrompt } from "./components/InstallPrompt";
import { AppSidebar } from "./components/AppSidebar";
import { Home } from "./pages/Home";
import { AddRecipe } from "./pages/AddRecipe";
import { ShoppingList } from "./pages/ShoppingList";
import { Pantry } from "./pages/Pantry";
import NotFound from "@/pages/not-found";

// WebSocket wrapper component
function WebSocketProvider({ children }: { children: React.ReactNode }) {
  useWebSocket(); // Initialize WebSocket connection
  return <>{children}</>;
}

function Router() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 w-full">
        <div className="flex items-center p-4 lg:hidden">
          <SidebarTrigger />
        </div>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/add" component={AddRecipe} />
          <Route path="/shopping" component={ShoppingList} />
          <Route path="/pantry" component={Pantry} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </SidebarProvider>
  );
}

function App() {
  return (
    <div className="fixed inset-0 overflow-hidden">
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <WebSocketProvider>
            <TooltipProvider>
              <div className="h-full flex flex-col overflow-hidden">
                <Router />
                <InstallPrompt />
                <Toaster />
              </div>
            </TooltipProvider>
          </WebSocketProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
