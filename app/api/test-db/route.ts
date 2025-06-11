import { pool } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT NOW() as current_time, version() as db_version')
    client.release()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connected successfully!',
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}