"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ExternalLink } from "lucide-react"
import type { Poll } from "@/lib/db"

export default function PollsListPage() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/polls")
      .then((res) => res.json())
      .then((data) => {
        setPolls(data)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

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

        <Card className="border-0 py-9">
          <CardHeader>
            <CardTitle className="text-3xl">ポストページ一覧</CardTitle>
            <CardDescription>作成されたポストページの一覧です</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center text-muted-foreground py-8">読み込み中...</p>
            ) : polls.length === 0 ? (
              <div className="text-center py-8 space-y-4">
                <p className="text-muted-foreground">まだポストページがありません</p>
                <Button className="font-bold" asChild>
                  <Link href="/create">最初のポストページを作成</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {polls.map((poll) => (
                  <Card key={poll.pollId} className="hover:border-primary transition-colors">
                    <CardHeader>
                      <CardTitle className="text-xl">{poll.question}</CardTitle>
                      <CardDescription>
                        作成者: {poll.createdBy} | 作成日: {new Date(poll.createdAt).toLocaleDateString("ja-JP")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button asChild className="flex-1 font-bold">
                          <Link href={`/poll/${poll.pollId}`}>
                            ポストする
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                        <Button asChild variant="outline" className="flex-1 bg-transparent font-bold">
                          <Link href={`/poll/${poll.pollId}/results`}>
                            結果を見る
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
