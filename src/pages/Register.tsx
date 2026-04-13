import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Mail, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "@/services/api";
import { toast } from "sonner";

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  // 🔥 validações de senha
  const rules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const isValidPassword =
    rules.length && rules.uppercase && rules.number && rules.special;

  async function handleRegister(e) {
    e.preventDefault();

    if (!isValidPassword) {
      toast("Senha não atende os requisitos");
      return;
    }

    try {
      await api.post('/auth/register', {
        name,
        email,
        password,
      });

      toast('Conta criada com sucesso 🚀');
          navigate('/login');

    } catch (error) {
      toast(error.response?.data?.error || 'Erro no cadastro');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md border-border shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center">
            <img className="w-24" src="/logo.png" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Criar Conta
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Cadastre-se para acessar o sistema
          </p>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleRegister}>
            
            {/* Nome */}
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Seu nome"
                className="pl-10"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Seu e-mail"
                className="pl-10"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Senha */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Sua senha"
                className="pl-10"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* 🔥 Regras de senha */}
            <div className="text-sm space-y-1">
              <p className={rules.length ? "text-green-500" : "text-muted-foreground"}>
                ✔️ Mínimo 8 caracteres
              </p>
              <p className={rules.uppercase ? "text-green-500" : "text-muted-foreground"}>
                ✔️ Letra maiúscula
              </p>
              <p className={rules.number ? "text-green-500" : "text-muted-foreground"}>
                ✔️ Número
              </p>
              <p className={rules.special ? "text-green-500" : "text-muted-foreground"}>
                ✔️ Caractere especial
              </p>
            </div>

            {/* Botão */}
            <Button type="submit" className="w-full mt-2">
              Criar conta
            </Button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Já tem conta?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Fazer login
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;