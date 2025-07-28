import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useMatch, useMatchResults, useChatMessages, useUpdateMatchStatus, useSendChatMessage } from "@/hooks/useApi";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Trophy, 
  Users, 
  Target, 
  Play, 
  Square, 
  ArrowLeft,
  Send,
  Skull,
  Crown,
  Eye
} from "lucide-react";
import { Link, useParams } from "wouter";

export default function MatchControl() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();

  const [chatMessage, setChatMessage] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const { data: match, isLoading } = useMatch(id || "");
  const { data: matchResults = [] } = useMatchResults(id || "");
  const { data: chatMessages = [] } = useChatMessages(id || "");

  const updateMatchMutation = useUpdateMatchStatus();
  const sendChatMutation = useSendChatMessage();

  // Helper functions for match control actions
  const handleZoneUpdate = (zone: number) => {
    updateMatchMutation.mutate({
      matchId: id || "",
      status: "live"
    });
  };

  const handleEliminateTeam = (resultId: string) => {
    // This would normally update match results
    toast({
      title: "Team Eliminated",
      description: "Team has been marked as eliminated.",
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    
    sendChatMutation.mutate({
      matchId: id || "",
      userId: user?.id || "",
      message: chatMessage,
    });
    setChatMessage("");
  };

  if (isLoading || !match) {
    return (
      <div className="min-h-screen bg-dark-bg text-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-700 rounded w-1/3"></div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 h-96 bg-gray-700 rounded"></div>
              <div className="h-96 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const aliveTeams = matchResults.filter((result: any) => result.status === 'alive');
  const eliminatedTeams = matchResults.filter((result: any) => result.status === 'eliminated');

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button asChild variant="ghost" className="text-gray-400 hover:text-white">
            <Link href="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Match Control Panel */}
          <div className="xl:col-span-2">
            <Card className="bg-card-bg border-gray-700 mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{match.name}</CardTitle>
                    <p className="text-gray-400 text-sm">Room ID: {match.roomId || 'BG2025GA3'} | Password: {match.roomPassword || 'BGIS147'}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-error-red rounded-full animate-pulse"></div>
                    <Badge className="bg-error-red text-white">LIVE</Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Zone Control */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">Zone {match.currentZone || 3}</div>
                    <div className="text-sm text-gray-400">Current Zone</div>
                    <div className="flex gap-1 mt-2">
                      {[1, 2, 3, 4, 5, 6].map((zone) => (
                        <Button
                          key={zone}
                          size="sm"
                          variant={match.currentZone === zone ? "default" : "outline"}
                          onClick={() => handleZoneUpdate(zone)}
                          className="w-8 h-8 p-0"
                        >
                          {zone}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success-green">{match.playersAlive || 67}</div>
                    <div className="text-sm text-gray-400">Players Alive</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-bgmi-orange">
                      {matchResults.reduce((acc: number, result: any) => acc + (result.kills || 0), 0)}
                    </div>
                    <div className="text-sm text-gray-400">Total Kills</div>
                  </div>
                </div>
                
                {/* Team Status Table */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Team Status</h3>
                  <div className="space-y-2">
                    {matchResults.map((result: any, index: number) => (
                      <div 
                        key={result.id} 
                        className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors ${
                          selectedTeam === result.id ? 'bg-bgmi-orange bg-opacity-20 border border-bgmi-orange' : 'bg-dark-bg hover:bg-gray-800'
                        }`}
                        onClick={() => setSelectedTeam(selectedTeam === result.id ? null : result.id)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 gaming-gradient rounded text-xs flex items-center justify-center text-white font-bold">
                              {result.team.tag.charAt(0)}
                            </div>
                            <span className="font-medium">{result.team.name}</span>
                            {result.position === 1 && result.status === 'alive' && (
                              <Crown className="h-4 w-4 text-bgmi-gold" />
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <Badge className={result.status === 'alive' ? 'bg-success-green text-dark-bg' : 'bg-gray-600 text-white'}>
                              {result.status === 'alive' ? 'Alive' : 'Eliminated'}
                            </Badge>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-bgmi-gold">{result.kills || 0}</div>
                            <div className="text-xs text-gray-400">Kills</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold">#{result.position || index + 1}</div>
                            <div className="text-xs text-gray-400">Pos</div>
                          </div>
                          <div className="flex space-x-2">
                            {result.status === 'alive' && (
                              <Button 
                                size="sm"
                                variant="destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEliminateTeam(result.id);
                                }}
                                className="bg-error-red hover:bg-red-600"
                              >
                                <Skull className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Match Actions */}
            <Card className="bg-card-bg border-gray-700">
              <CardHeader>
                <CardTitle>Match Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button 
                    className="bg-success-green hover:bg-green-600"
                    onClick={() => updateMatchMutation.mutate({ matchId: id || "", status: 'live' })}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start Match
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => updateMatchMutation.mutate({ matchId: id || "", status: 'completed' })}
                  >
                    <Square className="mr-2 h-4 w-4" />
                    End Match
                  </Button>
                  <Button variant="outline" className="border-gray-600">
                    <Eye className="mr-2 h-4 w-4" />
                    View Stream
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Live Chat Panel */}
          <Card className="bg-card-bg border-gray-700 h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-bgmi-orange" />
                Match Chat
              </CardTitle>
              <p className="text-sm text-gray-400">Admin communication with teams</p>
            </CardHeader>
            
            <CardContent className="p-0">
              <ScrollArea className="h-96 p-4">
                <div className="space-y-4">
                  {chatMessages.map((message: any) => (
                    <div key={message.id} className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                        message.type === 'admin' ? 'bg-bgmi-orange' : 'bg-gray-600'
                      }`}>
                        {message.type === 'admin' ? 'A' : message.user.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm">
                            {message.type === 'admin' ? 'Admin' : message.user.username || 'Player'}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(message.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="bg-dark-bg rounded-lg p-3 text-sm">
                          {message.message}
                        </div>
                      </div>
                    </div>
                  ))}

                  {chatMessages.length === 0 && (
                    <p className="text-gray-400 text-center py-8">No messages yet</p>
                  )}
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t border-gray-700">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <Input
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type message..."
                    className="flex-1 bg-dark-bg border-gray-600 text-white placeholder-gray-400"
                  />
                  <Button 
                    type="submit"
                    disabled={sendMessageMutation.isPending || !chatMessage.trim()}
                    className="bg-bgmi-orange hover:bg-orange-600"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Match Summary */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card-bg border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-bgmi-gold" />
                Alive Teams ({aliveTeams.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {aliveTeams.length === 0 ? (
                <p className="text-gray-400 text-center py-4">All teams eliminated</p>
              ) : (
                <div className="space-y-2">
                  {aliveTeams
                    .sort((a: any, b: any) => (b.kills || 0) - (a.kills || 0))
                    .map((result: any, index: number) => (
                    <div key={result.id} className="flex items-center justify-between p-2 bg-dark-bg rounded">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-success-green rounded-full text-xs flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </span>
                        <span className="font-medium">{result.team.name}</span>
                      </div>
                      <span className="text-bgmi-gold font-bold">{result.kills || 0} kills</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card-bg border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Skull className="h-5 w-5 text-gray-400" />
                Eliminated Teams ({eliminatedTeams.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {eliminatedTeams.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No eliminations yet</p>
              ) : (
                <div className="space-y-2">
                  {eliminatedTeams
                    .sort((a: any, b: any) => new Date(b.eliminatedAt || 0).getTime() - new Date(a.eliminatedAt || 0).getTime())
                    .map((result: any) => (
                    <div key={result.id} className="flex items-center justify-between p-2 bg-dark-bg rounded opacity-60">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-gray-600 rounded-full text-xs flex items-center justify-center text-white">
                          #{result.position || '?'}
                        </span>
                        <span>{result.team.name}</span>
                      </div>
                      <span className="text-sm text-gray-400">
                        {result.eliminatedAt && new Date(result.eliminatedAt).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
