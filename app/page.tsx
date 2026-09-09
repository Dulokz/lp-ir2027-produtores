"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Sprout,
  ShieldCheck,
  Clock3,
  Check,
  FileText,
  Wallet,
  ChartNoAxesCombined,
  Calculator,
  Tractor,
  Landmark,
  MessageCircle,
  Milk,
  Wheat,
  Bird,
} from "lucide-react";
import Diagnostic from "@/components/diagnostic";
import Brand from "@/components/brand";
import { getUtms } from "@/components/analytics";
import * as analytics from "@/components/analytics";
import { whatsappUrl } from "@/lib/diagnostic";
import { trackVercelEvent } from "@/lib/vercel-analytics";
const services = [
  { icon: FileText, name: "Notas fiscais", text: "Documentos no lugar certo." },
  {
    icon: Wallet,
    name: "Receitas e despesas",
    text: "Clareza sobre o que entra e sai.",
  },
  {
    icon: ChartNoAxesCombined,
    name: "Resultado rural",
    text: "Sua atividade vista de perto.",
  },
  {
    icon: Calculator,
    name: "Previsão de imposto",
    text: "Planejamento antes da declaração.",
  },
  { icon: Tractor, name: "Patrimônio", text: "Atenção às suas movimentações." },
  {
    icon: Landmark,
    name: "Financiamentos",
    text: "Contratos e saldos organizados.",
  },
];
export default function Home() {
  const trackEvent = (analytics as unknown as { trackMetaEvent?: (event: string, data?: Record<string, unknown>) => void; track?: (event: string, data?: Record<string, unknown>) => void }).trackMetaEvent ?? (analytics as unknown as { track: (event: string, data?: Record<string, unknown>) => void }).track;
  const [started, setStarted] = useState(false);
  const [diagnosticMode, setDiagnosticMode] = useState<"quick" | "full">("quick");
  function start(mode: "quick" | "full" = "quick") {
    setDiagnosticMode(mode);
    if (!started) {
      setStarted(true);
      trackEvent("StartDiagnostic");
      trackVercelEvent("StartDiagnostic");
      return;
    }
    document.getElementById("diagnostico")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "start",
    });
  }
  function contact(placement = "footer") {
    trackEvent("ContactWhatsApp", { placement });
    trackVercelEvent("ContactWhatsApp", { placement });
    try {
      sessionStorage.setItem(
        "jung-contact-origin",
        JSON.stringify({ utms: getUtms(), at: new Date().toISOString() }),
      );
    } catch {}
  }
  function whatsappContact(
    event: React.MouseEvent<HTMLAnchorElement>,
    placement: string,
  ) {
    event.currentTarget.href = whatsappUrl(
      "Olá! Gostaria de conversar sobre o acompanhamento contabil da minha atividade rural..",
    );
    contact(placement);
  }
  return (
    <>
      <a className="skip-link" href="#main">
        Pular para o conteúdo
      </a>
      <header className="header">
        <Link
          className="brand"
          href="/"
          aria-label="Grupo Jung Contabilidade — início"
        >
          <Brand />
        </Link>
        <span className="header-area">
          AO LADO DE QUEM PRODUZ <span className="tiny-dot" />
        </span>
      </header>
      <main id="main">
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-copy">
              <div className="rural-signature">
                <Wheat size={18} />
                <span>CONTABILIDADE PARA QUEM VIVE DO CAMPO</span>
              </div>
              <span className="eyebrow hero-label">
                <span className="tiny-dot" /> DIAGNÓSTICO FISCAL RURAL 2026
              </span>
              <h1>
                Seu Imposto de
                <br className="desktop-break" /> Renda Rural de{" "}
                <em>2027 já começou.</em>
              </h1>
              <p>
                O resultado que você vai declarar no próximo ano está sendo
                construído agora.{" "}
                <strong>
                  Esperar a época da declaração para descobrir quanto vai pagar
                  pode ser tarde.
                </strong>
              </p>
              <div className="hero-actions">
                <a
                  className="button hero-button whatsapp-button"
                  href={whatsappUrl("Olá! Gostaria de conversar sobre minha atividade rural.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => whatsappContact(event, "hero")}
                >
                  <MessageCircle size={20} /> Falar agora no WhatsApp
                </a>
                <button className="button hero-diagnostic-button" onClick={() => start()}>
                  Ver minha situação em 4 perguntas <ArrowRight size={20} />
                </button>
              </div>
              <div className="hero-reassurance">
                <span>
                  <Clock3 size={15} /> Leva menos de 2 minutos.
                </span>
                <span>
                  <ShieldCheck size={15} /> Sem compromisso
                </span>
              </div>
            </div>
            <div className="hero-visual">
              <div className="rural-context">
                <span>
                  <Milk size={20} /> Da produção
                </span>
                <span>
                  <FileText size={20} /> à nota fiscal
                </span>
                <span>
                  <Tractor size={20} /> ao patrimônio
                </span>
              </div>
              <div className="year-tag">
                <span>O ANO ACONTECE AGORA</span>
                <strong>
                  2026 <ArrowRight size={23} /> 2027
                </strong>
              </div>
              <div className="overview">
                <div className="overview-head">
                  <span className="mini-brand">
                    <Sprout size={18} /> VISÃO DA SUA ATIVIDADE
                  </span>
                  <span className="live-dot" />
                </div>
                <div className="overview-title">
                  <span>
                    Organização hoje.
                    <br />
                    <strong>Mais clareza amanhã.</strong>
                  </span>
                  <ChartNoAxesCombined size={34} />
                </div>
                <div className="timeline">
                  <div>
                    <span className="time-node completed">
                      <Check size={12} />
                    </span>
                    <small>Produzir</small>
                  </div>
                  <div>
                    <span className="time-node current" />
                    <small>Acompanhar</small>
                  </div>
                  <div>
                    <span className="time-node" />
                    <small>Declarar</small>
                  </div>
                </div>
                <div className="overview-row">
                  <span>
                    <FileText size={17} /> Receitas e despesas
                  </span>
                  <span>Ao longo do ano</span>
                </div>
                <div className="overview-row">
                  <span>
                    <Tractor size={17} /> Patrimônio e contratos
                  </span>
                  <span>Organizados</span>
                </div>
                <div className="overview-callout">
                  <ShieldCheck size={21} />
                  <span>
                    A próxima declaração começa
                    <br />
                    com as decisões de hoje.
                  </span>
                </div>
              </div>
              <p className="visual-caption">
                CUIDAR DO CAMPO. PLANEJAR O FUTURO.
              </p>
            </div>
          </div>
          <div className="hero-footer">
            <span>DA PORTEIRA PARA DENTRO, CADA DECISÃO CONTA.</span>
            <a
              href="#diagnostico"
              onClick={(event) => {
                event.preventDefault();
                start();
              }}
            >
              Comece pela sua organização <ArrowRight size={16} />
            </a>
          </div>
        </section>
        <div className="segments">
          <span>AO LADO DE QUEM PRODUZ</span>
          <div>
            <span>
              <Milk /> Leite
            </span>
            <span>
              <Tractor /> Suínos
            </span>
            <span>
              <Bird /> Aves
            </span>
            <span>
              <Wheat /> Grãos
            </span>
            <span>
              <Sprout /> Pecuária
            </span>
          </div>
        </div>
        <Diagnostic
          key={diagnosticMode}
          started={started}
          mode={diagnosticMode}
          onPause={() => setStarted(false)}
        />
        <section className="year-section content-width">
          <div>
            <span className="eyebrow">
              O CAMPO NÃO PARA. O ACOMPANHAMENTO TAMBÉM NÃO.
            </span>
            <h2>Não espere abril de 2027 para descobrir como terminou 2026.</h2>
          </div>
          <div className="year-copy">
            <p>
              O Imposto de Renda é entregue uma vez por ano.{" "}
              <strong>A atividade rural acontece todos os dias.</strong>
            </p>
            <p>
              Receitas, despesas, notas fiscais, patrimônio e financiamentos
              precisam ser acompanhados durante o ano.
            </p>
            <span className="small-note">
              Planejamento se constrói ao longo do caminho.
            </span>
          </div>
        </section>
        <section className="services-section content-width">
          <div className="section-line">
            <h2>O que acompanhamos</h2>
            <span>SEIS FRENTES. UMA VISÃO MAIS COMPLETA.</span>
          </div>
          <div className="services">
            {services.map(({ icon: Icon, name, text }) => (
              <article key={name}>
                <Icon size={26} />
                <h3>{name}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="agro-section">
          <div className="agro-inner content-width">
            <div className="agro-copy">
              <span className="eyebrow">
                AGROGESTÃO · INFORMAÇÃO PARA DECIDIR
              </span>
              <h2>
                E se você soubesse disso <em>antes da declaração?</em>
              </h2>
              <p>
                Acompanhamento mensal para ir além de guardar notas. Entender o
                momento da sua atividade para planejar os próximos passos com
                acompanhamento especializado.
              </p>
              <ul>
                <li>
                  <Check size={17} /> Uma visão mais clara do ano
                </li>
                <li>
                  <Check size={17} /> Organização para conversar sobre o futuro
                </li>
                <li>
                  <Check size={17} /> Informação perto de você
                </li>
              </ul>
              <button className="text-button" onClick={() => start()}>
                Descobrir meu ponto de partida <ArrowUpRight size={18} />
              </button>
            </div>
            <div className="dashboard">
              <div className="dashboard-header">
                <span>
                  <Sprout size={21} />
                  <strong>agrogestão</strong>
                </span>
                <span className="demo-tag">DEMONSTRAÇÃO</span>
              </div>
              <div className="dashboard-sub">
                <strong>Visão geral da atividade</strong>
                <span>2026</span>
              </div>
              <div className="metrics">
                <div>
                  <span>Receitas 2026</span>
                  <strong>R$ 428.350</strong>
                  <small>Entradas da atividade</small>
                </div>
                <div>
                  <span>Despesas rurais</span>
                  <strong>R$ 291.480</strong>
                  <small>Saídas da atividade</small>
                </div>
              </div>
              <div className="chart-heading">
                <span>Receitas e despesas</span>
                <small>
                  <i /> Receitas <i /> Despesas
                </small>
              </div>
              <div
                className="bar-chart"
                role="img"
                aria-label="Gráfico ilustrativo de receitas e despesas de janeiro a junho"
              >
                <div className="chart-grid" />
                {["JAN", "FEV", "MAR", "ABR", "MAI", "JUN"].map((m, i) => (
                  <div className="bar-group" key={m}>
                    <div className="bars">
                      <span
                        style={{ height: `${[43, 58, 50, 73, 67, 90][i]}%` }}
                      />
                      <span
                        style={{ height: `${[31, 41, 38, 48, 46, 63][i]}%` }}
                      />
                    </div>
                    <small>{m}</small>
                  </div>
                ))}
              </div>
              <div className="dashboard-result">
                <div>
                  <span>Resultado estimado</span>
                  <strong>R$ 136.870</strong>
                </div>
                <div>
                  <span>Imposto projetado</span>
                  <strong>R$ XX.XXX</strong>
                </div>
              </div>
              <div className="dashboard-tabs">
                <span>Notas</span>
                <span>Patrimônio</span>
                <span>Financeiro</span>
                <span>Financiamentos</span>
              </div>
              <p>
                Dados fictícios para demonstração visual. Não representam dados
                conectados nem uma apuração de imposto.
              </p>
            </div>
          </div>
        </section>
        <section className="trust-section content-width">
          <div className="trust-mark">
            <Sprout size={40} />
          </div>
          <span className="eyebrow">PROXIMIDADE COM QUEM PRODUZ</span>
          <h2>
            Grupo Jung
            <br />
            Contabilidade Rural
          </h2>
          <p>
            Acompanhamento especializado para produtores rurais durante todo o
            ano, com foco em organização, segurança fiscal e planejamento
            tributário.
          </p>
          <div className="trust-values">
            <span>
              <ShieldCheck size={18} /> Cuidado com sua informação
            </span>
            <span>
              <MessageCircle size={18} /> Conversa de perto
            </span>
            <span>
              <Sprout size={18} /> Foco no produtor rural
            </span>
          </div>
          {/* Future verified testimonials belong here; no fabricated social proof. */}
        </section>
        <section className="final-cta">
          <span className="eyebrow">O PRIMEIRO PASSO É ENTENDER.</span>
          <h2>
            Você sabe como está sua
            <br />
            situação fiscal hoje?
          </h2>
          <p>
            Em menos de 2 minutos, comece a olhar para 2026 com mais clareza.
          </p>
          <button className="button" onClick={() => start()}>
            Fazer meu Diagnóstico Fiscal Rural 2026 <ArrowRight size={19} />
          </button>
          <button className="text-button final-full-diagnostic" onClick={() => start("full")}>
            Quero aprofundar meu diagnóstico <ArrowRight size={16} />
          </button>
          <a
            className="direct-whatsapp"
            href={whatsappUrl(
              "Olá! Gostaria de conversar sobre o acompanhamento da minha atividade rural com o Grupo Jung.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => whatsappContact(event, "footer")}
          >
            <MessageCircle size={18} /> Falar diretamente pelo WhatsApp
          </a>
        </section>
      </main>
      <a
        className="mobile-whatsapp-sticky"
        href={whatsappUrl("Olá! Gostaria de conversar sobre minha atividade rural.")}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(event) => whatsappContact(event, "mobile_sticky")}
      >
        <MessageCircle size={20} /> Falar no WhatsApp
      </a>
      <footer className="footer">
        <Link className="brand" href="/">
          <Brand />
        </Link>
        <span>© {new Date().getFullYear()} Grupo Jung Contabilidade</span>
        <a href="/privacidade">Privacidade</a>
      </footer>
    </>
  );
}
