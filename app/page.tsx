import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Search, FileText, Plus, Play } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const targets = [
    {
      id: 1,
      domain: "example.com",
      status: "verified",
      lastScan: "2024-01-15",
      healthScore: 85,
      issues: 2,
      severity: "medium",
    },
    {
      id: 2,
      domain: "myapp.vercel.app",
      status: "verified",
      lastScan: "2024-01-12",
      healthScore: 92,
      issues: 1,
      severity: "low",
    },
    {
      id: 3,
      domain: "testsite.com",
      status: "pending",
      lastScan: null,
      healthScore: null,
      issues: 0,
      severity: "none",
    },
  ]

  const getHealthScoreColor = (score: number | null) => {
    if (!score) return "text-gray-500"
    if (score >= 90) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return (
          <Badge variant="destructive" className="text-xs">
            High Risk
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
            Medium Risk
          </Badge>
        )
      case "low":
        return (
          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
            Low Risk
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-800">
            No Issues
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
              <Link href="/" className="text-foreground font-medium">
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
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="space-y-12">
          {/* Hero Section */}
          <section className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl font-bold text-foreground leading-tight">Verify, Scan, Fix</h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Identify vulnerabilities and receive detailed reports to improve your web security
                </p>
                <Link href="/add-target">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">Add Target</Button>
                </Link>
              </div>
            </div>

            {/* Browser Mockup */}
            <div className="relative">
              <div className="bg-gray-100 rounded-lg p-6 shadow-lg">
                {/* Browser Header */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="flex-1 bg-white rounded px-3 py-1 ml-4 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">example.com</span>
                  </div>
                </div>

                {/* Test Results */}
                <div className="bg-white rounded p-4 space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Test results</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-foreground">Missing security headers</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-foreground">Weak TLS configuration</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-foreground">Outdated JavaScript library</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium text-foreground mb-3">Action</h4>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2">Fix now</Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Dashboard Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-foreground">Security Dashboard</h2>
              <p className="text-xl text-muted-foreground">Monitor and manage your verified targets</p>
            </div>
            <Link href="/add-target">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Target
              </Button>
            </Link>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">Your Targets</h2>

            <div className="grid gap-4">
              {targets.map((target) => (
                <Card key={target.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-semibold text-foreground">{target.domain}</h3>
                        <Badge variant={target.status === "verified" ? "secondary" : "outline"} className="text-xs">
                          {target.status === "verified" ? "✓ Verified" : "⏳ Pending Verification"}
                        </Badge>
                        {target.severity !== "none" && getSeverityBadge(target.severity)}
                      </div>

                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        {target.lastScan ? (
                          <>
                            <span>Last scan: {new Date(target.lastScan).toLocaleDateString()}</span>
                            <span>•</span>
                            <span className={getHealthScoreColor(target.healthScore)}>
                              Health Score: {target.healthScore}/100
                            </span>
                            <span>•</span>
                            <span>{target.issues} issues found</span>
                          </>
                        ) : (
                          <span>No scans yet</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {target.status === "verified" ? (
                        <Link href="/scan-setup">
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                            <Play className="w-4 h-4" />
                            Run Scan
                          </Button>
                        </Link>
                      ) : (
                        <Link href="/verify-target">
                          <Button variant="outline" className="bg-transparent">
                            Complete Verification
                          </Button>
                        </Link>
                      )}
                      {target.lastScan && (
                        <Link href="/scan-results">
                          <Button variant="outline" size="sm" className="bg-transparent">
                            View Report
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* How it works section */}
          <section className="mt-20">
            <h2 className="text-3xl font-bold text-foreground mb-12">How it works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="space-y-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Verify target ownership</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Demonstrate that you own the target before running any scans
                </p>
              </div>

              {/* Step 2 */}
              <div className="space-y-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Scan for vulnerabilities</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Perform security scans to discover potential issues
                </p>
              </div>

              {/* Step 3 */}
              <div className="space-y-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Receive reports</h3>
                <p className="text-muted-foreground leading-relaxed">Get detailed reports with remediation guidance</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
