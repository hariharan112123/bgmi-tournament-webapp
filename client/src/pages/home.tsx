import { useAuth } from "@/hooks/useAuth";
import { useTournaments, useMatches, useStats } from "@/hooks/useApi";
import Navbar from "@/components/navbar";
import TournamentCard from "@/components/tournament-card";
import LiveMatchCard from "@/components/live-match-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Users, DollarSign, Play, Search } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user } = useAuth();

  const { data: tournaments = [] } = useTournaments();
  const { data: matches = [] } = useMatches();
  const { data: stats } = useStats();

  const featuredTournaments = tournaments.slice(0, 3);
  const liveMatches = matches.filter((match) => match.status === 'live').slice(0, 2);

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-dark-bg via-transparent to-dark-bg z-10"></div>
        <div className="absolute inset-0 opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600" 
            alt="BGMI Tournament Arena" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-20 max-w-7xl mx-auto px-4 py-20 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold mb-6">
              <span className="text-white">Welcome back,</span>
              <span className="text-bgmi-orange"> {user?.username || 'Champion'}</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Ready to dominate the battlefield? Join tournaments, build your team, and compete for glory.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-bgmi-orange hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold">
                <Link href="/tournaments">
                  <Play className="mr-2 h-5 w-5" />
                  Join Tournament
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-bgmi-gold text-bgmi-gold hover:bg-bgmi-gold hover:text-dark-bg px-8 py-3">
                <Link href="/tournaments/create">
                  <Trophy className="mr-2 h-5 w-5" />
                  Create Tournament
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Live Tournament Stats */}
      {stats && (
        <section className="bg-card-bg border-y border-gray-700 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-bgmi-orange">{stats.activeTournaments}</div>
                <div className="text-gray-400 text-sm">Active Tournaments</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-bgmi-gold">₹{Number(stats.totalPrizePool).toLocaleString()}</div>
                <div className="text-gray-400 text-sm">Total Prize Pool</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-success-green">{stats.registeredTeams}</div>
                <div className="text-gray-400 text-sm">Registered Teams</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{stats.liveMatches}</div>
                <div className="text-gray-400 text-sm">Live Matches</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tournament Filters and Search */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input 
                type="text" 
                placeholder="Search tournaments..." 
                className="w-full bg-card-bg border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-bgmi-orange"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Select>
              <SelectTrigger className="bg-card-bg border-gray-600 text-white">
                <SelectValue placeholder="All Modes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                <SelectItem value="solo">Solo</SelectItem>
                <SelectItem value="duo">Duo</SelectItem>
                <SelectItem value="squad">Squad</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="bg-card-bg border-gray-600 text-white">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="free">Free Entry</SelectItem>
                <SelectItem value="paid">Paid Entry</SelectItem>
                <SelectItem value="invite">Invite Only</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="bg-card-bg border-gray-600 text-white">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Featured Tournaments */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Featured Tournaments</h2>
          <Button asChild variant="ghost" className="text-bgmi-orange hover:text-orange-400">
            <Link href="/tournaments">
              View All →
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTournaments.map((tournament: any) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </div>
      </section>

      {/* Live Matches Section */}
      {liveMatches.length > 0 && (
        <section className="bg-card-bg py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Live Matches</h2>
              <div className="flex items-center space-x-2 text-success-green">
                <div className="w-2 h-2 bg-success-green rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">{liveMatches.length} Live Now</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {liveMatches.map((match: any) => (
                <LiveMatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card-bg border-gray-700 card-hover">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 gaming-gradient rounded-lg flex items-center justify-center mx-auto mb-4">
                <Trophy className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">Browse Tournaments</h3>
              <p className="text-gray-400 mb-4">Find the perfect tournament to showcase your skills</p>
              <Button asChild className="w-full bg-bgmi-orange hover:bg-orange-600">
                <Link href="/tournaments">Browse Now</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card-bg border-gray-700 card-hover">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 gaming-gradient rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">Manage Team</h3>
              <p className="text-gray-400 mb-4">Build your squad and invite the best players</p>
              <Button asChild className="w-full bg-bgmi-orange hover:bg-orange-600">
                <Link href="/team">Manage Team</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card-bg border-gray-700 card-hover">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 gaming-gradient rounded-lg flex items-center justify-center mx-auto mb-4">
                <DollarSign className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">View Rankings</h3>
              <p className="text-gray-400 mb-4">Check leaderboards and player statistics</p>
              <Button asChild className="w-full bg-bgmi-orange hover:bg-orange-600">
                <Link href="/rankings">View Rankings</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
