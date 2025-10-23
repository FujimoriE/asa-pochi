"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, RefreshCw } from "lucide-react"
import type { Poll, Vote } from "@/lib/db"
import { VoterBubble } from "@/components/voter-bubble"

const CHOICE_COLORS = [
  "#F04600", // Choice 1: Orange
  "#03BF92", // Choice 2: Green
  "#0080EF", // Choice 3: Blue
  "#FEAA02", // Choice 4: Yellow
]

export default function ResultsPage() {
  const params = useParams()
  const pollId = params.pollId as string
  const [poll, setPoll] = useState<Poll | null>(null)
  const [votes, setVotes] = useState<Vote[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchResults = async () => {
    try {
      const [pollRes, votesRes] = await Promise.all([
        fetch(`/api/polls/${pollId}`),
        fetch(`/api/polls/${pollId}/votes`),
      ])

      if (!pollRes.ok) throw new Error("ポストページが見つかりません")

      const pollData = await pollRes.json()
      const votesData = await votesRes.json()

      setPoll(pollData)
      setVotes(votesData)
      setIsLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました")
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchResults()

    // ポーリングでリアルタイム更新（5秒ごと）
    const interval = setInterval(fetchResults, 5000)
    return () => clearInterval(interval)
  }, [pollId])

  const getChoiceText = (choiceId: number) => {
    return poll?.choices.find((c) => c.id === choiceId)?.text || ""
  }

  const getTotalVotes = () => votes.length

  const getVoteCountByChoice = () => {
    if (!poll) return []
    return poll.choices.map((choice) => ({
      choice,
      count: votes.filter((v) => v.choiceId === choice.id).length,
      percentage:
        getTotalVotes() > 0
          ? Math.round((votes.filter((v) => v.choiceId === choice.id).length / getTotalVotes()) * 100)
          : 0,
    }))
  }

  const getCurrentDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth() + 1
    const day = today.getDate()
    return `${year}年${month}月${day}日`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-xl text-muted-foreground">読み込み中...</p>
      </div>
    )
  }

  if (error || !poll) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">エラー</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{error}</p>
            <Button asChild>
              <Link href="/">ホームに戻る</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const voteCounts = getVoteCountByChoice()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <Button className="font-bold" variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              ホームに戻る
            </Link>
          </Button>
          <Button className="font-bold bg-transparent" variant="outline" onClick={fetchResults}>
            <RefreshCw className="w-4 h-4 mr-2" />
            更新
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-balance">{poll.question}</h1>
          <p className="text-lg text-muted-foreground mb-4">{getCurrentDate()}</p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {voteCounts.map((item, index) => (
              <div
                key={item.choice.id}
                className="px-6 py-3 rounded-full text-white font-bold shadow-lg"
                style={{ backgroundColor: CHOICE_COLORS[index % CHOICE_COLORS.length] }}
              >
                {item.choice.text}: {item.count}
              </div>
            ))}
          </div>
        </div>

        <Card className="border-primary min-h-96 border-0 shadow-lg">
          <CardHeader className="text-white bg-background">
            <CardTitle className="text-2xl text-center">ポスト結果</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {votes.length === 0 ? (
              <p className="text-center text-muted-foreground py-12 text-xl">まだポストがありません</p>
            ) : (
              <div className="flex flex-wrap justify-center">
                {votes.map((vote, index) => {
                  const choiceIndex = poll.choices.findIndex((c) => c.id === vote.choiceId)
                  return (
                    <VoterBubble
                      key={vote.voteId}
                      name={vote.voterName}
                      comment={vote.comment}
                      choiceText={getChoiceText(vote.choiceId)}
                      color={CHOICE_COLORS[choiceIndex % CHOICE_COLORS.length]}
                    />
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Button className="font-bold bg-transparent" asChild size="lg" variant="outline">
            <Link href="/polls">ポスト一覧をみる</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
