# Diagnóstico Fiscal Rural 2026 — Grupo Jung

Landing page mobile-first em Next.js App Router, TypeScript, Tailwind CSS 4 e Lucide. Aplicação própria, sem plataforma de quizzes e sem serviços pagos obrigatórios. Pronta para a Vercel.

## Rodar localmente

Requer Node.js 22.9+ e npm.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

No PowerShell, use `Copy-Item .env.example .env.local`. Abra http://localhost:3000.

```sh
npm run lint
npm test
npm run build
npm start
```

## Variáveis de ambiente

| Variável                    | Uso                                                                                      |
| --------------------------- | ---------------------------------------------------------------------------------------- |
| NEXT_PUBLIC_WHATSAPP_NUMBER | Número internacional somente dígitos. Padrão autorizado: `5549991199786`.                |
| NEXT_PUBLIC_META_PIXEL_ID   | ID numérico do Meta Pixel; vazio desativa medição.                                       |
| NEXT_PUBLIC_SITE_URL        | Origem pública usada em canonical e Open Graph. Padrão `https://rural.grupojung.com.br`. |
| SUPABASE_URL                | URL do projeto Supabase; opcional.                                                       |
| SUPABASE_SERVICE_ROLE_KEY   | Chave secreta, somente no servidor. Nunca usar prefixo NEXT_PUBLIC.                      |

Alterações em NEXT_PUBLIC exigem novo build/deploy. Não versionar `.env.local` ou chaves. `.env.example` contém apenas exemplos públicos.

## WhatsApp

O número informado está configurado como fallback em `lib/diagnostic.ts`. Pode ser substituído por variável. O CTA do resultado inclui nome, atividade, cidade/UF, classificação e pontuação; o usuário revisa a mensagem no WhatsApp antes de enviar. A abertura do WhatsApp não comprova envio ou atendimento. O número de telefone fornecido no formulário é usado no lead, não para alterar o destinatário.

## Diagnóstico e pontuação

Oito perguntas, uma por etapa; botões explícitos para continuar, voltar e corrigir respostas. A última pergunta permite múltipla escolha, com opções “Não tive problemas” e “Não sei dizer” exclusivas. Os dados pessoais ficam apenas na memória do navegador até o envio; recarregar reinicia o diagnóstico.

Índice heurístico de organização, não cálculo tributário ou diagnóstico profissional:

- Base: 20 pontos.
- Acompanhamento: 30 / 15 / 5 / 0.
- Clareza do faturamento: 15 / 8 / 0.
- Clareza do resultado: 20 / 10 / 0.
- Projeção de imposto: 10 / 0 / 0.
- Histórico sem problemas: 5; não sabe: 2; demais situações: 0.
- 75–100: Organizada; 45–74: Atenção; 20–44: Risco.

Atividade, movimentações patrimoniais e financiamentos não penalizam o score. Geram contexto e insights. A função pura é compartilhada com a API, que recalcula o resultado e não aceita pontuação enviada pelo cliente. Três a cinco orientações são exibidas. O score é editorial, não validado cientificamente, e merece revisão da equipe contábil antes da campanha.

## Leads e Supabase opcional

Execute `supabase/schema.sql` no editor SQL do projeto e configure as duas variáveis do Supabase no servidor. RLS fica habilitada sem políticas públicas; inserções passam pela API interna com service role. O cliente nunca recebe essa chave.

`POST /api/leads` aceita `{ name, phone, city, state, answers, utms }`. Valida tipos, limites, telefone, UF, respostas exclusivas e tamanho máximo de 12 KB; recusa origem divergente quando presente. Responde 201 com `stored:true` ao persistir. Sem configuração responde 200 com `stored:false`, sem salvar dados e sem registrar dados pessoais em logs. Falhas da integração não bloqueiam resultado nem WhatsApp. Não há fila de reenvio nem garantia de armazenamento quando o serviço está fora do ar. A janela máxima de espera no cliente é de cinco segundos.

Antes de escalar anúncios, configure limitação de requisições no provedor de hospedagem ou proteção equivalente: o endpoint é público e a checagem de origem não é proteção contra bots. Defina responsáveis, prazo de retenção e rotina de exclusão na base. Esta implementação não fornece painel administrativo.

