"use client";

import React, { useState } from "react";
import { LeaderboardEntry } from "@/types";
import { Trophy, Flame, Sparkles, Medal, CheckCircle2 } from "lucide-react";

interface LeaderboardViewProps {
  entries: LeaderboardEntry[];
  currentUserId: string;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ entries, currentUserId }) => {
  const [filter, setFilter] = useState<"streak" | "weeklyXp" | "totalSolved">("streak");

  const sortedEntries = [...entries].sort((a, b) => {
    if (filter === "streak") return b.currentStreak - a.currentStreak;
    if (filter === "weeklyXp") return b.weeklyXp - a.weeklyXp;
    return b.totalSolved - a.totalSolved;
  });

  const top1 = sortedEntries[0];
  const top2 = sortedEntries[1];
  const top3 = sortedEntries[2];

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-surface-100 border border-white/10 p-6 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-400" />
            Bảng Xếp Hạng Thuật Toán
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Vinh danh những coder kiên trì và chăm chỉ nhất cộng đồng AlgoHabit
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1 bg-surface-50 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setFilter("streak")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              filter === "streak" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            🔥 Chuỗi Streak
          </button>
          <button
            onClick={() => setFilter("weeklyXp")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              filter === "weeklyXp" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            ⚡ XP Tuần Này
          </button>
          <button
            onClick={() => setFilter("totalSolved")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              filter === "totalSolved" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            📚 Tổng Bài Giải
          </button>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end pt-4">
        {/* 2nd Place */}
        {top2 && (
          <div className="order-2 md:order-1 rounded-2xl bg-gradient-to-b from-surface-100 to-surface-50 border border-slate-700/60 p-5 shadow-xl flex flex-col items-center text-center relative">
            <div className="absolute -top-4 rounded-full bg-slate-400 text-slate-950 font-black px-3 py-1 text-xs shadow-lg">
              #2 Silver
            </div>
            <img
              src={top2.avatar}
              alt={top2.name}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-slate-400/40 mt-2 mb-3"
            />
            <h4 className="font-bold text-sm text-white">{top2.name}</h4>
            <div className="flex items-center gap-1 text-amber-400 font-bold text-base mt-1">
              <Flame className="h-4 w-4 fill-amber-400" /> {top2.currentStreak} ngày streak
            </div>
            <div className="text-xs text-slate-400 mt-1">{top2.weeklyXp} XP tuần này</div>
          </div>
        )}

        {/* 1st Place (Champion) */}
        {top1 && (
          <div className="order-1 md:order-2 rounded-2xl bg-gradient-to-b from-amber-500/20 via-surface-100 to-surface-50 border border-amber-500/40 p-6 shadow-2xl flex flex-col items-center text-center relative -mt-4">
            <div className="absolute -top-5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black px-4 py-1 text-xs shadow-xl flex items-center gap-1">
              <Medal className="h-3.5 w-3.5" /> #1 Champion
            </div>
            <div className="relative mt-2 mb-3">
              <img
                src={top1.avatar}
                alt={top1.name}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-amber-400 shadow-xl"
              />
              <span className="absolute -bottom-1 -right-1 text-2xl">👑</span>
            </div>
            <h4 className="font-extrabold text-base text-white">{top1.name}</h4>
            <div className="flex items-center gap-1 text-amber-400 font-extrabold text-lg mt-1">
              <Flame className="h-5 w-5 fill-amber-400 animate-pulse" /> {top1.currentStreak} ngày streak
            </div>
            <div className="text-xs text-indigo-300 font-semibold mt-1">+{top1.weeklyXp} XP tuần này</div>
          </div>
        )}

        {/* 3rd Place */}
        {top3 && (
          <div className="order-3 rounded-2xl bg-gradient-to-b from-surface-100 to-surface-50 border border-amber-900/60 p-5 shadow-xl flex flex-col items-center text-center relative">
            <div className="absolute -top-4 rounded-full bg-amber-700 text-amber-100 font-black px-3 py-1 text-xs shadow-lg">
              #3 Bronze
            </div>
            <img
              src={top3.avatar}
              alt={top3.name}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-amber-700/40 mt-2 mb-3"
            />
            <h4 className="font-bold text-sm text-white">{top3.name}</h4>
            <div className="flex items-center gap-1 text-amber-400 font-bold text-base mt-1">
              <Flame className="h-4 w-4 fill-amber-400" /> {top3.currentStreak} ngày streak
            </div>
            <div className="text-xs text-slate-400 mt-1">{top3.weeklyXp} XP tuần này</div>
          </div>
        )}
      </div>

      {/* Full Leaderboard Table */}
      <div className="rounded-2xl bg-surface-100 border border-white/10 p-6 shadow-xl overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <th className="pb-3 px-3">Hạng</th>
              <th className="pb-3 px-3">Thành viên</th>
              <th className="pb-3 px-3">Chuỗi Streak</th>
              <th className="pb-3 px-3">Tổng Bài Giải</th>
              <th className="pb-3 px-3">XP Tuần</th>
              <th className="pb-3 px-3 text-right">Tổng XP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sortedEntries.map((entry, idx) => {
              const isMe = entry.userId === currentUserId;
              return (
                <tr
                  key={entry.userId}
                  className={`hover:bg-white/[0.02] transition-colors ${
                    isMe ? "bg-indigo-600/10 font-medium" : ""
                  }`}
                >
                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold ${
                        idx === 0
                          ? "bg-amber-400 text-slate-950"
                          : idx === 1
                          ? "bg-slate-300 text-slate-950"
                          : idx === 2
                          ? "bg-amber-700 text-white"
                          : "text-slate-400 bg-surface-50"
                      }`}
                    >
                      {idx + 1}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={entry.avatar}
                        alt={entry.name}
                        className="h-9 w-9 rounded-full object-cover ring-2 ring-white/10"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">
                            {entry.name} {isMe && "(Bạn)"}
                          </span>
                          {entry.solvedToday && (
                            <span title="Đã giải bài hôm nay">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {entry.handles.map((h) => `@${h.handle}`).join(" • ")}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="flex items-center gap-1 font-bold text-amber-400 text-sm">
                      <Flame className="h-4 w-4 fill-amber-400" /> {entry.currentStreak} ngày
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-300 font-semibold">{entry.totalSolved} bài</td>
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-indigo-300">+{entry.weeklyXp} XP</span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className="inline-flex items-center gap-1 font-bold text-amber-400">
                      <Sparkles className="h-3 w-3" /> {entry.totalXp}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
