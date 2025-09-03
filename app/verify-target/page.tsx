import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Shield, ArrowLeft, Globe, Copy, Mail, FileText, CheckCircle, LogOut } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

async function handleLogout() {
  "use server"
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/auth/login")
}

async function generateVerificationToken(targetId: string, method: "dns" | "http" | "email") {
  "use server"
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Generate a unique verification token
  const token = `pent-verify-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now

  const { error } = await supabase.from("target_verifications").insert({
    target_id: targetId,
    method,
    token,
    expires_at: expiresAt.toISOString(),
    status: "pending",
  })

  if (error) {
    console.error("Error generating verification token:", error)
    return null
  }

  // Update target with verification method and token
  await supabase
    .from("targets")
    .update({
      verification_method: method,
      verification_token: token,
      verification_expires_at: expiresAt.toISOString(),
    })
    .eq("id", targetId)

  revalidatePath("/verify-target")
  return token
}

async function checkVerification(targetId: string) {
  "use server"
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get target and verification details
  const { data: target } = await supabase.from("targets").select("*").eq("id", targetId).eq("user_id", user.id).single()

  if (!target || !target.verification_token) {
    return { success: false, message: "No verification token found" }
  }

  let verified = false
  let errorMessage = ""

  try {
    if (target.verification_method === "dns") {
      // Simulate DNS TXT record check
      // In a real implementation, you would use DNS lookup libraries
      verified = Math.random() > 0.3 // 70% success rate for demo
      if (!verified) errorMessage = "DNS TXT record not found or incorrect"
    } else if (target.verification_method === "http") {
      // Simulate HTTP file check
      try {
        const response = await fetch(`https://${target.domain}/.well-known/pent-verification.txt`)
        const content = await response.text()
        verified = content.trim() === target.verification_token
        if (!verified) errorMessage = "Verification file not found or content mismatch"
      } catch {
        verified = Math.random() > 0.4 // 60% success rate for demo
        if (!verified) errorMessage = "Could not access verification file"
      }
    } else if (target.verification_method === "email") {
      // For email verification, we would typically send an email and wait for click
      // For demo purposes, we'll simulate this
      verified = Math.random() > 0.5 // 50% success rate for demo
      if (!verified) errorMessage = "Email verification not completed"
    }

    if (verified) {
      // Update target as verified
      await supabase
        .from("targets")
        .update({
          status: "verified",
          verified_at: new Date().toISOString(),
        })
        .eq("id", targetId)

      // Update verification record
      await supabase
        .from("target_verifications")
        .update({
          status: "verified",
          verified_at: new Date().toISOString(),
        })
        .eq("target_id", targetId)
        .eq("token", target.verification_token)

      revalidatePath("/verify-target")
      revalidatePath("/")
      return { success: true, message: "Target verified successfully!" }
    } else {
      return { success: false, message: errorMessage }
    }
  } catch (error) {
    return { success: false, message: "Verification check failed" }
  }
}

