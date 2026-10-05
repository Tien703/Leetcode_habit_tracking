/**
 * AlgoHabit - Background Service Worker
 * Xử lý gửi dữ liệu lên Web App API, lưu cache, và kích hoạt thông báo Chrome
 */

const DEFAULT_SERVER_URL = "http://localhost:3000";

// Lắng nghe tin nhắn từ Content Scripts (LeetCode / Codeforces Adapter)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "ALGO_SUBMISSION_ACCEPTED") {
    handleSubmission(message.payload)
      .then((res) => sendResponse({ success: true, res }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true; // Giữ kênh kết nối async
  }
});

async function handleSubmission(payload) {
  const config = await chrome.storage.sync.get(["serverUrl", "apiKey"]);
  const serverUrl = config.serverUrl || DEFAULT_SERVER_URL;
  const apiKey = config.apiKey || "";

  console.log("[AlgoHabit Extension] Sending submission to:", `${serverUrl}/api/submissions/sync`, payload);

  try {
    const res = await fetch(`${serverUrl}/api/submissions/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": apiKey ? `Bearer ${apiKey}` : "",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      // Hiển thị thông báo Chrome Notification
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/icon128.png",
        title: `🔥 Streak Updated! +${data.data?.xpEarned || 10} XP`,
        message: `Chúc mừng bạn đã giải thành công "${payload.problemTitle}" trên ${payload.platform.toUpperCase()}!`,
        priority: 2,
      });

      // Cập nhật Badge trên Extension icon
      chrome.action.setBadgeText({ text: "✓" });
      chrome.action.setBadgeBackgroundColor({ color: "#10b981" });

      setTimeout(() => {
        chrome.action.setBadgeText({ text: "" });
      }, 5000);

      return data;
    } else {
      throw new Error(data.error || "Gửi dữ liệu thất bại");
    }
  } catch (err) {
    console.error("[AlgoHabit Extension] Error syncing submission:", err);
    // Lưu tạm vào offline queue nếu mất kết nối
    const local = await chrome.storage.local.get(["offlineQueue"]);
    const queue = local.offlineQueue || [];
    queue.push(payload);
    await chrome.storage.local.set({ offlineQueue: queue });
    throw err;
  }
}
