import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Mail, UserCircle2, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'sindico' | 'morador'>('morador');
  const navigate = useNavigate();
  const { login, setTempToken, setRole } = useAuth();

  async function handleLogin(e) {
    e.preventDefault();

    if (!email || !password) {
      toast('Preencha e-mail e senha');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      if (response.data.requiresTwoFactor) {
        setTempToken(response.data.tempToken);
        setRole(selectedRole);
        toast('Autenticação parcialmente concluída. Insira o código 2FA.');
        navigate('/2fa-verify');
        return;
      }

      login(response.data.token, selectedRole);
      toast('Login realizado com sucesso 🚀');
      navigate(selectedRole === 'sindico' ? '/sindico' : '/morador');
    } catch (error) {
      toast(error.response?.data?.error || 'Erro no login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md border-border shadow-lg">
        <CardHeader className="text-center">
           <div className=" rounded-lg p-2 flex items-center justify-center ">
              <img  className="w-24 " src="../../public/logo.png"/>
            </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Portal do {selectedRole === 'sindico' ? 'Síndico' : 'Morador'}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Faça login para acessar sua visão de {selectedRole === 'sindico' ? 'síndico' : 'morador'}
          </p>
        </CardHeader>

        <CardContent>
          <form className="space-y-4"  onSubmit={handleLogin}>
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                value={email}
                placeholder="Seu e-mail"
                className="pl-10"
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Senha */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                value={password}
                placeholder="Sua senha"
                className="pl-10"
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Botão */}
            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
           
          </form>

          <div className="mt-6 rounded-2xl border border-border bg-secondary/50 p-4">
            <p className="text-sm font-semibold text-foreground mb-3">Entrar como</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  selectedRole === 'morador'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-background text-foreground'
                }`}
                onClick={() => setSelectedRole('morador')}
              >
                <div className="flex items-center justify-center gap-2">
                  <Users className="h-4 w-4" />
                  Morador
                </div>
              </button>
              <button
                type="button"
                className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  selectedRole === 'sindico'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-background text-foreground'
                }`}
                onClick={() => setSelectedRole('sindico')}
              >
                <div className="flex items-center justify-center gap-2">
                  <UserCircle2 className="h-4 w-4" />
                  Síndico
                </div>
              </button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Selecione o perfil que você deseja acessar.
            </p>
          </div>

          <div className="mt-6 text-center space-y-2">
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Esqueceu sua senha?
            </Link>
            <Link
              to="/2fa-verify"
              className="block text-sm text-primary hover:underline"
            >
              Já tenho autenticação 2FA
            </Link>
            <Link
              to="/2fa-setup"
              className="block text-sm text-primary hover:underline"
            >
              Quero ativar a autenticação de dois fatores
            </Link>
            <p className="text-xs text-muted-foreground">
              Não possui conta? <Link to="/register" className="text-primary hover:underline">Cadastre-se</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
