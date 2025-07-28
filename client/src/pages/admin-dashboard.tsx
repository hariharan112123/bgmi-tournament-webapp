import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTournaments, useMatches, useTeams, useStats } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Users, 
  DollarSign, 
  Play, 
  Plus,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye
} from "lucide-react";
import { Link } from "wouter";

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    }
  }, [user, authLoading, toast]);

  const { data: stats } = useStats();
  const { data: tournaments = [] } = useTournaments();
  const { data: matches = [] } = useMatches();
  const { data: teams = [] } = useTeams();

  if (authLoading || !user?.isAdmin) {
    return (
      <div className="min-h-screen bg-dark-bg text-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  const recentTournaments = tournaments.slice(0, 5);
  const liveMatches = matches.filter((match: any) => match.status === 'live');
  const pendingMatches = matches.filter((match: any) => match.status === 'scheduled');

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Manage tournaments, matches, and platform operations</p>
          </div>
          <Button asChild className="bg-bgmi-orange hover:bg-orange-600">
            <Link href="/tournaments/create">
              <Plus className="mr-2 h-5 w-5" />
              Create Tournament
            </Link>
          </Button>
        </div>

        {/* Quick Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-card-bg border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-bgmi-orange bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Trophy className="text-bgmi-orange text-xl" />
                  </div>
                  <Badge className="bg-success-green text-dark-bg">+12%</Badge>
                </div>
                <div className="text-2xl font-bold mb-1">{stats.activeTournaments}</div>
                <div className="text-sm text-gray-400">Active Tournaments</div>
              </CardContent>
            </Card>

            <Card className="bg-card-bg border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-bgmi-gold bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Users className="text-bgmi-gold text-xl" />
                  </div>
                  <Badge className="bg-success-green text-dark-bg">+8%</Badge>
                </div>
                <div className="text-2xl font-bold mb-1">{stats.registeredTeams}</div>
                <div className="text-sm text-gray-400">Total Teams</div>
              </CardContent>
            </Card>

            <Card className="bg-card-bg border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-success-green bg-opacity-20 rounded-lg flex items-center justify-center">
                    <DollarSign className="text-success-green text-xl" />
                  </div>
                  <Badge className="bg-success-green text-dark-bg">+25%</Badge>
                </div>
                <div className="text-2xl font-bold mb-1">₹{Number(stats.totalPrizePool).toLocaleString()}</div>
                <div className="text-sm text-gray-400">Total Prizes</div>
              </CardContent>
            </Card>

            <Card className="bg-card-bg border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-error-red bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Play className="text-error-red text-xl" />
                  </div>
                  <Badge className="bg-error-red text-white">LIVE</Badge>
                </div>
                <div className="text-2xl font-bold mb-1">{stats.liveMatches}</div>
                <div className="text-sm text-gray-400">Live Matches</div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-card-bg">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
            <TabsTrigger value="matches">Matches</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Recent Activity */}
            <Card className="bg-card-bg border-gray-700">
              <CardHeader>
                <CardTitle>Recent Tournament Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-success-green bg-opacity-20 rounded-lg flex items-center justify-center">
                        <CheckCircle className="text-success-green h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium">Tournament Registration Opened</div>
                        <div className="text-sm text-gray-400">BGMI Pro Series 2025 - 67 teams registered</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">2 mins ago</div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-bgmi-orange bg-opacity-20 rounded-lg flex items-center justify-center">
                        <Users className="text-bgmi-orange h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium">New Team Created</div>
                        <div className="text-sm text-gray-400">Phoenix Esports joined the platform</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">5 mins ago</div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-yellow-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                        <AlertCircle className="text-yellow-500 h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium">Match Review Required</div>
                        <div className="text-sm text-gray-400">Match ID #BG2025-147 flagged for review</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" className="border-gray-600">
                        Review
                      </Button>
                      <div className="text-sm text-gray-400">8 mins ago</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Matches Control */}
            {liveMatches.length > 0 && (
              <Card className="bg-card-bg border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-error-red rounded-full animate-pulse"></div>
                    Live Matches ({liveMatches.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {liveMatches.map((match: any) => (
                      <div key={match.id} className="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
                        <div>
                          <h4 className="font-semibold">{match.name}</h4>
                          <p className="text-sm text-gray-400">{match.round} • Zone {match.currentZone || 3}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className="bg-error-red text-white">
                            {match.playersAlive || 67} Alive
                          </Badge>
                          <Button asChild size="sm" className="bg-bgmi-orange hover:bg-orange-600">
                            <Link href={`/matches/${match.id}/control`}>
                              Control
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="tournaments" className="space-y-6">
            <Card className="bg-card-bg border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Tournament Management</span>
                  <Button asChild className="bg-bgmi-orange hover:bg-orange-600">
                    <Link href="/tournaments/create">
                      <Plus className="mr-2 h-4 w-4" />
                      New Tournament
                    </Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTournaments.map((tournament: any) => (
                    <div key={tournament.id} className="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
                      <div>
                        <h4 className="font-semibold">{tournament.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>{tournament.mode}</span>
                          <span>•</span>
                          <span>{tournament.currentTeams}/{tournament.maxTeams} teams</span>
                          <span>•</span>
                          <span>₹{Number(tournament.prizePool).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={tournament.status === 'live' ? 'bg-success-green text-dark-bg' : 
                                        tournament.status === 'open' ? 'bg-bgmi-orange text-white' : 'bg-gray-600 text-white'}>
                          {tournament.status}
                        </Badge>
                        <Button asChild size="sm" variant="outline" className="border-gray-600">
                          <Link href={`/tournaments/${tournament.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="matches" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Live Matches */}
              <Card className="bg-card-bg border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-error-red rounded-full animate-pulse"></div>
                    Live Matches
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {liveMatches.length === 0 ? (
                    <p className="text-gray-400 text-center py-6">No live matches</p>
                  ) : (
                    <div className="space-y-3">
                      {liveMatches.map((match: any) => (
                        <div key={match.id} className="p-3 bg-dark-bg rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium">{match.name}</h5>
                              <p className="text-xs text-gray-400">{match.round}</p>
                            </div>
                            <Button asChild size="sm" className="bg-error-red hover:bg-red-600">
                              <Link href={`/matches/${match.id}/control`}>
                                Control
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Pending Matches */}
              <Card className="bg-card-bg border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-bgmi-orange" />
                    Pending Matches
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingMatches.length === 0 ? (
                    <p className="text-gray-400 text-center py-6">No pending matches</p>
                  ) : (
                    <div className="space-y-3">
                      {pendingMatches.slice(0, 5).map((match: any) => (
                        <div key={match.id} className="p-3 bg-dark-bg rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium">{match.name}</h5>
                              <p className="text-xs text-gray-400">
                                {new Date(match.startTime).toLocaleString()}
                              </p>
                            </div>
                            <Button size="sm" variant="outline" className="border-gray-600">
                              Manage
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="teams" className="space-y-6">
            <Card className="bg-card-bg border-gray-700">
              <CardHeader>
                <CardTitle>Team Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teams.slice(0, 10).map((team: any) => (
                    <div key={team.id} className="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 gaming-gradient rounded-lg flex items-center justify-center font-bold text-white text-sm">
                          {team.tag}
                        </div>
                        <div>
                          <h4 className="font-semibold">{team.name}</h4>
                          <p className="text-sm text-gray-400">
                            {team.totalWins} wins • ₹{Number(team.totalEarnings).toLocaleString()} earned
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="border-gray-600">
                          {new Date(team.createdAt).toLocaleDateString()}
                        </Badge>
                        <Button size="sm" variant="outline" className="border-gray-600">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
