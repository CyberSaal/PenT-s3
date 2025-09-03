import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { runSecurityScan } from "@/lib/scanner/workers"
import { generateSecurityReport } from "@/lib/ai/report-generator"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const scanId = params.id

    // Get scan details
    const { data: scan, error: scanError } = await supabase
      .from("scans")
      .select(`
        *,
        targets (domain, verified_at),
        scan_configs (name, settings)
      `)
      .eq("id", scanId)
      .eq("user_id", user.id)
      .single()

    if (scanError || !scan) {
      return NextResponse.json({ error: "Scan not found" }, { status: 404 })
    }

    if (scan.status !== "queued") {
      return NextResponse.json({ error: "Scan already processed" }, { status: 400 })
    }

    // Update scan status to running
    await supabase
      .from("scans")
      .update({
        status: "running",
        started_at: new Date().toISOString(),
      })
      .eq("id", scanId)

    // Add progress log
    await supabase.from("scan_logs").insert({
      scan_id: scanId,
      step: "execution",
      message: "Starting security scan execution",
      status: "running",
    })

    const target = scan.targets.domain
    const profile = scan.scan_configs.settings.profile || "passive"

    // Execute security scan
    console.log(`[v0] Starting security scan for ${target} with profile ${profile}`)

    await supabase.from("scan_logs").insert({
      scan_id: scanId,
      step: "scanning",
      message: "Running security analysis plugins",
      status: "running",
    })

    const scanResults = await runSecurityScan(target, profile)

    console.log(`[v0] Scan completed, found ${scanResults.length} plugin results`)

    // Store individual findings
    for (const result of scanResults) {
      for (const finding of result.findings) {
        await supabase.from("scan_results").insert({
          scan_id: scanId,
          plugin: result.plugin,
          title: finding.title,
          severity: finding.severity,
          evidence: finding.evidence,
          cwe_id: finding.cwe_id,
          cve_refs: finding.cve_refs,
          remediation: finding.remediation,
          category: finding.category,
        })
      }
    }

    // Generate AI report
    await supabase.from("scan_logs").insert({
      scan_id: scanId,
      step: "ai_analysis",
      message: "Generating AI-powered security report",
      status: "running",
    })

    console.log(`[v0] Generating AI report for scan ${scanId}`)

    const aiReport = await generateSecurityReport(scanResults, target)

    console.log(`[v0] AI report generated with risk score: ${aiReport.risk_score}`)

    // Store the AI-generated report
    const { data: report } = await supabase
      .from("reports")
      .insert({
        scan_id: scanId,
        executive_summary: aiReport.executive_summary,
        risk_score: aiReport.risk_score,
        findings_count: aiReport.findings.length,
        priority_actions: aiReport.priority_actions,
        compliance_notes: aiReport.compliance_notes,
        report_data: aiReport,
      })
      .select()
      .single()

    // Update scan status to completed
    await supabase
      .from("scans")
      .update({
        status: "completed",
        finished_at: new Date().toISOString(),
      })
      .eq("id", scanId)

    await supabase.from("scan_logs").insert({
      scan_id: scanId,
      step: "completed",
      message: `Scan completed successfully. Risk score: ${aiReport.risk_score}/100`,
      status: "completed",
    })

    return NextResponse.json({
      success: true,
      scan_id: scanId,
      report_id: report?.id,
      risk_score: aiReport.risk_score,
      findings_count: aiReport.findings.length,
    })
  } catch (error) {
    console.error("Scan execution failed:", error)

    // Update scan status to failed
    const supabase = createServerClient()
    await supabase
      .from("scans")
      .update({
        status: "failed",
        finished_at: new Date().toISOString(),
      })
      .eq("id", params.id)

    await supabase.from("scan_logs").insert({
      scan_id: params.id,
      step: "error",
      message: `Scan failed: ${error}`,
      status: "failed",
    })

    return NextResponse.json({ error: "Scan execution failed" }, { status: 500 })
  }
}
