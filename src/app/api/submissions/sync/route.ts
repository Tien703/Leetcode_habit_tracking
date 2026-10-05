import { NextRequest, NextResponse } from "next/server";
import { UnifiedSubmissionPayload } from "@/types";
import { calculateXp } from "@/services/habit-engine";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const apiKey = authHeader ? authHeader.replace("Bearer ", "") : req.headers.get("x-api-key");

    const payload: UnifiedSubmissionPayload = await req.json();

    if (!payload.platform || !payload.problemId || !payload.status) {
      return NextResponse.json(
        { error: "Invalid payload: missing required fields" },
        { status: 400 }
      );
    }

    // Only reward Accepted submissions
    const isAccepted = payload.status === "ACCEPTED";
    const xpEarned = isAccepted ? calculateXp(payload.difficulty, payload.rawDifficulty) : 0;

    const record = {
      id: `sub-${Date.now()}`,
      userId: apiKey ? "user-1" : "anonymous",
      platform: payload.platform,
      problemId: payload.problemId,
      problemTitle: payload.problemTitle || payload.problemId,
      problemUrl: payload.problemUrl,
      difficulty: payload.difficulty || "MEDIUM",
      rawDifficulty: payload.rawDifficulty,
      tags: payload.tags || [],
      language: payload.language || "Unknown",
      status: payload.status,
      xpEarned,
      submittedAt: new Date(payload.submittedAt ? (payload.submittedAt > 1e11 ? payload.submittedAt : payload.submittedAt * 1000) : Date.now()).toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: isAccepted
        ? `🎉 Chúc mừng bạn đã giải thành công "${payload.problemTitle}" trên ${payload.platform.toUpperCase()}!`
        : `Ghi nhận bài nộp trên ${payload.platform}`,
      data: {
        record,
        xpEarned,
        streakUpdated: isAccepted,
      },
    });
  } catch (err: any) {
    console.error("Error in sync submission API:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err?.message },
      { status: 500 }
    );
  }
}
