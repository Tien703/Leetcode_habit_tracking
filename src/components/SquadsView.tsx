"use client";

import React, { useState } from "react";
import { Squad, SquadMember } from "@/types";
import { Users, Plus, ShieldAlert, CheckCircle2, XCircle, BellRing, Flame, Trophy, Copy, Check } from "lucide-react";

interface SquadsViewProps {
  squads: Squad[];
  onJoinSquad: (code: string) => void;
  onCreateSquad: (name: string, desc: string, rule: string) => void;
}

export const SquadsView: React.FC<SquadsViewProps> = ({ squads, onJoinSquad, onCreateSquad }) => {
  const [activeSquadId, setActiveSquadId] = useState<string>(squads[0]?.id || "squad-1");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [pokedMember, setPokedMember] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSquadName, setNewSquadName] = useState("");
  const [newSquadDesc, setNewSquadDesc] = useState("");
  const [newSquadRule, setNewSquadRule] = useState("Phạt 20k vào quỹ nếu đứt streak");
  const [inviteInput, setInviteInput] = useState("");

  const currentSquad = squads.find((s) => s.id === activeSquadId) || squads[0];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handlePoke = (member: SquadMember) => {
    setPokedMember(member.name);
    setTimeout(() => setPokedMember(null), 3000);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSquadName.trim()) return;
    onCreateSquad(newSquadName, newSquadDesc, newSquadRule);
    setShowCreateModal(false);
    setNewSquadName("");
    setNewSquadDesc("");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Squad Selector & Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-2xl bg-surface-100 border border-white/10 p-6 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-400" />
            Phòng Luyện Thuật Toán (Squads)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Luyện tập cùng đồng đội, theo dõi tiến độ hàng ngày và cùng nhau giữ vững chuỗi Streak!
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Quick Join input */}
          <div className="flex items-center bg-surface-50 border border-white/10 rounded-xl px-2.5 py-1 text-xs">
            <input
              type="text"
              placeholder="Nhập mã mời..."
              value={inviteInput}
              onChange={(e) => setInviteInput(e.target.value)}
              className="bg-transparent text-white outline-none w-28 text-xs placeholder:text-slate-500"
            />
            <button
              onClick={() => {
                if (inviteInput.trim()) {
                  onJoinSquad(inviteInput.trim());
                  setInviteInput("");
                }
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-2.5 py-1 text-xs font-semibold"
            >
              Vào
            </button>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl px-4 py-2 text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Plus className="h-4 w-4" />
            Tạo Phòng Mới
          </button>
        </div>
      </div>

      {/* Squad Tab Switcher */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {squads.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSquadId(s.id)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${
              activeSquadId === s.id
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "bg-surface-100/80 hover:bg-surface-100 text-slate-400 hover:text-white border border-white/5"
            }`}
          >
            <span>{s.name}</span>
            <span className="rounded-full bg-black/20 px-2 py-0.5 text-[10px]">
              {s.membersCount} thành viên
            </span>
          </button>
        ))}
      </div>

      {currentSquad && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Squad Info & Member Checklist */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl bg-surface-100 border border-white/10 p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/5">
                <div>
                  <h3 className="text-lg font-bold text-white">{currentSquad.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{currentSquad.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Mã mời:</span>
                  <button
                    onClick={() => handleCopyCode(currentSquad.inviteCode)}
                    className="flex items-center gap-1.5 bg-surface-50 border border-white/10 hover:border-indigo-500/50 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-indigo-300 transition-colors"
                  >
                    <span>{currentSquad.inviteCode}</span>
                    {copiedCode === currentSquad.inviteCode ? (
                      <Check className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <Copy className="h-3 w-3 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Pledge Alert Box */}
              {currentSquad.pledgeRule && (
                <div className="mt-4 flex items-center gap-3 rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-300">
                  <ShieldAlert className="h-4 w-4 flex-shrink-0 text-amber-400" />
                  <div>
                    <strong className="font-bold">Luật Cam Kết: </strong>
                    {currentSquad.pledgeRule}
                  </div>
                </div>
              )}

              {/* Toast for Poke notification */}
              {pokedMember && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-indigo-500/20 border border-indigo-500/40 p-3 text-xs text-indigo-200 animate-bounce">
                  <BellRing className="h-4 w-4 text-indigo-400" />
                  <span>
                    🔔 Đã gửi tin nhắn nhắc nhở đến <strong>{pokedMember}</strong>!
                  </span>
                </div>
              )}

              {/* Today's Check-in List */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-white">Bảng Check-in Hôm Nay</h4>
                  <span className="text-xs text-slate-400">
                    {currentSquad.members.filter((m) => m.solvedToday).length} /{" "}
                    {currentSquad.members.length} thành viên đã hoàn thành
                  </span>
                </div>

                <div className="space-y-3">
                  {currentSquad.members.map((member) => (
                    <div
                      key={member.userId}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-surface-50/70 hover:bg-surface-50 border border-white/5 p-4 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="h-10 w-10 rounded-full object-cover ring-2 ring-white/10"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">{member.name}</span>
                            {member.role === "OWNER" && (
                              <span className="text-[9px] font-bold bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">
                                Trưởng Nhóm
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                            <span className="flex items-center gap-1 text-amber-400">
                              <Flame className="h-3 w-3 fill-amber-400" /> {member.currentStreak} ngày
                            </span>
                            <span>• Tuần này: {member.weeklyXp} XP</span>
                          </div>
                        </div>
                      </div>

                      {/* Status and Poke CTA */}
                      <div className="flex items-center gap-3 self-end sm:self-center">
                        {member.solvedToday ? (
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Đã giải {member.todayCount} bài</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-xs font-semibold text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2.5 py-1 rounded-xl">
                              <XCircle className="h-3.5 w-3.5" /> Chưa giải
                            </span>
                            <button
                              onClick={() => handlePoke(member)}
                              className="flex items-center gap-1 text-xs font-bold text-indigo-300 hover:text-white bg-indigo-600/30 hover:bg-indigo-600 border border-indigo-500/40 px-2.5 py-1 rounded-xl transition-all"
                            >
                              <BellRing className="h-3 w-3" />
                              Nhắc Nhở
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Squad Statistics & Achievements */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-surface-100 border border-white/10 p-6 shadow-xl">
              <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                <Trophy className="h-4 w-4 text-amber-400" />
                Thành Tích Cả Phòng
              </h4>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-surface-50 border border-white/5">
                  <span className="text-xs text-slate-400">Tổng điểm XP cả nhóm</span>
                  <div className="text-2xl font-extrabold text-amber-400 mt-1">
                    {currentSquad.totalGroupXp} XP
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-surface-50 border border-white/5">
                  <span className="text-xs text-slate-400">Mục tiêu chung</span>
                  <div className="text-base font-bold text-white mt-1">
                    Mỗi người tối thiểu {currentSquad.dailyGoal} bài/ngày
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-surface-50 border border-white/5">
                  <span className="text-xs text-slate-400">Tỷ lệ hoàn thành hôm nay</span>
                  <div className="text-xl font-bold text-emerald-400 mt-1">
                    {Math.round(
                      (currentSquad.members.filter((m) => m.solvedToday).length /
                        currentSquad.members.length) *
                        100
                    )}
                    %
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tạo Nhóm */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-surface-100 border border-white/15 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Tạo Phòng Luyện Thuật Toán Mới</h3>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tên phòng / Squad:
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Cày LeetCode Đón Tết"
                  value={newSquadName}
                  onChange={(e) => setNewSquadName(e.target.value)}
                  className="w-full rounded-xl bg-surface-50 border border-white/10 px-3.5 py-2 text-sm text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mô tả mục tiêu:
                </label>
                <input
                  type="text"
                  placeholder="VD: Nhóm luyện 1 bài mỗi ngày, rèn tính kỷ luật"
                  value={newSquadDesc}
                  onChange={(e) => setNewSquadDesc(e.target.value)}
                  className="w-full rounded-xl bg-surface-50 border border-white/10 px-3.5 py-2 text-sm text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Luật cam kết / Phạt nếu đứt streak:
                </label>
                <input
                  type="text"
                  value={newSquadRule}
                  onChange={(e) => setNewSquadRule(e.target.value)}
                  className="w-full rounded-xl bg-surface-50 border border-white/10 px-3.5 py-2 text-sm text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 rounded-xl bg-surface-50 hover:bg-surface-200 text-slate-300 text-xs font-semibold py-2.5 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 shadow-lg shadow-indigo-600/30 transition-colors"
                >
                  Tạo Phòng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
