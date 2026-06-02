import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Lock, Mail, ShieldCheck, UserCircle2, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"sindico" | "morador">("morador");
  const navigate = useNavigate();
  const { login, setTempToken, setRole } = useAuth();

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email || !password) {
      toast("Preencha e-mail e senha");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const userRole = response.data.role || selectedRole;

      if (response.data.requiresTwoFactor) {
        setTempToken(response.data.tempToken);
        setRole(userRole);
        toast("Código 2FA necessário para concluir o acesso.");
        navigate("/2fa-verify");
        return;
      }

      login(response.data.token, userRole);
      toast("Login validado. Continuando...");
      const redirectPath = userRole === "sindico" ? "/sindico" : "/escolherUnidade";
      navigate(`/lgpd-consent?redirect=${encodeURIComponent(redirectPath)}`);
    } catch (error: any) {
      toast(error.response?.data?.error || "Erro no login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-[1fr_520px]">
        <section className="hidden bg-secondary/40 px-10 py-12 lg:flex lg:flex-col lg:justify-between">
          <Link to="/" className="inline-flex items-center">
            <img className="w-28" src="/logo.png" alt="Logo" />
          </Link>

          <div className="max-w-xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Acesso seguro ao portal
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl font-bold leading-tight text-foreground">
                Gestão transparente para quem vive o condomínio.
              </h1>
              <p className="text-lg leading-8 text-muted-foreground">
                Entre para acompanhar gastos, unidades, consentimentos LGPD e segurança da sua conta.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm text-muted-foreground">
            <div className="rounded-lg border border-border bg-card p-4">
              <Building2 className="mb-3 h-5 w-5 text-primary" />
              Condomínios
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <Users className="mb-3 h-5 w-5 text-primary" />
              Moradores
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <ShieldCheck className="mb-3 h-5 w-5 text-primary" />
              LGPD e 2FA
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-8">
          <Card className="w-full max-w-md border-border shadow-lg">
            <CardContent className="p-6 sm:p-8">
              <div className="mb-8 text-center">
                <Link to="/" className="mb-4 inline-flex justify-center lg:hidden">
                  <img className="w-24" src="/logo.png" alt="Logo" />
                </Link>
                <h2 className="text-2xl font-bold text-foreground">
                  Entrar no portal
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Se sua conta tiver 2FA ativo, pediremos o código automaticamente.
                </p>
              </div>

              <div className="mb-5 grid grid-cols-2 gap-2 rounded-lg border border-border bg-secondary/40 p-1">
                <button
                  type="button"
                  className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
                    selectedRole === "morador"
                      ? "bg-card text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setSelectedRole("morador")}
                >
                  <Users className="h-4 w-4" />
                  Morador
                </button>
                <button
                  type="button"
                  className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
                    selectedRole === "sindico"
                      ? "bg-card text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setSelectedRole("sindico")}
                >
                  <UserCircle2 className="h-4 w-4" />
                  Síndico
                </button>
              </div>

              <form className="space-y-4" onSubmit={handleLogin}>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    placeholder="Seu e-mail"
                    className="pl-10"
                    onChange={(event) => setEmail(event.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    value={password}
                    placeholder="Sua senha"
                    className="pl-10"
                    onChange={(event) => setPassword(event.target.value)}
                    disabled={loading}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
              </form>

              <div className="mt-6 space-y-3 text-center text-sm">
                <Link to="/forgot-password" className="block text-primary hover:underline">
                  Esqueceu sua senha?
                </Link>
                <p className="text-xs text-muted-foreground">
                  Não possui conta?{" "}
                  <Link to="/register" className="text-primary hover:underline">
                    Cadastre-se
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Login;
