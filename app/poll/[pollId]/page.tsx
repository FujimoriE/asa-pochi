"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import type { Poll } from "@/lib/db"
import { storage } from "@/lib/local-storage"

export default function VotingPage({ params }: { params: { pollId: string } }) {
  const { pollId } = params
  const router = useRouter()
  const [poll, setPoll] = useState<Poll | null>(null)
  const [voterName, setVoterName] = useState("")
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null)
  const [comment, setComment] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [hasVoted, setHasVoted] = useState(false)

  useEffect(() => {
    console.log("[v0] VotingPage mounted, pollId:", pollId)

    // 投票ページ情報を取得
    fetch(`/api/polls/${pollId}`)
      .then((res) => {
        console.log("[v0] Poll fetch response status:", res.status)
        if (!res.ok) throw new Error("ポストページが見つかりません")
        return res.json()
      })
      .then((data) => {
        console.log("[v0] Poll data received:", data)
        setPoll(data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error("[v0] Poll fetch error:", err)
        setError(err.message)
        setIsLoading(false)
      })

    // LocalStorageから名前を取得
    const savedName = storage.getName()
    if (savedName) {
      console.log("[v0] Saved name found:", savedName)
      setVoterName(savedName)
    }

    // 投票済みチェック
    if (storage.hasVotedToday(pollId)) {
      console.log("[v0] User has already voted today")
      setHasVoted(true)
    }
  }, [pollId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Form submitted")

    if (selectedChoice === null) {
      setError("選択肢を選んでください")
      return
    }

    setError("")
    setIsSubmitting(true)

    try {
      console.log("[v0] Submitting vote:", { voterName, choiceId: selectedChoice, comment })

      const response = await fetch(`/api/polls/${pollId}/votes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voterName,
          choiceId: selectedChoice,
          comment,
        }),
      })

      console.log("[v0] Vote response status:", response.status)

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "ポストに失敗しました")
      }

      // 名前を保存
      storage.saveName(voterName)
      // 投票済みを記録
      storage.markAsVoted(pollId)

      console.log("[v0] Vote successful, redirecting to results")
      // 結果ページへ遷移
      router.push(`/poll/${pollId}/results`)
    } catch (err) {
      console.error("[v0] Vote submission error:", err)
      setError(err instanceof Error ? err.message : "エラーが発生しました")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 flex items-center justify-center">
        <p className="text-xl text-muted-foreground">読み込み中...</p>
      </div>
    )
  }

  if (error && !poll) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 flex items-center justify-center">
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

  if (hasVoted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="mb-6">
            <Button className="font-bold" variant="ghost" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                ホームに戻る
              </Link>
            </Button>
          </div>

          <Card className="border-primary border-0 my-0 py-16">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="w-16 h-16 text-primary" />
              </div>
              <CardTitle className="text-3xl">本日はポスト済みです</CardTitle>
              <CardDescription>明日またポストしてください</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full font-bold" size="lg">
                <Link href={`/poll/${pollId}/results`}>結果を見る</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Button className="font-bold" variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              ホームに戻る
            </Link>
          </Button>
        </div>

        <Card className="mx-0 border-0 py-14">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl text-balance py-0">{poll?.question}</CardTitle>
            <CardDescription className="text-lg">あなたの選択を教えてください</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="voterName" className="text-lg">
                  お名前
                </Label>
                <Input
                  id="voterName"
                  value={voterName}
                  onChange={(e) => setVoterName(e.target.value)}
                  placeholder="山田太郎"
                  required
                  className="text-lg h-12"
                />
              </div>

              <div className="space-y-4">
                <Label className="text-lg">選択肢を選んでください</Label>
                <div className="grid sm:grid-cols-2 gap-4">
                  {poll?.choices.map((choice) => (
                    <Card
                      key={choice.id}
                      className={`cursor-pointer transition-all hover:scale-105 ${
                        selectedChoice === choice.id
                          ? "border-4 border-primary shadow-lg"
                          : "border-2 hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedChoice(choice.id)}
                    >
                      <CardContent className="p-6 text-center space-y-4 py-0">
                        {choice.imageUrl && (
                          <img
                            src={choice.imageUrl || "/placeholder.svg"}
                            alt={choice.text}
                            className="w-full object-cover rounded-lg h-44"
                            onError={(e) => {
                              e.currentTarget.style.display = "none"
                            }}
                          />
                        )}
                        <div className="flex items-center justify-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              selectedChoice === choice.id ? "border-primary bg-primary" : "border-muted-foreground"
                            }`}
                          >
                            {selectedChoice === choice.id && (
                              <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                            )}
                          </div>
                          <p className="text-xl font-semibold">{choice.text}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment" className="text-lg">
                  コメント（任意）
                </Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="今日の意気込みや理由を書いてください"
                  className="min-h-24"
                />
              </div>

              {error && <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-center">{error}</div>}

              <Button
                type="submit"
                size="lg"
                className="w-full text-lg h-14 font-bold"
                disabled={isSubmitting || selectedChoice === null}
              >
                {isSubmitting ? "ポスト中..." : "ポストする"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
