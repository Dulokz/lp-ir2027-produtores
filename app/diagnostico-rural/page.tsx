import { redirect } from "next/navigation";

/** The diagnostic now completes on the landing page. */
export default function DiagnosticRoute() {
  redirect("/");
}
