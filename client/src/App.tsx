import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Tournaments from "@/pages/tournaments";
import CreateTournament from "@/pages/create-tournament";
import TournamentDetail from "@/pages/tournament-detail";
import TeamManagement from "@/pages/team-management";
import AdminDashboard from "@/pages/admin-dashboard";
import MatchControl from "@/pages/match-control";
import Rankings from "@/pages/rankings";
import Replays from "@/pages/replays";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/tournaments" component={Tournaments} />
          <Route path="/tournaments/create" component={CreateTournament} />
          <Route path="/tournaments/:id" component={TournamentDetail} />
          <Route path="/team" component={TeamManagement} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/matches/:id/control" component={MatchControl} />
          <Route path="/rankings" component={Rankings} />
          <Route path="/replays" component={Replays} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
