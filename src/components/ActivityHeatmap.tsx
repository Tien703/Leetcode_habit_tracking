"use client";

import React, { useState } from "react";
import { HeatmapDay } from "@/types";
import { Calendar, Info } from "lucide-react";

interface ActivityHeatmapProps {
  days: HeatmapDay[];
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ days }) => {
  const [hoveredDay, setHoveredDay] = useState<HeatmapDay | null>(null);

  // Group days into weeks of 7 days
  const weeks: HeatmapDay[][] = [];
  let currentWeek: HeatmapDay[] = [];

  days.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === days.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  const totalSubmissions = days.reduce((acc, d) => acc + d.count, 0);
  const activeDaysCount = days.filter((d) => d.count > 0).length;

  const getColorClass = (level: 0 | 1 | 2 | 3 | 4) => {
    switch (level) {
      case 1:
        return "bg-emerald-950/80 border-emerald-800/40 text-emerald-300";
      case 2:
        return "bg-emerald-700/80 border-emerald-600/50 text-emerald-200";
      case 3:
        return "bg-emerald-500 border-emerald-400 text-emerald-950";
      case 4:
        return "bg-emerald-400 border-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.8)] text-emerald-950";
      default:
        return "bg-surface-50 border-white/[0.04]";
    }
  };

  return (
    <div className="rounded-2xl bg-surface-100 border border-white/10 p-6 shadow-xl">
      {/* Header with stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="h-4 w-4 text-emerald-400" />
            Ma Trận Hoạt Động (365 Ngày)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Tổng cộng <strong className="text-emerald-400 font-semibold">{totalSubmissions} bài nộp</strong> trong{" "}
            <strong className="text-white font-semibold">{activeDaysCount} ngày hoạt động</strong>
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span>Ít</span>
          <div className="flex gap-1 items-center">
            <span className="w-3 h-3 rounded-[3px] bg-surface-50 border border-white/[0.04]" />
            <span className="w-3 h-3 rounded-[3px] bg-emerald-950/80 border border-emerald-800/40" />
            <span className="w-3 h-3 rounded-[3px] bg-emerald-700/80 border border-emerald-600/50" />
            <span className="w-3 h-3 rounded-[3px] bg-emerald-500 border border-emerald-400" />
            <span className="w-3 h-3 rounded-[3px] bg-emerald-400 border border-emerald-300" />
          </div>
          <span>Nhiều</span>
        </div>
      </div>

      {/* Heatmap Grid (Scrollable on small screens) */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[760px]">
          {/* Days Grid: 7 rows x ~52 columns */}
          <div className="grid grid-flow-col grid-rows-7 gap-1.5 justify-start">
            {days.map((day) => (
              <div
                key={day.date}
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
                className={`w-3.5 h-3.5 rounded-[3px] border transition-transform duration-100 hover:scale-125 cursor-pointer ${getColorClass(
                  day.level
                )}`}
              />
            ))}
          </div>

          <div className="flex justify-between text-[10px] text-slate-500 mt-2 px-1 font-mono">
            <span>1 năm trước</span>
            <span>6 tháng trước</span>
            <span>3 tháng trước</span>
            <span>Hôm nay</span>
          </div>
        </div>
      </div>

      {/* Hover Tooltip / Detail Box */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between min-h-[32px] text-xs">
        {hoveredDay ? (
          <div className="flex items-center gap-2 text-slate-300">
            <span className="font-semibold text-emerald-400">{hoveredDay.date}:</span>
            <span>
              {hoveredDay.count === 0 ? "Không có bài giải" : `${hoveredDay.count} bài giải thành công`}
            </span>
            {hoveredDay.submissions && hoveredDay.submissions.length > 0 && (
              <span className="text-slate-400 text-[11px]">
                ({hoveredDay.submissions.map((s) => s.title).join(", ")})
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
            <Info className="h-3.5 w-3.5" />
            <span>Rê chuột vào các ô vuông để xem chi tiết bài giải từng ngày</span>
          </div>
        )}
      </div>
    </div>
  );
};
