# 🚀 AlgoHabit - Universal Coding Habit Tracker

Nền tảng Fullstack Web App kết hợp Browser Extension giúp theo dõi, duy trì thói quen giải thuật toán (LeetCode, Codeforces,...) cho cá nhân và cộng đồng.

---

## 🌟 Các Tính Năng Đã Hoàn Thiện

### 1. Thu Nạp Dữ Liệu Kép (Dual-Ingestion)
- **Universal Browser Extension (Real-time):** Tự động bắt sự kiện nộp bài thành công (Accepted) trên `leetcode.com` và `codeforces.com` rồi gửi về Web App qua REST API.
- **Server GraphQL & REST Polling:** Tự động kết nối với LeetCode Public GraphQL API và Codeforces Official API để lấy dữ liệu bài giải và Daily Challenge.

### 2. Gamification & Streak Consistency
- 🔥 **Streak Counter:** Đếm số ngày liên tục giải bài kèm hiệu ứng ngọn lửa sống động.
- 🛡️ **Streak Freeze:** Khiên bảo vệ chuỗi khi bận rộn.
- 🟩 **Activity Matrix (365 Days Heatmap):** Ma trận đóng góp 52 tuần trực quan hóa độ chăm chỉ.
- 🏆 **Level & XP Progression:** Hệ thống kinh nghiệm và danh hiệu (Novice Solver ➔ Grandmaster).
- 🎉 **Pháo hoa ăn mừng:** Hiệu ứng Confetti khi nộp bài hoặc hoàn thành mục tiêu.

### 3. Phòng Luyện Nhóm (Squads & Pledges)
- Tạo phòng luyện tập hoặc tham gia bằng **Invite Code**.
- Bảng Check-in theo dõi ai đã làm bài hôm nay, ai chưa làm.
- Tính năng **"Nhắc nhở / Poke"** bạn bè khi chưa giải bài.
- Thiết lập luật cam kết (Pledge rule / Quỹ phạt nếu đứt streak).

### 4. Bảng Xếp Hạng & Lộ Trình Tuyển Chọn
- Bảng xếp hạng toàn cầu & nhóm lọc theo Streak, XP tuần, Tổng bài.
- Tích hợp lộ trình **Blind 75 Must-Do** & **Codeforces Div 2 Starter**.

---

## 💻 Cấu Trúc Dự Án

```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── codeforces/route.ts      # Proxy Codeforces REST API
│   │   │   ├── leetcode/route.ts        # Proxy LeetCode GraphQL API
│   │   │   └── submissions/sync/route.ts# Ingestion API cho Extension & Web
│   │   ├── globals.css                 # Dark theme & styling tokens
│   │   ├── layout.tsx                  # Root layout & Google Fonts
│   │   └── page.tsx                    # Dashboard chính
│   ├── components/
│   │   ├── ActivityHeatmap.tsx         # Heatmap 365 ngày
│   │   ├── ExtensionModal.tsx          # Hướng dẫn cài đặt Extension
│   │   ├── LeaderboardView.tsx         # Bảng xếp hạng Top 3 Podium
│   │   ├── Navbar.tsx                  # Header điều hướng & chỉ số nhanh
│   │   ├── RecentSubmissions.tsx       # Danh sách bài giải gần đây
│   │   ├── RoadmapsView.tsx            # Lộ trình Blind 75
│   │   ├── SquadsView.tsx              # Phòng luyện nhóm & Poke
│   │   ├── StatsCards.tsx              # Thống kê chi tiết Easy/Medium/Hard/Rating
│   │   ├── StreakHero.tsx              # Card ngọn lửa Streak & Daily Challenge
│   │   └── SyncModal.tsx               # Modal liên kết LeetCode / Codeforces handle
│   ├── services/
│   │   ├── codeforces.ts               # Client gọi Codeforces API
│   │   ├── habit-engine.ts             # Thuật toán Streak, XP, Level, Heatmap
│   │   ├── leetcode.ts                 # Client gọi LeetCode GraphQL API
│   │   └── storage.ts                  # Mock database & bộ dữ liệu mẫu ban đầu
│   └── types/                          # Định nghĩa dữ liệu TypeScript
└── extension/                          # Universal Browser Extension (Manifest V3)
    ├── background.js                   # Service worker xử lý dispatching & notifications
    ├── content_scripts/
    │   ├── leetcode_adapter.js         # Adapter bắt sự kiện nộp bài LeetCode
    │   └── codeforces_adapter.js       # Adapter bắt sự kiện nộp bài Codeforces
    ├── popup/                          # Giao diện popup extension
    └── manifest.json                   # Cấu hình Manifest V3
```

---

## 🚀 Hướng Dẫn Khởi Chạy

### 1. Chạy Web App
```bash
# Cài đặt thư viện (nếu chưa cài)
npm install

# Khởi chạy máy chủ phát triển
npm run dev
```
Mở trình duyệt truy cập: `http://localhost:3000`

### 2. Cài Đặt Universal Browser Extension
1. Mở Chrome/Edge, truy cập `chrome://extensions`
2. Bật công tắc **"Developer mode"** (Chế độ dành cho nhà phát triển).
3. Bấm **"Load unpacked"** (Tải tiện ích đã giải nén) và chọn thư mục `extension/` trong dự án.
4. Bấm vào icon ngọn lửa 🔥 của Extension trên trình duyệt, dán API Key từ Web App và bấm **"Lưu Cấu Hình"**.
5. Bây giờ mỗi khi bạn giải xong bài trên LeetCode hoặc Codeforces, hệ thống sẽ tự động cập nhật streak và gửi thông báo!
