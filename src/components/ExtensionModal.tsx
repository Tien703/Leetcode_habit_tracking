"use client";

import React, { useState } from "react";
import { X, Chrome, Copy, Check, ShieldCheck, Zap, Layers, Sparkles } from "lucide-react";

interface ExtensionModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
}

export const ExtensionModal: React.FC<ExtensionModalProps> = ({ isOpen, onClose, apiKey }) => {
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!isOpen) return null;

  const serverUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(serverUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="w-full max-w-xl rounded-2xl bg-surface-100 border border-white/15 p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Chrome className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">AlgoHabit Universal Extension</h3>
            <p className="text-xs text-slate-400">
              Tự động bắt sự kiện nộp bài AC trên LeetCode & Codeforces theo thời gian thực
            </p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
          <div className="p-3 rounded-xl bg-surface-50 border border-white/5 text-center">
            <Zap className="h-5 w-5 text-amber-400 mx-auto mb-1" />
            <div className="text-xs font-bold text-white">Real-time 100%</div>
            <div className="text-[10px] text-slate-400">Vừa nộp bài là Streak lên ngay</div>
          </div>

          <div className="p-3 rounded-xl bg-surface-50 border border-white/5 text-center">
            <Layers className="h-5 w-5 text-indigo-400 mx-auto mb-1" />
            <div className="text-xs font-bold text-white">Adapter Mở Rộng</div>
            <div className="text-[10px] text-slate-400">Hỗ trợ LeetCode, Codeforces...</div>
          </div>

          <div className="p-3 rounded-xl bg-surface-50 border border-white/5 text-center">
            <Sparkles className="h-5 w-5 text-emerald-400 mx-auto mb-1" />
            <div className="text-xs font-bold text-white">Toast & Pháo Hoa</div>
            <div className="text-[10px] text-slate-400">Thông báo ăn mừng mỗi bài AC</div>
          </div>
        </div>

        {/* Credentials Box */}
        <div className="space-y-3 p-4 rounded-xl bg-surface-50 border border-white/5 mb-5">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Personal API Key của bạn:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={apiKey}
                className="flex-1 rounded-lg bg-surface-100 border border-white/10 px-3 py-2 text-xs font-mono text-amber-300 outline-none"
              />
              <button
                onClick={handleCopyKey}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 text-xs font-semibold transition-colors"
              >
                {copiedKey ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey ? "Đã chép" : "Sao chép"}</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Web App Endpoint:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={serverUrl}
                className="flex-1 rounded-lg bg-surface-100 border border-white/10 px-3 py-2 text-xs font-mono text-slate-300 outline-none"
              />
              <button
                onClick={handleCopyUrl}
                className="flex items-center gap-1.5 rounded-lg bg-surface-100 hover:bg-surface-200 border border-white/10 text-slate-300 px-3 py-2 text-xs font-semibold transition-colors"
              >
                {copiedUrl ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedUrl ? "Đã chép" : "Sao chép"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3 Step Installation Guide */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Cách cài đặt Extension (30 giây):
          </h4>

          <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside">
            <li className="p-2.5 rounded-lg bg-surface-50 border border-white/5">
              Mở trình duyệt Chrome/Edge, gõ <code className="text-indigo-300 font-mono">chrome://extensions</code> vào thanh địa chỉ và bật chế độ <strong>"Developer mode"</strong> (góc trên bên phải).
            </li>
            <li className="p-2.5 rounded-lg bg-surface-50 border border-white/5">
              Bấm nút <strong>"Load unpacked"</strong> và chọn thư mục <code className="text-amber-300 font-mono">extension/</code> trong dự án này.
            </li>
            <li className="p-2.5 rounded-lg bg-surface-50 border border-white/5">
              Bấm vào biểu tượng ngọn lửa 🔥 trên thanh Extension, dán <strong>API Key</strong> ở trên và bấm <strong>"Lưu Cấu Hình"</strong>.
            </li>
          </ol>
        </div>

        <div className="mt-6 pt-4 border-t border-white/5 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 shadow-lg shadow-indigo-600/30 transition-all"
          >
            Đã Hiểu
          </button>
        </div>
      </div>
    </div>
  );
};