## Meta Pixel e UTMs

Configure NEXT_PUBLIC_META_PIXEL_ID. O Pixel só carrega após permissão para medição. A preferência fica em localStorage; apagar dados do site permite escolhê-la de novo. Sem permissão o diagnóstico funciona normalmente.

Eventos preparados: PageView, ViewContent, StartDiagnostic, DiagnosticStep (número da etapa), CompleteDiagnostic, Lead (conclusão válida do formulário, não garantia de persistência) e ContactWhatsApp. Os três eventos padrão usam `track`; os demais usam `trackCustom`. Não são enviados ao Meta nome, telefone, respostas, score ou classificação. Eventos anteriores à permissão não são reproduzidos retroativamente. Bloqueadores podem impedir a medição. Não há CAPI.

`utm_source`, `utm_medium`, `utm_campaign`, `utm_content` e `utm_term` são capturados e persistidos em sessionStorage, anexados ao lead quando há armazenamento. Ao clicar no WhatsApp a origem também fica em `jung-contact-origin` durante a sessão. Sem Supabase, esse registro não é durável. A origem não é incluída na mensagem comercial para manter a conversa legível.

## Rotas e SEO

- `/`: landing page e diagnóstico.
- `/diagnostico-rural`: redireciona para `/`.
- `/privacidade`: aviso básico, com link de contato para solicitações.

Title, description, canonical, Open Graph textual e favicon em `app/`. O dashboard tem dados fictícios claramente identificados. O símbolo oficial foi obtido no cabeçalho de grupojung.com.br e é usado no cabeçalho, no questionário, no rodapé e no favicon. A origem está em public/brand/README.md. Há ponto reservado no código para depoimentos reais futuros, sem provas sociais inventadas.

Antes da campanha, o escritório deve completar o aviso de privacidade com seus dados cadastrais, retenção e política oficial. Os textos não afirmam datas legais de prazo ou valores de imposto; a referência a abril é a mensagem comercial solicitada, não um prazo oficial de 2027.

## Publicar na Vercel

1. Importe `Dulokz/lp-ir2027-produtores` na Vercel.
2. Use o preset Next.js, com `npm run build` e configurações padrão de saída.
3. Configure as variáveis acima nos ambientes de produção/preview. Supabase e Pixel podem permanecer vazios.
4. Faça o deploy. Adicione `rural.grupojung.com.br` em Domains e aplique o registro DNS indicado pela Vercel.
5. Confirme NEXT_PUBLIC_SITE_URL e faça novo deploy ao alterar variáveis públicas.
6. Teste o WhatsApp, o cadastro e os eventos no Gerenciador de Eventos do Meta com consentimento concedido, antes de iniciar anúncios.

## Organização do projeto

- `app/page.tsx`: seções da landing page.
- `components/diagnostic.tsx`: questionário, formulário e resultado.
- `lib/diagnostic.ts`: perguntas, validação, pontuação e WhatsApp.
- `components/analytics.tsx`: consentimento, Pixel e UTMs.
- `app/api/leads/route.ts`: integração opcional no servidor.
- `app/globals.css`: identidade visual, layouts e breakpoints.
- `tests/diagnostic.test.ts`: testes de regras e serialização.

A interface respeita preferência por movimento reduzido, possui labels, foco visível, botão de voltar, controles semânticos e fontes de 16 px nos campos para evitar zoom automático em celulares. Sem imagens pesadas ou fontes remotas; a demonstração é construída em HTML/CSS, sem carregamentos externos obrigatórios.

## Experiência dedicada no celular

Ao começar, o diagnóstico abre em um `dialog` modal nativo em tela cheia. O fundo fica inerte, com a posição da página preservada e a rolagem bloqueada. Cabeçalho e botões de avançar/voltar permanecem visíveis. As atividades ficam em duas colunas para caberem sem rolagem nas telas de celular.

O resultado fecha o modo dedicado e libera a rolagem. O botão de sair e a tecla Escape permitem voltar à página sem perder as respostas durante a mesma visita. Em telas muito baixas, zoom de acessibilidade ou com teclado aberto, somente o conteúdo interno pode rolar para manter campos e opções acessíveis; a página de fundo permanece bloqueada. A altura se ajusta ao visualViewport e às áreas seguras do celular.
