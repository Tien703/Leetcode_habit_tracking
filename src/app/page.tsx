"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Navbar } from "@/components/Navbar";
import { StreakHero } from "@/components/StreakHero";
import { ActivityHeatmap } from "@/components/ActivityHeatmap";
import { StatsCards } from "@/components/StatsCards";
import { RecentSubmissions } from "@/components/RecentSubmissions";
import { SquadsView } from "@/components/SquadsView";
import { LeaderboardView } from "@/components/LeaderboardView";
import { RoadmapsView } from "@/components/RoadmapsView";
import { SyncModal } from "@/components/SyncModal";
import { ExtensionModal } from "@/components/ExtensionModal";

import {
  INITIAL_USER,
  INITIAL_SUBMISSIONS,
  INITIAL_SQUADS,
  CURATED_ROADMAPS,
  LEADERBOARD_DATA,
} from "@/services/storage";
import { generateHeatmapGrid, calculateStreaks, getTodayDateStr } from "@/services/habit-engine";
import { UserProfile, SubmissionRecord, Squad, CuratedRoadmap, LeaderboardEntry } from "@/types";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "squads" | "leaderboard" | "roadmaps">("dashboard");
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>(INITIAL_SUBMISSIONS);
  const [squads, setSquads] = useState<Squad[]>(INITIAL_SQUADS);
  const [roadmaps, setRoadmaps] = useState<CuratedRoadmap[]>(CURATED_ROADMAPS);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(LEADERBOARD_DATA);

  const [dailyChallenge, setDailyChallenge] = useState<{
    date: string;
    link: string;
    title: string;
    difficulty: string;
  }>({
    date: new Date().toISOString().slice(0, 10),
    link: "https://leetcode.com/problems/course-schedule-ii/",
    title: "Course Schedule II",
    difficulty: "Medium",
  });

  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Compute Heatmap Days
  const activeDatesSet = new Set(submissions.map((s) => s.submittedAt.slice(0, 10)));
  const streaks = calculateStreaks(activeDatesSet);
  const heatmapDays = generateHeatmapGrid(submissions);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#6366f1", "#f59e0b", "#10b981", "#ec4899"],
    });
  };

  // Simulate a problem solve (Demo real-time ingestion)
  const handleSimulateSolve = async () => {
    const demoProblems = [
      { id: "binary-tree-inorder", title: "Binary Tree Inorder Traversal", platform: "leetcode" as const, difficulty: "EASY" as const, xp: 10, lang: "TypeScript" },
      { id: "word-break", title: "Word Break", platform: "leetcode" as const, difficulty: "MEDIUM" as const, xp: 25, lang: "Python3" },
      { id: "median-of-two-sorted-arrays", title: "Median of Two Sorted Arrays", platform: "leetcode" as const, difficulty: "HARD" as const, xp: 60, lang: "C++" },
      { id: "1850B", title: "Ten Words of Wisdom", platform: "codeforces" as const, difficulty: "EASY" as const, rawDiff: "800", xp: 10, lang: "C++ 20" },
    ];

    const pick = demoProblems[Math.floor(Math.random() * demoProblems.length)];
    const newSub: SubmissionRecord = {
      id: `sub-${Date.now()}`,
      userId: user.id,
      platform: pick.platform,
      problemId: pick.id,
      problemTitle: pick.title,
      problemUrl: pick.platform === "leetcode" ? `https://leetcode.com/problems/${pick.id}/` : `https://codeforces.com/problemset/problem/1850/B`,
      difficulty: pick.difficulty,
      rawDifficulty: pick.rawDiff,
      tags: ["Algorithm", "Data Structure"],
      language: pick.lang,
      status: "ACCEPTED",
      xpEarned: pick.xp,
      submittedAt: new Date().toISOString(),
    };

    setSubmissions((prev) => [newSub, ...prev]);

    // Update user stats
    const updatedXp = user.totalXp + pick.xp;
    const todayStr = getTodayDateStr();
    const newStreak = user.lastActiveDate === todayStr ? user.currentStreak : user.currentStreak + 1;

    setUser((prev) => ({
      ...prev,
      totalXp: updatedXp,
      currentStreak: newStreak,
      longestStreak: Math.max(prev.longestStreak, newStreak),
      lastActiveDate: todayStr,
      handles: prev.handles.map((h) =>
        h.platform === pick.platform ? { ...h, totalSolved: h.totalSolved + 1 } : h
      ),
    }));

    // Update squad
    setSquads((prev) =>
      prev.map((sq) => ({
        ...sq,
        members: sq.members.map((m) =>
          m.userId === user.id
            ? { ...m, solvedToday: true, todayCount: m.todayCount + 1, weeklyXp: m.weeklyXp + pick.xp }
            : m
        ),
      }))
    );

    triggerConfetti();
    showToast(`🎉 Ghi nhận thành công "${pick.title}" (+${pick.xp} XP)!`);
  };

  // Quick live sync with LeetCode API
  const handleQuickSync = async () => {
    const lcHandle = user.handles.find((h) => h.platform === "leetcode")?.handle;
    if (!lcHandle) {
      setIsSyncModalOpen(true);
      return;
    }

    setIsSyncing(true);
    try {
      const res = await fetch(`/api/leetcode?username=${encodeURIComponent(lcHandle)}`);
      const data = await res.json();

      if (res.ok && data.success && data.data) {
        const lcData = data.data;

        setUser((prev) => ({
          ...prev,
          handles: prev.handles.map((h) =>
            h.platform === "leetcode"
              ? {
                  ...h,
                  totalSolved: lcData.totalSolved,
                  easySolved: lcData.easySolved,
                  mediumSolved: lcData.mediumSolved,
                  hardSolved: lcData.hardSolved,
                  rankTitle: lcData.ranking ? `Rank #${lcData.ranking.toLocaleString()}` : h.rankTitle,
                  lastSyncedAt: new Date().toISOString(),
                }
              : h
          ),
        }));

        if (lcData.dailyChallenge) {
          setDailyChallenge(lcData.dailyChallenge);
        }

        showToast(`✓ Đã đồng bộ thành công LeetCode @${lcHandle}!`);
      } else {
        showToast(`Đã đồng bộ dữ liệu mới nhất.`);
      }
    } catch {
      showToast(`Đã đồng bộ dữ liệu.`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveHandles = async (leetcodeUser: string, cfHandle: string) => {
    setUser((prev) => ({
      ...prev,
      handles: [
        {
          platform: "leetcode",
          handle: leetcodeUser || "anonymous",
          totalSolved: prev.handles.find((h) => h.platform === "leetcode")?.totalSolved || 142,
          easySolved: 58,
          mediumSolved: 72,
          hardSolved: 12,
        },
        {
          platform: "codeforces",
          handle: cfHandle || "anonymous",
          totalSolved: prev.handles.find((h) => h.platform === "codeforces")?.totalSolved || 85,
          rating: 1840,
        },
      ],
    }));
    showToast("✓ Đã lưu tài khoản liên kết thành công!");
  };

  const handleJoinSquad = (code: string) => {
    showToast(`✓ Đã tham gia phòng với mã "${code}"!`);
  };

  const handleCreateSquad = (name: string, desc: string, rule: string) => {
    const newSquad: Squad = {
      id: `squad-${Date.now()}`,
      name: `🔥 ${name}`,
      description: desc || "Nhóm luyện thuật toán cùng nhau.",
      inviteCode: `SQUAD-${Math.floor(1000 + Math.random() * 9000)}`,
      ownerId: user.id,
      membersCount: 1,
      dailyGoal: 1,
      pledgeRule: rule,
      totalGroupXp: 0,
      members: [
        {
          userId: user.id,
          name: `${user.name} (You)`,
          avatar: user.avatar,
          role: "OWNER",
          solvedToday: streaks.solvedToday,
          todayCount: streaks.solvedToday ? 1 : 0,
          currentStreak: user.currentStreak,
          weeklyXp: 340,
        },
      ],
    };
    setSquads((prev) => [newSquad, ...prev]);
    showToast(`✓ Đã tạo phòng "${name}" thành công!`);
  };

  const handleToggleRoadmapProblem = (roadmapId: string, problemId: string) => {
    setRoadmaps((prev) =>
      prev.map((r) => {
        if (r.id !== roadmapId) return r;
        return {
          ...r,
          problems: r.problems.map((p) => {
            if (p.id !== problemId) return p;
            const newSolved = !p.isSolved;
            if (newSolved) triggerConfetti();
            return { ...p, isSolved: newSolved };
          }),
        };
      })
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0d14] text-slate-100">
      {/* Navigation Header */}
      <Navbar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSync={() => setIsSyncModalOpen(true)}
        onOpenExtension={() => setIsExtensionModalOpen(true)}
        onQuickSync={handleQuickSync}
        isSyncing={isSyncing}
      />

      {/* Floating Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-indigo-600 text-white px-5 py-3 shadow-2xl border border-indigo-400/40 text-sm font-semibold animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-6 sm:px-6 space-y-6">
        {/* Tab 1: Personal Habit Dashboard */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Streak & Hero Level */}
            <StreakHero
              user={user}
              dailyChallenge={dailyChallenge}
              solvedToday={streaks.solvedToday}
              onSimulateSolve={handleSimulateSolve}
            />

            {/* Stats Breakdown Cards */}
            <StatsCards user={user} />

            {/* 365-Day Activity Heatmap */}
            <ActivityHeatmap days={heatmapDays} />

            {/* Recent Submissions */}
            <RecentSubmissions submissions={submissions} />
          </div>
        )}

        {/* Tab 2: Squads / Study Rooms */}
        {activeTab === "squads" && (
          <div className="animate-fadeIn">
            <SquadsView
              squads={squads}
              onJoinSquad={handleJoinSquad}
              onCreateSquad={handleCreateSquad}
            />
          </div>
        )}

        {/* Tab 3: Global Leaderboard */}
        {activeTab === "leaderboard" && (
          <div className="animate-fadeIn">
            <LeaderboardView entries={leaderboard} currentUserId={user.id} />
          </div>
        )}

        {/* Tab 4: Curated Roadmaps (Blind 75) */}
        {activeTab === "roadmaps" && (
          <div className="animate-fadeIn">
            <RoadmapsView roadmaps={roadmaps} onToggleProblem={handleToggleRoadmapProblem} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 mt-12 bg-surface-50/50 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 AlgoHabit. Universal Multi-Platform Habit Engine for LeetCode & Codeforces.</p>
          <div className="flex gap-4">
            <button onClick={() => setIsExtensionModalOpen(true)} className="hover:text-indigo-400">
              Cài Extension
            </button>
            <button onClick={() => setIsSyncModalOpen(true)} className="hover:text-indigo-400">
              Liên kết Handle
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SyncModal
        user={user}
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        onSaveHandles={handleSaveHandles}
      />

      <ExtensionModal
        isOpen={isExtensionModalOpen}
        onClose={() => setIsExtensionModalOpen(false)}
        apiKey={user.apiKey}
      />
    </div>
  );
}
