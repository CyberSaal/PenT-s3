import { createServerClient } from "@/lib/supabase/server"

export async function createAuditLog(action: string, details: any) {
  try {
    const supabase = createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    await supabase.from("audit_logs").insert({
      user_id: user.id,
      action,
      details: typeof details === "string" ? details : JSON.stringify(details),
    })
  } catch (error) {
    console.error("Failed to create audit log:", error)
  }
}

export const AUDIT_ACTIONS = {
  TARGET_ADDED: "target_added",
  TARGET_VERIFIED: "target_verified",
  SCAN_STARTED: "scan_started",
  SCAN_COMPLETED: "scan_completed",
  REPORT_DOWNLOADED: "report_downloaded",
  USER_LOGIN: "user_login",
  USER_LOGOUT: "user_logout",
} as const
