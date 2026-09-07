"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
  MessageCircle,
  RotateCcw,
  LockKeyhole,
} from "lucide-react";
import {
  questions,
  diagnose,
  states,
  whatsappUrl,
  type Answers,
  type Lead,
} from "@/lib/diagnostic";
import { getUtms, track } from "./analytics";
export default function Diagnostic({
  started,
  onStart,
}: {
  started: boolean;
  onStart: () => void;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(
    Array.from({ length: 8 }, () => []),
  );
  const [lead, setLead] = useState<Lead>({
    name: "",
    phone: "",
    city: "",
    state: "SC",
  });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const card = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const busy = useRef(false);
  useEffect(() => {
    if (started) {
      title.current?.focus({ preventScroll: true });
      card.current?.scrollIntoView({ block: "start", behavior: "instant" });
    }
  }, [step, done, started]);
  const result = done ? diagnose(answers) : null;
  function select(index: number) {
    setAnswers((prev) =>
      prev.map((a, i) => {
        if (i !== step) return a;
        if (step !== 7) return [index];
        if (index >= 4) return a.includes(index) ? [] : [index];
        return a.includes(index)
          ? a.filter((n) => n !== index)
          : [...a.filter((n) => n < 4), index];
      }),
    );
  }
  function next() {
    if (!answers[step].length) return;
    track("DiagnosticStep", { step: step + 1 });
    setStep((s) => s + 1);
  }
  async function finish(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy.current) return;
    const phone = lead.phone.replace(/\D/g, "");
    if (!/^(?:55)?[1-9]{2}9?\d{8}$/.test(phone)) {
      setError("Informe um WhatsApp válido com DDD.");
      return;
    }
    if (lead.name.trim().length < 2 || lead.city.trim().length < 2) {
      setError("Confira seu nome e município.");
      return;
    }
    busy.current = true;
    setError("");
    setLoading(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, answers, utms: getUtms() }),
        signal: AbortSignal.timeout(5000),
      });
    } catch {
      /* Lead storage is optional. WhatsApp remains available. */
    }
    track("CompleteDiagnostic");
    track("Lead");
    setLoading(false);
    setDone(true);
    busy.current = false;
  }
  function contact() {
    track("ContactWhatsApp", { placement: "result" });
    try {
      sessionStorage.setItem(
        "jung-contact-origin",
        JSON.stringify({ utms: getUtms(), at: new Date().toISOString() }),
      );
    } catch {}
  }
  const message = result
    ? `Olá! Fiz o Diagnóstico Fiscal Rural 2026.\nNome: ${lead.name.trim()}\nAtividade: ${questions[0].options[answers[0][0]]}\nCidade: ${lead.city.trim()}/${lead.state}\nResultado: ${result.level} (${result.score}/100)\nGostaria de conversar sobre minha situação.`
    : "";
  return (
    <section id="diagnostico" className="diagnostic-section">
      <div className="section-heading">
        <span className="eyebrow">UM POUCO DE CLAREZA, A PARTIR DE AGORA</span>
        <h2>
          Sua propriedade tem uma rotina.
          <br />
          Sua organização fiscal também?
        </h2>
        <p>
          Responda algumas perguntas e descubra os pontos que merecem um olhar
          mais próximo.
        </p>
      </div>
      <div className="quiz-card" ref={card}>
        {!started ? (
          <div className="quiz-intro">
            <span className="round-icon">
              <ShieldCheck size={30} />
            </span>
            <span className="eyebrow">DIAGNÓSTICO FISCAL RURAL 2026</span>
            <h3>
              Como está a organização
              <br />
              da sua atividade rural?
            </h3>
            <p>8 perguntas simples. Sem precisar buscar documentos.</p>
            <button className="button" onClick={onStart}>
              Começar meu diagnóstico <ArrowRight size={19} />
            </button>
            <small>
              <LockKeyhole size={14} /> Suas respostas são tratadas com cuidado.
            </small>
          </div>
        ) : result ? (
          <div
            className={`result ${result.level === "Organizada" ? "good" : result.level === "Atenção" ? "attention" : "risk"}`}
          >
            <div className="quiz-top">
              <span>SEU DIAGNÓSTICO</span>
              <ShieldCheck size={20} />
            </div>
            <h3 ref={title} tabIndex={-1}>
              {lead.name.trim().split(" ")[0]}, este é o seu ponto de partida.
            </h3>
            <div className="result-main">
              <div className="score">
                <strong>{result.score}</strong>
                <span>/100</span>
              </div>
              <div>
                <span className="eyebrow">
                  ÍNDICE DE ORGANIZAÇÃO FISCAL RURAL
                </span>
                <span className="status">{result.level}</span>
              </div>
            </div>
            <h4>{result.title}</h4>
            <p>
              Com base nas suas respostas, identificamos sinais sobre a
              organização da sua atividade.
            </p>
            <ul className="insights">
              {result.insights.map((item) => (
                <li key={item}>
                  <Check size={18} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="disclaimer">
              Este índice é orientativo e considera apenas suas respostas. Não
              calcula imposto, não garante regularidade fiscal e não substitui
              uma análise contábil individual.
            </p>
            <a
              className="button"
              href={whatsappUrl(message)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={contact}
            >
              <MessageCircle size={21} /> Quero revisar minha situação com o
              Grupo Jung <ArrowRight size={18} />
            </a>
            <small>Você confere a mensagem antes de enviar no WhatsApp.</small>
            <button
              className="text-button"
              onClick={() => {
                setDone(false);
                setStep(0);
                track("StartDiagnostic", { restart: true });
              }}
            >
              <RotateCcw size={15} /> Revisar minhas respostas
            </button>
          </div>
        ) : (
          <form onSubmit={finish}>
            <div className="quiz-top">
              <span>
                {step < 8 ? `PERGUNTA ${step + 1} DE 8` : "ÚLTIMO PASSO"}
              </span>
              <span>
                {step < 8
                  ? "Sobre sua atividade"
                  : "Seu resultado está quase pronto"}
              </span>
            </div>
            <div
              className="progress"
              role="progressbar"
              aria-label="Progresso do diagnóstico"
              aria-valuemin={0}
              aria-valuemax={9}
              aria-valuenow={step}
            >
              <div style={{ width: `${(step / 9) * 100}%` }} />
            </div>
            <div className="question" key={step}>
              <h3 ref={title} tabIndex={-1}>
                {step < 8 ? questions[step].title : "Como podemos chamar você?"}
              </h3>
              <p>
                {step === 7
                  ? "Pode marcar mais de uma opção."
                  : step < 8
                    ? "Selecione a opção que mais combina com sua realidade."
                    : "Preencha seus dados para ver o resultado e conversar com nossa equipe."}
              </p>
              {step < 8 ? (
                <div
                  className={`options ${step === 0 ? "activities" : ""}`}
                  role="group"
                  aria-label={questions[step].title}
                >
                  {questions[step].options.map((option, i) => (
                    <button
                      type="button"
                      aria-pressed={answers[step].includes(i)}
                      className={answers[step].includes(i) ? "selected" : ""}
                      key={option}
                      onClick={() => select(i)}
                    >
                      <span className="option-check">
                        {answers[step].includes(i) ? (
                          <Check size={15} />
                        ) : (
                          String.fromCharCode(65 + i)
                        )}
                      </span>
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="lead-fields">
                  <label>
                    Seu nome
                    <input
                      autoComplete="name"
                      required
                      minLength={2}
                      maxLength={100}
                      value={lead.name}
                      onChange={(e) =>
                        setLead({ ...lead, name: e.target.value })
                      }
                      placeholder="Como você gosta de ser chamado"
                    />
                  </label>
                  <label>
                    WhatsApp com DDD
                    <input
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      required
                      maxLength={20}
                      value={lead.phone}
                      onChange={(e) =>
                        setLead({ ...lead, phone: e.target.value })
                      }
                      placeholder="(49) 99999-9999"
                    />
                  </label>
                  <div className="location-fields">
                    <label>
                      Município
                      <input
                        autoComplete="address-level2"
                        required
                        minLength={2}
                        maxLength={100}
                        value={lead.city}
                        onChange={(e) =>
                          setLead({ ...lead, city: e.target.value })
                        }
                        placeholder="Seu município"
                      />
                    </label>
                    <label>
                      Estado
                      <select
                        autoComplete="address-level1"
                        value={lead.state}
                        onChange={(e) =>
                          setLead({ ...lead, state: e.target.value })
                        }
                      >
                        {states.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <p className="privacy-note">
                    <LockKeyhole size={16} /> Seus dados serão utilizados apenas
                    para contato sobre o diagnóstico e os serviços do Grupo
                    Jung.{" "}
                    <a
                      href="/privacidade"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Privacidade
                    </a>
                  </p>
                </div>
              )}
              {error && (
                <p role="alert" className="error">
                  {error}
                </p>
              )}
            </div>
            <div className="quiz-bottom">
              <button
                type="button"
                className="text-button"
                disabled={step === 0 || loading}
                onClick={() => setStep((s) => s - 1)}
              >
                <ArrowLeft size={17} /> Voltar
              </button>
              {step < 8 ? (
                <button
                  type="button"
                  className="button"
                  disabled={!answers[step].length}
                  onClick={next}
                >
                  Continuar <ArrowRight size={18} />
                </button>
              ) : (
                <button className="button" disabled={loading} type="submit">
                  {loading ? "Preparando resultado…" : "Ver meu resultado"}
                  <ArrowRight size={18} />
                </button>
              )}
            </div>
          </form>
        )}
      </div>
      <p className="under-quiz">
        <ShieldCheck size={16} /> Sem documentos. Sem cálculo de imposto. Um
        primeiro olhar para a sua organização.
      </p>
    </section>
  );
}
