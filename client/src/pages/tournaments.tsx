import { useState } from "react";
import { useTournaments } from "@/hooks/useApi";
import Navbar from "@/components/navbar";
import TournamentCard from "@/components/tournament-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Plus, Filter } from "lucide-react";
import { Link } from "wouter";

export default function Tournaments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [modeFilter, setModeFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: tournaments = [], isLoading } = useTournaments();

  const filteredTournaments = tournaments.filter((tournament) => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tournament.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMode = modeFilter === "all" || tournament.mode.toLowerCase() === modeFilter;
    const matchesType = typeFilter === "all" || tournament.type.toLowerCase() === typeFilter;
    const matchesStatus = statusFilter === "all" || tournament.status === statusFilter;
    
    return matchesSearch && matchesMode && matchesType && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg text-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-card-bg border-gray-700 animate-pulse">
                <div className="h-48 bg-gray-700 rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded mb-4"></div>
                  <div className="space-y-2">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="h-4 bg-gray-700 rounded"></div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <Navbar />

      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Tournaments</h1>
            <p className="text-gray-400">Discover and join exciting BGMI tournaments</p>
          </div>
          <Button asChild className="bg-bgmi-orange hover:bg-orange-600 text-white">
            <Link href="/tournaments/create">
              <Plus className="mr-2 h-5 w-5" />
              Create Tournament
            </Link>
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input 
                type="text" 
                placeholder="Search tournaments..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-card-bg border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-bgmi-orange"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Select value={modeFilter} onValueChange={setModeFilter}>
              <SelectTrigger className="bg-card-bg border-gray-600 text-white min-w-[120px]">
                <SelectValue placeholder="All Modes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                <SelectItem value="solo">Solo</SelectItem>
                <SelectItem value="duo">Duo</SelectItem>
                <SelectItem value="squad">Squad</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="bg-card-bg border-gray-600 text-white min-w-[120px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="free">Free Entry</SelectItem>
                <SelectItem value="paid">Paid Entry</SelectItem>
                <SelectItem value="invite">Invite Only</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-card-bg border-gray-600 text-white min-w-[120px]">
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

        {/* Results count */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-gray-400">
            {filteredTournaments.length} tournaments found
          </span>
          {(searchQuery || modeFilter !== "all" || typeFilter !== "all" || statusFilter !== "all") && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setSearchQuery("");
                setModeFilter("all");
                setTypeFilter("all");
                setStatusFilter("all");
              }}
              className="text-gray-400 hover:text-white"
            >
              <Filter className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>
      </section>

      {/* Tournaments Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        {filteredTournaments.length === 0 ? (
          <Card className="bg-card-bg border-gray-700 text-center py-12">
            <CardContent>
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 gaming-gradient rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Search className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-bold mb-2">No tournaments found</h3>
                <p className="text-gray-400 mb-6">
                  {searchQuery || modeFilter !== "all" || typeFilter !== "all" || statusFilter !== "all"
                    ? "Try adjusting your search criteria or filters"
                    : "Be the first to create a tournament!"
                  }
                </p>
                <Button asChild className="bg-bgmi-orange hover:bg-orange-600">
                  <Link href="/tournaments/create">
                    Create Tournament
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map((tournament: any) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
