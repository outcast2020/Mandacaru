export type RankingMode = 'casual' | 'challenge';
export type LeaderboardProvider = 'local' | 'appscript' | 'supabase';

export interface RankingScope {
  trailId: string;
  mode: RankingMode;
  seed?: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  medal: string;
  stagesCompleted: number;
  totalStages: number;
  createdAt: string;
  mode: RankingMode;
  seed?: string;
  trailId: string;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  source: 'online' | 'local';
}
