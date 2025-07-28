import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, BarChart3, ExternalLink } from "lucide-react";
import { Link } from "wouter";

interface LiveMatchCardProps {
  match: {
    id: string;
    name: string;
    round: string;
    currentZone?: number;
    playersAlive?: number;
    tournamentId: string;
  };
}

export default function LiveMatchCard({ match }: LiveMatchCardProps) {
  // Mock team data for demonstration
  const mockTeams = [
    { name: "TSM Entity", kills: 15, position: 1, color: "text-bgmi-gold" },
    { name: "Soul Official", kills: 12, position: 2, color: "text-white" },
    { name: "GodLike Esports", kills: 11, position: 3, color: "text-orange-500" },
  ];

  return (
    <Card className="bg-dark-bg border-gray-700 card-hover">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-error-red rounded-full animate-pulse"></div>
            <Badge className="bg-error-red text-white">LIVE</Badge>
            <span className="text-sm text-gray-400">
              Zone {match.currentZone || 3} - {match.playersAlive || 67} Alive
            </span>
          </div>
          <Button variant="ghost" size="icon" className="text-bgmi-orange hover:text-orange-400">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
        
        <h3 className="text-lg font-semibold mb-3 text-white">{match.name}</h3>
        
        <div className="space-y-2 mb-4">
          {mockTeams.map((team, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${
                  index === 0 ? 'bg-bgmi-gold' : 
                  index === 1 ? 'bg-white' : 'bg-orange-500'
                }`}></span>
                <span className="text-sm font-medium">{team.name}</span>
              </div>
              <span className={`text-sm ${team.color}`}>{team.kills} Kills</span>
            </div>
          ))}
        </div>
        
        <div className="flex gap-3">
          <Button asChild className="flex-1 bg-error-red hover:bg-red-600 text-white">
            <Link href={`/matches/${match.id}/control`}>
              <Play className="mr-2 h-4 w-4" />
              Watch Live
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            className="border-gray-600 hover:border-bgmi-orange"
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
