import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, ArrowLeft, CheckCircle, Clock, Loader2 } from "lucide-react"
import Link from "next/link"

export default function ScanProgressPage() {
  const scanSteps = [
    {
      id: 1,
      name: "DNS Checks",
      description: "Analyzing DNS configuration and records",
      status: "completed",
      duration: "12s",
    },
    {
      id: 2,
      name: "HTTP Headers",
      description: "Examining security headers and server responses",
      status: "completed",
      duration: "8s",
    },
    {
      id: 3,
      name: "TLS Summary",
      description: "Testing SSL/TLS configuration and certificates",
      status: "in-progress",
      duration: "45s",
    },
    {
      id: 4,
      name: "Vulnerability Detection",
      description: "Scanning for known security vulnerabilities",
      status: "pending",
      duration: "2m 30s",
    },
    {
      id: 5,
      name: "Report Building",
      description: "Compiling results and generating detailed report",
      status: "pending",
      duration: "15s",
    },
  ]

  const getStepIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "in-progress":
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStepBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
            Completed
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
            In Progress
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-xs">
            Pending
          </Badge>
        )
    }
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
          <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent">
            Sign in
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Back Button */}
          <Link
            href="/scan-setup"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Scan Setup
          </Link>

          {/* Page Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground">Security Scan in Progress</h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span className="text-xl">example.com</span>
              <span>•</span>
              <span>Passive-only scan</span>
              <span>•</span>
              <span>ETA: 2 minutes remaining</span>
            </div>
          </div>

          {/* Progress Overview */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-foreground">Scan Progress</h2>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">60%</div>
                <div className="text-sm text-muted-foreground">Complete</div>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div className="bg-blue-600 h-3 rounded-full transition-all duration-500" style={{ width: "60%" }}></div>
            </div>

            <div className="text-sm text-muted-foreground">
              Step 3 of 5: Testing SSL/TLS configuration and certificates
            </div>
          </Card>

          {/* Detailed Steps */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Scan Steps</h3>

            {scanSteps.map((step) => (
              <Card key={step.id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">{getStepIcon(step.status)}</div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium text-foreground">{step.name}</h4>
                      {getStepBadge(step.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {step.status === "completed"
                      ? `Completed in ${step.duration}`
                      : step.status === "in-progress"
                        ? `Est. ${step.duration}`
                        : `Est. ${step.duration}`}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Status Logs */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Status Logs</h3>
            <div className="space-y-2 text-sm font-mono bg-gray-50 p-4 rounded-lg max-h-48 overflow-y-auto">
              <div className="text-green-600">[12:34:01] DNS checks completed successfully</div>
              <div className="text-green-600">[12:34:13] HTTP headers analysis finished</div>
              <div className="text-blue-600">[12:34:21] Starting TLS configuration test...</div>
              <div className="text-blue-600">[12:34:25] Testing SSL certificate validity</div>
              <div className="text-blue-600">[12:34:28] Checking cipher suites and protocols</div>
              <div className="text-gray-600">[12:34:30] TLS scan in progress...</div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <Button variant="outline" className="px-8 py-3 bg-transparent" disabled>
              Cancel Scan
            </Button>
            <Link href="/scan-results">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3" disabled>
                View Results (Available when complete)
              </Button>
            </Link>
          </div>

          {/* Info Card */}
          <Card className="p-6 bg-blue-50 border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">What happens next?</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>• The scan will continue running in the background</p>
              <p>• You'll receive an email notification when it's complete</p>
              <p>• Results will be available in your Reports section</p>
              <p>• You can safely close this page - the scan will continue</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
