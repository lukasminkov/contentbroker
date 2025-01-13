import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { InputOTP } from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"

export default function Creator() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [showOTP, setShowOTP] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Check and clear any invalid sessions on component mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || (session && !session.refresh_token)) {
        await supabase.auth.signOut()
      }
    }
    
    checkSession()
  }, [])

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Clear any existing sessions first
      await supabase.auth.signOut()
      
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
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "signup",
      })

      if (verifyError) {
        if (verifyError.message.includes('expired')) {
          throw new Error("Verification code has expired. Please request a new one.")
        }
        throw verifyError
      }

      if (!data.user) {
        throw new Error("Verification failed. Please try again.")
      }

      // After successful verification, check if user has completed onboarding
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', data.user.id)
        .maybeSingle()

      if (profileError) {
        throw profileError
      }

      toast({
        title: "Success!",
        description: "Your account has been verified.",
      })
      
      // If profile exists and has required fields, go to dashboard
      // Otherwise, go to onboarding
      if (profile?.first_name && profile?.last_name && profile?.date_of_birth) {
        navigate("/dashboard")
      } else {
        navigate("/onboarding")
      }
      
    } catch (err: any) {
      setError(err.message)
      console.error("Verify OTP Error:", err)
      
      // If OTP expired, allow user to request new code
      if (err.message.includes('expired')) {
        setShowOTP(false)
        setOtp("")
      }
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
    </div>
  )
}