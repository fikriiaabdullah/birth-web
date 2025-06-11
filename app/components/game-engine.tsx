"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Star, Heart, Gift, Award, Trophy, Zap, Volume2, VolumeX } from "lucide-react"
import type { GameState, Achievement } from "../types"
import { useToast } from "../../components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Sound effects with lazy loading
const SOUNDS = {
  coin: null as HTMLAudioElement | null,
  powerup: null as HTMLAudioElement | null,
  achievement: null as HTMLAudioElement | null,
  levelUp: null as HTMLAudioElement | null,
}

// Initialize sounds safely
if (typeof window !== "undefined") {
  SOUNDS.coin = new Audio("/placeholder.svg") // Placeholder that won't cause errors
  SOUNDS.powerup = new Audio("/placeholder.svg")
  SOUNDS.achievement = new Audio("/placeholder.svg")
  SOUNDS.levelUp = new Audio("/placeholder.svg")

  // Try to load actual sounds, but don't break if they don't exist
  try {
    fetch("/sounds/coin.mp3")
      .then((response) => {
        if (response.ok) SOUNDS.coin = new Audio("/sounds/coin.mp3")
      })
      .catch(() => {})

    fetch("/sounds/powerup.mp3")
      .then((response) => {
        if (response.ok) SOUNDS.powerup = new Audio("/sounds/powerup.mp3")
      })
      .catch(() => {})

    fetch("/sounds/achievement.mp3")
      .then((response) => {
        if (response.ok) SOUNDS.achievement = new Audio("/sounds/achievement.mp3")
      })
      .catch(() => {})

    fetch("/sounds/level-up.mp3")
      .then((response) => {
        if (response.ok) SOUNDS.levelUp = new Audio("/sounds/level-up.mp3")
      })
      .catch(() => {})
  } catch (e) {
    console.warn("Could not load sound effects")
  }
}

// Initial achievements
const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-coin",
    title: "Coin Collector",
    description: "Collect your first coin",
    icon: "🪙",
    unlocked: false,
  },
  {
    id: "first-star",
    title: "Star Power",
    description: "Activate your first star power-up",
    icon: "⭐",
    unlocked: false,
  },
  {
    id: "first-heart",
    title: "Heart Warmer",
    description: "Activate your first heart power-up",
    icon: "💖",
    unlocked: false,
  },
  {
    id: "score-1000",
    title: "High Scorer",
    description: "Reach 1,000 points",
    icon: "🏆",
    unlocked: false,
  },
  {
    id: "level-5",
    title: "Level Master",
    description: "Reach level 5",
    icon: "🎖️",
    unlocked: false,
  },
]

// Calculate level based on score
const calculateLevel = (score: number): number => {
  return Math.floor(score / 1000) + 1
}

// Calculate XP percentage for progress bar
const calculateXpPercentage = (score: number): number => {
  const currentLevel = calculateLevel(score)
  const levelStartScore = (currentLevel - 1) * 1000
  const levelEndScore = currentLevel * 1000
  return ((score - levelStartScore) / (levelEndScore - levelStartScore)) * 100
}

