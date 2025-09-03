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

    const reportId = params.id

    // Get report with scan and target details
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

    // Verify user owns this report through scan ownership
    const { data: scanOwnership } = await supabase
      .from("scans")
      .select("user_id")
      .eq("id", report.scan_id)
      .eq("user_id", user.id)
      .single()

    if (!scanOwnership) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      report: {
        id: report.id,
        scan_id: report.scan_id,
        executive_summary: report.executive_summary,
        risk_score: report.risk_score,
        findings_count: report.findings_count,
        priority_actions: report.priority_actions,
        compliance_notes: report.compliance_notes,
        report_data: report.report_data,
        created_at: report.created_at,
        scan: report.scans,
      },
    })
  } catch (error) {
    console.error("Failed to fetch report:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
