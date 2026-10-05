/**
 * Codeforces Official REST API Client
 * Endpoints:
 * - https://codeforces.com/api/user.info?handles=...
 * - https://codeforces.com/api/user.status?handle=...
 */

export interface CodeforcesProfileData {
  handle: string;
  rating?: number;
  maxRating?: number;
  rank?: string;
  maxRank?: string;
  avatar?: string;
  totalSolved: number;
  recentSubmissions: {
    id: string;
    contestId?: number;
    index?: string;
    name: string;
    rating?: number;
    tags: string[];
    programmingLanguage: string;
    verdict: string;
    creationTimeSeconds: number;
  }[];
}

export async function fetchCodeforcesData(handle: string): Promise<CodeforcesProfileData | null> {
  try {
    // 1. Fetch user info
    const infoRes = await fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`, {
      next: { revalidate: 300 }
    });

    if (!infoRes.ok) return null;
    const infoData = await infoRes.json();
    if (infoData.status !== "OK" || !infoData.result?.length) return null;

    const user = infoData.result[0];

    // 2. Fetch submissions
    const statusRes = await fetch(`https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}&from=1&count=100`, {
      next: { revalidate: 300 }
    });

    let submissions: any[] = [];
    if (statusRes.ok) {
      const statusData = await statusRes.json();
      if (statusData.status === "OK") {
        submissions = statusData.result || [];
      }
    }

    // Filter OK / Accepted
    const solvedSet = new Set<string>();
    const recentSubmissions: CodeforcesProfileData["recentSubmissions"] = [];

    for (const sub of submissions) {
      if (sub.verdict === "OK" && sub.problem) {
        const key = `${sub.problem.contestId}-${sub.problem.index}`;
        solvedSet.add(key);

        if (recentSubmissions.length < 20) {
          recentSubmissions.push({
            id: String(sub.id),
            contestId: sub.problem.contestId,
            index: sub.problem.index,
            name: sub.problem.name,
            rating: sub.problem.rating,
            tags: sub.problem.tags || [],
            programmingLanguage: sub.programmingLanguage,
            verdict: sub.verdict,
            creationTimeSeconds: sub.creationTimeSeconds,
          });
        }
      }
    }

    return {
      handle: user.handle,
      rating: user.rating,
      maxRating: user.maxRating,
      rank: user.rank,
      maxRank: user.maxRank,
      avatar: user.titlePhoto || user.avatar,
      totalSolved: solvedSet.size,
      recentSubmissions,
    };
  } catch (err) {
    console.error("Error fetching Codeforces data for", handle, err);
    return null;
  }
}
