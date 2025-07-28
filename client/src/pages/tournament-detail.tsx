import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useTournament, useTournamentRegistrations, useUserTeam, useMatches, useRegisterForTournament } from "@/hooks/useApi";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Users, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Clock, 
  Share, 
  ArrowLeft,
  Star,
  Shield,
  Target
} from "lucide-react";
import { Link, useParams } from "wouter";

export default function TournamentDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: tournament, isLoading } = useTournament(id || "");
  const { data: registrations = [] } = useTournamentRegistrations(id || "");
  const { data: userTeam } = useUserTeam(user?.id || "");
  const { data: matches = [] } = useMatches();

  const registerMutation = useRegisterForTournament();

  const handleRegister = () => {
    if (!userTeam) {
      toast({
        title: "Error",
        description: "You need to be part of a team to register",
        variant: "destructive",
      });
      return;
    }
    registerMutation.mutate({
      tournamentId: id || "",
      teamId: userTeam.id,
    });
  };

  if (isLoading || !tournament) {
    return (
      <div className="min-h-screen bg-dark-bg text-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-700 rounded mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-40 bg-gray-700 rounded"></div>
                <div className="h-40 bg-gray-700 rounded"></div>
              </div>
              <div className="h-80 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-success-green text-dark-bg';
      case 'open': return 'bg-bgmi-orange text-white';
      case 'completed': return 'bg-gray-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const isRegistered = registrations.some((reg: any) => reg.team.id === userTeam?.id);
  const canRegister = tournament.status === 'open' && 
                     (tournament.currentTeams || 0) < tournament.maxTeams && 
                     userTeam && 
                     !isRegistered;

  const tournamentMatches = matches.filter((match: any) => match.tournamentId === id);

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button asChild variant="ghost" className="text-gray-400 hover:text-white">
            <Link href="/tournaments">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tournaments
            </Link>
          </Button>
        </div>

        {/* Tournament Header */}
        <div className="relative mb-8">
          <div className="h-64 rounded-xl overflow-hidden">
            <img 
              src={tournament.bannerUrl || "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400"} 
              alt={tournament.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          </div>
          
          <div className="absolute inset-0 flex items-end p-8">
            <div className="w-full">
              <div className="flex items-center gap-4 mb-4">
                <Badge className={getStatusColor(tournament.status)}>
                  {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                </Badge>
                <Badge variant="outline" className="bg-black bg-opacity-60 text-white border-gray-500">
                  {tournament.mode}
                </Badge>
                <Badge variant="outline" className="bg-black bg-opacity-60 text-white border-gray-500">
                  {tournament.type}
                </Badge>
              </div>
              
              <h1 className="text-4xl font-bold mb-2">{tournament.name}</h1>
              <p className="text-gray-200 text-lg max-w-2xl">
                {tournament.description || "Experience intense competition in this exciting BGMI tournament."}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-card-bg">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="teams">Teams</TabsTrigger>
                <TabsTrigger value="matches">Matches</TabsTrigger>
                <TabsTrigger value="rules">Rules</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card className="bg-card-bg border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-bgmi-gold" />
                      Tournament Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-5 w-5 text-bgmi-gold" />
                        <div>
                          <p className="text-gray-400 text-sm">Prize Pool</p>
                          <p className="font-bold text-bgmi-gold">₹{Number(tournament.prizePool).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-white" />
                        <div>
                          <p className="text-gray-400 text-sm">Teams</p>
                          <p className="font-bold">{tournament.currentTeams}/{tournament.maxTeams}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-white" />
                        <div>
                          <p className="text-gray-400 text-sm">Start Date</p>
                          <p className="font-bold">
                            {new Date(tournament.startDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-white" />
                        <div>
                          <p className="text-gray-400 text-sm">Start Time</p>
                          <p className="font-bold">
                            {new Date(tournament.startDate).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {tournament.description && (
                  <Card className="bg-card-bg border-gray-700">
                    <CardHeader>
                      <CardTitle>About This Tournament</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 leading-relaxed">{tournament.description}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="teams" className="space-y-6">
                <Card className="bg-card-bg border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Registered Teams ({registrations.length})</span>
                      <Badge variant="outline">{tournament.currentTeams}/{tournament.maxTeams} slots filled</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {registrations.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">No teams registered yet. Be the first to join!</p>
                    ) : (
                      <div className="space-y-4">
                        {registrations.map((registration: any, index: number) => (
                          <div key={registration.id} className="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 gaming-gradient rounded-lg flex items-center justify-center font-bold text-white">
                                {index + 1}
                              </div>
                              <div>
                                <h4 className="font-semibold">{registration.team.name}</h4>
                                <p className="text-sm text-gray-400">#{registration.team.tag}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-400">Registered</p>
                              <p className="text-sm">
                                {new Date(registration.registeredAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="matches" className="space-y-6">
                <Card className="bg-card-bg border-gray-700">
                  <CardHeader>
                    <CardTitle>Tournament Matches</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {tournamentMatches.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">No matches scheduled yet.</p>
                    ) : (
                      <div className="space-y-4">
                        {tournamentMatches.map((match: any) => (
                          <div key={match.id} className="p-4 bg-dark-bg rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{match.name}</h4>
                              <Badge className={getStatusColor(match.status)}>
                                {match.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <span>{match.round}</span>
                              <span>•</span>
                              <span>{new Date(match.startTime).toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rules" className="space-y-6">
                <Card className="bg-card-bg border-gray-700">
                  <CardHeader>
                    <CardTitle>Tournament Rules</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {tournament.rules ? (
                      <div className="prose prose-gray max-w-none">
                        <pre className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                          {tournament.rules}
                        </pre>
                      </div>
                    ) : (
                      <p className="text-gray-400">No specific rules have been set for this tournament.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <Card className="bg-card-bg border-gray-700">
              <CardHeader>
                <CardTitle>Registration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!user ? (
                  <div className="text-center">
                    <p className="text-gray-400 mb-4">Login to register for this tournament</p>
                    <Button asChild className="w-full bg-bgmi-orange hover:bg-orange-600">
                      <a href="/api/login">Login to Register</a>
                    </Button>
                  </div>
                ) : !userTeam ? (
                  <div className="text-center">
                    <p className="text-gray-400 mb-4">You need to be part of a team to register</p>
                    <Button asChild className="w-full bg-bgmi-orange hover:bg-orange-600">
                      <Link href="/team">Create or Join Team</Link>
                    </Button>
                  </div>
                ) : isRegistered ? (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-success-green bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="h-8 w-8 text-success-green" />
                    </div>
                    <p className="font-semibold text-success-green mb-2">Already Registered!</p>
                    <p className="text-gray-400 text-sm">Your team is registered for this tournament</p>
                  </div>
                ) : canRegister ? (
                  <div className="text-center">
                    <p className="text-gray-400 mb-4">Register your team for this tournament</p>
                    <Button 
                      onClick={handleRegister}
                      disabled={registerMutation.isPending}
                      className="w-full bg-bgmi-orange hover:bg-orange-600"
                    >
                      {registerMutation.isPending ? "Registering..." : "Register Team"}
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">Team: {userTeam.name}</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-400 mb-2">Registration Closed</p>
                    <p className="text-sm text-gray-500">
                      {tournament.status !== 'open' 
                        ? "Tournament is no longer open for registration"
                        : "All slots are filled"
                      }
                    </p>
                  </div>
                )}

                <Separator className="bg-gray-700" />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Spots remaining</span>
                  <span className="font-semibold">
                    {Math.max(0, tournament.maxTeams - (tournament.currentTeams || 0))}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 border-gray-600">
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tournament Organizer */}
            <Card className="bg-card-bg border-gray-700">
              <CardHeader>
                <CardTitle>Organizer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-bgmi-orange rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">Tournament Admin</p>
                    <p className="text-sm text-gray-400">Verified Organizer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-card-bg border-gray-700">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Format</span>
                  <span>{tournament.mode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Entry Fee</span>
                  <span className={tournament.type === 'Free' ? 'text-success-green' : 'text-white'}>
                    {tournament.type === 'Free' ? 'Free' : tournament.type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Max Teams</span>
                  <span>{tournament.maxTeams}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Created</span>
                  <span className="text-sm">
                    {tournament.createdAt ? new Date(tournament.createdAt).toLocaleDateString() : "N/A"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
