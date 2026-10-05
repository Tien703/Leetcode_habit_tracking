/**
 * LeetCode Adapter Content Script
 * Tự động phát hiện khi người dùng nộp bài thành công (Accepted) trên leetcode.com
 */

(function () {
  console.log("[AlgoHabit] LeetCode Adapter initialized on", window.location.href);

  let lastProcessedKey = null;

  // Lấy thông tin bài toán từ URL & DOM
  function getProblemInfo() {
    const urlParts = window.location.pathname.split("/").filter(Boolean);
    let problemSlug = "unknown";
    if (urlParts[0] === "problems" && urlParts[1]) {
      problemSlug = urlParts[1];
    }

    const titleElem = document.querySelector("div[data-cy='question-title']") ||
                      document.querySelector(".text-title-large") ||
                      document.querySelector("a[href*='/problems/']");
    const problemTitle = titleElem ? titleElem.innerText.trim() : problemSlug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());

    // Difficulty
    let difficulty = "MEDIUM";
    const diffElem = document.querySelector("[class*='text-difficulty-']") ||
                     document.querySelector(".text-olive") ||
                     document.querySelector(".text-yellow") ||
                     document.querySelector(".text-pink");

    if (diffElem) {
      const text = diffElem.innerText.toUpperCase();
      if (text.includes("EASY")) difficulty = "EASY";
      else if (text.includes("HARD")) difficulty = "HARD";
      else if (text.includes("MEDIUM")) difficulty = "MEDIUM";
    }

    return {
      problemId: problemSlug,
      problemTitle,
      problemUrl: window.location.origin + "/problems/" + problemSlug + "/",
      difficulty,
    };
  }

  // Observer DOM để phát hiện modal kết quả Accepted
  const observer = new MutationObserver(() => {
    const acceptedElements = Array.from(
      document.querySelectorAll("[data-e2e-locator='submission-result'], span, div, p")
    ).filter(
      (el) =>
        el.innerText &&
        (el.innerText.trim() === "Accepted" || el.innerText.trim() === "Success") &&
        el.children.length === 0
    );

    if (acceptedElements.length > 0) {
      const info = getProblemInfo();
      const submissionKey = `${info.problemId}-${Math.floor(Date.now() / 60000)}`; // Khóa theo phút để tránh gửi lặp

      if (lastProcessedKey === submissionKey) return;
      lastProcessedKey = submissionKey;

      console.log("[AlgoHabit] 🎯 Detected LeetCode Accepted!", info);

      const payload = {
        platform: "leetcode",
        platformUsername: "current_user",
        problemId: info.problemId,
        problemTitle: info.problemTitle,
        problemUrl: info.problemUrl,
        difficulty: info.difficulty,
        tags: [],
        language: "auto",
        status: "ACCEPTED",
        submittedAt: Math.floor(Date.now() / 1000),
      };

      // Gửi sang background service worker
      chrome.runtime.sendMessage({
        type: "ALGO_SUBMISSION_ACCEPTED",
        payload,
      }, (res) => {
        if (chrome.runtime.lastError) {
          console.warn("[AlgoHabit] Message error:", chrome.runtime.lastError);
        } else {
          console.log("[AlgoHabit] Sync Response:", res);
        }
      });
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
