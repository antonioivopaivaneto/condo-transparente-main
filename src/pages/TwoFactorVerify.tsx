import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';

const TwoFactorVerify = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { tempToken, login, logout, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!tempToken) {
      toast('É necessário fazer login primeiro');
      navigate('/login');
    }
  }, [tempToken, navigate]);

  const handleVerify = async (event) => {
    event.preventDefault();

    if (!code || code.length < 6) {
      toast('Informe o código de 6 dígitos');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post(
        '/auth/login/2fa',
        { token: code },
        {
          headers: {
            Authorization: `Bearer ${tempToken}`,
          },
        }
      );

      login(response.data.token, role);
      toast('2FA validado com sucesso!');
      navigate(role === 'sindico' ? '/sindico' : '/morador');
    } catch (error) {
      toast(error.response?.data?.error || 'Erro ao validar 2FA');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-lg border-border shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Verificação de Dois Fatores (2FA)</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Insira o código de 6 dígitos do aplicativo autenticador.
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleVerify}>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Código TOTP</label>
              <Input
                type="text"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="000000"
                maxLength={6}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Validando...' : 'Validar código'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>Se você não recebeu o código, faça login novamente.</p>
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              Voltar ao login
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TwoFactorVerify;
