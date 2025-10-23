import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="flex justify-center mt-8 mb-8">
              <Image src="/images/mission.webp" alt="Mission" width={400} height={400} className="rounded-lg" />
            </div>
            <h1 className="text-6xl font-bold text-balance bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text">
              あさポチ
            </h1>
            <p className="text-xl text-muted-foreground text-balance">
              毎日の朝会でチームのバリューをポスト・共有しよう
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button asChild size="lg" className="text-lg font-bold">
              <Link href="/create">ポストページを作成</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg bg-transparent font-bold">
              <Link href="/polls">ポストページ一覧</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
