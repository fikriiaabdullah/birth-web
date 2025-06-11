"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Gamepad2, X } from "lucide-react"

interface GameObject {
  x: number
  y: number
  width: number
  height: number
  type: "coin" | "star" | "obstacle"
  active: boolean
}

export default function MiniGame() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 75 })
  const [objects, setObjects] = useState<GameObject[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestIdRef = useRef<number>(0)
  const lastObjectTimeRef = useRef<number>(0)
  const [imagesLoaded, setImagesLoaded] = useState(false)

  // Game settings
  const playerSize = 30
  const gravity = 0.5
  const jumpStrength = -10
  const [playerVelocity, setPlayerVelocity] = useState(0)
  const gameWidth = 300
  const gameHeight = 150

  // Images
  const playerImageRef = useRef<HTMLImageElement | null>(null)
  const coinImageRef = useRef<HTMLImageElement | null>(null)
  const starImageRef = useRef<HTMLImageElement | null>(null)
  const obstacleImageRef = useRef<HTMLImageElement | null>(null)
  const backgroundImageRef = useRef<HTMLImageElement | null>(null)

  // Load images
  useEffect(() => {
    if (typeof window === "undefined") return

    // Track loading status
    let loadedCount = 0
    const totalImages = 5

    const checkAllLoaded = () => {
      loadedCount++
      if (loadedCount === totalImages) {
        setImagesLoaded(true)
      }
    }

    const handleError = (imgName: string) => {
      console.warn(`Failed to load image: ${imgName}`)
      checkAllLoaded() // Still count as "loaded" to prevent blocking the game
    }

    // Player image
    playerImageRef.current = new Image()
    playerImageRef.current.onload = checkAllLoaded
    playerImageRef.current.onerror = () => handleError("player")
    playerImageRef.current.src = "/placeholder.svg?height=30&width=30&text=Player"
    playerImageRef.current.crossOrigin = "anonymous"

    // Coin image
    coinImageRef.current = new Image()
    coinImageRef.current.onload = checkAllLoaded
    coinImageRef.current.onerror = () => handleError("coin")
    coinImageRef.current.src = "/placeholder.svg?height=20&width=20&text=Coin"
    coinImageRef.current.crossOrigin = "anonymous"

    // Star image
    starImageRef.current = new Image()
    starImageRef.current.onload = checkAllLoaded
    starImageRef.current.onerror = () => handleError("star")
    starImageRef.current.src = "/placeholder.svg?height=20&width=20&text=Star"
    starImageRef.current.crossOrigin = "anonymous"

    // Obstacle image
    obstacleImageRef.current = new Image()
    obstacleImageRef.current.onload = checkAllLoaded
    obstacleImageRef.current.onerror = () => handleError("obstacle")
    obstacleImageRef.current.src = "/placeholder.svg?height=30&width=30&text=Obstacle"
    obstacleImageRef.current.crossOrigin = "anonymous"

    // Background image
    backgroundImageRef.current = new Image()
    backgroundImageRef.current.onload = checkAllLoaded
    backgroundImageRef.current.onerror = () => handleError("background")
    backgroundImageRef.current.src = "/placeholder.svg?height=150&width=300&text=Game+Background"
    backgroundImageRef.current.crossOrigin = "anonymous"

    return () => {
      // Clean up image references
      if (playerImageRef.current) {
        playerImageRef.current.onload = null
        playerImageRef.current.onerror = null
      }
      if (coinImageRef.current) {
        coinImageRef.current.onload = null
        coinImageRef.current.onerror = null
      }
      if (starImageRef.current) {
        starImageRef.current.onload = null
        starImageRef.current.onerror = null
      }
      if (obstacleImageRef.current) {
        obstacleImageRef.current.onload = null
        obstacleImageRef.current.onerror = null
      }
      if (backgroundImageRef.current) {
        backgroundImageRef.current.onload = null
        backgroundImageRef.current.onerror = null
      }
    }
  }, [])

  // Start game
  const startGame = () => {
    setIsPlaying(true)
    setScore(0)
    setGameOver(false)
    setPlayerPosition({ x: 50, y: 75 })
    setPlayerVelocity(0)
    setObjects([])
    lastObjectTimeRef.current = Date.now()
  }

  // Handle jump
  const handleJump = () => {
    if (gameOver) return

    // Only allow jumping when on the ground
    if (playerPosition.y >= gameHeight - playerSize) {
      setPlayerVelocity(jumpStrength)
    }
  }

  // Game loop
  useEffect(() => {
    if (!isPlaying || !imagesLoaded) return

    const gameLoop = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, gameWidth, gameHeight)

      // Draw background
      try {
        if (
          backgroundImageRef.current &&
          backgroundImageRef.current.complete &&
          backgroundImageRef.current.naturalWidth > 0
        ) {
          ctx.drawImage(backgroundImageRef.current, 0, 0, gameWidth, gameHeight)
        } else {
          // Fallback background
          ctx.fillStyle = "#87CEEB"
          ctx.fillRect(0, 0, gameWidth, gameHeight)

          // Ground
          ctx.fillStyle = "#8B4513"
          ctx.fillRect(0, gameHeight - 20, gameWidth, 20)
        }
      } catch (error) {
        console.error("Error drawing background:", error)
        // Fallback background
        ctx.fillStyle = "#87CEEB"
        ctx.fillRect(0, 0, gameWidth, gameHeight)
        ctx.fillStyle = "#8B4513"
        ctx.fillRect(0, gameHeight - 20, gameWidth, 20)
      }

      // Update player position with gravity
      setPlayerPosition((prev) => {
        let newY = prev.y + playerVelocity

        // Apply ground collision
        if (newY > gameHeight - playerSize) {
          newY = gameHeight - playerSize
          setPlayerVelocity(0)
        } else {
          setPlayerVelocity((prev) => prev + gravity)
        }

        return { ...prev, y: newY }
      })

      // Draw player
      try {
        if (playerImageRef.current && playerImageRef.current.complete && playerImageRef.current.naturalWidth > 0) {
          ctx.drawImage(playerImageRef.current, playerPosition.x, playerPosition.y, playerSize, playerSize)
        } else {
          // Fallback player
          ctx.fillStyle = "red"
          ctx.fillRect(playerPosition.x, playerPosition.y, playerSize, playerSize)
        }
      } catch (error) {
        console.error("Error drawing player:", error)
        ctx.fillStyle = "red"
        ctx.fillRect(playerPosition.x, playerPosition.y, playerSize, playerSize)
      }

      // Generate new objects
      const currentTime = Date.now()
      if (currentTime - lastObjectTimeRef.current > 1500) {
        const objectType = Math.random() < 0.7 ? "coin" : Math.random() < 0.5 ? "star" : "obstacle"

        const newObject: GameObject = {
          x: gameWidth,
          y: Math.random() * (gameHeight - 40),
          width: objectType === "obstacle" ? 30 : 20,
          height: objectType === "obstacle" ? 30 : 20,
          type: objectType,
          active: true,
        }

        setObjects((prev) => [...prev, newObject])
        lastObjectTimeRef.current = currentTime
      }

      // Update and draw objects
      setObjects((prevObjects) => {
        return prevObjects
          .filter((obj) => obj.x > -obj.width && obj.active)
          .map((obj) => {
            // Move object
            const updatedObj = { ...obj, x: obj.x - 3 }

            // Check collision
            if (
              updatedObj.active &&
              playerPosition.x < updatedObj.x + updatedObj.width &&
              playerPosition.x + playerSize > updatedObj.x &&
              playerPosition.y < updatedObj.y + updatedObj.height &&
              playerPosition.y + playerSize > updatedObj.y
            ) {
              // Handle collision based on object type
              if (updatedObj.type === "obstacle") {
                setGameOver(true)
              } else {
                // Collect coin or star
                updatedObj.active = false
                setScore((prev) => prev + (updatedObj.type === "coin" ? 10 : 50))
              }
            }

            // Draw object
            if (updatedObj.active) {
              try {
                let img = null
                let fallbackColor = "gold"

                if (updatedObj.type === "coin") {
                  img = coinImageRef.current
                  fallbackColor = "gold"
                } else if (updatedObj.type === "star") {
                  img = starImageRef.current
                  fallbackColor = "yellow"
                } else {
                  img = obstacleImageRef.current
                  fallbackColor = "green"
                }

                if (img && img.complete && img.naturalWidth > 0) {
                  ctx.drawImage(img, updatedObj.x, updatedObj.y, updatedObj.width, updatedObj.height)
                } else {
                  // Fallback shapes
                  ctx.fillStyle = fallbackColor
                  if (updatedObj.type === "coin") {
                    ctx.beginPath()
                    ctx.arc(
                      updatedObj.x + updatedObj.width / 2,
                      updatedObj.y + updatedObj.height / 2,
                      updatedObj.width / 2,
                      0,
                      Math.PI * 2,
                    )
                    ctx.fill()
                  } else {
                    ctx.fillRect(updatedObj.x, updatedObj.y, updatedObj.width, updatedObj.height)
                  }
                }
              } catch (error) {
                console.error("Error drawing object:", error)
                ctx.fillStyle = updatedObj.type === "coin" ? "gold" : updatedObj.type === "star" ? "yellow" : "green"
                ctx.fillRect(updatedObj.x, updatedObj.y, updatedObj.width, updatedObj.height)
              }
            }

            return updatedObj
          })
      })

      // Draw score
      ctx.fillStyle = "white"
      ctx.font = "16px 'Courier New'"
      ctx.fillText(`Score: ${score}`, 10, 20)

      // Game over
      if (gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
        ctx.fillRect(0, 0, gameWidth, gameHeight)

        ctx.fillStyle = "white"
        ctx.font = "20px 'Courier New'"
        ctx.textAlign = "center"
        ctx.fillText("GAME OVER", gameWidth / 2, gameHeight / 2 - 10)
        ctx.fillText(`Score: ${score}`, gameWidth / 2, gameHeight / 2 + 20)

        return
      }

      requestIdRef.current = requestAnimationFrame(gameLoop)
    }

    requestIdRef.current = requestAnimationFrame(gameLoop)

    return () => {
      cancelAnimationFrame(requestIdRef.current)
    }
  }, [isPlaying, playerPosition, playerVelocity, score, gameOver, objects, imagesLoaded])

  // Handle key press for jump
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        handleJump()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [playerPosition.y])

  return (
    <Card className="border-4 border-purple-600 bg-gradient-to-b from-purple-100 to-purple-200 shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <CardTitle className="flex items-center gap-3 text-2xl pixel-font">
          <Gamepad2 className="w-8 h-8" />
          BIRTHDAY RUNNER
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          {!isPlaying ? (
            <div className="text-center">
              <div className="mb-4">
                <div className="inline-block p-4 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-lg border-4 border-purple-600 shadow-xl">
                  <div className="text-6xl">🎮</div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-purple-800 mb-4 pixel-font">BIRTHDAY RUNNER MINI-GAME</h3>
              <p className="text-purple-700 mb-6">Collect coins and stars, avoid obstacles!</p>
              <Button
                onClick={startGame}
                className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 border-4 border-yellow-400 text-yellow-100 font-bold text-xl pixel-font py-4 shadow-lg transform hover:scale-105 transition-all"
              >
                START GAME
              </Button>
            </div>
          ) : (
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={gameWidth}
                height={gameHeight}
                className="border-4 border-purple-600 bg-blue-100"
                onClick={handleJump}
              />

              {gameOver ? (
                <div className="mt-4 flex justify-center gap-4">
                  <Button
                    onClick={startGame}
                    className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 border-4 border-yellow-400 text-yellow-100 font-bold pixel-font"
                  >
                    PLAY AGAIN
                  </Button>

                  <Button
                    onClick={() => setIsPlaying(false)}
                    variant="outline"
                    className="border-4 border-red-600 text-red-800 font-bold pixel-font"
                  >
                    <X className="w-4 h-4 mr-1" /> QUIT
                  </Button>
                </div>
              ) : (
                <div className="mt-4 text-center">
                  <p className="text-purple-800 font-bold pixel-font">TAP OR PRESS SPACE TO JUMP</p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
