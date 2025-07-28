import { useState } from "react";
import { useMatchReplays, useTournaments } from "@/hooks/useApi";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Download, 
  Eye, 
  ThumbsUp, 
  Search, 
  Filter,
  Calendar,
  Clock,
  Trophy,
  Users,
  ExternalLink
} from "lucide-react";
import { Link } from "wouter";

export default function Replays() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [filterTournament, setFilterTournament] = useState("all");

  const { data: replays = [], isLoading } = useMatchReplays();
  const { data: tournaments = [] } = useTournaments();

  // Mock additional replay data for better UX
  const enhancedReplays = replays.map((replay: any, index: number) => ({
    ...replay,
    views: replay.views || Math.floor(Math.random() * 100000) + 10000,
    likes: replay.likes || Math.floor(Math.random() * 5000) + 500,
    duration: replay.duration || `${Math.floor(Math.random() * 45) + 15}:${(Math.floor(Math.random() * 60)).toString().padStart(2, '0')}`,
    thumbnailUrl: replay.thumbnailUrl || `https://images.unsplash.com/photo-${
      index % 3 === 0 ? '1542751371-adc38448a05e' : 
      index % 3 === 1 ? '1493711662062-fa541adb3fc8' : 
      '1511512578047-dfb367046420'
    }?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225`,
  }));

  const filteredReplays = enhancedReplays.filter((replay: any) => {
    const matchesSearch = replay.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         replay.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTournament = filterTournament === "all" || replay.matchId?.includes(filterTournament);
    
    return matchesSearch && matchesTournament;
  });

  const sortedReplays = [...filteredReplays].sort((a: any, b: any) => {
    switch (sortBy) {
      case "views":
        return b.views - a.views;
      case "likes":
        return b.likes - a.likes;
      case "duration":
        return b.duration.localeCompare(a.duration);
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const getReplayTypeBadge = (title: string) => {
    if (title.toLowerCase().includes('final')) return { text: 'Final', class: 'bg-error-red text-white' };
    if (title.toLowerCase().includes('semi')) return { text: 'Semi Final', class: 'bg-bgmi-gold text-dark-bg' };
    if (title.toLowerCase().includes('highlight')) return { text: 'Highlights', class: 'bg-purple-600 text-white' };
    return { text: 'Match', class: 'bg-bgmi-orange text-white' };
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Match Replays</h1>
          <p className="text-gray-400">Watch the best moments from BGMI tournaments and matches</p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input 
                type="text" 
                placeholder="Search replays..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-card-bg border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-bgmi-orange"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Select value={filterTournament} onValueChange={setFilterTournament}>
              <SelectTrigger className="bg-card-bg border-gray-600 text-white min-w-[160px]">
                <SelectValue placeholder="All Tournaments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tournaments</SelectItem>
                {tournaments.slice(0, 5).map((tournament: any) => (
                  <SelectItem key={tournament.id} value={tournament.id}>
                    {tournament.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-card-bg border-gray-600 text-white min-w-[140px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest First</SelectItem>
                <SelectItem value="views">Most Viewed</SelectItem>
                <SelectItem value="likes">Most Liked</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-gray-400">
            {sortedReplays.length} replays found
          </span>
          {(searchQuery || filterTournament !== "all") && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setSearchQuery("");
                setFilterTournament("all");
              }}
              className="text-gray-400 hover:text-white"
            >
              <Filter className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>

        {/* Featured Replay */}
        {sortedReplays.length > 0 && (
          <Card className="bg-card-bg border-gray-700 mb-8 overflow-hidden">
            <div className="relative">
              <img 
                src={sortedReplays[0].thumbnailUrl}
                alt={sortedReplays[0].title}
                className="w-full h-64 lg:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Button className="bg-bgmi-orange hover:bg-orange-600 text-white w-20 h-20 rounded-full">
                  <Play className="text-2xl ml-1" />
                </Button>
              </div>
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded text-sm">
                {sortedReplays[0].duration}
              </div>
              <div className="absolute top-4 left-4">
                <Badge className="bg-bgmi-orange text-white">Featured</Badge>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{sortedReplays[0].title}</h2>
                  <p className="text-gray-400 mb-4">{sortedReplays[0].description}</p>
                  <div className="flex items-center gap-6 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {sortedReplays[0].views.toLocaleString()} views
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      {sortedReplays[0].likes.toLocaleString()} likes
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(sortedReplays[0].createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button className="bg-bgmi-orange hover:bg-orange-600 text-white">
                    <Play className="mr-2 h-4 w-4" />
                    Watch Now
                  </Button>
                  <Button variant="outline" className="border-gray-600">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Replays Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-card-bg border-gray-700 animate-pulse">
                <div className="h-48 bg-gray-700 rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-700 rounded w-16"></div>
                    <div className="h-3 bg-gray-700 rounded w-16"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sortedReplays.length === 0 ? (
          <Card className="bg-card-bg border-gray-700 text-center py-12">
            <CardContent>
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 gaming-gradient rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Play className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-bold mb-2">No replays found</h3>
                <p className="text-gray-400 mb-6">
                  {searchQuery || filterTournament !== "all"
                    ? "Try adjusting your search criteria or filters"
                    : "Match replays will appear here once tournaments are completed"
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedReplays.slice(1).map((replay: any) => {
              const badge = getReplayTypeBadge(replay.title);
              
              return (
                <Card key={replay.id} className="bg-card-bg border-gray-700 card-hover overflow-hidden">
                  <div className="relative">
                    <img 
                      src={replay.thumbnailUrl}
                      alt={replay.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button className="bg-bgmi-orange hover:bg-orange-600 text-white w-16 h-16 rounded-full">
                        <Play className="text-xl ml-1" />
                      </Button>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                      {replay.duration}
                    </div>
                    <div className="absolute top-4 left-4">
                      <Badge className={badge.class}>
                        {badge.text}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-bold mb-2 line-clamp-2">{replay.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {replay.description || "Epic highlights and key moments from this intense BGMI match."}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {replay.views > 1000 ? `${Math.floor(replay.views / 1000)}K` : replay.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        {replay.likes > 1000 ? `${Math.floor(replay.likes / 1000)}K` : replay.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(replay.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-bgmi-orange hover:bg-orange-600 text-white text-sm">
                        <Play className="mr-2 h-3 w-3" />
                        Watch
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-gray-600 hover:border-bgmi-orange"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-gray-600 hover:border-bgmi-orange"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Popular Categories */}
        {!isLoading && sortedReplays.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-card-bg border-gray-700 card-hover">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-error-red bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Trophy className="text-error-red text-lg" />
                  </div>
                  <h3 className="font-bold mb-2">Tournament Finals</h3>
                  <p className="text-gray-400 text-sm mb-4">Championship matches and grand finals</p>
                  <Button variant="outline" size="sm" className="border-gray-600">
                    View All
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card-bg border-gray-700 card-hover">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-600 bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="text-purple-400 text-lg" />
                  </div>
                  <h3 className="font-bold mb-2">Best Moments</h3>
                  <p className="text-gray-400 text-sm mb-4">Highlight reels and clutch plays</p>
                  <Button variant="outline" size="sm" className="border-gray-600">
                    View All
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card-bg border-gray-700 card-hover">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-bgmi-orange bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Clock className="text-bgmi-orange text-lg" />
                  </div>
                  <h3 className="font-bold mb-2">Recent Matches</h3>
                  <p className="text-gray-400 text-sm mb-4">Latest tournament replays</p>
                  <Button variant="outline" size="sm" className="border-gray-600">
                    View All
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
