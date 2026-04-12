import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { TrendingUp, TrendingDown, DollarSign, FileText, Users, Plus } from "lucide-react";

const Sindico = () => {
  const expenses = [
    { name: "Limpeza", value: "R$ 2.500,00", status: "pago" },
    { name: "Manutenção Elevador", value: "R$ 1.800,00", status: "pendente" },
    { name: "Segurança", value: "R$ 4.200,00", status: "pago" },
  ];

  const quotations = [
    { service: "Pintura Fachada", proposals: 3, lowest: "R$ 15.000,00" },
    { service: "Reforma Salão", proposals: 5, lowest: "R$ 8.500,00" },
  ];

   // Plano de contas simples
  const budgetPlan = [
    { account: "Limpeza", allocated: 3000, spent: 2500 },
    { account: "Manutenção", allocated: 5000, spent: 1800 },
    { account: "Segurança", allocated: 4500, spent: 4200 },
    { account: "Água e Luz", allocated: 2000, spent: 1500 },
  ];
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard do Síndico</h1>
          <p className="text-muted-foreground">Gerencie todas as operações do condomínio</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Despesas do Mês</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">R$ 18.500</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingDown className="h-3 w-3 mr-1 text-green-500" />
                12% menor que o mês anterior
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cotações Abertas</CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">8</div>
              <p className="text-xs text-muted-foreground mt-1">
                23 propostas recebidas
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Moradores Ativos</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">142</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1 text-primary" />
                98% de engajamento
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Economia Anual</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">R$ 24.300</div>
              <p className="text-xs text-muted-foreground mt-1">
                Com cotações competitivas
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Expenses */}
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Despesas Recentes</CardTitle>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Nova Despesa
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenses.map((expense, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border">
                    <div>
                      <p className="font-medium text-foreground">{expense.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {expense.status === "pago" ? "✓ Pago" : "⏳ Pendente"}
                      </p>
                    </div>
                    <span className="font-bold text-foreground">{expense.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Quotations */}
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Cotações Ativas</CardTitle>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Nova Cotação
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quotations.map((quotation, index) => (
                  <div key={index} className="p-4 rounded-lg bg-accent/30 border border-border">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-foreground">{quotation.service}</p>
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                        {quotation.proposals} propostas
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Menor valor:</span>
                      <span className="font-bold text-primary">{quotation.lowest}</span>
                    </div>
                    <Button variant="link" className="p-0 h-auto mt-2 text-primary">
                      Ver todas as propostas →
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>


          
        </div>

        {/* Gestão Orçamentária */}
        <Card className="border-border mb-8 mt-10">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Gestão Orçamentária Mês 10</CardTitle>
            <Button size="sm">
              Gerar Apresentação
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left border border-border rounded-lg">
                <thead>
                  <tr className="bg-secondary">
                    <th className="px-4 py-2">Plano de Contas</th>
                    <th className="px-4 py-2">Valor Alocado</th>
                    <th className="px-4 py-2">Valor Gasto</th>
                    <th className="px-4 py-2">Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {budgetPlan.map((item, idx) => (
                    <tr key={idx} className="border-t border-border">
                      <td className="px-4 py-2">{item.account}</td>
                      <td className="px-4 py-2">R$ {item.allocated}</td>
                      <td className="px-4 py-2">R$ {item.spent}</td>
                      <td className="px-4 py-2 font-bold">R$ {item.allocated - item.spent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Sindico;
