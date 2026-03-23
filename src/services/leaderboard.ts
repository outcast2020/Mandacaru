import { getLeaderboardFromAppScript, submitLeaderboardToAppScript } from './leaderboard-appscript';
import { loadLocalLeaderboard, localLeaderboardResponse, saveLocalLeaderboardEntry } from './leaderboard-local';
import { getLeaderboardFromSupabase, submitLeaderboardToSupabase } from './leaderboard-supabase';
import type { LeaderboardEntry, LeaderboardProvider, LeaderboardResponse, RankingMode, RankingScope } from './leaderboard-types';

function getProvider(): LeaderboardProvider {
  const value = import.meta.env.VITE_LEADERBOARD_PROVIDER;

  if (value === 'appscript' || value === 'supabase' || value === 'local') {
    return value;
  }

  return 'appscript';
}

function sortEntries(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  return [...entries]
    .sort((left, right) => right.score - left.score || left.createdAt.localeCompare(right.createdAt))
    .slice(0, 10);
}

export function loadLocalRanking(scope: RankingScope): LeaderboardEntry[] {
  return loadLocalLeaderboard(scope);
}

export async function getLeaderboard(scope: RankingScope): Promise<LeaderboardResponse> {
  const provider = getProvider();

  try {
    if (provider === 'appscript') {
      const response = await getLeaderboardFromAppScript(scope);
      if (response) {
        return {
          entries: sortEntries(response.entries),
          source: response.source,
        };
      }
    }

    if (provider === 'supabase') {
      const response = await getLeaderboardFromSupabase(scope);
      if (response) {
        return {
          entries: sortEntries(response.entries),
          source: response.source,
        };
      }
    }
  } catch {
    return localLeaderboardResponse(scope);
  }

  return localLeaderboardResponse(scope);
}

export async function submitScore(scope: RankingScope, entry: LeaderboardEntry): Promise<LeaderboardResponse> {
  const localEntries = saveLocalLeaderboardEntry(scope, entry);
  const provider = getProvider();

  try {
    if (provider === 'appscript') {
      const response = await submitLeaderboardToAppScript(scope, entry);
      if (response) {
        return {
          entries: sortEntries(response.entries.length ? response.entries : localEntries),
          source: response.source,
        };
      }
    }

    if (provider === 'supabase') {
      const response = await submitLeaderboardToSupabase(scope, entry);
      if (response) {
        return {
          entries: sortEntries(response.entries.length ? response.entries : localEntries),
          source: response.source,
        };
      }
    }
  } catch {
    return {
      entries: localEntries,
      source: 'local',
    };
  }

  return {
    entries: localEntries,
    source: 'local',
  };
}

export type { LeaderboardEntry, LeaderboardProvider, LeaderboardResponse, RankingMode, RankingScope };
