import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, ArrowLeft, Globe } from "lucide-react"
import Link from "next/link"

export default function ScanPage() {
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
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          {/* Page Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground">Start a Security Scan</h1>
            <p className="text-xl text-muted-foreground">
              Enter the website URL you want to scan for security vulnerabilities
            </p>
          </div>

          {/* Scan Form */}
          <Card className="p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">Target Website</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="website-url" className="text-base font-medium">
                    Website URL
                  </Label>
                  <Input id="website-url" type="url" placeholder="https://example.com" className="text-lg py-3 px-4" />
                  <p className="text-sm text-muted-foreground">Enter the full URL including https:// or http://</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">Before you scan:</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Ensure you own or have permission to scan this website</li>
                    <li>• Verify the URL is correct and accessible</li>
                    <li>• The scan may take several minutes to complete</li>
                  </ul>
                </div>

                <div className="flex gap-4 pt-4">
                  <Link href="/scan-results" className="flex-1">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg w-full">
                      Start Security Scan
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" className="px-8 py-3 text-lg bg-transparent">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>

          {/* How Scanning Works */}
          <Card className="p-6 bg-gray-50">
            <h3 className="text-lg font-semibold text-foreground mb-4">What we'll scan for:</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="space-y-2">
                <p>• SSL/TLS configuration</p>
                <p>• Security headers</p>
                <p>• JavaScript vulnerabilities</p>
                <p>• Cross-site scripting (XSS)</p>
              </div>
              <div className="space-y-2">
                <p>• SQL injection risks</p>
                <p>• Outdated libraries</p>
                <p>• Server misconfigurations</p>
                <p>• Authentication weaknesses</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
