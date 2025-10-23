import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { nanoid } from "nanoid"

export async function POST(request: NextRequest, { params }: { params: Promise<{ pollId: string }> }) {
  try {
    const { pollId } = await params
    const body = await request.json()
    const { voterName, choiceId, comment } = body

    // 投票ページの存在確認
    const poll = db.getPoll(pollId)
    if (!poll) {
      return NextResponse.json({ error: "投票ページが見つかりません" }, { status: 404 })
    }

    // 本日の投票済みチェック
    if (db.hasVotedToday(pollId, voterName)) {
      return NextResponse.json({ error: "本日は既に投票済みです" }, { status: 400 })
    }

    const vote = db.addVote({
      voteId: nanoid(10),
      pollId,
      voterName,
      choiceId,
      comment: comment || "",
      votedAt: new Date(),
    })

    return NextResponse.json(vote)
  } catch (error) {
    return NextResponse.json({ error: "投票の送信に失敗しました" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ pollId: string }> }) {
  const { pollId } = await params
  const votes = db.getVotesForToday(pollId)
  return NextResponse.json(votes)
}
