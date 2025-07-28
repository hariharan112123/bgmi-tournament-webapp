import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Calendar, DollarSign, Share } from "lucide-react";
import { Link } from "wouter";

interface TournamentCardProps {
  tournament: {
    id: string;
    name: string;
    description?: string;
    mode: string;
    type: string;
    status: string;
    prizePool: string;
    currentTeams: number;
    maxTeams: number;
    startDate: string;
    bannerUrl?: string;
  };
}

export default function TournamentCard({ tournament }: TournamentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-success-green text-dark-bg';
      case 'open': return 'bg-bgmi-orange text-white';
      case 'completed': return 'bg-gray-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'live': return 'Live';
      case 'open': return 'Open';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const isRegistrationClosed = tournament.currentTeams >= tournament.maxTeams || tournament.status !== 'open';

  return (
    <Card className="bg-card-bg border-gray-700 card-hover overflow-hidden">
      <div className="relative">
        <img 
          src={tournament.bannerUrl || "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"} 
          alt={tournament.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <Badge className={getStatusColor(tournament.status)}>
            {getStatusLabel(tournament.status)}
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <Badge variant="outline" className="bg-black bg-opacity-60 text-white border-gray-500">
            {tournament.mode}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-2 text-white">{tournament.name}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {tournament.description || "Experience intense competition in this exciting BGMI tournament."}
        </p>
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              Prize Pool
            </span>
            <span className="text-bgmi-gold font-semibold">₹{Number(tournament.prizePool).toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm flex items-center">
              <Users className="h-4 w-4 mr-1" />
              Teams
            </span>
            <span className="text-white">{tournament.currentTeams}/{tournament.maxTeams}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Starts
            </span>
            <span className="text-white text-sm">
              {new Date(tournament.startDate).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Entry</span>
            <span className={tournament.type === 'Free' ? "text-success-green font-medium" : "text-white"}>
              {tournament.type === 'Free' ? 'Free' : tournament.type}
            </span>
          </div>
        </div>
        
        <div className="flex gap-3">
          {tournament.status === 'live' ? (
            <Button asChild className="flex-1 bg-error-red hover:bg-red-600 text-white">
              <Link href={`/tournaments/${tournament.id}`}>
                <Trophy className="mr-2 h-4 w-4" />
                Watch Live
              </Link>
            </Button>
          ) : (
            <Button 
              asChild 
              className="flex-1 bg-bgmi-orange hover:bg-orange-600 text-white"
              disabled={isRegistrationClosed}
            >
              <Link href={`/tournaments/${tournament.id}`}>
                {isRegistrationClosed ? (
                  tournament.status === 'completed' ? 'View Results' : 'Registration Closed'
                ) : (
                  <>
                    <Trophy className="mr-2 h-4 w-4" />
                    Register Now
                  </>
                )}
              </Link>
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="icon"
            className="border-gray-600 hover:border-bgmi-orange"
          >
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
