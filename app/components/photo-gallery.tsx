"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react"

interface Photo {
  id: number
  title: string
  description: string | null
  image_url: string
  uploaded_at: string
}

interface PhotoGalleryProps {
  photos: Photo[]
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length)
  }

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="text-6xl mb-4 block">📸</span>
        <p className="pixel-font text-xl font-bold text-blue-800">NO PHOTOS YET!</p>
        <p className="pixel-font text-lg text-blue-600">Upload some memories to get started!</p>
      </div>
    )
  }

  const currentPhoto = photos[currentIndex]

  return (
    <div className="space-y-6">
      {/* Main Photo Display */}
      <Card className="border-4 border-yellow-400 bg-white shadow-xl overflow-hidden">
        <CardContent className="p-0 relative">
          <div className="relative aspect-video bg-gradient-to-br from-blue-100 to-cyan-100">
            <img
              src={currentPhoto.image_url || "/placeholder.svg"}
              alt={currentPhoto.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=400&width=600&text=Photo"
              }}
            />

            {/* Navigation Buttons */}
            {photos.length > 1 && (
              <>
                <Button
                  onClick={prevPhoto}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-red-600 hover:bg-red-700 border-2 border-yellow-400 w-12 h-12 p-0"
                >
                  <ChevronLeft className="w-6 h-6 text-yellow-100" />
                </Button>
                <Button
                  onClick={nextPhoto}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-red-600 hover:bg-red-700 border-2 border-yellow-400 w-12 h-12 p-0"
                >
                  <ChevronRight className="w-6 h-6 text-yellow-100" />
                </Button>
              </>
            )}

            {/* Fullscreen Button */}
            <Button
              onClick={() => setIsFullscreen(true)}
              className="absolute top-4 right-4 bg-green-600 hover:bg-green-700 border-2 border-yellow-400 w-10 h-10 p-0"
            >
              <Maximize2 className="w-5 h-5 text-yellow-100" />
            </Button>

            {/* Photo Counter */}
            <div className="absolute bottom-4 left-4 bg-purple-600 border-2 border-yellow-400 px-3 py-1 rounded">
              <span className="text-yellow-100 pixel-font font-bold">
                {currentIndex + 1} / {photos.length}
              </span>
            </div>
          </div>

          {/* Photo Info */}
          <div className="p-6 bg-gradient-to-r from-yellow-100 to-yellow-200 border-t-4 border-yellow-400">
            <h3 className="text-2xl font-bold text-blue-800 pixel-font mb-2">{currentPhoto.title}</h3>
            {currentPhoto.description && (
              <p className="text-blue-700 text-lg leading-relaxed">{currentPhoto.description}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Photo Thumbnails */}
      {photos.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-24 h-24 rounded-lg border-4 overflow-hidden transition-all ${
                index === currentIndex
                  ? "border-yellow-400 scale-110 shadow-lg"
                  : "border-gray-400 hover:border-yellow-300 hover:scale-105"
              }`}
            >
              <img
                src={photo.image_url || "/placeholder.svg"}
                alt={photo.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg?height=96&width=96&text=Photo"
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full">
            <img
              src={currentPhoto.image_url || "/placeholder.svg"}
              alt={currentPhoto.title}
              className="max-w-full max-h-full object-contain"
            />
            <Button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 border-2 border-yellow-400"
            >
              ✕
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
