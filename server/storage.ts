import {
  users,
  tournaments,
  teams,
  teamMembers,
  teamInvitations,
  tournamentRegistrations,
  matches,
  matchResults,
  matchReplays,
  chatMessages,
  type User,
  type UpsertUser,
  type Tournament,
  type InsertTournament,
  type Team,
  type InsertTeam,
  type TeamMember,
  type TeamInvitation,
  type InsertTeamInvitation,
  type TournamentRegistration,
  type Match,
  type InsertMatch,
  type MatchResult,
  type InsertMatchResult,
  type MatchReplay,
  type InsertMatchReplay,
  type ChatMessage,
  type InsertChatMessage,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, count, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Tournament operations
  getTournaments(): Promise<Tournament[]>;
  getTournament(id: string): Promise<Tournament | undefined>;
  createTournament(tournament: InsertTournament): Promise<Tournament>;
  updateTournament(id: string, updates: Partial<Tournament>): Promise<Tournament>;
  
  // Team operations
  getTeams(): Promise<Team[]>;
  getTeam(id: string): Promise<Team | undefined>;
  getUserTeam(userId: string): Promise<Team | undefined>;
  createTeam(team: InsertTeam): Promise<Team>;
  updateTeam(id: string, updates: Partial<Team>): Promise<Team>;
  getTeamMembers(teamId: string): Promise<(TeamMember & { user: User })[]>;
  addTeamMember(teamId: string, userId: string, role?: string): Promise<TeamMember>;
  removeTeamMember(teamId: string, userId: string): Promise<void>;
  
  // Team invitation operations
  createTeamInvitation(invitation: InsertTeamInvitation): Promise<TeamInvitation>;
  getUserInvitations(userId: string): Promise<(TeamInvitation & { team: Team, inviter: User })[]>;
  updateInvitationStatus(id: string, status: string): Promise<TeamInvitation>;
  
  // Tournament registration operations
  registerTeamForTournament(tournamentId: string, teamId: string): Promise<TournamentRegistration>;
  getTournamentRegistrations(tournamentId: string): Promise<(TournamentRegistration & { team: Team })[]>;
  isTeamRegistered(tournamentId: string, teamId: string): Promise<boolean>;
  
  // Match operations
  getMatches(): Promise<Match[]>;
  getMatch(id: string): Promise<Match | undefined>;
  getTournamentMatches(tournamentId: string): Promise<Match[]>;
  createMatch(match: InsertMatch): Promise<Match>;
  updateMatch(id: string, updates: Partial<Match>): Promise<Match>;
  
  // Match result operations
  getMatchResults(matchId: string): Promise<(MatchResult & { team: Team })[]>;
  createMatchResult(result: InsertMatchResult): Promise<MatchResult>;
  updateMatchResult(id: string, updates: Partial<MatchResult>): Promise<MatchResult>;
  
  // Match replay operations
  getMatchReplays(): Promise<MatchReplay[]>;
  getMatchReplay(id: string): Promise<MatchReplay | undefined>;
  createMatchReplay(replay: InsertMatchReplay): Promise<MatchReplay>;
  
  // Chat operations
  getMatchChatMessages(matchId: string): Promise<(ChatMessage & { user: User })[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Rankings and stats
  getPlayerRankings(): Promise<User[]>;
  getTeamRankings(): Promise<Team[]>;
  getTournamentStats(): Promise<{
    activeTournaments: number;
    totalPrizePool: string;
    registeredTeams: number;
    liveMatches: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Tournament operations
  async getTournaments(): Promise<Tournament[]> {
    return await db.select().from(tournaments).orderBy(desc(tournaments.createdAt));
  }

  async getTournament(id: string): Promise<Tournament | undefined> {
    const [tournament] = await db.select().from(tournaments).where(eq(tournaments.id, id));
    return tournament;
  }

  async createTournament(tournament: InsertTournament): Promise<Tournament> {
    const [newTournament] = await db.insert(tournaments).values(tournament).returning();
    return newTournament;
  }

  async updateTournament(id: string, updates: Partial<Tournament>): Promise<Tournament> {
    const [updatedTournament] = await db
      .update(tournaments)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tournaments.id, id))
      .returning();
    return updatedTournament;
  }

  // Team operations
  async getTeams(): Promise<Team[]> {
    return await db.select().from(teams).orderBy(desc(teams.totalWins));
  }

  async getTeam(id: string): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team;
  }

  async getUserTeam(userId: string): Promise<Team | undefined> {
    const [result] = await db
      .select({ team: teams })
      .from(teamMembers)
      .innerJoin(teams, eq(teamMembers.teamId, teams.id))
      .where(eq(teamMembers.userId, userId));
    return result?.team;
  }

  async createTeam(team: InsertTeam): Promise<Team> {
    const [newTeam] = await db.insert(teams).values(team).returning();
    
    // Add captain as team member
    await db.insert(teamMembers).values({
      teamId: newTeam.id,
      userId: newTeam.captainId,
      role: 'captain',
    });
    
    return newTeam;
  }

  async updateTeam(id: string, updates: Partial<Team>): Promise<Team> {
    const [updatedTeam] = await db
      .update(teams)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(teams.id, id))
      .returning();
    return updatedTeam;
  }

  async getTeamMembers(teamId: string): Promise<(TeamMember & { user: User })[]> {
    return await db
      .select({
        id: teamMembers.id,
        teamId: teamMembers.teamId,
        userId: teamMembers.userId,
        role: teamMembers.role,
        joinedAt: teamMembers.joinedAt,
        user: users,
      })
      .from(teamMembers)
      .innerJoin(users, eq(teamMembers.userId, users.id))
      .where(eq(teamMembers.teamId, teamId));
  }

  async addTeamMember(teamId: string, userId: string, role = 'member'): Promise<TeamMember> {
    const [member] = await db
      .insert(teamMembers)
      .values({ teamId, userId, role })
      .returning();
    return member;
  }

  async removeTeamMember(teamId: string, userId: string): Promise<void> {
    await db
      .delete(teamMembers)
      .where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId)));
  }

  // Team invitation operations
  async createTeamInvitation(invitation: InsertTeamInvitation): Promise<TeamInvitation> {
    const [newInvitation] = await db.insert(teamInvitations).values(invitation).returning();
    return newInvitation;
  }

  async getUserInvitations(userId: string): Promise<(TeamInvitation & { team: Team, inviter: User })[]> {
    return await db
      .select({
        id: teamInvitations.id,
        teamId: teamInvitations.teamId,
        userId: teamInvitations.userId,
        invitedBy: teamInvitations.invitedBy,
        status: teamInvitations.status,
        createdAt: teamInvitations.createdAt,
        updatedAt: teamInvitations.updatedAt,
        team: teams,
        inviter: users,
      })
      .from(teamInvitations)
      .innerJoin(teams, eq(teamInvitations.teamId, teams.id))
      .innerJoin(users, eq(teamInvitations.invitedBy, users.id))
      .where(and(eq(teamInvitations.userId, userId), eq(teamInvitations.status, 'pending')));
  }

  async updateInvitationStatus(id: string, status: string): Promise<TeamInvitation> {
    const [updatedInvitation] = await db
      .update(teamInvitations)
      .set({ status, updatedAt: new Date() })
      .where(eq(teamInvitations.id, id))
      .returning();
    return updatedInvitation;
  }

  // Tournament registration operations
  async registerTeamForTournament(tournamentId: string, teamId: string): Promise<TournamentRegistration> {
    const [registration] = await db
      .insert(tournamentRegistrations)
      .values({ tournamentId, teamId })
      .returning();
    
    // Update tournament current teams count
    await db
      .update(tournaments)
      .set({ currentTeams: sql`${tournaments.currentTeams} + 1` })
      .where(eq(tournaments.id, tournamentId));
    
    return registration;
  }

  async getTournamentRegistrations(tournamentId: string): Promise<(TournamentRegistration & { team: Team })[]> {
    return await db
      .select({
        id: tournamentRegistrations.id,
        tournamentId: tournamentRegistrations.tournamentId,
        teamId: tournamentRegistrations.teamId,
        registeredAt: tournamentRegistrations.registeredAt,
        team: teams,
      })
      .from(tournamentRegistrations)
      .innerJoin(teams, eq(tournamentRegistrations.teamId, teams.id))
      .where(eq(tournamentRegistrations.tournamentId, tournamentId));
  }

  async isTeamRegistered(tournamentId: string, teamId: string): Promise<boolean> {
    const [result] = await db
      .select({ count: count() })
      .from(tournamentRegistrations)
      .where(
        and(
          eq(tournamentRegistrations.tournamentId, tournamentId),
          eq(tournamentRegistrations.teamId, teamId)
        )
      );
    return result.count > 0;
  }

  // Match operations
  async getMatches(): Promise<Match[]> {
    return await db.select().from(matches).orderBy(desc(matches.startTime));
  }

  async getMatch(id: string): Promise<Match | undefined> {
    const [match] = await db.select().from(matches).where(eq(matches.id, id));
    return match;
  }

  async getTournamentMatches(tournamentId: string): Promise<Match[]> {
    return await db
      .select()
      .from(matches)
      .where(eq(matches.tournamentId, tournamentId))
      .orderBy(matches.startTime);
  }

  async createMatch(match: InsertMatch): Promise<Match> {
    const [newMatch] = await db.insert(matches).values(match).returning();
    return newMatch;
  }

  async updateMatch(id: string, updates: Partial<Match>): Promise<Match> {
    const [updatedMatch] = await db
      .update(matches)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(matches.id, id))
      .returning();
    return updatedMatch;
  }

  // Match result operations
  async getMatchResults(matchId: string): Promise<(MatchResult & { team: Team })[]> {
    return await db
      .select({
        id: matchResults.id,
        matchId: matchResults.matchId,
        teamId: matchResults.teamId,
        position: matchResults.position,
        kills: matchResults.kills,
        points: matchResults.points,
        status: matchResults.status,
        eliminatedAt: matchResults.eliminatedAt,
        createdAt: matchResults.createdAt,
        team: teams,
      })
      .from(matchResults)
      .innerJoin(teams, eq(matchResults.teamId, teams.id))
      .where(eq(matchResults.matchId, matchId))
      .orderBy(matchResults.position);
  }

  async createMatchResult(result: InsertMatchResult): Promise<MatchResult> {
    const [newResult] = await db.insert(matchResults).values(result).returning();
    return newResult;
  }

  async updateMatchResult(id: string, updates: Partial<MatchResult>): Promise<MatchResult> {
    const [updatedResult] = await db
      .update(matchResults)
      .set(updates)
      .where(eq(matchResults.id, id))
      .returning();
    return updatedResult;
  }

  // Match replay operations
  async getMatchReplays(): Promise<MatchReplay[]> {
    return await db.select().from(matchReplays).orderBy(desc(matchReplays.createdAt));
  }

  async getMatchReplay(id: string): Promise<MatchReplay | undefined> {
    const [replay] = await db.select().from(matchReplays).where(eq(matchReplays.id, id));
    return replay;
  }

  async createMatchReplay(replay: InsertMatchReplay): Promise<MatchReplay> {
    const [newReplay] = await db.insert(matchReplays).values(replay).returning();
    return newReplay;
  }

  // Chat operations
  async getMatchChatMessages(matchId: string): Promise<(ChatMessage & { user: User })[]> {
    return await db
      .select({
        id: chatMessages.id,
        matchId: chatMessages.matchId,
        userId: chatMessages.userId,
        message: chatMessages.message,
        type: chatMessages.type,
        createdAt: chatMessages.createdAt,
        user: users,
      })
      .from(chatMessages)
      .innerJoin(users, eq(chatMessages.userId, users.id))
      .where(eq(chatMessages.matchId, matchId))
      .orderBy(chatMessages.createdAt);
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db.insert(chatMessages).values(message).returning();
    return newMessage;
  }

  // Rankings and stats
  async getPlayerRankings(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .orderBy(desc(users.totalPoints), desc(users.tournamentsWon))
      .limit(50);
  }

  async getTeamRankings(): Promise<Team[]> {
    return await db
      .select()
      .from(teams)
      .orderBy(desc(teams.totalWins), desc(teams.totalEarnings))
      .limit(50);
  }

  async getTournamentStats(): Promise<{
    activeTournaments: number;
    totalPrizePool: string;
    registeredTeams: number;
    liveMatches: number;
  }> {
    const [activeTournamentsResult] = await db
      .select({ count: count() })
      .from(tournaments)
      .where(or(eq(tournaments.status, 'open'), eq(tournaments.status, 'live')));

    const [prizePoolResult] = await db
      .select({ total: sql<string>`COALESCE(SUM(${tournaments.prizePool}), 0)` })
      .from(tournaments)
      .where(or(eq(tournaments.status, 'open'), eq(tournaments.status, 'live')));

    const [registeredTeamsResult] = await db
      .select({ count: count() })
      .from(teams);

    const [liveMatchesResult] = await db
      .select({ count: count() })
      .from(matches)
      .where(eq(matches.status, 'live'));

    return {
      activeTournaments: activeTournamentsResult.count,
      totalPrizePool: prizePoolResult.total || '0',
      registeredTeams: registeredTeamsResult.count,
      liveMatches: liveMatchesResult.count,
    };
  }
}

export const storage = new DatabaseStorage();
