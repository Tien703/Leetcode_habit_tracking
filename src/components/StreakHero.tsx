"use client";

import React from "react";
import { Flame, ShieldCheck, CheckCircle2, AlertCircle, ExternalLink, Sparkles, Trophy, ArrowUpRight } from "lucide-react";
import { UserProfile } from "@/types";
import { calculateLevel } from "@/services/habit-engine";

interface StreakHeroProps {
  user: UserProfile;
  dailyChallenge?: {
    date: string;
    link: string;
    title: string;
    difficulty: string;
  };
  solvedToday: boolean;
  onSimulateSolve: () => void;
}

export const StreakHero: React.FC<StreakHeroProps> = ({
  user,
  dailyChallenge,
  solvedToday,
  onSimulateSolve,
}) => {
  const levelInfo = calculateLevel(user.totalXp);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* 1. Main Streak Card (Flame & Status) */}
      <div className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#181a2e] via-surface-100 to-[#121624] border border-white/10 p-6 shadow-2xl">
        {/* Glow ambient circle */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Animated Flame Badge */}
            <div className="relative flex-shrink-0 flex items-center justify-center h-24 w-24 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-orange-500/30 to-red-500/20 border border-orange-500/40 shadow-xl shadow-orange-500/10">
              <Flame className="h-14 w-14 text-amber-400 fill-amber-400 filter drop-shadow-[0_0_12px_rgba(251,191,36,0.6)] animate-pulse" />
              <div className="absolute -bottom-2 bg-gradient-to-r from-amber-500 to-orange-500 text-[#0a0d14] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-md">
                Active
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  {user.currentStreak} <span className="text-xl font-medium text-slate-400">Ngày Liên Tục</span>
                </h2>
              </div>
              <p className="text-sm text-slate-300">
                Kỷ lục chuỗi dài nhất: <strong className="text-amber-400">{user.longestStreak} ngày</strong>
              </p>

              {/* Status Badge */}
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                {solvedToday ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" /> Đã hoàn thành mục tiêu hôm nay!
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-1 text-xs font-semibold text-amber-400 animate-pulse">
                    <AlertCircle className="h-4 w-4" /> Chưa giải bài hôm nay (Cần giải 1 bài để giữ chuỗi)
                  </span>
                )}

                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 px-3 py-1 text-xs font-medium text-indigo-300">
                  <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" /> {user.streakFreeze} Khiên bảo vệ
                </span>
              </div>
            </div>
          </div>

          {/* Simulate Action for Demo / Testing */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto">
            <button
              onClick={onSimulateSolve}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold px-4 py-2.5 text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="h-4 w-4" />
              Nộp Bài Giả Lập (+XP)
            </button>
          </div>
        </div>

        {/* Level Progression Bar */}
        <div className="relative z-10 mt-6 pt-5 border-t border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                Level {levelInfo.level} • {levelInfo.title}
              </div>
              <div className="text-[11px] text-slate-400">
                {user.totalXp} / {levelInfo.nextLevelXp} XP (còn {levelInfo.nextLevelXp - user.totalXp} XP để lên Level {levelInfo.level + 1})
              </div>
            </div>
          </div>

          <div className="w-full md:w-56">
            <div className="w-full bg-slate-800/80 h-2.5 rounded-full overflow-hidden border border-white/5">
              <div
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. LeetCode Daily Challenge Problem Box */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-100 to-surface-50 border border-white/10 p-6 flex flex-col justify-between shadow-xl">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> LeetCode Daily
            </span>
            <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-md">
              {dailyChallenge?.date || new Date().toISOString().slice(0, 10)}
            </span>
          </div>

          <h3 className="text-base font-bold text-white mb-2 line-clamp-2">
            {dailyChallenge?.title || "Course Schedule II"}
          </h3>

          <div className="flex items-center gap-2 mb-4">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
              (dailyChallenge?.difficulty || "Medium").toUpperCase() === "EASY"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : (dailyChallenge?.difficulty || "Medium").toUpperCase() === "HARD"
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
            }`}>
              {dailyChallenge?.difficulty || "MEDIUM"}
            </span>
            <span className="text-[11px] text-slate-400">+25 XP khi giải xong</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/5">
          <a
            href={dailyChallenge?.link || "https://leetcode.com/problemset/all/"}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-semibold py-2.5 transition-all"
          >
            <span>Giải Bài Ngay Trên LeetCode</span>
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
