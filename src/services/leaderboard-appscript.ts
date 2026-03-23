import type { LeaderboardEntry, LeaderboardResponse, RankingScope } from './leaderboard-types';

const APPSCRIPT_URL = import.meta.env.VITE_APPSCRIPT_URL;

export async function getLeaderboardFromAppScript(scope: RankingScope): Promise<LeaderboardResponse | null> {
  if (!APPSCRIPT_URL) {
    return null;
  }

  const params = new URLSearchParams({
    action: 'getLeaderboard',
    trailId: scope.trailId,
    mode: scope.mode,
  });

  if (scope.seed) {
    params.set('seed', scope.seed);
  }

  const response = await fetch(`${APPSCRIPT_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error('appscript leaderboard fetch failed');
  }

  const payload = (await response.json()) as { ok?: boolean; entries?: LeaderboardEntry[]; error?: string };

  if (payload.ok === false) {
    throw new Error(payload.error || 'appscript leaderboard fetch rejected');
  }

  return {
    entries: payload.entries ?? [],
    source: 'online',
  };
}

export async function submitLeaderboardToAppScript(
  scope: RankingScope,
  entry: LeaderboardEntry,
): Promise<LeaderboardResponse | null> {
  if (!APPSCRIPT_URL) {
    return null;
  }

  const response = await fetch(APPSCRIPT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'submitScore',
      trailId: scope.trailId,
      mode: scope.mode,
      seed: scope.seed,
      entry,
    }),
  });

  if (!response.ok) {
    throw new Error('appscript leaderboard submit failed');
  }

  const payload = (await response.json()) as { entries?: LeaderboardEntry[]; ok?: boolean; error?: string };

  if (payload.ok === false) {
    throw new Error(payload.error || 'appscript leaderboard submit rejected');
  }

  return {
    entries: payload.entries ?? [],
    source: 'online',
  };
}
