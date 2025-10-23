"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"

interface VoterBubbleProps {
  name: string
  comment?: string
  color: string
  size?: number
  choiceText: string
}

export function VoterBubble({ name, comment, color, size = 100, choiceText }: VoterBubbleProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="relative inline-block m-2">
      <div
        className="rounded-full flex items-center justify-center font-bold text-white shadow-lg cursor-pointer transition-transform hover:scale-110 animate-fade-in"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: color,
          fontSize: `${size / 6}px`,
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
      >
        <span className="text-center px-2 leading-tight">{choiceText}</span>
      </div>

      {showTooltip && (
        <Card className="absolute z-10 p-3 shadow-xl min-w-48 max-w-xs left-1/2 -translate-x-1/2 top-full mt-2 animate-fade-in">
          <p className="font-semibold text-sm mb-1">{name}</p>
          {comment && <p className="text-sm text-muted-foreground">{comment}</p>}
        </Card>
      )}
    </div>
  )
}
