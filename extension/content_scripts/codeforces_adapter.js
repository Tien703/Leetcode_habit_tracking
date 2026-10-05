/**
 * Codeforces Adapter Content Script
 * Tự động phát hiện khi bài nộp đạt verdict "Accepted" trên codeforces.com
 */

(function () {
  console.log("[AlgoHabit] Codeforces Adapter initialized on", window.location.href);

  let lastProcessedId = null;

  function checkForAcceptedSubmissions() {
    // 1. Kiểm tra bảng Submissions trên Codeforces
    const rows = document.querySelectorAll("tr[data-submission-id]");
    rows.forEach((row) => {
      const subId = row.getAttribute("data-submission-id");
      const verdictEl = row.querySelector(".verdict-accepted, .cell-verdict");

      if (verdictEl && verdictEl.innerText.includes("Accepted")) {
        if (lastProcessedId === subId) return;
        lastProcessedId = subId;

        const problemLink = row.querySelector("a[href*='/problem/'], a[href*='/problemset/problem/']");
        const problemTitle = problemLink ? problemLink.innerText.trim() : "Codeforces Problem";
        const problemUrl = problemLink ? window.location.origin + problemLink.getAttribute("href") : window.location.href;

        // Trích xuất ID (vd: 1850A)
        const parts = problemUrl.split("/").filter(Boolean);
        const pIndex = parts[parts.length - 1];
        const pContest = parts[parts.length - 2];
        const problemId = `${pContest}${pIndex}`;

        console.log("[AlgoHabit] 🎯 Detected Codeforces Accepted Submission:", subId, problemTitle);

        const payload = {
          platform: "codeforces",
          platformUsername: "cf_user",
          problemId,
          problemTitle,
          problemUrl,
          difficulty: "MEDIUM",
          rawDifficulty: "1200",
          tags: [],
          language: "C++",
          status: "ACCEPTED",
          submittedAt: Math.floor(Date.now() / 1000),
        };

        chrome.runtime.sendMessage({
          type: "ALGO_SUBMISSION_ACCEPTED",
          payload,
        });
      }
    });
  }

  // Chạy kiểm tra định kỳ mỗi 3s trên trang submission của Codeforces
  setInterval(checkForAcceptedSubmissions, 3000);
  checkForAcceptedSubmissions();
})();
