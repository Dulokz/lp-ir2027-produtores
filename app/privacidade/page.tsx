import type { Metadata } from "next";
import Link from "next/link";
import { whatsappUrl } from "@/lib/diagnostic";
export const metadata: Metadata = {
  title: "Privacidade | Grupo Jung",
  alternates: { canonical: "/privacidade" },
};
export default function Privacy() {
  return (
    <main className="privacy-page">
      <Link href="/">← Voltar ao diagnóstico</Link>
      <h1>Seus dados, com cuidado.</h1>
      <p>
        Este aviso explica o uso das informações no Diagnóstico Fiscal Rural
        2026 do Grupo Jung Contabilidade.
      </p>
      <h2>O que você informa</h2>
      <p>
        Nome, WhatsApp, município, estado e respostas sobre a organização da sua
        atividade rural. Utilizamos esses dados apenas para o diagnóstico e para
        contato sobre o diagnóstico e os serviços do Grupo Jung.
      </p>
      <h2>Como funciona</h2>
      <p>
        Suas respostas geram um índice orientativo. Quando o armazenamento
        estiver habilitado, as informações são encaminhadas à base de
        atendimento do Grupo Jung. Ao clicar no WhatsApp, seu nome, atividade,
        município e resultado compõem uma mensagem que você pode revisar antes
        de enviar. O WhatsApp aplica suas próprias condições de privacidade.
      </p>
      <h2>Origem da campanha e medição</h2>
      <p>
        Os parâmetros da campanha ficam guardados durante a sessão do navegador
        e podem acompanhar o cadastro, para identificar a origem do contato. A
        medição de eventos pelo Meta Pixel, quando configurada, só é ativada se
        você permitir. Não enviamos nome, telefone, respostas ou pontuação para
        o Pixel. Você pode apagar os dados do site no navegador para rever essa
        escolha.
      </p>
      <h2>Fale com o Grupo Jung</h2>
      <p>
        Para solicitar informações, correções ou exclusão de seus dados,{" "}
        <a
          href={whatsappUrl(
            "Olá! Gostaria de tratar uma solicitação sobre meus dados no Diagnóstico Fiscal Rural.",
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          entre em contato pelo WhatsApp
        </a>
        .
      </p>
      <p>
        Atualizado em 7 de setembro de 2026. Este aviso deve ser complementado
        pelo escritório com seus dados cadastrais, prazos de retenção e a
        política completa antes da campanha.
      </p>
    </main>
  );
}
