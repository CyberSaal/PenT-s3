import { generateObject } from "ai"
import { groq } from "@ai-sdk/groq"
import { z } from "zod"
import type { ScanResult, ScanFinding } from "../scanner/workers"

const ReportSchema = z.object({
  executive_summary: z.string().describe("Executive summary of security findings for business stakeholders"),
  risk_score: z.number().min(0).max(100).describe("Overall risk score from 0-100"),
  findings: z.array(
    z.object({
      title: z.string(),
      severity: z.enum(["Critical", "High", "Medium", "Low", "Info"]),
      description: z.string().describe("Detailed technical description"),
      business_impact: z.string().describe("Business impact explanation"),
      remediation: z.string().describe("Step-by-step remediation guidance"),
      priority: z.number().min(1).max(5).describe("Remediation priority 1-5"),
      cwe_id: z.string().optional(),
      cve_refs: z.array(z.string()).optional(),
    }),
  ),
  priority_actions: z.array(z.string()).describe("Top 3-5 priority actions to take"),
  compliance_notes: z.string().describe("Relevant compliance considerations (OWASP, PCI-DSS, etc.)"),
})

export type SecurityReport = z.infer<typeof ReportSchema>

export async function generateSecurityReport(scanResults: ScanResult[], target: string): Promise<SecurityReport> {
  // Normalize and aggregate findings
  const allFindings: ScanFinding[] = []
  scanResults.forEach((result) => {
    allFindings.push(...result.findings)
  })

  // Calculate severity distribution
  const severityCounts = allFindings.reduce(
    (acc, finding) => {
      acc[finding.severity] = (acc[finding.severity] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const prompt = `
You are a cybersecurity expert generating a professional security assessment report for the domain: ${target}

SCAN RESULTS:
${JSON.stringify(scanResults, null, 2)}

SEVERITY DISTRIBUTION:
${JSON.stringify(severityCounts, null, 2)}

Generate a comprehensive security report that includes:

1. EXECUTIVE SUMMARY: Write for business stakeholders, focusing on risk and business impact
2. RISK SCORE: Calculate 0-100 based on severity and number of findings
3. FINDINGS: For each finding, provide:
   - Clear technical description
   - Business impact explanation
   - Detailed remediation steps
   - Priority ranking (1=highest, 5=lowest)
4. PRIORITY ACTIONS: List top 3-5 most critical actions
5. COMPLIANCE NOTES: Mention relevant standards (OWASP Top 10, PCI-DSS, etc.)

Focus on actionable insights and clear remediation guidance. Use professional security terminology but ensure business stakeholders can understand the impact.
`

  try {
    const { object } = await generateObject({
      model: groq("llama-3.1-70b-versatile"),
      schema: ReportSchema,
      prompt,
      temperature: 0.3, // Lower temperature for more consistent, factual output
    })

    return object
  } catch (error) {
    console.error("AI report generation failed:", error)

    // Fallback to template-based report
    return generateFallbackReport(allFindings, target)
  }
}

function generateFallbackReport(findings: ScanFinding[], target: string): SecurityReport {
  const criticalCount = findings.filter((f) => f.severity === "Critical").length
  const highCount = findings.filter((f) => f.severity === "High").length
  const mediumCount = findings.filter((f) => f.severity === "Medium").length

  // Calculate risk score based on findings
  const riskScore = Math.min(100, criticalCount * 25 + highCount * 15 + mediumCount * 5)

  return {
    executive_summary: `Security assessment of ${target} identified ${findings.length} findings across multiple categories. ${criticalCount > 0 ? `${criticalCount} critical issues require immediate attention.` : "No critical vulnerabilities detected."} The overall security posture ${riskScore > 70 ? "requires significant improvement" : riskScore > 40 ? "shows moderate risk" : "appears relatively secure"}.`,
    risk_score: riskScore,
    findings: findings.map((finding, index) => ({
      title: finding.title,
      severity: finding.severity,
      description: finding.evidence,
      business_impact: getSeverityImpact(finding.severity),
      remediation: finding.remediation,
      priority: getSeverityPriority(finding.severity),
      cwe_id: finding.cwe_id,
      cve_refs: finding.cve_refs || [],
    })),
    priority_actions: [
      ...findings
        .filter((f) => f.severity === "Critical")
        .slice(0, 2)
        .map((f) => f.remediation),
      ...findings
        .filter((f) => f.severity === "High")
        .slice(0, 3)
        .map((f) => f.remediation),
    ].slice(0, 5),
    compliance_notes:
      "Review findings against OWASP Top 10, ensure PCI-DSS compliance if handling payments, and consider ISO 27001 security controls.",
  }
}

function getSeverityImpact(severity: string): string {
  switch (severity) {
    case "Critical":
      return "High business risk - potential for data breach or system compromise"
    case "High":
      return "Significant security risk - could lead to unauthorized access"
    case "Medium":
      return "Moderate risk - may facilitate other attacks"
    case "Low":
      return "Low risk - minimal direct impact but should be addressed"
    default:
      return "Informational - no immediate security impact"
  }
}

function getSeverityPriority(severity: string): number {
  switch (severity) {
    case "Critical":
      return 1
    case "High":
      return 2
    case "Medium":
      return 3
    case "Low":
      return 4
    default:
      return 5
  }
}
