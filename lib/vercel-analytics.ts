"use client";

import { track } from "@vercel/analytics";

/** Sends only non-identifying funnel data to Vercel Web Analytics. */
export function trackVercelEvent(
  name: "StartDiagnostic" | "DiagnosticStep" | "CompleteDiagnostic" | "ContactWhatsApp",
  data: Record<string, string | number> = {},
) {
  track(name, data);
}
