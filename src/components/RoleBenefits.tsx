import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, CheckCircle2, ClipboardList, FileSearch, Handshake, ShieldCheck, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type RoleKey = "morador" | "sindico" | "fornecedor";

const roleContent = {
  morador: {
    title: "Benefícios para Moradores",
    subtitle: "Acompanhe o condomínio com clareza antes de tomar decisões ou participar das assembleias.",
    cta: "Entrar como morador",
    highlights: [
      ["Transparência de gastos", "Veja despesas, receitas e movimentações do condomínio em um só lugar."],
      ["Escolha sua unidade", "Acesse dados vinculados ao seu condomínio e unidade depois do login."],
      ["Participação informada", "Entenda assembleias, manutenções e custos sem depender de planilhas soltas."],
    ],
    steps: ["Faça login", "Escolha condomínio e unidade", "Acompanhe os gastos"],
    icon: Users,
  },
  sindico: {
    title: "Benefícios para Síndicos",
    subtitle: "Controle despesas, cotações e prestação de contas com uma visão preparada para gestão.",
    cta: "Entrar como síndico",
    highlights: [
      ["Dashboard financeiro", "Acompanhe despesas do mês, orçamento, saldos e movimentações recentes."],
      ["Cotações organizadas", "Compare propostas e registre decisões com mais previsibilidade."],
      ["Prestação de contas", "Gere uma visão clara para moradores e assembleias."],
    ],
    steps: ["Faça login", "Aceite os termos LGPD", "Acesse o dashboard do síndico"],
    icon: BarChart3,
  },
  fornecedor: {
    title: "Benefícios para Fornecedores",
    subtitle: "Receba oportunidades, envie propostas e acompanhe retornos com mais organização.",
    cta: "Falar com o condomínio",
    highlights: [
      ["Oportunidades abertas", "Visualize demandas de serviços e cotações disponíveis."],
      ["Propostas estruturadas", "Envie valores, prazos e detalhes técnicos em um fluxo padronizado."],
      ["Histórico de negociações", "Acompanhe status de propostas aprovadas, pendentes ou em análise."],
    ],
    steps: ["Cadastre sua empresa", "Envie propostas", "Acompanhe aprovações"],
    icon: Handshake,
  },
} satisfies Record<RoleKey, {
  title: string;
  subtitle: string;
  cta: string;
  highlights: [string, string][];
  steps: string[];
  icon: typeof Users;
}>;

type RoleBenefitsProps = {
  role: RoleKey;
};

const RoleBenefits = ({ role }: RoleBenefitsProps) => {
  const content = roleContent[role];
  const HeroIcon = content.icon;
  const supportingIcons = [ShieldCheck, ClipboardList, FileSearch];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="border-b border-border bg-secondary/30">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground">
                <HeroIcon className="h-4 w-4 text-primary" />
                Portal {role === "sindico" ? "do síndico" : role === "morador" ? "do morador" : "do fornecedor"}
              </div>
              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl font-bold leading-tight text-foreground md:text-5xl">
                  {content.title}
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                  {content.subtitle}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link to={role === "fornecedor" ? "/login" : "/login"}>
                    {content.cta}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/">Voltar ao início</Link>
                </Button>
              </div>
            </div>

            <Card className="border-border shadow-lg">
              <CardContent className="space-y-5 p-6">
                {content.highlights.map(([title, description], index) => {
                  const ItemIcon = supportingIcons[index];
                  return (
                    <div key={title} className="flex gap-4 rounded-lg border border-border bg-background p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <ItemIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-foreground">{title}</h2>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            {content.steps.map((step, index) => (
              <div key={step} className="rounded-lg border border-border bg-card p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary">Etapa {index + 1}</span>
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <p className="font-medium text-foreground">{step}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default RoleBenefits;
