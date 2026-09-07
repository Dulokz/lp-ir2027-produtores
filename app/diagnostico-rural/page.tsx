import { redirect } from "next/navigation";
export default async function DiagnosticRoute({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = new URLSearchParams();
  for (const key of [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ]) {
    const value = params[key];
    if (typeof value === "string") query.set(key, value.slice(0, 200));
  }
  redirect(query.size ? `/?${query.toString()}` : "/");
}
