import { NextResponse } from "next/server";
import { diagnose, validAnswers, states } from "@/lib/diagnostic";
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return NextResponse.json({ error: "Origem inválida" }, { status: 403 });
  if (!request.headers.get("content-type")?.includes("application/json"))
    return NextResponse.json({ error: "Formato inválido" }, { status: 415 });
  if (Number(request.headers.get("content-length") || 0) > 12000)
    return NextResponse.json(
      { error: "Requisição muito grande" },
      { status: 413 },
    );
  try {
    const reader = request.body?.getReader();
    if (!reader)
      return NextResponse.json({ error: "Dados ausentes" }, { status: 400 });
    let raw = "";
    let bytes = 0;
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 12000) {
        await reader.cancel();
        return NextResponse.json(
          { error: "Requisição muito grande" },
          { status: 413 },
        );
      }
      raw += decoder.decode(value, { stream: true });
    }
    raw += decoder.decode();
    const body = JSON.parse(raw);
    const { name, phone, city, state, answers } = body;
    if (
      typeof name !== "string" ||
      name.trim().length < 2 ||
      name.length > 100 ||
      typeof city !== "string" ||
      city.trim().length < 2 ||
      city.length > 100 ||
      typeof phone !== "string" ||
      phone.length > 20 ||
      !/^(?:55)?[1-9]{2}9?\d{8}$/.test(phone.replace(/\D/g, "")) ||
      !states.includes(state) ||
      !validAnswers(answers)
    )
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    const utms: Record<string, string> = {};
    for (const k of [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
    ])
      if (typeof body.utms?.[k] === "string")
        utms[k] = body.utms[k].slice(0, 200);
    const result = diagnose(answers);
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key)
      return NextResponse.json({ stored: false }, { status: 200 });
    const response = await fetch(
      `${url.replace(/\/$/, "")}/rest/v1/rural_leads`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: key,
          Authorization: `Bearer ${key}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.replace(/\D/g, ""),
          city: city.trim(),
          state,
          answers,
          score: result.score,
          classification: result.level,
          utms,
          privacy_version: "2026-09-07",
        }),
        signal: AbortSignal.timeout(4000),
      },
    );
    if (!response.ok)
      return NextResponse.json({ stored: false }, { status: 503 });
    return NextResponse.json({ stored: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { stored: false, error: "Não foi possível processar os dados" },
      { status: 400 },
    );
  }
}
