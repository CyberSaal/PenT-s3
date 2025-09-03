import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "json"
    const reportId = params.id

    // Get report with full details
    const { data: report, error: reportError } = await supabase
      .from("reports")
      .select(`
        *,
        scans (
          id,
          profile,
          started_at,
          finished_at,
          targets (domain, verified_at)
        )
      `)
      .eq("id", reportId)
      .single()

    if (reportError || !report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    // Verify ownership
    const { data: scanOwnership } = await supabase
      .from("scans")
      .select("user_id")
      .eq("id", report.scan_id)
      .eq("user_id", user.id)
      .single()

    if (!scanOwnership) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const target = report.scans.targets.domain
    const timestamp = new Date(report.created_at).toISOString().split("T")[0]

    switch (format) {
      case "json":
        return new NextResponse(JSON.stringify(report.report_data, null, 2), {
          headers: {
            "Content-Type": "application/json",
            "Content-Disposition": `attachment; filename="pent-report-${target}-${timestamp}.json"`,
          },
        })

      case "html":
        const htmlReport = generateHtmlReport(report, target)
        return new NextResponse(htmlReport, {
          headers: {
            "Content-Type": "text/html",
            "Content-Disposition": `attachment; filename="pent-report-${target}-${timestamp}.html"`,
          },
        })

      case "pdf":
        // For PDF generation, you would typically use a library like Puppeteer or jsPDF
        // For now, return a placeholder response
        return NextResponse.json(
          { error: "PDF export not yet implemented. Use HTML export and print to PDF." },
          { status: 501 },
        )

      default:
        return NextResponse.json({ error: "Invalid format. Use json, html, or pdf" }, { status: 400 })
    }
  } catch (error) {
    console.error("Export failed:", error)
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}

function generateHtmlReport(report: any, target: string): string {
  const reportData = report.report_data
  const scanDate = new Date(report.created_at).toLocaleDateString()

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PenT Security Report - ${target}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
        .risk-score { background: ${reportData.risk_score > 70 ? "#ef4444" : reportData.risk_score > 40 ? "#f59e0b" : "#10b981"}; color: white; padding: 10px 20px; border-radius: 8px; display: inline-block; font-weight: bold; }
        .finding { border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 15px 0; }
        .severity-critical { border-left: 4px solid #dc2626; }
        .severity-high { border-left: 4px solid #ea580c; }
        .severity-medium { border-left: 4px solid #d97706; }
        .severity-low { border-left: 4px solid #65a30d; }
        .severity-info { border-left: 4px solid #0891b2; }
        .priority-actions { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">🛡️ PenT</div>
        <h1>Security Assessment Report</h1>
        <p><strong>Target:</strong> ${target}</p>
        <p><strong>Scan Date:</strong> ${scanDate}</p>
        <div class="risk-score">Risk Score: ${reportData.risk_score}/100</div>
    </div>

    <section>
        <h2>Executive Summary</h2>
        <p>${reportData.executive_summary}</p>
    </section>

    <section class="priority-actions">
        <h2>Priority Actions</h2>
        <ol>
            ${reportData.priority_actions.map((action: string) => `<li>${action}</li>`).join("")}
        </ol>
    </section>

    <section>
        <h2>Detailed Findings</h2>
        ${reportData.findings
          .map(
            (finding: any) => `
            <div class="finding severity-${finding.severity.toLowerCase()}">
                <h3>${finding.title}</h3>
                <p><strong>Severity:</strong> ${finding.severity} | <strong>Priority:</strong> ${finding.priority}/5</p>
                <p><strong>Description:</strong> ${finding.description}</p>
                <p><strong>Business Impact:</strong> ${finding.business_impact}</p>
                <p><strong>Remediation:</strong> ${finding.remediation}</p>
                ${finding.cwe_id ? `<p><strong>CWE ID:</strong> ${finding.cwe_id}</p>` : ""}
                ${finding.cve_refs && finding.cve_refs.length > 0 ? `<p><strong>CVE References:</strong> ${finding.cve_refs.join(", ")}</p>` : ""}
            </div>
        `,
          )
          .join("")}
    </section>

    <section>
        <h2>Compliance Notes</h2>
        <p>${reportData.compliance_notes}</p>
    </section>

    <div class="footer">
        <p>This report was generated by PenT Security Platform on ${scanDate}. For questions or support, contact your security team.</p>
    </div>
</body>
</html>
`
}
