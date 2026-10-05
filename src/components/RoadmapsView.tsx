"use client";

import React, { useState } from "react";
import { CuratedRoadmap, CuratedProblem } from "@/types";
import { BookOpen, CheckCircle, Circle, ExternalLink, Sparkles } from "lucide-react";

interface RoadmapsViewProps {
  roadmaps: CuratedRoadmap[];
  onToggleProblem: (roadmapId: string, problemId: string) => void;
}

export const RoadmapsView: React.FC<RoadmapsViewProps> = ({ roadmaps, onToggleProblem }) => {
  const [activeRoadmapId, setActiveRoadmapId] = useState<string>(roadmaps[0]?.id || "blind-75");

  const currentRoadmap = roadmaps.find((r) => r.id === activeRoadmapId) || roadmaps[0];

  const solvedCount = currentRoadmap?.problems.filter((p) => p.isSolved).length || 0;
  const totalCount = currentRoadmap?.problems.length || 1;
  const progressPercent = Math.round((solvedCount / totalCount) * 100);

  // Group problems by category
  const categoriesMap = new Map<string, CuratedProblem[]>();
  currentRoadmap?.problems.forEach((p) => {
    const list = categoriesMap.get(p.category) || [];
    list.push(p);
    categoriesMap.set(p.category, list);
  });

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
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Roadmap Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl bg-surface-100 border border-white/10 p-6 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-400" />
            Lộ Trình Thuật Toán Tuyển Chọn
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Theo dõi tiến độ hoàn thành các bộ đề kinh điển như Blind 75, NeetCode 150 và Codeforces Div 2.
          </p>
        </div>

        {/* Roadmap Switcher Buttons */}
        <div className="flex gap-2">
          {roadmaps.map((r) => (
            <button
              key={r.id}
              onClick={() => setActiveRoadmapId(r.id)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                activeRoadmapId === r.id
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "bg-surface-50 text-slate-400 hover:text-white border border-white/5"
              }`}
            >
              {r.title}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar Card */}
      {currentRoadmap && (
        <div className="rounded-2xl bg-gradient-to-br from-[#181a2e] to-surface-100 border border-white/10 p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-bold text-white">{currentRoadmap.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{currentRoadmap.description}</p>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black text-indigo-400">{progressPercent}%</span>
              <div className="text-xs text-slate-400">
                {solvedCount} / {totalCount} bài đã hoàn thành
              </div>
            </div>
          </div>

          <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Categorized Problems */}
      <div className="space-y-6">
        {Array.from(categoriesMap.entries()).map(([category, problems]) => {
          const catSolved = problems.filter((p) => p.isSolved).length;
          return (
            <div key={category} className="rounded-2xl bg-surface-100 border border-white/10 p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-indigo-400" />
                  {category}
                </h4>
                <span className="text-xs font-semibold text-slate-400">
                  {catSolved} / {problems.length} đã xong
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {problems.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onToggleProblem(currentRoadmap.id, p.id)}
                    className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      p.isSolved
                        ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                        : "bg-surface-50/70 hover:bg-surface-50 border-white/5 text-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {p.isSolved ? (
                        <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-slate-600 hover:text-slate-400 flex-shrink-0" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold text-xs ${
                              p.isSolved ? "line-through text-slate-400" : "text-white"
                            }`}
                          >
                            {p.title}
                          </span>
                          {getDifficultyBadge(p.difficulty, p.rawDifficulty)}
                        </div>
                      </div>
                    </div>

                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-slate-500 hover:text-indigo-400 transition-colors p-1"
                      title="Mở bài toán trên LeetCode/Codeforces"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
