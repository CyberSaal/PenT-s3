import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AddTarget() {
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
          <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent">
            Sign in
          </Button>
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
            <form className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="domain" className="text-base font-medium">
                    Domain or Website URL
                  </Label>
                  <Input
                    id="domain"
                    type="url"
                    placeholder="https://example.com or example.com"
                    className="text-base py-3"
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter the full URL or just the domain name you want to scan
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base font-medium">
                    Description (Optional)
                  </Label>
                  <Input id="description" type="text" placeholder="My company website" className="text-base py-3" />
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
                <Link href="/verify-target">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg flex-1">
                    Add Target & Verify
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="px-8 py-3 text-lg bg-transparent">
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
