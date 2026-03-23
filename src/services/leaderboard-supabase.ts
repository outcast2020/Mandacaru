import type { LeaderboardEntry, LeaderboardResponse, RankingScope } from './leaderboard-types';

const SUPABASE_LEADERBOARD_URL = import.meta.env.VITE_SUPABASE_LEADERBOARD_URL;

export async function getLeaderboardFromSupabase(scope: RankingScope): Promise<LeaderboardResponse | null> {
  if (!SUPABASE_LEADERBOARD_URL) {
    return null;
  }

  const params = new URLSearchParams({
    trailId: scope.trailId,
    mode: scope.mode,
  });

  if (scope.seed) {
    params.set('seed', scope.seed);
  }

  const response = await fetch(`${SUPABASE_LEADERBOARD_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error('supabase leaderboard fetch failed');
  }

  const payload = (await response.json()) as { entries?: LeaderboardEntry[] };

  return {
    entries: payload.entries ?? [],
    source: 'online',
  };
}

export async function submitLeaderboardToSupabase(
  scope: RankingScope,
  entry: LeaderboardEntry,
): Promise<LeaderboardResponse | null> {
  if (!SUPABASE_LEADERBOARD_URL) {
    return null;
  }

  const response = await fetch(SUPABASE_LEADERBOARD_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      trailId: scope.trailId,
      mode: scope.mode,
      seed: scope.seed,
      entry,
    }),
  });

  if (!response.ok) {
    throw new Error('supabase leaderboard submit failed');
  }

  const payload = (await response.json()) as { entries?: LeaderboardEntry[] };

  return {
    entries: payload.entries ?? [],
    source: 'online',
  };
}
