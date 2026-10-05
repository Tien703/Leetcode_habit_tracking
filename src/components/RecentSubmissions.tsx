"use client";

import React from "react";
import { SubmissionRecord } from "@/types";
import { CheckCircle2, ExternalLink, History, Sparkles } from "lucide-react";

interface RecentSubmissionsProps {
  submissions: SubmissionRecord[];
}

export const RecentSubmissions: React.FC<RecentSubmissionsProps> = ({ submissions }) => {
  const getDifficultyBadge = (difficulty: string, raw?: string) => {
    switch (difficulty.toUpperCase()) {
      case "EASY":
        return (
          <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
            {raw ? `CF ${raw}` : "Easy"}
          </span>
        );
      case "MEDIUM":
        return (
          <span className="rounded bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
            {raw ? `CF ${raw}` : "Medium"}
          </span>
        );
      case "HARD":
        return (
          <span className="rounded bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 text-[10px] font-semibold text-rose-400">
            {raw ? `CF ${raw}` : "Hard"}
          </span>
        );
      default:
        return (
          <span className="rounded bg-slate-700/50 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
            {difficulty}
          </span>
        );
    }
  };

  const getPlatformBadge = (platform: string) => {
    if (platform === "leetcode") {
      return (
        <span className="rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 text-[10px] font-mono font-semibold">
          LeetCode
        </span>
      );
    }
    if (platform === "codeforces") {
      return (
        <span className="rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 text-[10px] font-mono font-semibold">
          Codeforces
        </span>
      );
    }
    return (
      <span className="rounded bg-slate-800 text-slate-300 px-1.5 py-0.5 text-[10px] font-mono font-semibold">
        {platform}
      </span>
    );
  };

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 5) return "Vừa xong";
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    return `${days} ngày trước`;
  };

  return (
    <div className="rounded-2xl bg-surface-100 border border-white/10 p-6 shadow-xl">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <History className="h-4 w-4 text-indigo-400" />
          Bài Giải Gần Đây
        </h3>
        <span className="text-xs text-slate-400">Tự động đồng bộ từ Extension & API</span>
      </div>

      <div className="space-y-3">
        {submissions.map((sub) => (
          <div
            key={sub.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-surface-50/60 hover:bg-surface-50 border border-white/5 p-4 transition-all duration-200"
          >
            <div className="flex items-start sm:items-center gap-3">
              <div className="mt-0.5 sm:mt-0 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href={sub.problemUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-sm text-white hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                  >
                    {sub.problemTitle}
                    <ExternalLink className="h-3 w-3 text-slate-500" />
                  </a>
                  {getPlatformBadge(sub.platform)}
                  {getDifficultyBadge(sub.difficulty, sub.rawDifficulty)}
                </div>

                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-400">{sub.language}</span>
                  {sub.tags && sub.tags.length > 0 && (
                    <span className="text-[11px] text-slate-500">
                      • {sub.tags.slice(0, 3).join(", ")}
                    </span>
                  )}
                  <span className="text-[11px] text-slate-500">• {formatTimeAgo(sub.submittedAt)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 text-xs font-bold text-amber-400">
                <Sparkles className="h-3 w-3" /> +{sub.xpEarned} XP
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
