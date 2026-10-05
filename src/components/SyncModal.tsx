"use client";

import React, { useState } from "react";
import { UserProfile, CodingPlatform } from "@/types";
import { X, Check, RefreshCw, AlertCircle, Sparkles, Code2, Award } from "lucide-react";

interface SyncModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSaveHandles: (leetcodeUser: string, cfHandle: string) => Promise<void>;
}

export const SyncModal: React.FC<SyncModalProps> = ({
  user,
  isOpen,
  onClose,
  onSaveHandles,
}) => {
  const currentLc = user.handles.find((h) => h.platform === "leetcode")?.handle || "";
  const currentCf = user.handles.find((h) => h.platform === "codeforces")?.handle || "";

  const [lcUsername, setLcUsername] = useState(currentLc);
  const [cfHandle, setCfHandle] = useState(currentCf);
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleTestLeetCode = async () => {
    if (!lcUsername.trim()) return;
    setLoading(true);
    setErrorMsg("");
    setTestResult(null);

    try {
      const res = await fetch(`/api/leetcode?username=${encodeURIComponent(lcUsername.trim())}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setTestResult(data.data);
      } else {
        setErrorMsg(data.error || "Không tìm thấy tài khoản LeetCode");
      }
    } catch (err: any) {
      setErrorMsg("Lỗi kết nối máy chủ: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSaveHandles(lcUsername.trim(), cfHandle.trim());
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Lưu thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="w-full max-w-lg rounded-2xl bg-surface-100 border border-white/15 p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
          <Code2 className="h-5 w-5 text-indigo-400" />
          Liên Kết Tài Khoản Luyện Thuật Toán
        </h3>
        <p className="text-xs text-slate-400 mb-5">
          Nhập Username công khai của bạn. Hệ thống sẽ tự động đồng bộ bài giải và tính Streak mỗi ngày.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          {/* LeetCode Field */}
          <div className="p-4 rounded-xl bg-surface-50 border border-white/5 space-y-2">
            <label className="block text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <span>LeetCode Username:</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="VD: tourist, neal_wu..."
                value={lcUsername}
                onChange={(e) => setLcUsername(e.target.value)}
                className="flex-1 rounded-xl bg-surface-100 border border-white/10 px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleTestLeetCode}
                disabled={loading || !lcUsername.trim()}
                className="rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 px-3 py-2 text-xs font-bold transition-all disabled:opacity-50"
              >
                Kiểm tra
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              * Yêu cầu Profile LeetCode của bạn đang ở chế độ Public.
            </p>
          </div>

          {/* Codeforces Field */}
          <div className="p-4 rounded-xl bg-surface-50 border border-white/5 space-y-2">
            <label className="block text-xs font-bold text-blue-400 flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5" />
              <span>Codeforces Handle:</span>
            </label>
            <input
              type="text"
              placeholder="VD: tourist, Petr..."
              value={cfHandle}
              onChange={(e) => setCfHandle(e.target.value)}
              className="w-full rounded-xl bg-surface-100 border border-white/10 px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
            />
          </div>

          {/* Test Result Box */}
          {testResult && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-emerald-400 flex-shrink-0" />
              <div>
                <strong className="font-bold">✓ Tìm thấy LeetCode: @{testResult.username}</strong>
                <div>
                  Đã giải: {testResult.totalSolved} bài (Easy: {testResult.easySolved}, Medium: {testResult.mediumSolved}, Hard: {testResult.hardSolved})
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl bg-surface-50 hover:bg-surface-200 text-slate-300 text-xs font-semibold py-2.5 transition-colors"
            >
              Đóng
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              {loading && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
              <span>Lưu & Đồng Bộ Ngay</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
