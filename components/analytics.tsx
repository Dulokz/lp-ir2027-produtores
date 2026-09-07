"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
type Pixel = ((...args: unknown[]) => void) & {
  queue: unknown[][];
  loaded: boolean;
  version: string;
  callMethod?: (...args: unknown[]) => void;
  push?: Pixel;
};
declare global {
  interface Window {
    fbq?: Pixel;
    _fbq?: Pixel;
  }
}
export function getUtms(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem("jung-utms") || "{}");
  } catch {
    return {};
  }
}
export function track(event: string, data: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  // Never send names, phone numbers, answers or fiscal scores to Meta.
  if (window.fbq)
    window.fbq(
      ["PageView", "ViewContent", "Lead"].includes(event)
        ? "track"
        : "trackCustom",
      event,
      data,
    );
}
function startPixel() {
  const id = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  if (!id || !/^\d+$/.test(id) || window.fbq) return;
  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  } as Pixel;
  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.push = fbq;
  window.fbq = fbq;
  window._fbq = fbq;
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);
  fbq("init", id);
  track("PageView");
  track("ViewContent", { content_name: "Diagnóstico Fiscal Rural 2026" });
}
const subscribe = () => () => {};
const consentNeeded = () => {
  try {
    return !localStorage.getItem("jung-analytics");
  } catch {
    return false;
  }
};
export default function Analytics() {
  const [dismissed, setDismissed] = useState(false);
  const show =
    useSyncExternalStore(subscribe, consentNeeded, () => false) &&
    !dismissed &&
    !!process.env.NEXT_PUBLIC_META_PIXEL_ID;
  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const utms = getUtms();
      [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_content",
        "utm_term",
      ].forEach((k) => {
        const v = params.get(k);
        if (v) utms[k] = v.slice(0, 200);
      });
      sessionStorage.setItem("jung-utms", JSON.stringify(utms));
      const consent = localStorage.getItem("jung-analytics");
      if (consent === "yes") startPixel();
    } catch {
      /* Storage may be disabled; the diagnostic still works. */
    }
  }, []);
  function choose(yes: boolean) {
    try {
      localStorage.setItem("jung-analytics", yes ? "yes" : "no");
    } catch {}
    if (yes) startPixel();
    setDismissed(true);
  }
  return show ? (
    <aside className="consent" aria-label="Preferências de medição">
      <p>
        Podemos usar cookies para medir os resultados desta campanha?{" "}
        <a href="/privacidade">Saiba mais</a>
      </p>
      <div>
        <button onClick={() => choose(false)}>Agora não</button>
        <button onClick={() => choose(true)}>Permitir</button>
      </div>
    </aside>
  ) : null;
}