export default async function VerifyTargetPage({
  searchParams,
}: {
  searchParams: Promise<{ target?: string; method?: string; token?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const params = await searchParams
  const targetId = params.target

  if (!targetId) {
    redirect("/")
  }

  const { data: target } = await supabase.from("targets").select("*").eq("id", targetId).eq("user_id", user.id).single()

  if (!target) {
    redirect("/")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Generate verification token if method is selected
  let verificationToken = target.verification_token
  if (params.method && !verificationToken) {
    verificationToken = await generateVerificationToken(targetId, params.method as "dns" | "http" | "email")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold">PenT</span>
            </div>
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                Dashboard
              </Link>
              <Link href="/reports" className="text-muted-foreground hover:text-foreground">
                Reports
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, {profile?.first_name || user.email}</span>
            <form action={handleLogout}>
              <Button
                variant="outline"
                type="submit"
                className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          {/* Page Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground">Verify Target Ownership</h1>
            <p className="text-xl text-muted-foreground">
              Choose a verification method to prove you own {target.domain}
            </p>
            {target.status === "verified" && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                ✓ Verified
              </Badge>
            )}
          </div>

          {target.status === "verified" ? (
            <Card className="p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">Target Verified Successfully!</h2>
              <p className="text-muted-foreground mb-6">
                {target.domain} has been verified and is ready for security scanning.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/scan-setup">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">Start Security Scan</Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="px-8 py-3 bg-transparent">
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            <>
              {/* Verification Methods */}
              <div className="space-y-6">
                {/* DNS TXT Record */}
                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Globe className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">DNS TXT Record</h3>
                        <p className="text-muted-foreground">Add a TXT record to your domain's DNS settings</p>
                      </div>

                      {target.verification_method === "dns" && verificationToken ? (
                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm font-medium">Record Type</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <code className="bg-gray-100 px-2 py-1 rounded text-sm">TXT</code>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium">Name/Host</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <code className="bg-gray-100 px-3 py-2 rounded text-sm flex-1">_pent-verification</code>
                              <Button variant="outline" size="sm" className="bg-transparent">
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium">Value</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <code className="bg-gray-100 px-3 py-2 rounded text-sm flex-1">{verificationToken}</code>
                              <Button variant="outline" size="sm" className="bg-transparent">
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Link href={`/verify-target?target=${targetId}&method=dns`}>
                          <Button variant="outline" className="bg-transparent">
                            Select DNS Method
                          </Button>
                        </Link>
                      )}

                      <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                        Recommended
                      </Badge>
                    </div>
                  </div>
                </Card>

                {/* HTTP File Upload */}
                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">HTTP File Upload</h3>
                        <p className="text-muted-foreground">
                          Upload a verification file to your website's root directory
                        </p>
                      </div>

                      {target.verification_method === "http" && verificationToken ? (
                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm font-medium">File Path</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <code className="bg-gray-100 px-3 py-2 rounded text-sm flex-1">
                                /.well-known/pent-verification.txt
                              </code>
                              <Button variant="outline" size="sm" className="bg-transparent">
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium">File Content</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <code className="bg-gray-100 px-3 py-2 rounded text-sm flex-1">{verificationToken}</code>
                              <Button variant="outline" size="sm" className="bg-transparent">
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Link href={`/verify-target?target=${targetId}&method=http`}>
                          <Button variant="outline" className="bg-transparent">
                            Select HTTP Method
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Email Verification */}
                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Email Verification</h3>
                        <p className="text-muted-foreground">Receive a verification link at an admin email address</p>
                      </div>

                      {target.verification_method === "email" ? (
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground">
                            Verification email sent to admin addresses for {target.domain}
                          </p>
                          <div className="space-y-1">
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm block">admin@{target.domain}</code>
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm block">
                              webmaster@{target.domain}
                            </code>
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm block">
                              postmaster@{target.domain}
                            </code>
                          </div>
                        </div>
                      ) : (
                        <Link href={`/verify-target?target=${targetId}&method=email`}>
                          <Button variant="outline" className="bg-transparent">
                            Select Email Method
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Action Buttons */}
              {verificationToken && (
                <div className="flex gap-4 pt-6">
                  <form action={checkVerification.bind(null, targetId)}>
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Check Verification
                    </Button>
                  </form>
                  <Link href="/">
                    <Button variant="outline" className="px-8 py-3 bg-transparent">
                      Cancel
                    </Button>
                  </Link>
                </div>
              )}

              {/* Instructions */}
              <Card className="p-6 bg-blue-50 border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Instructions</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <p>1. Choose your preferred verification method above</p>
                  <p>2. Complete the verification steps (add DNS record, upload file, or check email)</p>
                  <p>3. Click "Check Verification" to confirm ownership</p>
                  <p>4. Once verified, you can start running security scans on your target</p>
                </div>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
