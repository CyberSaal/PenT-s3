import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, ArrowLeft, LogOut } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

async function handleLogout() {
  "use server"
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/auth/login")
}

async function handleAddTarget(formData: FormData) {
  "use server"
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const domain = formData.get("domain") as string
  const description = formData.get("description") as string

  // Clean up domain input
  let cleanDomain = domain.trim()
  if (cleanDomain.startsWith("http://") || cleanDomain.startsWith("https://")) {
    cleanDomain = new URL(cleanDomain).hostname
  }

  const { data, error } = await supabase
    .from("targets")
    .insert({
      user_id: user.id,
      domain: cleanDomain,
      description: description || null,
      status: "pending",
    })
    .select()
    .single()

  if (error) {
    console.error("Error adding target:", error)
    return
  }

  redirect(`/verify-target?target=${data.id}`)
}

export default async function AddTarget() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

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
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          {/* Page Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">Add New Target</h1>
            <p className="text-xl text-muted-foreground">Add a website or domain to start security scanning</p>
          </div>

          {/* Add Target Form */}
          <Card className="p-8">
            <form action={handleAddTarget} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="domain" className="text-base font-medium">
                    Domain or Website URL
                  </Label>
                  <Input
                    id="domain"
                    name="domain"
                    type="text"
                    placeholder="https://example.com or example.com"
                    className="text-base py-3"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter the full URL or just the domain name you want to scan
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base font-medium">
                    Description (Optional)
                  </Label>
                  <Input
                    id="description"
                    name="description"
                    type="text"
                    placeholder="My company website"
                    className="text-base py-3"
                  />
                  <p className="text-sm text-muted-foreground">Add a description to help you identify this target</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Next Steps</h3>
                <p className="text-sm text-blue-800">
                  After adding your target, you'll need to verify ownership before running any scans. We'll guide you
                  through the verification process using DNS records, file upload, or email confirmation.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg flex-1">
                  Add Target & Verify
                </Button>
                <Link href="/">
                  <Button type="button" variant="outline" className="px-8 py-3 text-lg bg-transparent">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}