export default function GameEngine() {
  // Initialize game state from localStorage or defaults
  const [gameState, setGameState] = useState<GameState>(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("birthdayGameState")
      if (savedState) {
        return JSON.parse(savedState)
      }
    }

    return {
      score: 0,
      coins: 0,
      stars: 0,
      level: 1,
      achievements: INITIAL_ACHIEVEMENTS,
      powerUps: [],
    }
  })

  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const { toast } = useToast()

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("birthdayGameState", JSON.stringify(gameState))
    }
  }, [gameState])

  // Check for achievements
  useEffect(() => {
    const checkAchievements = () => {
      const { score, coins, level, achievements, powerUps } = gameState
      const updatedAchievements = [...gameState.achievements]
      let newAchievement: Achievement | null = null

      // Check each achievement condition
      if (coins >= 1 && !achievements.find((a) => a.id === "first-coin")?.unlocked) {
        const achievement = updatedAchievements.find((a) => a.id === "first-coin")
        if (achievement) {
          achievement.unlocked = true
          achievement.timestamp = new Date().toISOString()
          newAchievement = achievement
        }
      }

      if (powerUps.includes("star") && !achievements.find((a) => a.id === "first-star")?.unlocked) {
        const achievement = updatedAchievements.find((a) => a.id === "first-star")
        if (achievement) {
          achievement.unlocked = true
          achievement.timestamp = new Date().toISOString()
          newAchievement = achievement
        }
      }

      if (powerUps.includes("heart") && !achievements.find((a) => a.id === "first-heart")?.unlocked) {
        const achievement = updatedAchievements.find((a) => a.id === "first-heart")
        if (achievement) {
          achievement.unlocked = true
          achievement.timestamp = new Date().toISOString()
          newAchievement = achievement
        }
      }

      if (score >= 1000 && !achievements.find((a) => a.id === "score-1000")?.unlocked) {
        const achievement = updatedAchievements.find((a) => a.id === "score-1000")
        if (achievement) {
          achievement.unlocked = true
          achievement.timestamp = new Date().toISOString()
          newAchievement = achievement
        }
      }

      if (level >= 5 && !achievements.find((a) => a.id === "level-5")?.unlocked) {
        const achievement = updatedAchievements.find((a) => a.id === "level-5")
        if (achievement) {
          achievement.unlocked = true
          achievement.timestamp = new Date().toISOString()
          newAchievement = achievement
        }
      }

      // If we found a new achievement, update state and show notification
      if (newAchievement) {
        setGameState((prev) => ({ ...prev, achievements: updatedAchievements }))
        setShowAchievement(newAchievement)

        if (soundEnabled) {
          SOUNDS.achievement?.play?.().catch?.((e) => console.error("Error playing sound:", e))
        }
      }
    }

    checkAchievements()
  }, [gameState.coins, gameState.powerUps, gameState.score, gameState.level, gameState.achievements, soundEnabled])

  // Check for level up
  useEffect(() => {
    const newLevel = calculateLevel(gameState.score)
    if (newLevel > gameState.level) {
      setGameState((prev) => ({ ...prev, level: newLevel }))

      toast({
        title: "Level Up!",
        description: `You've reached level ${newLevel}!`,
        variant: "default",
        className:
          "bg-gradient-to-r from-yellow-400 to-yellow-600 border-4 border-red-600 text-red-800 font-bold pixel-font",
      })

      if (soundEnabled) {
        SOUNDS.levelUp?.play?.().catch?.((e) => console.error("Error playing sound:", e))
      }
    }
  }, [gameState.score, gameState.level, toast, soundEnabled])

  const collectCoin = () => {
    setGameState((prev) => ({
      ...prev,
      coins: prev.coins + 1,
      score: prev.score + 100,
    }))

    if (soundEnabled) {
      SOUNDS.coin?.play?.().catch?.((e) => console.error("Error playing sound:", e))
    }
  }

  const activatePowerUp = (type: string) => {
    setGameState((prev) => {
      const updatedPowerUps = [...prev.powerUps, type]
      const scoreBonus = type === "star" ? 500 : type === "heart" ? 300 : 200

      return {
        ...prev,
        powerUps: updatedPowerUps,
        score: prev.score + scoreBonus,
        stars: type === "star" ? prev.stars + 1 : prev.stars,
      }
    })

    if (soundEnabled) {
      SOUNDS.powerup?.play?.().catch?.((e) => console.error("Error playing sound:", e))
    }

    // Remove power-up after 3 seconds
    setTimeout(() => {
      setGameState((prev) => ({
        ...prev,
        powerUps: prev.powerUps.filter((p) => p !== type),
      }))
    }, 3000)
  }

  const resetGame = () => {
    setGameState({
      score: 0,
      coins: 0,
      stars: 0,
      level: 1,
      achievements: INITIAL_ACHIEVEMENTS,
      powerUps: [],
    })

    toast({
      title: "Game Reset",
      description: "All progress has been reset!",
      variant: "destructive",
    })
  }

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
  }

  return (
    <div className="space-y-6">
      {/* Game HUD */}
      <div className="bg-gradient-to-r from-blue-800 to-purple-900 border-4 border-yellow-400 rounded-lg p-4 shadow-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Score */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 border-4 border-yellow-400 px-4 py-2 rounded-lg shadow-lg">
            <div className="text-center">
              <p className="text-yellow-300 pixel-font font-bold text-sm">SCORE</p>
              <p className="text-yellow-100 pixel-font font-bold text-2xl">{gameState.score.toLocaleString()}</p>
            </div>
          </div>

          {/* Level */}
          <div className="bg-gradient-to-r from-green-600 to-green-800 border-4 border-yellow-400 px-4 py-2 rounded-lg shadow-lg">
            <div className="text-center">
              <p className="text-yellow-300 pixel-font font-bold text-sm">LEVEL</p>
              <p className="text-yellow-100 pixel-font font-bold text-2xl">{gameState.level}</p>
            </div>
            <Progress value={calculateXpPercentage(gameState.score)} className="h-2 mt-1 bg-green-900" />
          </div>

          {/* Coins */}
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 border-4 border-red-600 px-4 py-2 rounded-lg shadow-lg">
            <div className="text-center">
              <p className="text-red-800 pixel-font font-bold text-sm">COINS</p>
              <p className="text-red-900 pixel-font font-bold text-2xl">{gameState.coins}</p>
            </div>
          </div>

          {/* Stars */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 border-4 border-yellow-400 px-4 py-2 rounded-lg shadow-lg">
            <div className="text-center">
              <p className="text-yellow-300 pixel-font font-bold text-sm">STARS</p>
              <p className="text-yellow-100 pixel-font font-bold text-2xl">{gameState.stars}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={collectCoin}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 border-4 border-red-600 text-red-800 font-bold pixel-font transform hover:scale-110 transition-all"
              >
                🪙 COIN (+100)
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to collect coins and earn 100 points</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => activatePowerUp("star")}
                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 border-4 border-yellow-400 text-yellow-100 font-bold pixel-font transform hover:scale-110 transition-all"
              >
                <Star className="w-4 h-4 mr-1" />
                STAR (+500)
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Activate star power-up for 500 points</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => activatePowerUp("heart")}
                className="bg-gradient-to-r from-pink-500 to-pink-700 hover:from-pink-600 hover:to-pink-800 border-4 border-yellow-400 text-yellow-100 font-bold pixel-font transform hover:scale-110 transition-all"
              >
                <Heart className="w-4 h-4 mr-1" />
                HEART (+300)
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Activate heart power-up for 300 points</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => activatePowerUp("gift")}
                className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 border-4 border-yellow-400 text-yellow-100 font-bold pixel-font transform hover:scale-110 transition-all"
              >
                <Gift className="w-4 h-4 mr-1" />
                GIFT (+200)
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Open a gift for 200 points</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button
          onClick={toggleSound}
          variant="outline"
          className="border-4 border-blue-600 text-blue-800 font-bold pixel-font"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </Button>
      </div>

      {/* Active Power-ups */}
      {gameState.powerUps.length > 0 && (
        <div className="bg-gradient-to-r from-green-500 to-green-700 border-4 border-yellow-400 px-4 py-2 rounded-lg shadow-lg">
          <p className="text-yellow-100 pixel-font font-bold text-sm">ACTIVE POWER-UPS:</p>
          <div className="flex gap-2">
            {gameState.powerUps.map((powerUp, index) => (
              <span key={index} className="text-yellow-300 text-lg animate-pulse">
                {powerUp === "star" ? "⭐" : powerUp === "heart" ? "💖" : powerUp === "gift" ? "🎁" : "⚡"}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 border-4 border-yellow-400 p-4 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-yellow-100 pixel-font font-bold text-lg flex items-center">
            <Trophy className="w-5 h-5 mr-2" /> ACHIEVEMENTS
          </h3>
          <Badge variant="outline" className="bg-yellow-400 text-red-800 pixel-font border-2 border-red-800">
            {gameState.achievements.filter((a) => a.unlocked).length}/{gameState.achievements.length}
          </Badge>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {gameState.achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-2 rounded-lg text-center ${
                achievement.unlocked
                  ? "bg-gradient-to-r from-yellow-300 to-yellow-500 border-2 border-green-600"
                  : "bg-gray-700 border-2 border-gray-600 opacity-50"
              }`}
            >
              <div className="text-2xl mb-1">{achievement.icon}</div>
              <div className={`text-xs font-bold ${achievement.unlocked ? "text-green-800" : "text-gray-300"}`}>
                {achievement.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <div className="flex justify-center mt-4">
        <Button
          onClick={resetGame}
          variant="destructive"
          className="border-4 border-yellow-400 text-yellow-100 font-bold pixel-font"
        >
          <Zap className="w-4 h-4 mr-1" /> RESET GAME
        </Button>
      </div>

      {/* Achievement Popup */}
      <Dialog open={!!showAchievement} onOpenChange={() => setShowAchievement(null)}>
        <DialogContent className="bg-gradient-to-r from-yellow-300 to-yellow-500 border-8 border-green-600 p-6">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl text-green-800 pixel-font flex items-center justify-center gap-2">
              <Award className="w-6 h-6" /> ACHIEVEMENT UNLOCKED!
            </DialogTitle>
          </DialogHeader>

          {showAchievement && (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">{showAchievement.icon}</div>
              <h3 className="text-xl font-bold text-green-800 pixel-font mb-2">{showAchievement.title}</h3>
              <p className="text-green-700">{showAchievement.description}</p>

              <Button
                onClick={() => setShowAchievement(null)}
                className="mt-6 bg-green-600 hover:bg-green-700 border-4 border-yellow-400 text-yellow-100 font-bold pixel-font"
              >
                AWESOME!
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
