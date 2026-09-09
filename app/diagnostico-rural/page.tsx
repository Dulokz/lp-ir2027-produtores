"use client";
import { useEffect, useSyncExternalStore } from "react";
import { ArrowRight, MessageCircle, ShieldCheck } from "lucide-react";
import { diagnose, questions, whatsappUrl, type Answers } from "@/lib/diagnostic";
import { getUtms, trackMetaEvent } from "@/components/analytics";
import Brand from "@/components/brand";

type Mode = "quick" | "full";
type StoredDiagnostic = { mode: Mode; answers: Answers };
const quickQuestionIndexes = [0, 1, 3, 4] as const;
function quickResult(answers: Answers) {
  const score = 20 + [30, 15, 5, 0][answers[1][0]] + [20, 10, 0][answers[3][0]] + [10, 0, 0][answers[4][0]];
  return { score, level: score >= 65 ? "Organizada" : score >= 40 ? "Atenção" : "Risco" };
}
function isStoredDiagnostic(value: unknown): value is StoredDiagnostic {
  if (!value || typeof value !== "object") return false;
  const data = value as StoredDiagnostic;
  return (data.mode === "quick" || data.mode === "full") && Array.isArray(data.answers) && data.answers.length === 8 && data.answers.every((answer) => Array.isArray(answer));
}
const subscribe = () => () => {};
function getStoredDiagnostic() {
  try {
    const stored = JSON.parse(sessionStorage.getItem("jung-diagnostic-result") || "null");
    return isStoredDiagnostic(stored) ? stored : null;
  } catch { return null; }
}

export default function DiagnosticResultPage() {
  const data = useSyncExternalStore(subscribe, getStoredDiagnostic, () => null);
  useEffect(() => {
    if (!data) window.location.replace("/");
  }, [data]);
  if (!data) return null;
  const result = data.mode === "quick" ? quickResult(data.answers) : diagnose(data.answers);
  const answerIndexes = data.mode === "quick" ? quickQuestionIndexes : questions.map((_, index) => index);
  const answerSummary = answerIndexes.map((index) => `${questions[index].title}\n${data.answers[index].map((option) => questions[index].options[option]).join(", ")}`).join("\n\n");
  const utms = getUtms();
  const origin = utms.utm_campaign || utms.utm_source || "acesso direto";
  const message = `Olá! Vim da campanha ${origin} e ${data.mode === "quick" ? "fiz o diagnóstico rápido" : "aprofundei meu diagnóstico"}.\n\nAtividade: ${questions[0].options[data.answers[0][0]]}\n\nPrincipais respostas:\n${answerSummary}\n\nClassificação preliminar: ${result.level} (${result.score}/${data.mode === "quick" ? 80 : 100}).\n\nQuero revisar minha situação no WhatsApp.`;
  const headline = result.level === "Risco" ? "Ainda dá tempo de evitar surpresas em 2027." : "Você já tem um ponto de partida. Agora, transforme isso em clareza.";
  function contact() {
    trackMetaEvent("ContactWhatsApp", { placement: "diagnostic_result_page", version: data!.mode });
    try { sessionStorage.setItem("jung-contact-origin", JSON.stringify({ utms, at: new Date().toISOString() })); } catch {}
  }
  return <main className="result-page">
    <header className="result-page-header"><Brand /></header>
    <section className={`result-page-card ${result.level === "Risco" ? "risk" : result.level === "Atenção" ? "attention" : "good"}`}>
      <div className="result-page-icon"><ShieldCheck size={28} /></div><span className="eyebrow">SUA SITUAÇÃO HOJE</span><h1>{headline}</h1>
      <div className="result-page-score"><div className="score"><strong>{result.score}</strong><span>/{data.mode === "quick" ? 80 : 100}</span></div><div><span className="eyebrow">CLASSIFICAÇÃO PRELIMINAR</span><strong className="status">{result.level}</strong></div></div>
      <p>Com base nas suas respostas, uma conversa agora pode ajudar a organizar sua atividade antes da declaração.</p>
      <a className="button result-page-cta" href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" onClick={contact}><MessageCircle size={21} /> Quero revisar minha situação no WhatsApp <ArrowRight size={18} /></a><small>Você confere a mensagem antes de enviar no WhatsApp.</small>
    </section>
  </main>;
}
