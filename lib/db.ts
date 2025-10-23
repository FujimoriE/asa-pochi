export interface Choice {
  id: number
  text: string
  imageUrl?: string
}

export interface Poll {
  pollId: string
  question: string
  choices: Choice[]
  createdBy: string
  createdAt: Date
}

export interface Vote {
  voteId: string
  pollId: string
  voterName: string
  choiceId: number
  comment?: string
  votedAt: Date
}

// インメモリストレージ
const polls = new Map<string, Poll>()
const votes = new Map<string, Vote[]>()

export const db = {
  // Poll operations
  createPoll: (poll: Poll) => {
    polls.set(poll.pollId, poll)
    votes.set(poll.pollId, [])
    return poll
  },

  getPoll: (pollId: string) => {
    return polls.get(pollId)
  },

  getAllPolls: () => {
    return Array.from(polls.values())
  },

  // Vote operations
  addVote: (vote: Vote) => {
    const pollVotes = votes.get(vote.pollId) || []
    pollVotes.push(vote)
    votes.set(vote.pollId, pollVotes)
    return vote
  },

  getVotes: (pollId: string) => {
    return votes.get(pollId) || []
  },

  // 日付でフィルタリング
  getVotesForToday: (pollId: string) => {
    const allVotes = votes.get(pollId) || []
    const today = new Date().toDateString()
    return allVotes.filter((vote) => new Date(vote.votedAt).toDateString() === today)
  },

  // 投票済みチェック（名前ベース）
  hasVotedToday: (pollId: string, voterName: string) => {
    const todayVotes = db.getVotesForToday(pollId)
    return todayVotes.some((vote) => vote.voterName === voterName)
  },
}
