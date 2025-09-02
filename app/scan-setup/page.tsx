import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Shield, ArrowLeft, Zap, Eye, AlertTriangle, Globe } from "lucide-react"
import Link from "next/link"

export default function ScanSetupPage() {
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
            <h1 className="text-4xl font-bold text-foreground">Configure Security Scan</h1>
            <p className="text-xl text-muted-foreground">
              Choose your scan profile and configure settings for example.com
            </p>
          </div>

          {/* Scan Profiles */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">Scan Profile</h2>

            {/* Passive-only Profile */}
            <Card className="p-6 border-2 border-blue-200 bg-blue-50">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold text-foreground">Passive-only Scan</h3>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Recommended
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    Non-intrusive scanning that only observes and analyzes without sending potentially harmful requests
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">What we'll check:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• SSL/TLS configuration and certificates</li>
                      <li>• HTTP security headers</li>
                      <li>• DNS configuration</li>
                      <li>• Server information disclosure</li>
                      <li>• Known vulnerable software versions</li>
                    </ul>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full border-2 border-blue-600 bg-blue-600"></div>
                </div>
              </div>
            </Card>

            {/* Active-light Profile */}
            <Card className="p-6 border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold text-foreground">Active-light Scan</h3>
                    <Badge variant="outline" className="border-orange-200 text-orange-700">
                      More Thorough
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    Includes passive checks plus safe, lightweight active testing for more comprehensive results
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">Additional checks include:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Directory and file enumeration</li>
                      <li>• Form input validation testing</li>
                      <li>• Authentication mechanism analysis</li>
                      <li>• Safe SQL injection detection</li>
                      <li>• Cross-site scripting (XSS) testing</li>
                    </ul>
                  </div>

                  {/* Consent Checkbox */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4">
                    <div className="flex items-start gap-3">
                      <Checkbox id="active-consent" className="mt-1" />
                      <div className="space-y-2">
                        <Label htmlFor="active-consent" className="text-sm font-medium text-orange-900">
                          I consent to active testing on my website
                        </Label>
                        <p className="text-xs text-orange-800">
                          Active testing may generate log entries and could potentially trigger security alerts. Only
                          enable this if you own the target and understand the implications.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                </div>
              </div>
            </Card>
          </div>

          {/* Scope Preview */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Scan Scope</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Primary Target:</span>
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">example.com</code>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Included subdomains and hosts:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <code className="bg-gray-100 px-2 py-1 rounded">www.example.com</code>
                  <code className="bg-gray-100 px-2 py-1 rounded">api.example.com</code>
                  <code className="bg-gray-100 px-2 py-1 rounded">app.example.com</code>
                  <code className="bg-gray-100 px-2 py-1 rounded">admin.example.com</code>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <AlertTriangle className="w-4 h-4 inline mr-2" />
                  Scanning will be limited to the verified domain and its subdomains only
                </p>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <Link href="/scan-progress">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">Start Scan</Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="px-8 py-3 text-lg bg-transparent">
                Cancel
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
