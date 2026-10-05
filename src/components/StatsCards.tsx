"use client";

import React from "react";
import { UserProfile } from "@/types";
import { Award, Code2, Flame, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  user: UserProfile;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ user }) => {
  const lcHandle = user.handles.find((h) => h.platform === "leetcode");
  const cfHandle = user.handles.find((h) => h.platform === "codeforces");

  const easy = lcHandle?.easySolved || 0;
  const medium = lcHandle?.mediumSolved || 0;
  const hard = lcHandle?.hardSolved || 0;
  const totalLc = lcHandle?.totalSolved || (easy + medium + hard) || 1;

  const easyPct = Math.round((easy / totalLc) * 100) || 0;
  const mediumPct = Math.round((medium / totalLc) * 100) || 0;
  const hardPct = Math.round((hard / totalLc) * 100) || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* 1. LeetCode Stats */}
      <div className="rounded-2xl bg-surface-100 border border-white/10 p-5 shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <Code2 className="h-4 w-4 text-amber-500" /> LeetCode
            </span>
            <span className="text-[11px] font-mono text-amber-400/90 font-medium">
              @{lcHandle?.handle || "not_linked"}
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white">
            {lcHandle?.totalSolved || 0}{" "}
            <span className="text-xs font-normal text-slate-400">bài đã giải</span>
          </div>
        </div>

        {/* Progress distribution */}
        <div className="mt-4 space-y-2">
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-emerald-400 font-medium">Easy ({easy})</span>
              <span className="text-slate-400">{easyPct}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${easyPct}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-amber-400 font-medium">Medium ({medium})</span>
              <span className="text-slate-400">{mediumPct}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${mediumPct}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-rose-400 font-medium">Hard ({hard})</span>
              <span className="text-slate-400">{hardPct}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full" style={{ width: `${hardPct}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Codeforces Stats */}
      <div className="rounded-2xl bg-surface-100 border border-white/10 p-5 shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <Award className="h-4 w-4 text-blue-400" /> Codeforces
            </span>
            <span className="text-[11px] font-mono text-blue-400/90 font-medium">
              @{cfHandle?.handle || "not_linked"}
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white">
            {cfHandle?.rating || "1840"}{" "}
            <span className="text-xs font-normal text-slate-400">Rating</span>
          </div>
          <p className="text-xs font-semibold text-purple-400 mt-1">
            {cfHandle?.rankTitle || "Candidate Master"}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-xs">
          <span className="text-slate-400">Đã giải:</span>
          <span className="font-bold text-white">{cfHandle?.totalSolved || 85} bài</span>
        </div>
      </div>

      {/* 3. Habit Health & Streak Consistency */}
      <div className="rounded-2xl bg-surface-100 border border-white/10 p-5 shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-orange-500" /> Thói Quen
            </span>
            <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
              Xuất Sắc
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white">
            92% <span className="text-xs font-normal text-slate-400">tỷ lệ duy trì</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Mục tiêu: <strong className="text-white">{user.dailyGoal} bài/ngày</strong>
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-xs">
          <span className="text-slate-400">Khiên bảo vệ còn:</span>
          <span className="font-bold text-indigo-300">{user.streakFreeze} lượt</span>
        </div>
      </div>

      {/* 4. Weekly Grind XP */}
      <div className="rounded-2xl bg-surface-100 border border-white/10 p-5 shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-indigo-400" /> Tuần Này
            </span>
            <span className="text-[10px] text-indigo-400 font-semibold bg-indigo-500/15 px-2 py-0.5 rounded-full">
              Top 2 Global
            </span>
          </div>
          <div className="text-2xl font-extrabold text-indigo-300">
            +340 XP
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Giải được 9 bài trong 7 ngày qua
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-xs">
          <span className="text-slate-400">Tổng điểm XP:</span>
          <span className="font-bold text-amber-400">{user.totalXp} XP</span>
        </div>
      </div>
    </div>
  );
};
