"use client";

import React from "react";
import { Flame, Shield, Chrome, RefreshCw, Zap, Users, Trophy, BookOpen, UserCheck } from "lucide-react";
import { UserProfile } from "@/types";
import { calculateLevel } from "@/services/habit-engine";

interface NavbarProps {
  user: UserProfile;
  activeTab: "dashboard" | "squads" | "leaderboard" | "roadmaps";
  setActiveTab: (tab: "dashboard" | "squads" | "leaderboard" | "roadmaps") => void;
  onOpenSync: () => void;
  onOpenExtension: () => void;
  onQuickSync: () => void;
  isSyncing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  onOpenSync,
  onOpenExtension,
  onQuickSync,
  isSyncing,
}) => {
  const levelInfo = calculateLevel(user.totalXp);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0a0d14]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Left: Brand Logo & Navigation Tabs */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab("dashboard")}>
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 shadow-lg shadow-orange-500/20">
              <Flame className="h-6 w-6 text-white animate-pulse" />
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-[#0a0d14]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-white">AlgoHabit</span>
                <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/30">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Universal Habit Engine</p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-surface-100/60 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                activeTab === "dashboard"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("squads")}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                activeTab === "squads"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              Phòng Luyện (Squads)
            </button>
            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                activeTab === "leaderboard"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <Trophy className="h-3.5 w-3.5" />
              Bảng Xếp Hạng
            </button>
            <button
              onClick={() => setActiveTab("roadmaps")}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                activeTab === "roadmaps"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              Lộ Trình Blind 75
            </button>
          </nav>
        </div>

        {/* Right: Streak status, Level, Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Quick Streak Flame Counter */}
          <div className="flex items-center gap-2 bg-surface-100/90 border border-amber-500/30 rounded-xl px-3 py-1.5 shadow-inner">
            <Flame className="h-5 w-5 text-amber-500 fill-amber-500 animate-bounce" />
            <div>
              <div className="flex items-center gap-1 leading-none">
                <span className="font-bold text-amber-400 text-sm">{user.currentStreak}</span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Ngày</span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <Shield className="h-2.5 w-2.5 text-emerald-400" />
                <span className="text-[9px] text-emerald-400">{user.streakFreeze} Khiên</span>
              </div>
            </div>
          </div>

          {/* Level & XP Box */}
          <div className="hidden lg:flex flex-col gap-1 bg-surface-100/60 border border-white/5 rounded-xl px-3 py-1.5 min-w-[130px]">
            <div className="flex justify-between items-center text-[10px]">
              <span className="font-semibold text-indigo-300">Level {levelInfo.level}</span>
              <span className="text-slate-400">{user.totalXp} XP</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
          </div>

          {/* Quick Sync Button */}
          <button
            onClick={onQuickSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 bg-surface-100 hover:bg-surface-200 border border-white/10 text-slate-300 hover:text-white rounded-xl px-3 py-2 text-xs font-medium transition-all"
            title="Đồng bộ bài giải mới từ LeetCode / Codeforces"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin text-indigo-400" : ""}`} />
            <span className="hidden sm:inline">{isSyncing ? "Đang đồng bộ..." : "Đồng bộ"}</span>
          </button>

          {/* Extension Download / Guide Modal Button */}
          <button
            onClick={onOpenExtension}
            className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 hover:from-purple-600/30 hover:to-indigo-600/30 border border-indigo-500/30 text-indigo-300 rounded-xl px-3 py-2 text-xs font-medium transition-all"
          >
            <Chrome className="h-3.5 w-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Cài Extension</span>
          </button>

          {/* User Account / Handles Button */}
          <button
            onClick={onOpenSync}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-3 py-2 text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
          >
            <UserCheck className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Liên kết Handle</span>
          </button>
        </div>
      </div>
    </header>
  );
};
