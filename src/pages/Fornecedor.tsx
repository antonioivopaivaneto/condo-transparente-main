import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import { FileText, TrendingUp, CheckCircle, Clock } from "lucide-react";

const Fornecedor = () => {
  const activeQuotations = [
    {
      id: 1,
      title: "Pintura de Fachada",
      condo: "Residencial Jardim das Flores",
      deadline: "20 Jan 2025",
      proposals: 5,
    },
    {
      id: 2,
      title: "Manutenção de Elevadores",
      condo: "Edifício Central Plaza",
      deadline: "25 Jan 2025",
      proposals: 3,
    },
    {
      id: 3,
      title: "Reforma do Salão de Festas",
      condo: "Condomínio Vista Verde",
      deadline: "30 Jan 2025",
      proposals: 7,
    },
  ];

  const myProposals = [
    { service: "Limpeza de Piscina", status: "aprovada", value: "R$ 800,00" },
    { service: "Jardinagem", status: "pendente", value: "R$ 1.200,00" },
    { service: "Pintura", status: "em análise", value: "R$ 15.000,00" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aprovada":
        return "text-green-600 bg-green-50";
      case "pendente":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-blue-600 bg-blue-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "aprovada":
        return <CheckCircle className="h-4 w-4" />;
      case "pendente":
        return <Clock className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Portal do Fornecedor</h1>
          <p className="text-muted-foreground">Envie propostas e acompanhe suas cotações</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Propostas Enviadas</CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">24</div>
              <p className="text-xs text-muted-foreground mt-1">
                Este mês
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Aprovação</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">68%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Acima da média
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Serviços Concluídos</CardTitle>
              <CheckCircle className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">18</div>
              <p className="text-xs text-muted-foreground mt-1">
                100% de satisfação
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Active Quotations */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Cotações Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeQuotations.map((quotation) => (
                  <div key={quotation.id} className="p-4 rounded-lg bg-secondary/30 border border-border">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-foreground">{quotation.title}</p>
                        <p className="text-sm text-muted-foreground">{quotation.condo}</p>
                      </div>
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                        {quotation.proposals} propostas
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-muted-foreground">
                        Prazo: {quotation.deadline}
                      </span>
                      <Button size="sm" variant="outline">
                        Enviar Proposta
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* New Proposal Form */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Minhas Propostas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                {myProposals.map((proposal, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-accent/20 border border-border">
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">{proposal.service}</p>
                      <div className={`flex items-center gap-1 mt-1 text-xs px-2 py-1 rounded-full w-fit ${getStatusColor(proposal.status)}`}>
                        {getStatusIcon(proposal.status)}
                        <span className="capitalize">{proposal.status}</span>
                      </div>
                    </div>
                    <span className="font-bold text-foreground">{proposal.value}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm font-medium text-foreground mb-3">📊 Dicas para Propostas</p>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li>• Seja detalhado e transparente nos valores</li>
                  <li>• Inclua prazos realistas de execução</li>
                  <li>• Anexe certificações e referências</li>
                  <li>• Responda rápido às dúvidas dos síndicos</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Fornecedor;
