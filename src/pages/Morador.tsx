"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { DollarSign, TrendingUp, FileText, Calendar, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Morador = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([
    { sender: "bot", text: "Olá! Sou o assistente do condomínio 🏢. Pergunte sobre gastos ou normas." },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const monthlyExpenses = [
    { category: "Limpeza", amount: "R$ 2.500,00", percentage: 25 },
    { category: "Segurança", amount: "R$ 4.200,00", percentage: 42 },
    { category: "Manutenção", amount: "R$ 1.800,00", percentage: 18 },
    { category: "Água/Luz", amount: "R$ 1.500,00", percentage: 15 },
  ];

  const recentTransactions = [
    { date: "15 Jan 2025", description: "Limpeza Geral", value: "R$ 2.500,00", type: "saída" },
    { date: "12 Jan 2025", description: "Manutenção Elevador", value: "R$ 1.800,00", type: "saída" },
    { date: "10 Jan 2025", description: "Taxa de Condomínio", value: "R$ 450,00", type: "entrada" },
    { date: "08 Jan 2025", description: "Segurança Mensal", value: "R$ 4.200,00", type: "saída" },
  ];


  // Simula resposta com animação de digitação
const typeBotResponse = (fullText: string) => {
  setIsTyping(true);

  // Cria a mensagem do bot vazia
  setMessages(prev => [...prev, { sender: "bot", text: "" }]);

  let index = 0;

  const interval = setInterval(() => {
    setMessages(prev => {
      const newPrev = [...prev];
      const last = newPrev[newPrev.length - 1];

      if (!last || last.sender !== "bot") {
        // Caso algo dê errado, garante que sempre existe
        newPrev.push({ sender: "bot", text: "" });
      }

      if (index < fullText.length) {
        newPrev[newPrev.length - 1].text += fullText[index];
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }

      return newPrev;
    });
  }, 30);
};



  // Respostas básicas do bot
  const handleBotResponse = (question: string) => {
    let answer = "Desculpe, não entendi sua pergunta.";

    if (question.toLowerCase().includes("seguranca")) {
      answer = "Os gastos com segurança em janeiro foram de R$ 4.200,00.";
    } else if (question.toLowerCase().includes("limpeza")) {
      answer = "Foram gastos R$ 2.500,00 com limpeza em janeiro.";
    } else if (question.toLowerCase().includes("norma")) {
      answer = "Normas principais: silêncio após 22h, uso de máscara em áreas comuns e reservas para salão de festas.";
    } else if (question.toLowerCase().includes("total")) {
      answer = "O total de gastos em janeiro foi de R$ 10.000,00.";
    }

    typeBotResponse(answer);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    handleBotResponse(input);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Portal do Morador</h1>
          <p className="text-muted-foreground">Acompanhe as finanças do seu condomínio</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sua Taxa Mensal</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">R$ 450,00</div>
              <p className="text-xs text-muted-foreground mt-1">
                Vencimento: 10/02/2025
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Gastos</CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">R$ 10.000,00</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1 text-red-500" />
                8% maior que mês anterior
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próxima Assembleia</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">25 Jan</div>
              <p className="text-xs text-muted-foreground mt-1">
                Aprovação de reformas
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Expense Breakdown */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Distribuição de Gastos - Janeiro 2025</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyExpenses.map((expense, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-foreground">{expense.category}</span>
                      <span className="text-sm font-bold text-foreground">{expense.amount}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${expense.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{expense.percentage}% do total</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Movimentações Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((transaction, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    </div>
                    <span
                      className={`font-bold text-sm ${
                        transaction.type === "entrada" ? "text-green-600" : "text-foreground"
                      }`}
                    >
                      {transaction.type === "entrada" ? "+" : "-"} {transaction.value}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-accent/20 rounded-lg border border-primary/20">
                <p className="text-sm text-foreground font-medium mb-2">💡 Transparência Total</p>
                <p className="text-xs text-muted-foreground">
                  Todos os gastos são aprovados em assembleia e auditados mensalmente. 
                  Você pode solicitar comprovantes de qualquer despesa a qualquer momento.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Chatbot flutuante */}
      <div className="fixed bottom-6 right-6">
        {chatOpen ? (
          <Card className="w-96 h-[440px] flex flex-col border-border shadow-xl">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="text-sm font-bold">Agente</CardTitle>
              <Button size="sm" variant="ghost" onClick={() => setChatOpen(false)}>X</Button>
            </CardHeader>
            <CardContent className="flex flex-col flex-1">
              <div className="flex-1 overflow-y-auto max-h-64 pr-2">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-lg ${
                      msg.sender === "user"
                        ? "bg-primary text-white self-end ml-auto max-w-[80%] my-1"
                        : "bg-secondary text-foreground self-start mr-auto max-w-[80%] my-1"
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
                {isTyping && (
                  <div className="p-2 rounded-lg bg-secondary text-foreground self-start mr-auto max-w-[80%] my-1">
                    <span className="animate-pulse">Digitando...</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-5">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Digite sua pergunta..."
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <Button onClick={handleSend} disabled={isTyping}>
                  Enviar
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Button
            className="rounded-full w-14 h-14 shadow-lg"
            onClick={() => setChatOpen(true)}
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Morador;
