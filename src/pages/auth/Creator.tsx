import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { InputOTP } from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function Creator() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [showOTP, setShowOTP] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showNameDialog, setShowNameDialog] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  // Check and clear any invalid sessions on component mount
  useEffect(() => {
    const checkAndClearSession = async () => {
      try {
        console.log("Checking session status...")
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error("Session error:", sessionError)
          await supabase.auth.signOut()
          return
        }

        if (session) {
          if (!session.refresh_token) {
            console.log("Invalid session detected (no refresh token), clearing...")
            await supabase.auth.signOut()
          } else {
            const { error: refreshError } = await supabase.auth.refreshSession()
            if (refreshError) {
              console.error("Session refresh failed:", refreshError)
              await supabase.auth.signOut()
            } else {
              console.log("Session refreshed successfully")
              checkProfile(session.user.id)
            }
          }
        } else {
          console.log("No active session")
        }
      } catch (err) {
        console.error("Error checking session:", err)
        await supabase.auth.signOut()
      }
    }
    
    checkAndClearSession()
  }, [navigate])

  const checkProfile = async (userId: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (profile?.first_name && profile?.last_name) {
      navigate("/dashboard")
    } else {
      setShowNameDialog(true)
    }
  }

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      console.log("Clearing existing session before OTP request...")
      await supabase.auth.signOut()
      
      console.log("Sending OTP to:", email)
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          data: {
            role: 'creator'
          }
        },
      })

      if (error) {
        console.error("OTP send error:", error)
        if (error.message.includes('rate limit')) {
          throw new Error("Too many email attempts. Please wait a few minutes before trying again.")
        }
        throw error
      }

      setShowOTP(true)
      toast({
        title: "Verification code sent",
        description: "Please check your email for the verification code.",
      })
    } catch (err: any) {
      setError(err.message)
      console.error("Send OTP Error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      console.log("Verifying OTP for:", email)
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "signup",
      })

      if (verifyError) {
        console.error("OTP verification error:", verifyError)
        if (verifyError.message.includes('expired')) {
          throw new Error("Verification code has expired. Please request a new one.")
        }
        throw verifyError
      }

      if (!data.user) {
        throw new Error("Verification failed. Please try again.")
      }

      setShowNameDialog(true)
      
    } catch (err: any) {
      setError(err.message)
      console.error("Verify OTP Error:", err)
      
      if (err.message.includes('expired')) {
        setShowOTP(false)
        setOtp("")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error("No session found")

      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: session.user.id,
          first_name: firstName,
          last_name: lastName,
          email: session.user.email
        })

      if (error) throw error

      navigate("/dashboard")
    } catch (err: any) {
      setError(err.message)
      console.error("Name submission error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Welcome Creator!</h2>
          <p className="mt-2 text-muted-foreground">
            {showOTP ? "Enter the code sent to your email" : "Enter your email to get started"}
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="text-left">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!showOTP ? (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Sending code..." : "Continue with Email"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification code</Label>
              <InputOTP
                value={otp}
                onChange={setOtp}
                maxLength={6}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading || otp.length !== 6}
            >
              {loading ? "Verifying..." : "Verify Code"}
            </Button>
            <Button
              type="button"
              variant="link"
              className="w-full"
              onClick={() => {
                setShowOTP(false)
                setError(null)
                setOtp("")
              }}
            >
              Use a different email
            </Button>
          </form>
        )}
      </div>

      <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Just one more step!</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleNameSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading || !firstName || !lastName}
            >
              {loading ? "Saving..." : "Continue to Dashboard"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}