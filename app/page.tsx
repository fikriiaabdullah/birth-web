import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Heart, Star, Camera, Gamepad2, Trophy } from "lucide-react"
import { submitMessage, getMessages, getPhotos } from "./actions"
import PhotoGallery from "./components/photo-gallery"
import GameEngine from "./components/game-engine"
import DatabaseStatus from "./components/database-status"
import MiniGame from "./components/mini-game"
import type { Message } from "./types"

export default async function BirthdayPage() {
  const messages = await getMessages()
  const photos = await getPhotos()

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-400 via-yellow-300 to-green-400 relative overflow-hidden">
      {/* Pixel Art Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-8 h-8 bg-yellow-400 rounded-sm animate-bounce"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-red-500 rounded-sm animate-pulse"></div>
        <div
          className="absolute bottom-40 left-20 w-10 h-10 bg-green-500 rounded-sm animate-bounce"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute bottom-20 right-40 w-8 h-8 bg-blue-500 rounded-sm animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Retro Header */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-red-600 to-red-800 p-8 rounded-lg border-4 border-yellow-400 shadow-2xl mb-8">
            <div className="flex justify-center items-center gap-6 mb-6">
              <div className="w-20 h-20 bg-yellow-400 border-4 border-red-800 flex items-center justify-center font-bold text-2xl text-red-800 pixel-font">
                🎮
              </div>
              <div className="text-center">
                <h1 className="text-6xl font-bold text-yellow-300 pixel-font drop-shadow-lg">HAPPY BIRTHDAY!</h1>
                <div className="text-2xl text-yellow-200 mt-2 pixel-font">★ JUNE 18TH SPECIAL STAGE ★</div>
              </div>
              <div className="w-20 h-20 bg-green-400 border-4 border-red-800 flex items-center justify-center font-bold text-2xl text-red-800">
                🏆
              </div>
            </div>
            <div className="bg-yellow-300 text-red-800 p-4 rounded border-2 border-red-800 pixel-font text-lg font-bold">
              🎂 LEVEL UP TO ANOTHER AMAZING YEAR! 🎂
            </div>
          </div>

          <GameEngine />
        </div>

        {/* Mini Game */}
        <div className="mb-12">
          <MiniGame />
        </div>

        {/* Photo Gallery Section */}
        <div className="mb-12">
          <Card className="border-4 border-blue-600 bg-gradient-to-r from-blue-100 to-cyan-100 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
              <CardTitle className="flex items-center gap-3 text-2xl pixel-font">
                <Camera className="w-8 h-8" />
                BIRTHDAY PHOTO GALLERY
                <Star className="w-8 h-8 text-yellow-300" />
              </CardTitle>
              <CardDescription className="text-blue-100 pixel-font">
                Collecting memories like power-up coins!
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <PhotoGallery photos={photos} />
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Message Form */}
          <Card className="border-4 border-green-600 bg-gradient-to-b from-green-100 to-green-200 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-800 text-white">
              <CardTitle className="flex items-center gap-3 text-2xl pixel-font">
                <Gamepad2 className="w-8 h-8" />
                SEND MESSAGE
              </CardTitle>
              <CardDescription className="text-green-100 pixel-font">Drop your birthday wishes here!</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form action={submitMessage} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-green-800 font-bold pixel-font text-lg">
                    PLAYER NAME
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    required
                    className="border-4 border-green-600 focus:border-yellow-400 text-lg pixel-font bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="text-green-800 font-bold pixel-font text-lg">
                    BIRTHDAY MESSAGE
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Write your birthday wishes here..."
                    required
                    rows={5}
                    className="border-4 border-green-600 focus:border-yellow-400 text-lg pixel-font bg-white"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 border-4 border-yellow-400 text-yellow-100 font-bold text-xl pixel-font py-4 shadow-lg transform hover:scale-105 transition-all"
                >
                  <Heart className="w-6 h-6 mr-3" />
                  SEND WISHES
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Game Character Section */}
          <Card className="border-4 border-purple-600 bg-gradient-to-b from-purple-100 to-purple-200 shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="mb-8">
                <div className="inline-block p-8 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-lg border-4 border-red-600 shadow-xl">
                  <div className="text-9xl">🎮</div>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-purple-800 mb-6 pixel-font">GAME MASTER SAYS:</h3>
              <div className="bg-gradient-to-r from-yellow-200 to-yellow-300 p-6 rounded-lg border-4 border-purple-600 shadow-inner">
                <p className="text-xl text-purple-800 leading-relaxed pixel-font font-bold mb-4">
                  🏆 "BIRTHDAY QUEST ACTIVATED!" 🏆
                </p>
                <p className="text-lg text-purple-700 leading-relaxed pixel-font">
                  ✨ "Collect happiness points, unlock new adventures, and power up for an epic year ahead!" ✨
                </p>
              </div>
              <div className="mt-8 flex justify-center gap-6">
                <div className="w-6 h-6 bg-red-500 border-2 border-red-800 animate-bounce"></div>
                <div
                  className="w-6 h-6 bg-yellow-500 border-2 border-yellow-800 animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-6 h-6 bg-green-500 border-2 border-green-800 animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
                <div
                  className="w-6 h-6 bg-blue-500 border-2 border-blue-800 animate-bounce"
                  style={{ animationDelay: "0.6s" }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Messages Display */}
        <div className="mt-12 max-w-6xl mx-auto">
          <Card className="border-4 border-orange-600 bg-gradient-to-b from-orange-100 to-yellow-100 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
              <CardTitle className="flex items-center gap-3 text-2xl pixel-font">
                <Trophy className="w-8 h-8" />
                BIRTHDAY MESSAGES ({messages.length})
                <Star className="w-8 h-8 text-yellow-300" />
              </CardTitle>
              <CardDescription className="text-orange-100 pixel-font">
                High scores from friends and family!
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-orange-700">
                  <span className="text-6xl mb-6 block">🎮</span>
                  <p className="pixel-font text-xl font-bold">NO MESSAGES YET!</p>
                  <p className="pixel-font text-lg">Be the first player to send wishes!</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {messages.map((msg: Message, index: number) => (
                    <div
                      key={msg.id}
                      className="bg-gradient-to-r from-white to-yellow-50 p-6 rounded-lg border-4 border-orange-400 shadow-lg transform hover:scale-105 transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-700 border-4 border-yellow-400 flex items-center justify-center flex-shrink-0 font-bold text-yellow-100 text-xl pixel-font">
                          #{index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-orange-800 mb-2 pixel-font text-xl">{msg.name}</p>
                          <p className="text-gray-800 leading-relaxed text-lg mb-3">{msg.message}</p>
                          <p className="text-sm text-orange-600 pixel-font font-bold">
                            {new Date(msg.created_at).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 py-8">
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6 rounded-lg border-4 border-yellow-400 shadow-2xl">
            <div className="flex justify-center items-center gap-4 text-yellow-300">
              <span className="text-3xl">🎮</span>
              <p className="text-2xl font-bold pixel-font">MADE WITH L & CODE</p>
              <span className="text-3xl">💝</span>
            </div>
            <p className="text-purple-200 pixel-font mt-2">© 2025 Birthday Game Zaph</p>
          </div>
        </div>
      </div>
    </div>
  )
}
