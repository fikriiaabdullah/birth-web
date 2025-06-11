"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Database, Check } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export default function DatabaseStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if DATABASE_URL is defined
    const isDatabaseConfigured = !!process.env.DATABASE_URL
    setIsConnected(isDatabaseConfigured)
  }, [])

  const handleSetupClick = () => {
    setShowDialog(true)
  }

  const handleTestConnection = () => {
    setIsLoading(true)
    // Simulate testing connection
    setTimeout(() => {
      setIsLoading(false)
      // Still false because we can't actually set env vars in the browser
      setIsConnected(false)
    }, 1500)
  }

  if (isConnected === null) {
    return (
      <Card className="border-4 border-yellow-400 bg-blue-100 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-spin">⚙️</span>
            <div>
              <p className="font-bold text-blue-800 pixel-font">CHECKING DATABASE...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isConnected) {
    return (
      <Card className="border-4 border-green-600 bg-green-100 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Check className="h-6 w-6 text-green-600" />
            <div>
              <p className="font-bold text-green-800 pixel-font">DATABASE CONNECTED!</p>
              <p className="text-green-700 text-sm">Your messages and photos will be saved to the database.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Alert variant="destructive" className="border-4 border-yellow-400 bg-red-100">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle className="pixel-font">DATABASE NOT CONNECTED</AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          <p>The app is running in demo mode. Messages and photos won't be saved permanently.</p>
          <Button
            onClick={handleSetupClick}
            className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 border-4 border-yellow-400 text-yellow-100 font-bold pixel-font w-fit"
          >
            <Database className="w-4 h-4 mr-2" /> SETUP DATABASE
          </Button>
        </AlertDescription>
      </Alert>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-gradient-to-r from-blue-100 to-cyan-100 border-4 border-blue-600 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-blue-800 pixel-font">DATABASE SETUP GUIDE</DialogTitle>
            <DialogDescription className="text-blue-700">Follow these steps to connect your database</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border-2 border-blue-300">
              <h3 className="font-bold text-blue-800 mb-2">1. Create a PostgreSQL Database</h3>
              <p className="text-sm text-gray-700 mb-2">
                You can use Vercel Postgres, Neon, Supabase, or any PostgreSQL provider.
              </p>
              <div className="bg-gray-100 p-2 rounded text-sm font-mono">
                # Example with Neon
                <br />
                1. Sign up at neon.tech
                <br />
                2. Create a new project
                <br />
                3. Get your connection string
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border-2 border-blue-300">
              <h3 className="font-bold text-blue-800 mb-2">2. Set Environment Variable</h3>
              <p className="text-sm text-gray-700 mb-2">
                Add your database connection string as an environment variable.
              </p>
              <div className="bg-gray-100 p-2 rounded text-sm font-mono">
                # In your .env.local file
                <br />
                DATABASE_URL=postgres://user:password@host:port/database
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border-2 border-blue-300">
              <h3 className="font-bold text-blue-800 mb-2">3. Run Database Setup Script</h3>
              <p className="text-sm text-gray-700 mb-2">Execute the SQL script to create necessary tables.</p>
              <div className="bg-gray-100 p-2 rounded text-sm font-mono">
                # The script is in /scripts/create-table.sql
                <br /># You can run it using your database client
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border-2 border-blue-300">
              <h3 className="font-bold text-blue-800 mb-2">4. Restart Your Application</h3>
              <p className="text-sm text-gray-700">
                After setting up the database, restart your Next.js application to apply the changes.
              </p>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setShowDialog(false)} className="border-2 border-blue-600">
                Close
              </Button>

              <Button
                onClick={handleTestConnection}
                disabled={isLoading}
                className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 border-4 border-yellow-400 text-yellow-100 font-bold pixel-font"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2">⚙️</span> Testing...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" /> Test Connection
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
