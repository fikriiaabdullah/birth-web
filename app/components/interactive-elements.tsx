"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Star, Heart } from "lucide-react"

export default function InteractiveElements() {
  const [score, setScore] = useState(0)
  const [coins, setCoins] = useState(0)
  const [powerUps, setPowerUps] = useState<string[]>([])

  const collectCoin = () => {
    setCoins((prev) => prev + 1)
    setScore((prev) => prev + 100)
  }

  const activatePowerUp = (type: string) => {
    setPowerUps((prev) => [...prev, type])
    setScore((prev) => prev + 500)

    // Remove power-up after 3 seconds
    setTimeout(() => {
      setPowerUps((prev) => prev.filter((p) => p !== type))
    }, 3000)
  }

  return (
    <div className="flex flex-wrap justify-center gap-6 mb-8">
      {/* Score Display */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 border-4 border-yellow-400 px-6 py-3 rounded-lg shadow-lg">
        <div className="text-center">
          <p className="text-yellow-300 pixel-font font-bold text-sm">SCORE</p>
          <p className="text-yellow-100 pixel-font font-bold text-2xl">{score.toLocaleString()}</p>
        </div>
      </div>

      {/* Coins Display */}
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 border-4 border-red-600 px-6 py-3 rounded-lg shadow-lg">
        <div className="text-center">
          <p className="text-red-800 pixel-font font-bold text-sm">COINS</p>
          <p className="text-red-900 pixel-font font-bold text-2xl">{coins}</p>
        </div>
      </div>

      {/* Interactive Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={collectCoin}
          className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 border-4 border-red-600 text-red-800 font-bold pixel-font transform hover:scale-110 transition-all"
        >
          🪙 COIN
        </Button>

        <Button
          onClick={() => activatePowerUp("star")}
          className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 border-4 border-yellow-400 text-yellow-100 font-bold pixel-font transform hover:scale-110 transition-all"
        >
          <Star className="w-4 h-4 mr-1" />
          STAR
        </Button>

        <Button
          onClick={() => activatePowerUp("heart")}
          className="bg-gradient-to-r from-pink-500 to-pink-700 hover:from-pink-600 hover:to-pink-800 border-4 border-yellow-400 text-yellow-100 font-bold pixel-font transform hover:scale-110 transition-all"
        >
          <Heart className="w-4 h-4 mr-1" />
          HEART
        </Button>
      </div>

      {/* Active Power-ups */}
      {powerUps.length > 0 && (
        <div className="bg-gradient-to-r from-green-500 to-green-700 border-4 border-yellow-400 px-4 py-2 rounded-lg shadow-lg">
          <p className="text-yellow-100 pixel-font font-bold text-sm">ACTIVE:</p>
          <div className="flex gap-2">
            {powerUps.map((powerUp, index) => (
              <span key={index} className="text-yellow-300 text-lg animate-pulse">
                {powerUp === "star" ? "⭐" : powerUp === "heart" ? "💖" : "⚡"}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
