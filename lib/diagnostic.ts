export const questions = [
  {
    title: "Qual é a principal atividade da sua propriedade?",
    options: [
      "Leite",
      "Suínos",
      "Aves",
      "Grãos",
      "Gado",
      "Atividade mista",
      "Outra",
    ],
  },
  {
    title:
      "Hoje alguém acompanha suas receitas e despesas rurais durante o ano?",
    options: [
      "Sim, mensalmente",
      "Às vezes",
      "Só perto do Imposto de Renda",
      "Não tenho esse acompanhamento",
    ],
  },
  {
    title:
      "Você sabe aproximadamente quanto sua atividade rural já faturou em 2026?",
    options: ["Sim", "Tenho uma ideia aproximada", "Não"],
  },
  {
    title:
      "Se eu perguntasse hoje qual é o seu resultado fiscal de 2026, você saberia responder?",
    options: ["Sim", "Mais ou menos", "Não"],
  },
  {
    title:
      "Você tem alguma estimativa de quanto poderá pagar de Imposto de Renda em 2027?",
    options: ["Sim", "Não", "Nunca fiz essa projeção"],
  },
  {
    title:
      "Em 2026 você comprou ou vendeu máquinas, veículos, terras ou outros bens relevantes?",
    options: ["Sim", "Não"],
  },
  {
    title: "Você possui financiamentos rurais ativos?",
    options: ["Sim", "Não"],
  },
  {
    title: "No último Imposto de Renda, aconteceu alguma destas situações?",
    options: [
      "Imposto maior do que eu esperava",
      "Dificuldade para juntar documentos",
      "Informações faltando",
      "Medo de cair na malha fina",
      "Não tive problemas",
      "Não sei dizer",
    ],
    multiple: true,
  },
];
export type Answers = number[][];
export function validAnswers(value: unknown): value is Answers {
  return (
    Array.isArray(value) &&
    value.length === 8 &&
    value.every(
      (a, i) =>
        Array.isArray(a) &&
        a.length > 0 &&
        (i === 7 || a.length === 1) &&
        new Set(a).size === a.length &&
        a.every(
          (n) =>
            Number.isInteger(n) && n >= 0 && n < questions[i].options.length,
        ) &&
        !(i === 7 && a.length > 1 && a.some((n) => n >= 4)),
    )
  );
}
export function diagnose(a: Answers) {
  const score =
    20 +
    [30, 15, 5, 0][a[1][0]] +
    [15, 8, 0][a[2][0]] +
    [20, 10, 0][a[3][0]] +
    [10, 0, 0][a[4][0]] +
    (a[7].includes(4) ? 5 : a[7].includes(5) ? 2 : 0);
  const level = score >= 75 ? "Organizada" : score >= 45 ? "Atenção" : "Risco";
  const title =
    score >= 75
      ? "Organização adequada"
      : score >= 45
        ? "Existem pontos que merecem atenção"
        : "Sua atividade pode estar sendo acompanhada tarde demais";
  const insights: string[] = [];
  if (a[1][0] > 1)
    insights.push(
      "Seu acompanhamento acontece apenas perto da declaração ou ainda não existe. Organizar o ano agora pode trazer mais clareza.",
    );
  if (a[3][0] > 0)
    insights.push(
      "Você ainda não tem clareza sobre seu resultado fiscal atual. Receitas e despesas organizadas ajudam a entender esse cenário.",
    );
  if (a[4][0] > 0)
    insights.push(
      "Você ainda não possui uma projeção de imposto para 2027. Uma revisão pode ajudar a se planejar.",
    );
  if (a[5][0] === 0)
    insights.push(
      "Você realizou movimentações patrimoniais em 2026. Vale revisar os documentos dessas operações.",
    );
  if (a[6][0] === 0)
    insights.push(
      "Você possui financiamentos rurais. Contratos, saldos e pagamentos merecem estar organizados.",
    );
  if (a[2][0] > 0)
    insights.push(
      "Consolidar o faturamento de 2026 pode ajudar a acompanhar melhor a atividade rural.",
    );
  if (a[7].some((n) => n < 4))
    insights.push(
      "Você relatou dificuldades ou preocupações na última declaração. Uma rotina de acompanhamento pode ajudar.",
    );
  const positive = [
    "Manter receitas e despesas atualizadas ajuda a preservar a organização ao longo do ano.",
    "Revisar a projeção sempre que houver mudanças na atividade ajuda no planejamento.",
    "Conferir os documentos antes da declaração é um próximo passo para manter tudo em ordem.",
  ];
  return {
    score,
    level,
    title,
    insights: [...insights, ...positive].slice(
      0,
      Math.max(3, Math.min(5, insights.length)),
    ),
  };
}
export const states = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];
export const whatsappNumber =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5549991199786";
export type Lead = { name: string; phone: string; city: string; state: string };
export function whatsappUrl(message: string) {
  return `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}
