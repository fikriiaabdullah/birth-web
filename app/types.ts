export interface GameState {
  score: number
  coins: number
  stars: number
  level: number
  achievements: Achievement[]
  powerUps: string[]
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  timestamp?: string
}

export interface Photo {
  id: number
  title: string
  description: string | null
  image_url: string
  uploaded_at: string
}

export interface Message {
  id: number
  name: string
  message: string
  created_at: string
}
