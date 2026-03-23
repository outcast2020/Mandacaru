export interface WeeklyChallenge {
  seed: string;
  label: string;
  weekKey: string;
}

function getUtcThursday(date: Date): Date {
  const copy = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = copy.getUTCDay() || 7;
  copy.setUTCDate(copy.getUTCDate() + 4 - day);
  return copy;
}

function getIsoWeek(date: Date): { year: number; week: number } {
  const thursday = getUtcThursday(date);
  const yearStart = new Date(Date.UTC(thursday.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((thursday.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);

  return {
    year: thursday.getUTCFullYear(),
    week,
  };
}

export function getWeeklyChallenge(baseDate = new Date()): WeeklyChallenge {
  const { year, week } = getIsoWeek(baseDate);
  const paddedWeek = String(week).padStart(2, '0');
  return {
    seed: `MR-${year}-W${paddedWeek}`,
    label: `Desafio semanal ${paddedWeek}/${year}`,
    weekKey: `${year}-W${paddedWeek}`,
  };
}
