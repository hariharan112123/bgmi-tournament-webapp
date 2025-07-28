import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { 
  Tournament, 
  Team, 
  Match, 
  MatchResult, 
  MatchReplay, 
  ChatMessage,
  TeamInvitation,
  TeamMember,
  TournamentRegistration,
  InsertTournament,
  InsertTeam,
  InsertTeamInvitation,
  InsertMatch,
  InsertMatchResult,
  InsertChatMessage,
  InsertMatchReplay
} from "@shared/schema";

// Tournament hooks
export function useTournaments() {
  return useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
  });
}

export function useTournament(id: string) {
  return useQuery<Tournament>({
    queryKey: ["/api/tournaments", id],
  });
}

export function useTournamentRegistrations(tournamentId: string) {
  return useQuery<TournamentRegistration[]>({
    queryKey: ["/api/tournaments", tournamentId, "registrations"],
  });
}

// Team hooks
export function useTeams() {
  return useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });
}

export function useTeam(id: string) {
  return useQuery<Team>({
    queryKey: ["/api/teams", id],
  });
}

export function useUserTeam(userId: string) {
  return useQuery<Team | null>({
    queryKey: ["/api/users", userId, "team"],
  });
}

export function useTeamMembers(teamId: string) {
  return useQuery<TeamMember[]>({
    queryKey: ["/api/teams", teamId, "members"],
  });
}

export function useTeamInvitations(userId: string) {
  return useQuery<TeamInvitation[]>({
    queryKey: ["/api/users", userId, "invitations"],
  });
}

// Match hooks
export function useMatches() {
  return useQuery<Match[]>({
    queryKey: ["/api/matches"],
  });
}

export function useMatch(id: string) {
  return useQuery<Match>({
    queryKey: ["/api/matches", id],
  });
}

export function useMatchResults(matchId: string) {
  return useQuery<MatchResult[]>({
    queryKey: ["/api/matches", matchId, "results"],
  });
}

export function useMatchReplays() {
  return useQuery<MatchReplay[]>({
    queryKey: ["/api/replays"],
  });
}

export function useChatMessages(matchId: string) {
  return useQuery<ChatMessage[]>({
    queryKey: ["/api/matches", matchId, "chat"],
  });
}

// Stats hooks
export function useStats() {
  return useQuery<{
    activeTournaments: number;
    totalPrizePool: string;
    registeredTeams: number;
    liveMatches: number;
  }>({
    queryKey: ["/api/stats"],
  });
}

export function usePlayerRankings() {
  return useQuery<Array<{
    id: string;
    username: string;
    email: string;
    profileImageUrl: string;
    totalPoints: number;
    tournamentsWon: number;
    totalKills: number;
    rank: number;
  }>>({
    queryKey: ["/api/rankings/players"],
  });
}

export function useTeamRankings() {
  return useQuery<Array<{
    id: string;
    name: string;
    tag: string;
    totalWins: number;
    totalEarnings: string;
    rank: number;
  }>>({
    queryKey: ["/api/rankings/teams"],
  });
}

// Mutation hooks
export function useCreateTournament() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertTournament) => {
      const response = await apiRequest("POST", "/api/tournaments", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
  });
}

export function useCreateTeam() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertTeam) => {
      const response = await apiRequest("POST", "/api/teams", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
    },
  });
}

export function useInviteToTeam() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertTeamInvitation) => {
      const response = await apiRequest("POST", "/api/team-invitations", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
  });
}

export function useRegisterForTournament() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ tournamentId, teamId }: { tournamentId: string; teamId: string }) => {
      const response = await apiRequest("POST", `/api/tournaments/${tournamentId}/register`, { teamId });
      return response.json();
    },
    onSuccess: (_, { tournamentId }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments", tournamentId] });
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments", tournamentId, "registrations"] });
    },
  });
}

export function useUpdateMatchStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ matchId, status }: { matchId: string; status: string }) => {
      const response = await apiRequest("PATCH", `/api/matches/${matchId}`, { status });
      return response.json();
    },
    onSuccess: (_, { matchId }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/matches", matchId] });
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
    },
  });
}

export function useUpdateMatchResult() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertMatchResult) => {
      const response = await apiRequest("POST", "/api/match-results", data);
      return response.json();
    },
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/matches", data.matchId, "results"] });
      queryClient.invalidateQueries({ queryKey: ["/api/rankings"] });
    },
  });
}

export function useSendChatMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertChatMessage) => {
      const response = await apiRequest("POST", "/api/chat-messages", data);
      return response.json();
    },
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/matches", data.matchId, "chat"] });
    },
  });
}