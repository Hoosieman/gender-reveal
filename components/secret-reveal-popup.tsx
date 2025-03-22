"use client"

import { useState, useEffect } from "react"
import { X } from 'lucide-react'
import confetti from "canvas-confetti"

export default function SecretRevealPopup({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    if (isOpen) {
      // Trigger blue confetti when the popup opens
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#0ea5e9', '#38bdf8', '#7dd3fc', '#e0f2fe']
      })
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-300">
      <div className="relative max-w-md w-full bg-white rounded-xl shadow-2xl p-6 animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center py-8">
          <div className="mb-6 text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">
            It&apos;s a BOY!!!!
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-blue-100 rounded-full animate-ping opacity-75"></div>
            </div>
            <div className="relative z-10 flex justify-center">
              <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                👶
              </div>
            </div>
          </div>
          
          <p className="mt-6 text-gray-600">
            Congratulations! You found the secret reveal!
          </p>
        </div>
      </div>
    </div>
  )
}
