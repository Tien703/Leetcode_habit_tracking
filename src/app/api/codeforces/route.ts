import { NextRequest, NextResponse } from "next/server";
import { fetchCodeforcesData } from "@/services/codeforces";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const handle = searchParams.get("handle");

  if (!handle) {
    return NextResponse.json({ error: "Missing handle parameter" }, { status: 400 });
  }

  const data = await fetchCodeforcesData(handle);

  if (!data) {
    return NextResponse.json(
      { error: "Could not fetch Codeforces profile. Handle may not exist." },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data });
}
