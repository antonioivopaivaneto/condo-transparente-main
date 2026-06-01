import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import api from '@/services/api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      if (!token) return;
      try {
        const response = await api.get(`/auth/reset-password/${token}/validate`);
        setTokenValid(true);
        setMessage(response.data.message);
      } catch (error) {
        setTokenValid(false);
        setMessage(error.response?.data?.error || 'Token inválido ou expirado');
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!token) {
      toast('Token de redefinição não encontrado');
      return;
    }
    if (!password || !passwordConfirm) {
      toast('Preencha as duas senhas');
      return;
    }
    if (password !== passwordConfirm) {
      toast('As senhas não coincidem');
      return;
    }

    try {
      setLoading(true);
      await api.post(`/auth/reset-password/${token}`, {
        password,
        passwordConfirm
      });
      toast('Senha atualizada com sucesso');
      navigate('/login');
    } catch (error) {
      toast(error.response?.data?.error || 'Erro ao redefinir senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md border-border shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Redefinir Senha</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            {tokenValid ? 'Defina sua nova senha abaixo.' : 'Validação de token em andamento...'}
          </p>
        </CardHeader>
        <CardContent>
          {message && (
            <div className="mb-4 rounded-xl border border-border p-4 text-sm text-muted-foreground">
              {message}
            </div>
          )}

          {tokenValid ? (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="relative">
                <Input
                  type="password"
                  placeholder="Nova senha"
                  className="pl-4"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
              <div className="relative">
                <Input
                  type="password"
                  placeholder="Confirme a nova senha"
                  className="pl-4"
                  value={passwordConfirm}
                  onChange={(event) => setPasswordConfirm(event.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Redefinindo...' : 'Redefinir senha'}
              </Button>
            </form>
          ) : (
            <div className="text-center text-muted-foreground">
              <p>O link de redefinição não é válido ou expirou.</p>
              <Button variant="outline" className="mt-4" onClick={() => navigate('/forgot-password')}>
                Solicitar novo link
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
