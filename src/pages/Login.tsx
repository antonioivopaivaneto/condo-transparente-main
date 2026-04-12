import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {  Lock, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import api from "@/services/api";

const Login = () => {

    const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    console.log('Tentando logar com:', { email, password });

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', response.data.token);
      alert('Login realizado com sucesso 🚀');

    } catch (error) {
      alert(error.response?.data?.error || 'Erro no login');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md border-border shadow-lg">
        <CardHeader className="text-center">
           <div className=" rounded-lg p-2 flex flex items-center justify-center ">
              <img  className="w-24 " src="../../public/logo.png"/>
            </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Portal do Morador
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Faça login para acessar suas informações
          </p>
        </CardHeader>

        <CardContent>
          <form className="space-y-4"  onSubmit={handleLogin}>
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

            {/* Botão */}
            <Button type="submit" className="w-full mt-2">
              Entrar
            </Button>
           
          </form>

          {/* Links extras */}
          <div className="mt-6 text-center space-y-2">
            <a
              href="#"
              className="text-sm text-primary hover:underline"
            >
              Esqueceu sua senha?
            </a>
            <p className="text-xs text-muted-foreground">
              Não possui conta? <a href="#" className="text-primary hover:underline">Cadastre-se</a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
