import type { LeaderboardEntry, LeaderboardResponse, RankingScope } from './leaderboard-types';

const PREFIX = 'mandacaru-ranking';

function getStorageKey(scope: RankingScope): string {
  const seedPart = scope.seed ? `:${scope.seed}` : '';
  return `${PREFIX}:${scope.trailId}:${scope.mode}${seedPart}`;
}

function sortEntries(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  return [...entries]
    .sort((left, right) => right.score - left.score || left.createdAt.localeCompare(right.createdAt))
    .slice(0, 10);
}

export function loadLocalLeaderboard(scope: RankingScope): LeaderboardEntry[] {
  try {
    const raw = window.localStorage.getItem(getStorageKey(scope));

    if (!raw) {
      return [];
    }

    return sortEntries(JSON.parse(raw) as LeaderboardEntry[]);
  } catch {
    return [];
  }
}

export function saveLocalLeaderboardEntry(scope: RankingScope, entry: LeaderboardEntry): LeaderboardEntry[] {
  const current = loadLocalLeaderboard(scope);
  const next = sortEntries([...current, entry]);
  window.localStorage.setItem(getStorageKey(scope), JSON.stringify(next));
  return next;
}

export function localLeaderboardResponse(scope: RankingScope): LeaderboardResponse {
  return {
    entries: loadLocalLeaderboard(scope),
    source: 'local',
  };
}
