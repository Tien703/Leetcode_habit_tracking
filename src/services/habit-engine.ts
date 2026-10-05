import { HeatmapDay, ProblemDifficulty, CodingPlatform, SubmissionRecord } from "@/types";

/**
 * Calculate XP based on problem difficulty and platform
 */
export function calculateXp(difficulty: ProblemDifficulty, rawDifficulty?: string): number {
  if (difficulty === "HARD") return 60;
  if (difficulty === "MEDIUM") return 25;
  if (difficulty === "EASY") return 10;

  // Codeforces rating based
  if (rawDifficulty && !isNaN(Number(rawDifficulty))) {
    const rating = Number(rawDifficulty);
    if (rating >= 1900) return 70;
    if (rating >= 1500) return 40;
    if (rating >= 1200) return 25;
    return 10;
  }

  return 10;
}

/**
 * Calculate Level from Total XP
 * Level curve: Level N requires 50 * N^1.5 XP
 */
export function calculateLevel(totalXp: number): { level: number; progressPercent: number; nextLevelXp: number; currentLevelXp: number; title: string } {
  let level = 1;
  let xpForNext = 100;
  let xpForCurrent = 0;

  while (totalXp >= xpForNext) {
    level++;
    xpForCurrent = xpForNext;
    xpForNext = Math.floor(100 * Math.pow(level, 1.4));
  }

  const range = xpForNext - xpForCurrent;
  const currentProgress = totalXp - xpForCurrent;
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentProgress / range) * 100)));

  let title = "Novice Solver";
  if (level >= 30) title = "Mythic Algo God";
  else if (level >= 20) title = "Grandmaster Coder";
  else if (level >= 15) title = "Diamond Algo Warrior";
  else if (level >= 10) title = "Platinum Architect";
  else if (level >= 5) title = "Gold Problem Solver";
  else if (level >= 2) title = "Silver Apprentice";

  return {
    level,
    progressPercent,
    nextLevelXp: xpForNext,
    currentLevelXp: xpForCurrent,
    title,
  };
}

/**
 * Calculate Current Streak and Longest Streak from activity dates
 * Dates in array: ["YYYY-MM-DD", ...]
 */
export function calculateStreaks(activeDatesSet: Set<string>): { currentStreak: number; longestStreak: number; solvedToday: boolean } {
  if (activeDatesSet.size === 0) {
    return { currentStreak: 0, longestStreak: 0, solvedToday: false };
  }

  const todayStr = getTodayDateStr();
  const yesterdayStr = getPastDateStr(1);

  const solvedToday = activeDatesSet.has(todayStr);
  const solvedYesterday = activeDatesSet.has(yesterdayStr);

  // If didn't solve today and didn't solve yesterday -> streak is 0
  let currentStreak = 0;
  let checkDay = solvedToday ? 0 : (solvedYesterday ? 1 : -1);

  if (checkDay !== -1) {
    while (true) {
      const dateStr = getPastDateStr(checkDay);
      if (activeDatesSet.has(dateStr)) {
        currentStreak++;
        checkDay++;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak by sorting all dates
  const sortedDates = Array.from(activeDatesSet).sort();
  let longestStreak = 0;
  let tempStreak = 0;
  let lastDate: Date | null = null;

  for (const dateStr of sortedDates) {
    const curr = new Date(dateStr + "T00:00:00Z");
    if (!lastDate) {
      tempStreak = 1;
    } else {
      const diffDays = Math.round((curr.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
    lastDate = curr;
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
  }

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    solvedToday,
  };
}

/**
 * Generate 52-week Heatmap Grid (365 days) from submission records and calendar dict
 */
export function generateHeatmapGrid(
  submissions: SubmissionRecord[],
  calendarDict: Record<string, number> = {}
): HeatmapDay[] {
  const days: HeatmapDay[] = [];
  const totalDays = 364; // 52 weeks * 7 days

  // Build daily count map
  const dailyCounts = new Map<string, { count: number; subs: { platform: CodingPlatform; title: string; difficulty: ProblemDifficulty }[] }>();

  // Process explicit submission records
  for (const sub of submissions) {
    const dateStr = sub.submittedAt.slice(0, 10);
    const existing = dailyCounts.get(dateStr) || { count: 0, subs: [] };
    existing.count += 1;
    existing.subs.push({
      platform: sub.platform,
      title: sub.problemTitle,
      difficulty: sub.difficulty,
    });
    dailyCounts.set(dateStr, existing);
  }

  // Merge with LeetCode calendar timestamps
  for (const [timestampStr, count] of Object.entries(calendarDict)) {
    const ts = Number(timestampStr) * 1000;
    if (!isNaN(ts)) {
      const dateStr = new Date(ts).toISOString().slice(0, 10);
      const existing = dailyCounts.get(dateStr) || { count: 0, subs: [] };
      existing.count = Math.max(existing.count, count);
      dailyCounts.set(dateStr, existing);
    }
  }

  // Generate date range ending on today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = totalDays; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const data = dailyCounts.get(dateStr) || { count: 0, subs: [] };

    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (data.count >= 6) level = 4;
    else if (data.count >= 4) level = 3;
    else if (data.count >= 2) level = 2;
    else if (data.count >= 1) level = 1;

    days.push({
      date: dateStr,
      count: data.count,
      level,
      submissions: data.subs,
    });
  }

  return days;
}

export function getTodayDateStr(): string {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

export function getPastDateStr(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}
