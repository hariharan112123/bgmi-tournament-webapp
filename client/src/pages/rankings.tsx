import { useState } from "react";
import { usePlayerRankings, useTeamRankings, useStats } from "@/hooks/useApi";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Users, 
  TrendingUp, 
  Crown, 
  Medal, 
  Target,
  DollarSign,
  Calendar,
  Star
} from "lucide-react";

export default function Rankings() {
  const [selectedPeriod, setSelectedPeriod] = useState("all");

  const { data: playerRankings = [], isLoading: playersLoading } = usePlayerRankings();
  const { data: teamRankings = [], isLoading: teamsLoading } = useTeamRankings();
  const { data: stats } = useStats();

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="h-5 w-5 text-bgmi-gold" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-orange-600" />;
      default:
        return <span className="font-bold text-gray-400">#{position}</span>;
    }
  };

  const getRankBadgeColor = (position: number) => {
    switch (position) {
      case 1:
        return "bg-bgmi-gold text-dark-bg";
      case 2:
        return "bg-gray-400 text-dark-bg";
      case 3:
        return "bg-orange-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Rankings</h1>
          <p className="text-gray-400">Top players and teams in the BGMI competitive scene</p>
        </div>

        {/* Overall Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-card-bg border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 gaming-gradient rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Trophy className="text-white text-lg" />
                </div>
                <div className="text-2xl font-bold text-bgmi-orange">{stats.activeTournaments}</div>
                <div className="text-sm text-gray-400">Active Tournaments</div>
              </CardContent>
            </Card>

            <Card className="bg-card-bg border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 gaming-gradient rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="text-white text-lg" />
                </div>
                <div className="text-2xl font-bold text-bgmi-gold">{stats.registeredTeams}</div>
                <div className="text-sm text-gray-400">Registered Teams</div>
              </CardContent>
            </Card>

            <Card className="bg-card-bg border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 gaming-gradient rounded-lg flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="text-white text-lg" />
                </div>
                <div className="text-2xl font-bold text-success-green">₹{Number(stats.totalPrizePool).toLocaleString()}</div>
                <div className="text-sm text-gray-400">Prize Pool</div>
              </CardContent>
            </Card>

            <Card className="bg-card-bg border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 gaming-gradient rounded-lg flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="text-white text-lg" />
                </div>
                <div className="text-2xl font-bold text-white">{stats.liveMatches}</div>
                <div className="text-sm text-gray-400">Live Matches</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Rankings Tabs */}
        <Tabs defaultValue="players" className="w-full">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <TabsList className="grid w-full lg:w-auto grid-cols-2 bg-card-bg">
              <TabsTrigger value="players">Player Rankings</TabsTrigger>
              <TabsTrigger value="teams">Team Rankings</TabsTrigger>
            </TabsList>

            {/* Time Period Filter */}
            <div className="flex gap-2">
              {["all", "month", "week"].map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPeriod(period)}
                  className={selectedPeriod === period ? "bg-bgmi-orange" : "border-gray-600"}
                >
                  {period === "all" ? "All Time" : period === "month" ? "This Month" : "This Week"}
                </Button>
              ))}
            </div>
          </div>

          <TabsContent value="players" className="space-y-6">
            <Card className="bg-card-bg border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-bgmi-orange" />
                  Top Player Rankings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {playersLoading ? (
                  <div className="space-y-4">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-4 p-4 bg-dark-bg rounded-lg animate-pulse">
                        <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                          <div className="h-3 bg-gray-700 rounded w-1/3"></div>
                        </div>
                        <div className="h-6 bg-gray-700 rounded w-16"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {playerRankings.map((player: any, index: number) => (
                      <div 
                        key={player.id} 
                        className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                          index < 3 ? 'bg-gradient-to-r from-dark-bg to-card-bg border border-gray-600' : 'bg-dark-bg hover:bg-gray-800'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            {getRankIcon(index + 1)}
                          </div>
                          
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={player.profileImageUrl} alt={player.username} />
                            <AvatarFallback className="bg-bgmi-orange text-white">
                              {player.username?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{player.username || "Anonymous Player"}</span>
                              {index < 3 && <Star className="h-4 w-4 text-bgmi-gold" />}
                            </div>
                            <div className="text-sm text-gray-400">
                              ID: #{player.id.slice(-6).toUpperCase()}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-6 text-right">
                          <div>
                            <div className="font-bold text-success-green">{player.totalPoints || 0}</div>
                            <div className="text-xs text-gray-400">Points</div>
                          </div>
                          <div>
                            <div className="font-bold text-bgmi-gold">{player.tournamentsWon || 0}</div>
                            <div className="text-xs text-gray-400">Wins</div>
                          </div>
                          <div>
                            <div className="font-bold text-white">{player.totalKills || 0}</div>
                            <div className="text-xs text-gray-400">Kills</div>
                          </div>
                          <Badge className={getRankBadgeColor(index + 1)}>
                            #{index + 1}
                          </Badge>
                        </div>
                      </div>
                    ))}

                    {playerRankings.length === 0 && (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 gaming-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                          <Target className="text-white text-xl" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No Player Rankings Yet</h3>
                        <p className="text-gray-400">Rankings will appear once players start competing in tournaments.</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teams" className="space-y-6">
            <Card className="bg-card-bg border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-bgmi-orange" />
                  Top Team Rankings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {teamsLoading ? (
                  <div className="space-y-4">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-4 p-4 bg-dark-bg rounded-lg animate-pulse">
                        <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                          <div className="h-3 bg-gray-700 rounded w-1/3"></div>
                        </div>
                        <div className="h-6 bg-gray-700 rounded w-16"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {teamRankings.map((team: any, index: number) => (
                      <div 
                        key={team.id} 
                        className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                          index < 3 ? 'bg-gradient-to-r from-dark-bg to-card-bg border border-gray-600' : 'bg-dark-bg hover:bg-gray-800'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            {getRankIcon(index + 1)}
                          </div>
                          
                          <div className="w-12 h-12 gaming-gradient rounded-lg flex items-center justify-center font-bold text-white">
                            {team.tag || team.name.slice(0, 2).toUpperCase()}
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{team.name}</span>
                              {index < 3 && <Star className="h-4 w-4 text-bgmi-gold" />}
                            </div>
                            <div className="text-sm text-gray-400">
                              #{team.tag} • Created {new Date(team.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-6 text-right">
                          <div>
                            <div className="font-bold text-success-green">{team.totalWins || 0}</div>
                            <div className="text-xs text-gray-400">Wins</div>
                          </div>
                          <div>
                            <div className="font-bold text-bgmi-gold">₹{Number(team.totalEarnings || 0).toLocaleString()}</div>
                            <div className="text-xs text-gray-400">Earnings</div>
                          </div>
                          <div>
                            <div className="font-bold text-white">
                              {new Date(team.createdAt).getFullYear()}
                            </div>
                            <div className="text-xs text-gray-400">Since</div>
                          </div>
                          <Badge className={getRankBadgeColor(index + 1)}>
                            #{index + 1}
                          </Badge>
                        </div>
                      </div>
                    ))}

                    {teamRankings.length === 0 && (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 gaming-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                          <Users className="text-white text-xl" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No Team Rankings Yet</h3>
                        <p className="text-gray-400">Rankings will appear once teams start competing in tournaments.</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Achievement Highlights */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-card-bg border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-bgmi-gold" />
                Champion Spotlight
              </CardTitle>
            </CardHeader>
            <CardContent>
              {playerRankings.length > 0 ? (
                <div className="text-center">
                  <Avatar className="w-16 h-16 mx-auto mb-4">
                    <AvatarImage src={playerRankings[0]?.profileImageUrl} />
                    <AvatarFallback className="bg-bgmi-gold text-dark-bg text-lg font-bold">
                      {playerRankings[0]?.username?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-lg">{playerRankings[0]?.username || "Champion"}</h3>
                  <p className="text-sm text-gray-400 mb-3">Current #1 Player</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-dark-bg p-2 rounded">
                      <div className="font-bold text-success-green">{playerRankings[0]?.totalPoints || 0}</div>
                      <div className="text-xs text-gray-400">Points</div>
                    </div>
                    <div className="bg-dark-bg p-2 rounded">
                      <div className="font-bold text-bgmi-gold">{playerRankings[0]?.tournamentsWon || 0}</div>
                      <div className="text-xs text-gray-400">Wins</div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No champion yet</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card-bg border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-bgmi-orange" />
                Top Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              {teamRankings.length > 0 ? (
                <div className="text-center">
                  <div className="w-16 h-16 gaming-gradient rounded-lg flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {teamRankings[0]?.tag || teamRankings[0]?.name?.slice(0, 2).toUpperCase()}
                  </div>
                  <h3 className="font-bold text-lg">{teamRankings[0]?.name}</h3>
                  <p className="text-sm text-gray-400 mb-3">Leading Team</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-dark-bg p-2 rounded">
                      <div className="font-bold text-success-green">{teamRankings[0]?.totalWins || 0}</div>
                      <div className="text-xs text-gray-400">Wins</div>
                    </div>
                    <div className="bg-dark-bg p-2 rounded">
                      <div className="font-bold text-bgmi-gold">₹{Number(teamRankings[0]?.totalEarnings || 0).toLocaleString()}</div>
                      <div className="text-xs text-gray-400">Earned</div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No top team yet</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card-bg border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-success-green" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-bgmi-gold rounded-full"></div>
                  <div className="text-sm">
                    <span className="font-medium">New #1 Player</span>
                    <p className="text-gray-400">Rankings updated</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-success-green rounded-full"></div>
                  <div className="text-sm">
                    <span className="font-medium">Tournament Complete</span>
                    <p className="text-gray-400">Prize distributed</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-bgmi-orange rounded-full"></div>
                  <div className="text-sm">
                    <span className="font-medium">New Team Registered</span>
                    <p className="text-gray-400">Rankings updated</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
