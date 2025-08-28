import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "./lib/queryClient";
import { LanguageProvider } from "./contexts/LanguageContext";
import { useWebSocket } from "./hooks/useWebSocket";
import { InstallPrompt } from "./components/InstallPrompt";
import { Home } from "./pages/Home";
import { AddRecipe } from "./pages/AddRecipe";
import { ShoppingList } from "./pages/ShoppingList";
import { Pantry } from "./pages/Pantry";
import { Tools } from "./pages/Tools";
import NotFound from "@/pages/not-found";

// WebSocket wrapper component
function WebSocketProvider({ children }: { children: React.ReactNode }) {
  useWebSocket(); // Initialize WebSocket connection
  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/add" component={AddRecipe} />
      <Route path="/shopping" component={ShoppingList} />
      <Route path="/pantry" component={Pantry} />
      <Route path="/tools" component={Tools} />
      <Route component={NotFound} />
    </Switch>
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
