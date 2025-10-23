"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreatePollPage() {
  const router = useRouter()
  const [question, setQuestion] = useState("今日意識したいバリューは？")
  const [choices, setChoices] = useState([
    { text: "Take Ownership", imageUrl: "https://www.kubell.com/image/about/value_to.png" },
    { text: "Playful Challenge", imageUrl: "https://www.kubell.com/image/about/value_pc.png" },
    { text: "Beyond Boundaries", imageUrl: "https://www.kubell.com/image/about/value_bb.png" },
    { text: "Integrity Driven", imageUrl: "https://www.kubell.com/image/about/value_id.png" },
  ])
  const [createdBy, setCreatedBy] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChoiceChange = (index: number, field: "text" | "imageUrl", value: string) => {
    const newChoices = [...choices]
    newChoices[index][field] = value
    setChoices(newChoices)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    console.log("[v0] フォーム送信開始")

    try {
      const response = await fetch("/api/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          choices,
          createdBy: createdBy || "管理者",
        }),
      })

      console.log("[v0] レスポンスステータス:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("[v0] エラーレスポンス:", errorData)
        throw new Error(errorData.error || "ポストページの作成に失敗しました")
      }

      const poll = await response.json()
      console.log("[v0] 作成されたポスト:", poll)
      router.push(`/poll/${poll.pollId}`)
    } catch (err) {
      console.error("[v0] キャッチされたエラー:", err)
      setError(err instanceof Error ? err.message : "エラーが発生しました")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-6">
          <Button className="font-bold" variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              ホームに戻る
            </Link>
          </Button>
        </div>

        <Card className="border-0 py-9">
          <CardHeader>
            <CardTitle className="text-3xl">ポストページを作成</CardTitle>
            <CardDescription>質問文と4つの選択肢を設定してください</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="question">質問文</Label>
                <Textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="例: 今日意識したいバリューは？"
                  required
                  className="min-h-20"
                />
              </div>

              <div className="space-y-4">
                <Label>選択肢（4つ）</Label>
                {choices.map((choice, index) => (
                  <Card key={index} className="p-4 bg-card">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-primary">選択肢 {index + 1}</span>
                      </div>
                      <Input className="bg-background"
                        value={choice.text}
                        onChange={(e) => handleChoiceChange(index, "text", e.target.value)}
                        placeholder="選択肢のテキスト"
                        required
                      />
                      <Input className="bg-background"
                        value={choice.imageUrl}
                        onChange={(e) => handleChoiceChange(index, "imageUrl", e.target.value)}
                        placeholder="画像URL（任意）"
                        type="url"
                      />
                    </div>
                  </Card>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="createdBy">作成者名（任意）</Label>
                <Input
                  id="createdBy"
                  value={createdBy}
                  onChange={(e) => setCreatedBy(e.target.value)}
                  placeholder="例: 山田太郎"
                />
              </div>

              {error && <div className="p-4 bg-destructive/10 text-destructive rounded-lg">{error}</div>}

              <Button type="submit" size="lg" className="w-full font-bold" disabled={isLoading}>
                {isLoading ? "作成中..." : "ポストページを作成"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
