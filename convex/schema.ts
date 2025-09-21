import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  teams: defineTable({
    name: v.string(),
    members: v.array(v.string()),
    createdBy: v.optional(v.string()), // user identity for ownership
    gamesPlayed: v.number(),
    totalScore: v.number(),
    highestScore: v.number(),
    createdAt: v.number(),
  }).index("by_name", ["name"])
    .index("by_created_by", ["createdBy"]),

  gameResults: defineTable({
    teamScores: v.array(v.object({
      teamName: v.string(),
      teamMembers: v.array(v.string()),
      score: v.number(),
    })),
    totalRounds: v.number(),
    gameDate: v.number(),
    winningTeam: v.string(),
    playedBy: v.optional(v.string()), // user identity
  }).index("by_played_by", ["playedBy"])
    .index("by_game_date", ["gameDate"]),
});