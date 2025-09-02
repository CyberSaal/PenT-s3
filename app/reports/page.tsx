import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, ArrowLeft, Calendar, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

export default function Reports() {
  const reports = [
    {
      id: 1,
      domain: "example.com",
      date: "2024-01-15",
      status: "completed",
      vulnerabilities: 3,
      severity: "high",
    },
    {
      id: 2,
      domain: "myapp.vercel.app",
      date: "2024-01-12",
      status: "completed",
      vulnerabilities: 1,
      severity: "medium",
    },
    {
      id: 3,
      domain: "testsite.com",
      date: "2024-01-10",
      status: "completed",
      vulnerabilities: 0,
      severity: "none",
    },
    {
      id: 4,
      domain: "demo.website.com",
      date: "2024-01-08",
      status: "completed",
      vulnerabilities: 5,
      severity: "critical",
    },
    {
      id: 5,
      domain: "portfolio.dev",
      date: "2024-01-05",
      status: "completed",
      vulnerabilities: 2,
      severity: "medium",
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "none":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <XCircle className="w-4 h-4" />
      case "high":
        return <AlertTriangle className="w-4 h-4" />
      case "medium":
        return <AlertTriangle className="w-4 h-4" />
      case "none":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
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
              <Link href="/reports" className="text-foreground font-medium">
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
        <div className="space-y-8">
          {/* Header with back button */}
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Security Reports</h1>
              <p className="text-muted-foreground mt-2">
                View your previous security scan reports and vulnerability assessments
              </p>
            </div>

            {/* Reports List */}
            <div className="space-y-4">
              {reports.map((report) => (
                <Card key={report.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-foreground">{report.domain}</h3>
                        <Badge variant="outline" className={getSeverityColor(report.severity)}>
                          <div className="flex items-center gap-1">
                            {getSeverityIcon(report.severity)}
                            {report.severity === "none" ? "Secure" : report.severity}
                          </div>
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(report.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4" />
                          {report.vulnerabilities} vulnerabilities found
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">{report.status}</Badge>
                      <Button variant="outline" size="sm">
                        View Report
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Empty state or load more */}
            <div className="text-center py-8">
              <Button variant="outline">Load More Reports</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
