import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, ArrowLeft, AlertTriangle, CheckCircle, XCircle, Clock, Download, Share } from "lucide-react"
import Link from "next/link"

export default function ScanResultsPage() {
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
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Back Button */}
          <Link href="/scan" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back to Scan
          </Link>

          {/* Report Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-foreground">Security Scan Report</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span>example.com</span>
                <span>•</span>
                <span>Scanned on {new Date().toLocaleDateString()}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>2 minutes ago</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Download className="w-4 h-4" />
                Export PDF
              </Button>
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Share className="w-4 h-4" />
                Share Report
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">3</p>
                  <p className="text-sm text-muted-foreground">Critical Issues</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">5</p>
                  <p className="text-sm text-muted-foreground">Medium Issues</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">2</p>
                  <p className="text-sm text-muted-foreground">Low Issues</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">15</p>
                  <p className="text-sm text-muted-foreground">Passed Tests</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Security Score */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Security Score</h2>
              <div className="text-3xl font-bold text-orange-600">C</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div className="bg-orange-600 h-3 rounded-full" style={{ width: "60%" }}></div>
            </div>
            <p className="text-sm text-muted-foreground">
              60/100 - Your website has several security issues that need attention
            </p>
          </Card>

          {/* Detailed Issues */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Detailed Findings</h2>

            {/* Critical Issues */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <XCircle className="w-5 h-5 text-red-600" />
                <h3 className="text-xl font-semibold text-red-600">Critical Issues</h3>
                <Badge variant="destructive">3 found</Badge>
              </div>
              <div className="space-y-4">
                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <h4 className="font-medium text-foreground">Missing Security Headers</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Critical security headers like Content-Security-Policy and X-Frame-Options are missing
                  </p>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      Headers
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      XSS Protection
                    </Badge>
                  </div>
                </div>
                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <h4 className="font-medium text-foreground">Weak TLS Configuration</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    TLS 1.0 and 1.1 are enabled, which are deprecated and insecure
                  </p>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      SSL/TLS
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Encryption
                    </Badge>
                  </div>
                </div>
                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <h4 className="font-medium text-foreground">Outdated JavaScript Library</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    jQuery 2.1.4 contains known security vulnerabilities
                  </p>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      Dependencies
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      JavaScript
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Medium Issues */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <h3 className="text-xl font-semibold text-orange-600">Medium Issues</h3>
                <Badge variant="secondary">5 found</Badge>
              </div>
              <div className="space-y-4">
                <div className="border-l-4 border-orange-500 pl-4 py-2">
                  <h4 className="font-medium text-foreground">Insecure Cookie Configuration</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Session cookies are missing Secure and HttpOnly flags
                  </p>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      Cookies
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Session Management
                    </Badge>
                  </div>
                </div>
                <div className="border-l-4 border-orange-500 pl-4 py-2">
                  <h4 className="font-medium text-foreground">Information Disclosure</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Server version information is exposed in HTTP headers
                  </p>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      Information Leak
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Headers
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Recommendations */}
            <Card className="p-6 bg-blue-50 border-blue-200">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Recommended Actions</h3>
              <div className="space-y-3 text-sm text-blue-800">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Implement Content Security Policy (CSP) headers to prevent XSS attacks</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Upgrade TLS configuration to only support TLS 1.2 and 1.3</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Update jQuery to the latest version (3.7.1 or higher)</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Configure cookies with Secure and HttpOnly flags</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <Link href="/scan">
              <Button variant="outline" className="px-8 py-3 bg-transparent">
                Scan Another Site
              </Button>
            </Link>
            <Link href="/reports">
              <Button variant="outline" className="px-8 py-3 bg-transparent">
                View All Reports
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
