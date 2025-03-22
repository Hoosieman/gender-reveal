"use client"

import type React from "react"

import { useState } from "react"
import SecretRevealPopup from "./secret-reveal-popup"

export default function SecretTrigger({ children }: { children: React.ReactNode }) {
  const [clickCount, setClickCount] = useState(0)
  const [showPopup, setShowPopup] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const newCount = clickCount + 1
    setClickCount(newCount)

    if (newCount >= 5) {
      setShowPopup(true)
      setClickCount(0)
    }
  }

  return (
    <>
      <span
        onClick={handleClick}
        className="cursor-pointer hover:text-blue-500 transition-colors relative inline-block"
        title={clickCount > 0 ? `${5 - clickCount} more clicks to reveal` : ""}
      >
        {children}
        {clickCount > 0 && (
          <span className="absolute -top-1 -right-2 text-[10px] text-blue-500 font-bold">{5 - clickCount}</span>
        )}
      </span>

      <SecretRevealPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
    </>
  )
}

