export type CodingPlatform = 'leetcode' | 'codeforces' | 'hackerrank' | 'atcoder' | 'vnoi';

export type ProblemDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'UNKNOWN';

export interface UnifiedSubmissionPayload {
  platform: CodingPlatform;
  platformUsername: string;
  problemId: string;
  problemTitle: string;
  problemUrl: string;
  difficulty: ProblemDifficulty;
  rawDifficulty?: string;
  tags: string[];
  language: string;
  status: 'ACCEPTED' | 'WRONG_ANSWER' | 'TIME_LIMIT_EXCEEDED' | 'RUNTIME_ERROR';
  runtimeMs?: number;
  memoryKb?: number;
  sourceCode?: string;
  submittedAt: number; // Unix timestamp in seconds or ms
}

export interface SubmissionRecord {
  id: string;
  userId: string;
  platform: CodingPlatform;
  problemId: string;
  problemTitle: string;
  problemUrl: string;
  difficulty: ProblemDifficulty;
  rawDifficulty?: string;
  tags: string[];
  language: string;
  status: string;
  xpEarned: number;
  submittedAt: string; // ISO date string
}

export interface UserPlatformHandle {
  platform: CodingPlatform;
  handle: string;
  avatarUrl?: string;
  totalSolved: number;
  easySolved?: number;
  mediumSolved?: number;
  hardSolved?: number;
  rating?: number; // Codeforces rating
  rankTitle?: string;
  lastSyncedAt?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  apiKey: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  totalXp: number;
  level: number;
  streakFreeze: number;
  handles: UserPlatformHandle[];
  dailyGoal: number; // e.g. 1 or 2 problems per day
  joinedAt: string;
}

export interface HeatmapDay {
  date: string; // YYYY-MM-DD
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  submissions?: {
    platform: CodingPlatform;
    title: string;
    difficulty: ProblemDifficulty;
  }[];
}

export interface SquadMember {
  userId: string;
  name: string;
  avatar: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  solvedToday: boolean;
  todayCount: number;
  currentStreak: number;
  weeklyXp: number;
  lastSolvedTime?: string;
}

export interface Squad {
  id: string;
  name: string;
  description: string;
  inviteCode: string;
  ownerId: string;
  membersCount: number;
  dailyGoal: number;
  pledgeRule?: string; // e.g. "Phạt 20k vào quỹ nếu đứt streak"
  totalGroupXp: number;
  members: SquadMember[];
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string;
  handles: { platform: CodingPlatform; handle: string }[];
  currentStreak: number;
  longestStreak: number;
  totalSolved: number;
  weeklyXp: number;
  totalXp: number;
  solvedToday: boolean;
}

export interface CuratedProblem {
  id: string;
  title: string;
  platform: CodingPlatform;
  url: string;
  difficulty: ProblemDifficulty;
  rawDifficulty?: string;
  category: string;
  order: number;
  isSolved?: boolean;
  solvedAt?: string;
}

export interface CuratedRoadmap {
  id: string;
  title: string;
  description: string;
  totalProblems: number;
  category: string;
  problems: CuratedProblem[];
}
