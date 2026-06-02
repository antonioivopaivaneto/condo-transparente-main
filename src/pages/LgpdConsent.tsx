import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, FileText, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const REQUIRED_LGPD_TERMS = [
  {
    type: 'authentication',
    version: '1.0',
    title: 'Autenticação e segurança',
    purpose: 'Autenticar seu acesso, proteger sua conta, registrar eventos de segurança e prevenir uso indevido do portal.'
  },
  {
    type: 'condominium_operations',
    version: '1.0',
    title: 'Operação do condomínio',
    purpose: 'Usar seus dados cadastrais para liberar funcionalidades, identificar seu perfil e operar serviços do condomínio.'
  },
  {
    type: 'communications',
    version: '1.0',
    title: 'Comunicações necessárias',
    purpose: 'Enviar avisos transacionais, notificações de conta, recuperação de senha, alertas de segurança e comunicados operacionais.'
  }
];

type ConsentRecord = {
  type: string;
  version: string;
  accepted: boolean;
  revokedAt: string | null;
};

const LgpdConsent = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const redirectTo = useMemo(() => {
    const redirect = searchParams.get('redirect');
    return redirect && redirect.startsWith('/') ? redirect : '/morador';
  }, [searchParams]);

  const hasAllRequiredConsents = (consents: ConsentRecord[]) => {
    return REQUIRED_LGPD_TERMS.every((term) =>
      consents.some(
        (consent) =>
          consent.type === term.type &&
          consent.version === term.version &&
          consent.accepted &&
          !consent.revokedAt
      )
    );
  };

  useEffect(() => {
    const verifyConsents = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const response = await api.get('/auth/consents');

        if (hasAllRequiredConsents(response.data.consents || [])) {
          navigate(redirectTo, { replace: true });
        }
      } catch (error: any) {
        toast({
          title: 'Erro ao verificar consentimentos',
          description: error.response?.data?.error || 'Não foi possível carregar os termos.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    verifyConsents();
  }, [token, navigate, redirectTo, toast]);

  const handleAcceptTerms = async () => {
    if (!accepted) {
      toast({
        title: 'Aceite obrigatório',
        description: 'Confirme que você leu e aceita os termos necessários para continuar.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSaving(true);

      await Promise.all(
        REQUIRED_LGPD_TERMS.map((term) =>
          api.post('/auth/consent', {
            type: term.type,
            purpose: term.purpose,
            version: term.version,
            accepted: true,
          })
        )
      );

      toast({
        title: 'Termos aceitos',
        description: 'Seu aceite LGPD foi registrado com finalidade, versão e data.',
      });

      navigate(redirectTo, { replace: true });
    } catch (error: any) {
      toast({
        title: 'Erro ao registrar aceite',
        description: error.response?.data?.error || 'Não foi possível registrar seu aceite.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verificando termos LGPD...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <Card className="border-border shadow-lg">
          <CardHeader>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold">Termos e Privacidade LGPD</CardTitle>
            <CardDescription>
              Para acessar o portal, registre seu aceite dos tratamentos necessários abaixo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-3">
              {REQUIRED_LGPD_TERMS.map((term) => (
                <div key={`${term.type}:${term.version}`} className="rounded-lg border p-4">
                  <div className="flex items-start gap-3">
                    <FileText className="mt-1 h-4 w-4 text-primary" />
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">{term.title}</p>
                        <span className="rounded border px-2 py-0.5 text-xs text-muted-foreground">
                          versão {term.version}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{term.purpose}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-lg border bg-secondary/40 p-4">
              <label className="flex items-start gap-3 text-sm">
                <Checkbox
                  checked={accepted}
                  onCheckedChange={(checked) => setAccepted(checked === true)}
                  disabled={saving}
                />
                <span>
                  Li e aceito explicitamente os termos necessários de tratamento de dados para usar o portal.
                </span>
              </label>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={saving}
                onClick={() => {
                  logout();
                  navigate('/login', { replace: true });
                }}
              >
                Sair
              </Button>
              <Button type="button" disabled={saving || !accepted} onClick={handleAcceptTerms}>
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                )}
                Aceitar e continuar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LgpdConsent;
