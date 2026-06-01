import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import api from '@/services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email) {
      toast('Informe seu e-mail');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/auth/forgot-password', { email });
      setSuccessMessage(response.data.message);
      toast('Verifique seu e-mail ou o link de recuperação');
    } catch (error) {
      toast(error.response?.data?.error || 'Erro ao solicitar recuperação de senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md border-border shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Recuperar Senha</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Informe o e-mail cadastrado para receber o link de redefinição.
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="relative">
              <Input
                type="email"
                placeholder="Seu e-mail"
                className="pl-4"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar link'}
            </Button>
          </form>

          {successMessage && (
            <div className="mt-4 rounded-xl border border-green-300 bg-green-50 p-4 text-sm text-green-800">
              {successMessage}
            </div>
          )}

          <div className="mt-4 text-center text-sm text-muted-foreground">
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => navigate('/login')}
            >
              Voltar ao login
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
