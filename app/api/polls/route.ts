import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

function generateId() {
  return Math.random().toString(36).substring(2, 12) + Date.now().toString(36)
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] POST /api/polls - リクエスト受信")
    const body = await request.json()
    console.log("[v0] リクエストボディ:", body)

    const { question, choices, createdBy } = body

    if (!question || !choices || choices.length !== 4) {
      console.log("[v0] バリデーションエラー")
      return NextResponse.json({ error: "質問文と4つの選択肢が必要です" }, { status: 400 })
    }

    const poll = db.createPoll({
      pollId: generateId(),
      question,
      choices: choices.map((choice: any, index: number) => ({
        id: index + 1,
        text: choice.text,
        imageUrl: choice.imageUrl,
      })),
      createdBy: createdBy || "anonymous",
      createdAt: new Date(),
    })

    console.log("[v0] 投票ページ作成成功:", poll.pollId)
    return NextResponse.json(poll)
  } catch (error) {
    console.error("[v0] エラー:", error)
    return NextResponse.json({ error: "投票ページの作成に失敗しました" }, { status: 500 })
  }
}

export async function GET() {
  const polls = db.getAllPolls()
  return NextResponse.json(polls)
}
