import { NextRequest, NextResponse } from "next/server";
import { fetchLeetCodeData } from "@/services/leetcode";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Missing username parameter" }, { status: 400 });
  }

  const data = await fetchLeetCodeData(username);

  if (!data) {
    return NextResponse.json(
      { error: "Could not fetch LeetCode profile. User may not exist or profile is private." },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data });
}
