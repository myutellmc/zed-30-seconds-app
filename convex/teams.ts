import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all teams for the current user
export const getUserTeams = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }
    
    return await ctx.db
      .query("teams")
      .withIndex("by_created_by", (q) => q.eq("createdBy", identity.tokenIdentifier))
      .order("desc")
      .collect();
  },
});

// Get all teams (for non-authenticated users)
export const getPublicTeams = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("teams")
      .order("desc")
      .take(20); // Limit to recent 20 teams
  },
});

// Create or update a team
export const saveTeam = mutation({
  args: {
    name: v.string(),
    members: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    
    // Check if team already exists
    const existingTeam = await ctx.db
      .query("teams")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();
    
    if (existingTeam) {
      // Update existing team
      await ctx.db.patch(existingTeam._id, {
        members: args.members,
        createdBy: identity?.tokenIdentifier,
      });
      return existingTeam._id;
    } else {
      // Create new team
      return await ctx.db.insert("teams", {
        name: args.name,
        members: args.members,
        createdBy: identity?.tokenIdentifier,
        gamesPlayed: 0,
        totalScore: 0,
        highestScore: 0,
        createdAt: Date.now(),
      });
    }
  },
});

// Record game results and update team stats
export const recordGameResult = mutation({
  args: {
    teamScores: v.array(v.object({
      teamName: v.string(),
      teamMembers: v.array(v.string()),
      score: v.number(),
    })),
    totalRounds: v.number(),
    winningTeam: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    
    // Save game result
    await ctx.db.insert("gameResults", {
      teamScores: args.teamScores,
      totalRounds: args.totalRounds,
      gameDate: Date.now(),
      winningTeam: args.winningTeam,
      playedBy: identity?.tokenIdentifier,
    });
    
    // Update team statistics
    for (const teamResult of args.teamScores) {
      const existingTeam = await ctx.db
        .query("teams")
        .withIndex("by_name", (q) => q.eq("name", teamResult.teamName))
        .first();
      
      if (existingTeam) {
        await ctx.db.patch(existingTeam._id, {
          gamesPlayed: existingTeam.gamesPlayed + 1,
          totalScore: existingTeam.totalScore + teamResult.score,
          highestScore: Math.max(existingTeam.highestScore, teamResult.score),
          members: teamResult.teamMembers, // Update members in case they changed
        });
      }
    }
  },
});

// Get team statistics
export const getTeamStats = query({
  args: { teamName: v.string() },
  handler: async (ctx, args) => {
    const team = await ctx.db
      .query("teams")
      .withIndex("by_name", (q) => q.eq("name", args.teamName))
      .first();
    
    if (!team) return null;
    
    // Get recent game results for this team
    const recentGames = await ctx.db
      .query("gameResults")
      .order("desc")
      .take(5);
    
    // Filter games that include this team (done after querying)
    const teamGames = recentGames.filter(game => 
      game.teamScores.some(teamScore => teamScore.teamName === args.teamName) ||
      game.winningTeam === args.teamName
    );
    
    return {
      ...team,
      averageScore: team.gamesPlayed > 0 ? team.totalScore / team.gamesPlayed : 0,
      recentGames: teamGames,
    };
  },
});