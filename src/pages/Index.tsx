import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import FeatureCard from "@/components/FeatureCard";
import { ArrowRight, Users, FileCheck, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-condo.jpg";
import heroImage2 from "@/assets/hero-condo2.png";
import iconTransparency from "@/assets/icon-transparency.png";
import iconCommunity from "@/assets/icon-community.png";
import iconSecurity from "@/assets/icon-security.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                Transparência Total na Gestão do seu{" "}
                <span className="text-primary">Condomínio</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Acompanhe gastos, cotações e serviços em tempo real. 
                Uma plataforma completa para síndicos, moradores e fornecedores.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/sindico">
                    Começar Agora <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg">
                  Ver Demonstração
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src={heroImage2}
                alt="Gestão de Condomínio"
                className=""
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Por que escolher o Clique Sindico?
            </h2>
            <p className="text-xl text-muted-foreground">
              Gestão moderna e eficiente para o seu condomínio
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={iconTransparency}
              title="Transparência Total"
              description="Todos os gastos e cotações visíveis para moradores em tempo real. Sem surpresas no fim do mês."
            />
            <FeatureCard
              icon={iconCommunity}
              title="Gestão Colaborativa"
              description="Síndicos, moradores e fornecedores trabalhando juntos em uma única plataforma."
            />
            <FeatureCard
              icon={iconSecurity}
              title="Seguro e Confiável"
              description="Seus dados protegidos com tecnologia de ponta. Auditoria completa de todas as operações."
            />
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-border">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Síndico</h3>
              <p className="text-muted-foreground mb-6">
                Gerencie despesas, solicite cotações e mantenha tudo organizado em um só lugar.
              </p>
              <Button variant="outline" asChild className="w-full">
                <Link to="/sindico">Acessar Dashboard</Link>
              </Button>
            </div>

            <div className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-border">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <FileCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Morador</h3>
              <p className="text-muted-foreground mb-6">
                Acompanhe os gastos do condomínio e participe das decisões importantes.
              </p>
              <Button variant="outline" asChild className="w-full">
                <Link to="/morador">Ver Despesas</Link>
              </Button>
            </div>

            <div className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-border">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Fornecedor</h3>
              <p className="text-muted-foreground mb-6">
                Envie propostas e cotações diretamente para os condomínios interessados.
              </p>
              <Button variant="outline" asChild className="w-full">
                <Link to="/fornecedor">Enviar Proposta</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">
            © 2025 Clique Sindico. Gestão transparente e eficiente para condomínios.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
