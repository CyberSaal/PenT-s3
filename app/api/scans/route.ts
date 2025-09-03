import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: scans, error } = await supabase
    .from("scans")
    .select(`
      *,
      targets (domain, description)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ scans })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { targetId, profileType, activeConsent } = await request.json()

    // Validate target ownership and verification
    const { data: target } = await supabase
      .from("targets")
      .select("*")
      .eq("id", targetId)
      .eq("user_id", user.id)
      .eq("status", "verified")
      .single()

    if (!target) {
      return NextResponse.json({ error: "Target not found or not verified" }, { status: 404 })
    }

    // Validate active consent for active-light scans
    if (profileType === "active-light" && !activeConsent) {
      return NextResponse.json({ error: "Active consent is required for active-light scans" }, { status: 400 })
    }

    // Get scan configuration
    const { data: config } = await supabase
      .from("scan_configs")
      .select("*")
      .eq("profile_type", profileType)
      .eq("is_default", true)
      .single()

    // Create scan record
    const { data: scan, error } = await supabase
      .from("scans")
      .insert({
        user_id: user.id,
        target_id: targetId,
        config_id: config?.id,
        profile_type: profileType,
        status: "queued",
        progress: 0,
        current_step: "Initializing scan...",
        total_steps: profileType === "passive" ? 5 : 8,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Add initial log entry
    await supabase.from("scan_logs").insert({
      scan_id: scan.id,
      level: "info",
      message: `Scan initiated with ${profileType} profile`,
      step_name: "initialization",
    })

    return NextResponse.json({ scan }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
