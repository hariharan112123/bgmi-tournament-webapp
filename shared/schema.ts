import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  username: varchar("username").unique(),
  isAdmin: boolean("is_admin").default(false),
  totalPoints: integer("total_points").default(0),
  tournamentsWon: integer("tournaments_won").default(0),
  totalKills: integer("total_kills").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tournaments = pgTable("tournaments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  mode: varchar("mode").notNull(), // Solo, Duo, Squad
  type: varchar("type").notNull(), // Free, Paid, Invite
  status: varchar("status").notNull().default('open'), // open, live, completed
  entryFee: decimal("entry_fee", { precision: 10, scale: 2 }).default('0'),
  prizePool: decimal("prize_pool", { precision: 10, scale: 2 }).notNull(),
  maxTeams: integer("max_teams").notNull(),
  currentTeams: integer("current_teams").default(0),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  rules: text("rules"),
  bannerUrl: varchar("banner_url"),
  createdBy: varchar("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const teams = pgTable("teams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  tag: varchar("tag").notNull(),
  logoUrl: varchar("logo_url"),
  captainId: varchar("captain_id").notNull().references(() => users.id),
  totalWins: integer("total_wins").default(0),
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).default('0'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const teamMembers = pgTable("team_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  teamId: varchar("team_id").notNull().references(() => teams.id, { onDelete: 'cascade' }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: varchar("role").notNull().default('member'), // captain, member
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const teamInvitations = pgTable("team_invitations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  teamId: varchar("team_id").notNull().references(() => teams.id, { onDelete: 'cascade' }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  invitedBy: varchar("invited_by").notNull().references(() => users.id),
  status: varchar("status").notNull().default('pending'), // pending, accepted, declined
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tournamentRegistrations = pgTable("tournament_registrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tournamentId: varchar("tournament_id").notNull().references(() => tournaments.id, { onDelete: 'cascade' }),
  teamId: varchar("team_id").notNull().references(() => teams.id, { onDelete: 'cascade' }),
  registeredAt: timestamp("registered_at").defaultNow(),
});

export const matches = pgTable("matches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tournamentId: varchar("tournament_id").notNull().references(() => tournaments.id, { onDelete: 'cascade' }),
  name: varchar("name").notNull(),
  round: varchar("round").notNull(), // qualifier, semi, final
  status: varchar("status").notNull().default('scheduled'), // scheduled, live, completed
  roomId: varchar("room_id"),
  roomPassword: varchar("room_password"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  currentZone: integer("current_zone").default(1),
  playersAlive: integer("players_alive"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const matchResults = pgTable("match_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  matchId: varchar("match_id").notNull().references(() => matches.id, { onDelete: 'cascade' }),
  teamId: varchar("team_id").notNull().references(() => teams.id, { onDelete: 'cascade' }),
  position: integer("position").notNull(),
  kills: integer("kills").default(0),
  points: integer("points").default(0),
  status: varchar("status").notNull().default('alive'), // alive, eliminated
  eliminatedAt: timestamp("eliminated_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const matchReplays = pgTable("match_replays", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  matchId: varchar("match_id").notNull().references(() => matches.id, { onDelete: 'cascade' }),
  title: varchar("title").notNull(),
  description: text("description"),
  videoUrl: varchar("video_url").notNull(),
  thumbnailUrl: varchar("thumbnail_url"),
  duration: varchar("duration"),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  matchId: varchar("match_id").notNull().references(() => matches.id, { onDelete: 'cascade' }),
  userId: varchar("user_id").notNull().references(() => users.id),
  message: text("message").notNull(),
  type: varchar("type").notNull().default('user'), // user, admin, system
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  teamsAsCaptain: many(teams),
  teamMemberships: many(teamMembers),
  sentInvitations: many(teamInvitations, { relationName: "inviter" }),
  receivedInvitations: many(teamInvitations, { relationName: "invitee" }),
  createdTournaments: many(tournaments),
  chatMessages: many(chatMessages),
}));

export const tournamentsRelations = relations(tournaments, ({ one, many }) => ({
  creator: one(users, {
    fields: [tournaments.createdBy],
    references: [users.id],
  }),
  registrations: many(tournamentRegistrations),
  matches: many(matches),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  captain: one(users, {
    fields: [teams.captainId],
    references: [users.id],
  }),
  members: many(teamMembers),
  invitations: many(teamInvitations),
  registrations: many(tournamentRegistrations),
  matchResults: many(matchResults),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
}));

export const teamInvitationsRelations = relations(teamInvitations, ({ one }) => ({
  team: one(teams, {
    fields: [teamInvitations.teamId],
    references: [teams.id],
  }),
  invitee: one(users, {
    fields: [teamInvitations.userId],
    references: [users.id],
    relationName: "invitee",
  }),
  inviter: one(users, {
    fields: [teamInvitations.invitedBy],
    references: [users.id],
    relationName: "inviter",
  }),
}));

export const tournamentRegistrationsRelations = relations(tournamentRegistrations, ({ one }) => ({
  tournament: one(tournaments, {
    fields: [tournamentRegistrations.tournamentId],
    references: [tournaments.id],
  }),
  team: one(teams, {
    fields: [tournamentRegistrations.teamId],
    references: [teams.id],
  }),
}));

export const matchesRelations = relations(matches, ({ one, many }) => ({
  tournament: one(tournaments, {
    fields: [matches.tournamentId],
    references: [tournaments.id],
  }),
  results: many(matchResults),
  replays: many(matchReplays),
  chatMessages: many(chatMessages),
}));

export const matchResultsRelations = relations(matchResults, ({ one }) => ({
  match: one(matches, {
    fields: [matchResults.matchId],
    references: [matches.id],
  }),
  team: one(teams, {
    fields: [matchResults.teamId],
    references: [teams.id],
  }),
}));

export const matchReplaysRelations = relations(matchReplays, ({ one }) => ({
  match: one(matches, {
    fields: [matchReplays.matchId],
    references: [matches.id],
  }),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  match: one(matches, {
    fields: [chatMessages.matchId],
    references: [matches.id],
  }),
  user: one(users, {
    fields: [chatMessages.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertTournamentSchema = createInsertSchema(tournaments).omit({
  id: true,
  currentTeams: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
  totalWins: true,
  totalEarnings: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTeamInvitationSchema = createInsertSchema(teamInvitations).omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMatchResultSchema = createInsertSchema(matchResults).omit({
  id: true,
  createdAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export const insertMatchReplaySchema = createInsertSchema(matchReplays).omit({
  id: true,
  views: true,
  likes: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Tournament = typeof tournaments.$inferSelect;
export type InsertTournament = z.infer<typeof insertTournamentSchema>;
export type Team = typeof teams.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;
export type TeamInvitation = typeof teamInvitations.$inferSelect;
export type InsertTeamInvitation = z.infer<typeof insertTeamInvitationSchema>;
export type TournamentRegistration = typeof tournamentRegistrations.$inferSelect;
export type Match = typeof matches.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type MatchResult = typeof matchResults.$inferSelect;
export type InsertMatchResult = z.infer<typeof insertMatchResultSchema>;
export type MatchReplay = typeof matchReplays.$inferSelect;
export type InsertMatchReplay = z.infer<typeof insertMatchReplaySchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
