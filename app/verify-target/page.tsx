import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Shield, ArrowLeft, Globe, Copy, Mail, FileText, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function VerifyTargetPage() {
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
            <h1 className="text-4xl font-bold text-foreground">Verify Target Ownership</h1>
            <p className="text-xl text-muted-foreground">Choose a verification method to prove you own testsite.com</p>
          </div>

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
                        <code className="bg-gray-100 px-3 py-2 rounded text-sm flex-1">
                          pent-verify-abc123def456ghi789
                        </code>
                        <Button variant="outline" size="sm" className="bg-transparent">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

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
                    <p className="text-muted-foreground">Upload a verification file to your website's root directory</p>
                  </div>

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
                        <code className="bg-gray-100 px-3 py-2 rounded text-sm flex-1">
                          pent-verify-abc123def456ghi789
                        </code>
                        <Button variant="outline" size="sm" className="bg-transparent">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
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

                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      We'll send a verification link to one of these addresses:
                    </p>
                    <div className="space-y-1">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm block">admin@testsite.com</code>
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm block">webmaster@testsite.com</code>
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm block">postmaster@testsite.com</code>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Check Verification
            </Button>
            <Link href="/">
              <Button variant="outline" className="px-8 py-3 bg-transparent">
                Cancel
              </Button>
            </Link>
          </div>

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
        </div>
      </main>
    </div>
  )
}
