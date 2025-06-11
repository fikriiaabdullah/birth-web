"use server"

import { neon } from "@neondatabase/serverless"
import { revalidatePath } from "next/cache"

// Check if database is configured
const isDatabaseConfigured = !!process.env.DATABASE_URL

let sql: any = null

if (isDatabaseConfigured) {
  sql = neon(process.env.DATABASE_URL!)
}

export async function submitMessage(formData: FormData) {
  const name = formData.get("name") as string
  const message = formData.get("message") as string

  if (!name || !message) {
    throw new Error("Name and message are required")
  }

  if (!isDatabaseConfigured) {
    console.log("Demo mode - Message would be saved:", { name, message })
    revalidatePath("/")
    return
  }

  try {
    await sql`
      INSERT INTO birthday_messages (name, message)
      VALUES (${name}, ${message})
    `

    revalidatePath("/")
  } catch (error) {
    console.error("Error saving message:", error)
    throw new Error("Failed to save message")
  }
}

export async function getMessages() {
  if (!isDatabaseConfigured) {
    return [
      {
        id: 1,
        name: "Player One",
        message: "Happy Birthday! Level up to another amazing year! 🎮✨",
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        name: "Game Master",
        message: "Wishing you power-ups, extra lives, and endless joy! 🍄🎂",
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
    ]
  }

  try {
    const messages = await sql`
      SELECT id, name, message, created_at
      FROM birthday_messages
      ORDER BY created_at DESC
    `

    return messages
  } catch (error) {
    console.error("Error fetching messages:", error)
    return []
  }
}

export async function getPhotos() {
  if (!isDatabaseConfigured) {
    return [
      {
        id: 1,
        title: "Birthday Adventure",
        description: "Ready for another year of adventures!",
        image_url: "/placeholder.svg?height=300&width=400&text=Birthday+Adventure",
        uploaded_at: new Date().toISOString(),
      },
      {
        id: 2,
        title: "Level Complete",
        description: "Another year, another level mastered!",
        image_url: "/placeholder.svg?height=300&width=400&text=Level+Complete",
        uploaded_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 3,
        title: "Power-Up Moment",
        description: "Collecting memories like coins!",
        image_url: "/placeholder.svg?height=300&width=400&text=Power+Up",
        uploaded_at: new Date(Date.now() - 172800000).toISOString(),
      },
    ]
  }

  try {
    const photos = await sql`
      SELECT id, title, description, image_url, uploaded_at
      FROM birthday_photos
      ORDER BY uploaded_at DESC
    `

    return photos
  } catch (error) {
    console.error("Error fetching photos:", error)
    return []
  }
}
