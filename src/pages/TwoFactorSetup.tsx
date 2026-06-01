import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';

const TwoFactorSetup = () => {
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      toast('Faça login antes de configurar 2FA');
      navigate('/login');
      return;
    }

    const fetchSetup = async () => {
      try {
        const response = await api.post('/auth/2fa/setup');
        setQrCode(response.data.qrCode);
        setSecret(response.data.secret);
      } catch (error) {
        toast(error.response?.data?.error || 'Erro ao iniciar configuração de 2FA');
      }
    };

    fetchSetup();
  }, [isAuthenticated, navigate]);

  const handleVerifySetup = async (event) => {
    event.preventDefault();
    if (!secret || !token) {
      toast('Informe o token e o secret');
      return;
    }

    try {
      setLoading(true);
      await api.post('/auth/2fa/verify-setup', { secret, token });
      toast('2FA ativado com sucesso');
      navigate('/morador');
    } catch (error) {
      toast(error.response?.data?.error || 'Erro ao ativar 2FA');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-2xl border-border shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Configurar Autenticação de Dois Fatores</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Escaneie o QR code pelo app autenticador e confirme com o código de 6 dígitos.
          </p>
        </CardHeader>
        <CardContent>
          {qrCode ? (
            <div className="space-y-6">
              <div className="text-center">
                <img src={qrCode} alt="QR Code 2FA" className="mx-auto mb-4 max-w-full" />
                <p className="text-sm text-muted-foreground">Se não conseguir ler, copie o código secreto abaixo.</p>
              </div>

              <div className="rounded-xl bg-secondary/50 p-4 border border-border text-sm">
                <p className="font-medium text-foreground">Secret 2FA</p>
                <p className="break-all mt-2 text-sm text-muted-foreground">{secret}</p>
              </div>

              <form className="space-y-4" onSubmit={handleVerifySetup}>
                <div>
                  <label className="block text-sm font-medium text-foreground">Código TOTP</label>
                  <input
                    type="text"
                    value={token}
                    onChange={(event) => setToken(event.target.value)}
                    placeholder="000000"
                    className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Ativando...' : 'Ativar 2FA'}
                </Button>
              </form>
            </div>
          ) : (
            <p className="text-center text-muted-foreground">Carregando configuração de 2FA...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TwoFactorSetup;
