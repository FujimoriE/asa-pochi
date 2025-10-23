export const storage = {
  // 名前を保存
  saveName: (name: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("asapochi_voter_name", name)
    }
  },

  // 名前を取得
  getName: (): string => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("asapochi_voter_name") || ""
    }
    return ""
  },

  // 投票済みを記録
  markAsVoted: (pollId: string) => {
    if (typeof window !== "undefined") {
      const today = new Date().toDateString()
      const key = `asapochi_voted_${pollId}`
      localStorage.setItem(key, today)
    }
  },

  // 投票済みかチェック
  hasVotedToday: (pollId: string): boolean => {
    if (typeof window !== "undefined") {
      const today = new Date().toDateString()
      const key = `asapochi_voted_${pollId}`
      const votedDate = localStorage.getItem(key)
      return votedDate === today
    }
    return false
  },
}
