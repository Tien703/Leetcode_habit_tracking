/**
 * LeetCode Public GraphQL API Client
 * Endpoint: https://leetcode.com/graphql
 */

export interface LeetCodeProfileData {
  username: string;
  realName?: string;
  avatar?: string;
  ranking?: number;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  recentSubmissions: {
    id: string;
    title: string;
    titleSlug: string;
    timestamp: number;
  }[];
  submissionCalendar: Record<string, number>; // { [unix_timestamp_seconds]: count }
  dailyChallenge?: {
    date: string;
    link: string;
    title: string;
    difficulty: string;
  };
}

export async function fetchLeetCodeData(username: string): Promise<LeetCodeProfileData | null> {
  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          realName
          userAvatar
          ranking
        }
        submitStats: submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
        userCalendar(year: ${new Date().getFullYear()}) {
          submissionCalendar
          streak
          totalActiveDays
        }
      }
      recentAcSubmissionList(username: $username, limit: 20) {
        id
        title
        titleSlug
        timestamp
      }
      activeDailyCodingChallengeQuestion {
        date
        link
        question {
          title
          titleSlug
          difficulty
        }
      }
    }
  `;

  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": `https://leetcode.com/${username}/`,
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
      next: { revalidate: 300 }, // Cache 5 min
    });

    if (!res.ok) {
      throw new Error(`LeetCode API returned HTTP status ${res.status}`);
    }

    const data = await res.json();
    const user = data?.data?.matchedUser;

    if (!user) {
      return null;
    }

    const acStats = user.submitStats?.acSubmissionNum || [];
    const all = acStats.find((s: { difficulty: string }) => s.difficulty === "All")?.count || 0;
    const easy = acStats.find((s: { difficulty: string }) => s.difficulty === "Easy")?.count || 0;
    const medium = acStats.find((s: { difficulty: string }) => s.difficulty === "Medium")?.count || 0;
    const hard = acStats.find((s: { difficulty: string }) => s.difficulty === "Hard")?.count || 0;

    let calendar: Record<string, number> = {};
    try {
      const rawCal = user.userCalendar?.submissionCalendar;
      if (rawCal) {
        calendar = JSON.parse(rawCal);
      }
    } catch {
      calendar = {};
    }

    const recentSubmissions = (data?.data?.recentAcSubmissionList || []).map((sub: { id: string; title: string; titleSlug: string; timestamp: string | number }) => ({
      id: String(sub.id),
      title: sub.title,
      titleSlug: sub.titleSlug,
      timestamp: Number(sub.timestamp),
    }));

    const dailyQ = data?.data?.activeDailyCodingChallengeQuestion;

    return {
      username: user.username,
      realName: user.profile?.realName,
      avatar: user.profile?.userAvatar,
      ranking: user.profile?.ranking,
      totalSolved: all,
      easySolved: easy,
      mediumSolved: medium,
      hardSolved: hard,
      recentSubmissions,
      submissionCalendar: calendar,
      dailyChallenge: dailyQ ? {
        date: dailyQ.date,
        link: `https://leetcode.com${dailyQ.link}`,
        title: dailyQ.question?.title,
        difficulty: dailyQ.question?.difficulty,
      } : undefined,
    };
  } catch (err) {
    console.error("Error fetching LeetCode data for", username, err);
    return null;
  }
}
