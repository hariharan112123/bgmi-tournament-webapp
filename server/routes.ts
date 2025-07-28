import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertTournamentSchema, 
  insertTeamSchema, 
  insertTeamInvitationSchema,
  insertMatchSchema,
  insertMatchResultSchema,
  insertChatMessageSchema,
  insertMatchReplaySchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Tournament routes
  app.get('/api/tournaments', async (req, res) => {
    try {
      const tournaments = await storage.getTournaments();
      res.json(tournaments);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      res.status(500).json({ message: "Failed to fetch tournaments" });
    }
  });

  app.get('/api/tournaments/:id', async (req, res) => {
    try {
      const tournament = await storage.getTournament(req.params.id);
      if (!tournament) {
        return res.status(404).json({ message: "Tournament not found" });
      }
      res.json(tournament);
    } catch (error) {
      console.error("Error fetching tournament:", error);
      res.status(500).json({ message: "Failed to fetch tournament" });
    }
  });

  app.post('/api/tournaments', isAuthenticated, async (req: any, res) => {
    try {
      const tournamentData = insertTournamentSchema.parse({
        ...req.body,
        createdBy: req.user.claims.sub,
      });
      const tournament = await storage.createTournament(tournamentData);
      res.status(201).json(tournament);
    } catch (error) {
      console.error("Error creating tournament:", error);
      res.status(500).json({ message: "Failed to create tournament" });
    }
  });

  app.patch('/api/tournaments/:id', isAuthenticated, async (req: any, res) => {
    try {
      const tournament = await storage.updateTournament(req.params.id, req.body);
      res.json(tournament);
    } catch (error) {
      console.error("Error updating tournament:", error);
      res.status(500).json({ message: "Failed to update tournament" });
    }
  });

  app.get('/api/tournaments/:id/registrations', async (req, res) => {
    try {
      const registrations = await storage.getTournamentRegistrations(req.params.id);
      res.json(registrations);
    } catch (error) {
      console.error("Error fetching tournament registrations:", error);
      res.status(500).json({ message: "Failed to fetch registrations" });
    }
  });

  app.post('/api/tournaments/:id/register', isAuthenticated, async (req: any, res) => {
    try {
      const { teamId } = req.body;
      const tournamentId = req.params.id;
      
      // Check if team is already registered
      const isRegistered = await storage.isTeamRegistered(tournamentId, teamId);
      if (isRegistered) {
        return res.status(400).json({ message: "Team already registered" });
      }
      
      const registration = await storage.registerTeamForTournament(tournamentId, teamId);
      res.status(201).json(registration);
    } catch (error) {
      console.error("Error registering team:", error);
      res.status(500).json({ message: "Failed to register team" });
    }
  });

  // Team routes
  app.get('/api/teams', async (req, res) => {
    try {
      const teams = await storage.getTeams();
      res.json(teams);
    } catch (error) {
      console.error("Error fetching teams:", error);
      res.status(500).json({ message: "Failed to fetch teams" });
    }
  });

  app.get('/api/teams/:id', async (req, res) => {
    try {
      const team = await storage.getTeam(req.params.id);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      res.json(team);
    } catch (error) {
      console.error("Error fetching team:", error);
      res.status(500).json({ message: "Failed to fetch team" });
    }
  });

  app.post('/api/teams', isAuthenticated, async (req: any, res) => {
    try {
      const teamData = insertTeamSchema.parse({
        ...req.body,
        captainId: req.user.claims.sub,
      });
      const team = await storage.createTeam(teamData);
      res.status(201).json(team);
    } catch (error) {
      console.error("Error creating team:", error);
      res.status(500).json({ message: "Failed to create team" });
    }
  });

  app.get('/api/user/team', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const team = await storage.getUserTeam(userId);
      res.json(team);
    } catch (error) {
      console.error("Error fetching user team:", error);
      res.status(500).json({ message: "Failed to fetch user team" });
    }
  });

  app.get('/api/teams/:id/members', async (req, res) => {
    try {
      const members = await storage.getTeamMembers(req.params.id);
      res.json(members);
    } catch (error) {
      console.error("Error fetching team members:", error);
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });

  // Team invitation routes
  app.get('/api/user/invitations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const invitations = await storage.getUserInvitations(userId);
      res.json(invitations);
    } catch (error) {
      console.error("Error fetching invitations:", error);
      res.status(500).json({ message: "Failed to fetch invitations" });
    }
  });

  app.post('/api/team-invitations', isAuthenticated, async (req: any, res) => {
    try {
      const invitationData = insertTeamInvitationSchema.parse({
        ...req.body,
        invitedBy: req.user.claims.sub,
      });
      const invitation = await storage.createTeamInvitation(invitationData);
      res.status(201).json(invitation);
    } catch (error) {
      console.error("Error creating invitation:", error);
      res.status(500).json({ message: "Failed to create invitation" });
    }
  });

  app.patch('/api/team-invitations/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { status } = req.body;
      const invitation = await storage.updateInvitationStatus(req.params.id, status);
      
      // If accepted, add user to team
      if (status === 'accepted') {
        await storage.addTeamMember(invitation.teamId, invitation.userId);
      }
      
      res.json(invitation);
    } catch (error) {
      console.error("Error updating invitation:", error);
      res.status(500).json({ message: "Failed to update invitation" });
    }
  });

  // Match routes
  app.get('/api/matches', async (req, res) => {
    try {
      const matches = await storage.getMatches();
      res.json(matches);
    } catch (error) {
      console.error("Error fetching matches:", error);
      res.status(500).json({ message: "Failed to fetch matches" });
    }
  });

  app.get('/api/matches/:id', async (req, res) => {
    try {
      const match = await storage.getMatch(req.params.id);
      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }
      res.json(match);
    } catch (error) {
      console.error("Error fetching match:", error);
      res.status(500).json({ message: "Failed to fetch match" });
    }
  });

  app.post('/api/matches', isAuthenticated, async (req: any, res) => {
    try {
      const matchData = insertMatchSchema.parse(req.body);
      const match = await storage.createMatch(matchData);
      res.status(201).json(match);
    } catch (error) {
      console.error("Error creating match:", error);
      res.status(500).json({ message: "Failed to create match" });
    }
  });

  app.patch('/api/matches/:id', isAuthenticated, async (req: any, res) => {
    try {
      const match = await storage.updateMatch(req.params.id, req.body);
      res.json(match);
    } catch (error) {
      console.error("Error updating match:", error);
      res.status(500).json({ message: "Failed to update match" });
    }
  });

  app.get('/api/matches/:id/results', async (req, res) => {
    try {
      const results = await storage.getMatchResults(req.params.id);
      res.json(results);
    } catch (error) {
      console.error("Error fetching match results:", error);
      res.status(500).json({ message: "Failed to fetch match results" });
    }
  });

  app.post('/api/matches/:id/results', isAuthenticated, async (req: any, res) => {
    try {
      const resultData = insertMatchResultSchema.parse({
        ...req.body,
        matchId: req.params.id,
      });
      const result = await storage.createMatchResult(resultData);
      res.status(201).json(result);
    } catch (error) {
      console.error("Error creating match result:", error);
      res.status(500).json({ message: "Failed to create match result" });
    }
  });

  app.patch('/api/match-results/:id', isAuthenticated, async (req: any, res) => {
    try {
      const result = await storage.updateMatchResult(req.params.id, req.body);
      res.json(result);
    } catch (error) {
      console.error("Error updating match result:", error);
      res.status(500).json({ message: "Failed to update match result" });
    }
  });

  // Chat routes
  app.get('/api/matches/:id/chat', async (req, res) => {
    try {
      const messages = await storage.getMatchChatMessages(req.params.id);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  app.post('/api/matches/:id/chat', isAuthenticated, async (req: any, res) => {
    try {
      const messageData = insertChatMessageSchema.parse({
        ...req.body,
        matchId: req.params.id,
        userId: req.user.claims.sub,
      });
      const message = await storage.createChatMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      console.error("Error creating chat message:", error);
      res.status(500).json({ message: "Failed to create chat message" });
    }
  });

  // Replay routes
  app.get('/api/replays', async (req, res) => {
    try {
      const replays = await storage.getMatchReplays();
      res.json(replays);
    } catch (error) {
      console.error("Error fetching replays:", error);
      res.status(500).json({ message: "Failed to fetch replays" });
    }
  });

  app.post('/api/replays', isAuthenticated, async (req: any, res) => {
    try {
      const replayData = insertMatchReplaySchema.parse(req.body);
      const replay = await storage.createMatchReplay(replayData);
      res.status(201).json(replay);
    } catch (error) {
      console.error("Error creating replay:", error);
      res.status(500).json({ message: "Failed to create replay" });
    }
  });

  // Rankings and stats routes
  app.get('/api/rankings/players', async (req, res) => {
    try {
      const rankings = await storage.getPlayerRankings();
      res.json(rankings);
    } catch (error) {
      console.error("Error fetching player rankings:", error);
      res.status(500).json({ message: "Failed to fetch player rankings" });
    }
  });

  app.get('/api/rankings/teams', async (req, res) => {
    try {
      const rankings = await storage.getTeamRankings();
      res.json(rankings);
    } catch (error) {
      console.error("Error fetching team rankings:", error);
      res.status(500).json({ message: "Failed to fetch team rankings" });
    }
  });

  app.get('/api/stats', async (req, res) => {
    try {
      const stats = await storage.getTournamentStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
