"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Check, X, Wheat } from "lucide-react";
import { questions, diagnose, type Answers } from "@/lib/diagnostic";
import { trackMetaEvent } from "./analytics";
import Brand from "./brand";

const quickQuestionIndexes = [0, 1, 3, 4] as const;
type Mode = "quick" | "full";
function preliminaryDiagnosis(answers: Answers) {
  const score = 20 + [30, 15, 5, 0][answers[1][0]] + [20, 10, 0][answers[3][0]] + [10, 0, 0][answers[4][0]];
  return { score, level: score >= 65 ? "Organizada" : score >= 40 ? "Atenção" : "Risco" };
}

export default function Diagnostic({ started, mode, onPause }: { started: boolean; mode: Mode; onPause: () => void }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(Array.from({ length: 8 }, () => []));
  const title = useRef<HTMLHeadingElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const questionIndex = mode === "quick" ? quickQuestionIndexes[step] : step;
  const questionCount = mode === "quick" ? quickQuestionIndexes.length : questions.length;

  useEffect(() => {
    if (!started || !dialog.current) return;
    const element = dialog.current, scrollY = window.scrollY, bodyStyle = document.body.getAttribute("style"), rootOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    Object.assign(document.body.style, { position: "fixed", top: `-${scrollY}px`, width: "100%", overflow: "hidden" });
    element.showModal();
    const viewport = window.visualViewport;
    const resize = () => { element.style.setProperty("--quiz-height", `${viewport?.height ?? window.innerHeight}px`); element.style.setProperty("--quiz-top", `${viewport?.offsetTop ?? 0}px`); };
    resize(); viewport?.addEventListener("resize", resize); viewport?.addEventListener("scroll", resize);
    return () => { viewport?.removeEventListener("resize", resize); viewport?.removeEventListener("scroll", resize); element.close(); if (bodyStyle === null) document.body.removeAttribute("style"); else document.body.setAttribute("style", bodyStyle); document.documentElement.style.overflow = rootOverflow; window.scrollTo({ top: scrollY, behavior: "instant" }); };
  }, [started]);
  useEffect(() => { if (started) { title.current?.focus({ preventScroll: true }); dialog.current?.querySelector(".question")?.scrollTo({ top: 0, behavior: "instant" }); } }, [step, started]);
  function select(option: number) {
    setAnswers((previous) => previous.map((answer, index) => {
      if (index !== questionIndex) return answer;
      if (mode !== "full" || questionIndex !== 7) return [option];
      if (option >= 4) return answer.includes(option) ? [] : [option];
      return answer.includes(option) ? answer.filter((value) => value !== option) : [...answer.filter((value) => value < 4), option];
    }));
  }
  function next() {
    if (!answers[questionIndex].length) return;
    trackMetaEvent("DiagnosticStep", { step: step + 1, version: mode });
    if (step + 1 === questionCount) {
      const result = mode === "quick" ? preliminaryDiagnosis(answers) : diagnose(answers);
      try { sessionStorage.setItem("jung-diagnostic-result", JSON.stringify({ mode, answers, result })); } catch {}
      trackMetaEvent("CompleteDiagnostic", { version: mode });
      router.push("/diagnostico-rural");
      return;
    }
    setStep((current) => current + 1);
  }
  if (!started) return null;
  return <dialog ref={dialog} className="quiz-dialog" aria-labelledby="quiz-title" onCancel={(event) => { event.preventDefault(); onPause(); }}>
    <div className="quiz-dialog-brand"><Brand /><button type="button" className="quiz-close" aria-label="Sair do diagnóstico e continuar depois" onClick={onPause}><X size={21} /></button></div>
    <div className="quiz-dialog-content"><div className="quiz-rural-label"><Wheat size={16} /> {mode === "quick" ? "Diagnóstico rápido do produtor rural" : "Diagnóstico fiscal completo do produtor rural"}</div><div className="quiz-top"><span>PERGUNTA {step + 1} DE {questionCount}</span><span>Sobre sua atividade</span></div><div className="progress" role="progressbar" aria-label="Progresso do diagnóstico" aria-valuemin={0} aria-valuemax={questionCount} aria-valuenow={step + 1}><div style={{ width: `${((step + 1) / questionCount) * 100}%` }} /></div>
      <div className="question" key={step}><h3 id="quiz-title" ref={title} tabIndex={-1}>{questions[questionIndex].title}</h3><p>{mode === "full" && questionIndex === 7 ? "Pode marcar mais de uma opção." : "Selecione a opção que mais combina com sua realidade."}</p><div className={`options ${questionIndex === 0 ? "activities" : ""}`} role="group" aria-label={questions[questionIndex].title}>{questions[questionIndex].options.map((option, index) => <button type="button" aria-pressed={answers[questionIndex].includes(index)} className={answers[questionIndex].includes(index) ? "selected" : ""} key={option} onClick={() => select(index)}><span className="option-check">{answers[questionIndex].includes(index) ? <Check size={15} /> : String.fromCharCode(65 + index)}</span>{option}</button>)}</div></div>
      <div className="quiz-bottom"><button type="button" className="text-button" disabled={step === 0} onClick={() => setStep((current) => current - 1)}><ArrowLeft size={17} /> Voltar</button><button type="button" className="button" disabled={!answers[questionIndex].length} onClick={next}>{step + 1 === questionCount ? "Ver minha situação" : "Continuar"} <ArrowRight size={18} /></button></div>
    </div>
  </dialog>;
}
