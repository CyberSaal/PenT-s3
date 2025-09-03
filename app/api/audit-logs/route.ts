import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
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
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    // Get audit logs for the user
    const { data: logs, error: logsError } = await supabase
      .from("audit_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (logsError) {
      return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      logs: logs,
      pagination: {
        limit,
        offset,
        total: logs.length,
      },
    })
  } catch (error) {
    console.error("Failed to fetch audit logs:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { action, details } = body

    // Create audit log entry
    const { data: log, error: logError } = await supabase
      .from("audit_logs")
      .insert({
        user_id: user.id,
        action,
        details,
      })
      .select()
      .single()

    if (logError) {
      return NextResponse.json({ error: "Failed to create audit log" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      log: log,
    })
  } catch (error) {
    console.error("Failed to create audit log:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
