import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "./use-auth";

export function useUserTeams() {
  const { isAuthenticated } = useAuth();
  
  const userTeams = useQuery(api.teams.getUserTeams, isAuthenticated ? {} : "skip");
  const publicTeams = useQuery(api.teams.getPublicTeams, !isAuthenticated ? {} : "skip");
  
  return {
    teams: isAuthenticated ? userTeams : publicTeams,
    isLoading: (isAuthenticated ? userTeams : publicTeams) === undefined,
  };
}

export function useSaveTeam() {
  return useMutation(api.teams.saveTeam);
}

export function useRecordGame() {
  return useMutation(api.teams.recordGameResult);
}

export function useTeamStats(teamName: string) {
  return useQuery(api.teams.getTeamStats, teamName ? { teamName } : "skip");
}