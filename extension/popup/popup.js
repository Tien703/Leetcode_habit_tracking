document.addEventListener("DOMContentLoaded", async () => {
  const serverUrlInput = document.getElementById("serverUrl");
  const apiKeyInput = document.getElementById("apiKey");
  const saveBtn = document.getElementById("saveBtn");
  const testBtn = document.getElementById("testBtn");
  const statusMsg = document.getElementById("statusMsg");

  // Load saved config
  const config = await chrome.storage.sync.get(["serverUrl", "apiKey"]);
  serverUrlInput.value = config.serverUrl || "http://localhost:3000";
  apiKeyInput.value = config.apiKey || "";

  // Save config
  saveBtn.addEventListener("click", async () => {
    const serverUrl = serverUrlInput.value.trim() || "http://localhost:3000";
    const apiKey = apiKeyInput.value.trim();

    await chrome.storage.sync.set({ serverUrl, apiKey });
    statusMsg.className = "status-msg success";
    statusMsg.innerText = "✓ Đã lưu cấu hình thành công!";
    setTimeout(() => {
      statusMsg.innerText = "";
    }, 3000);
  });

  // Test send
  testBtn.addEventListener("click", async () => {
    statusMsg.className = "status-msg";
    statusMsg.innerText = "Đang gửi test submission...";

    try {
      const response = await new Promise((resolve) => {
        chrome.runtime.sendMessage(
          {
            type: "ALGO_SUBMISSION_ACCEPTED",
            payload: {
              platform: "leetcode",
              platformUsername: "test_user",
              problemId: "two-sum",
              problemTitle: "Two Sum (Test Sync)",
              problemUrl: "https://leetcode.com/problems/two-sum/",
              difficulty: "EASY",
              tags: ["Array", "Hash Table"],
              language: "TypeScript",
              status: "ACCEPTED",
              submittedAt: Math.floor(Date.now() / 1000),
            },
          },
          resolve
        );
      });

      if (response && response.success) {
        statusMsg.className = "status-msg success";
        statusMsg.innerText = "✓ Kết nối API thành công (+10 XP)!";
      } else {
        throw new Error(response?.error || "Lỗi phản hồi");
      }
    } catch (err) {
      statusMsg.className = "status-msg error";
      statusMsg.innerText = "✗ Thất bại: " + err.message;
    }
  });
});
