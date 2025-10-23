import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: Promise<{ pollId: string }> }) {
  try {
    const { pollId } = await params
    console.log("[v0] GET /api/polls/[pollId] - pollId:", pollId)

    const poll = db.getPoll(pollId)
    console.log("[v0] Poll found:", poll ? "yes" : "no")

    if (!poll) {
      return NextResponse.json({ error: "投票ページが見つかりません" }, { status: 404 })
    }

    return NextResponse.json(poll)
  } catch (error) {
    console.error("[v0] Error in GET /api/polls/[pollId]:", error)
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 })
  }
}
