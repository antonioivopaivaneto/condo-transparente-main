import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, Trash2, ArrowLeft, Loader2, CheckCircle2, XCircle, KeyRound } from 'lucide-react';

const CONSENT_OPTIONS = [
  {
    type: 'authentication',
    version: '1.0',
    title: 'Autenticação e segurança',
    purpose: 'Autenticar o usuário, proteger a conta, registrar acessos e aplicar controles de segurança.'
  },
  {
    type: 'condominium_operations',
    version: '1.0',
    title: 'Operação do condomínio',
    purpose: 'Tratar dados necessários para acesso às funcionalidades do portal do condomínio.'
  },
  {
    type: 'communications',
    version: '1.0',
    title: 'Comunicações do sistema',
    purpose: 'Enviar avisos operacionais, mensagens transacionais e notificações relacionadas à conta.'
  }
];

interface UserData {
  profile: {
    id: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    twoFactorEnabled: boolean;
  };
  security: {
    failedAttempts: number;
    lockUntil: string | null;
    lastFailedLoginAt: string | null;
  };
  consents: Array<{
    id: number;
    type: string;
    purpose: string;
    version: string;
    accepted: boolean;
    acceptedAt: string;
    revokedAt: string | null;
    createdAt?: string;
  }>;
}

export const MyData = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const { toast } = useToast();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [consentLoading, setConsentLoading] = useState<string | null>(null);
  const [consentChecks, setConsentChecks] = useState<Record<string, boolean>>({});
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Verificar autenticação
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    fetchUserData();
  }, [token, navigate]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/my-data');
      setUserData(response.data.data);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar dados',
        description: error.response?.data?.error || 'Erro ao buscar dados pessoais',
        variant: 'destructive',
      });
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      setExporting(true);
      const response = await api.post('/auth/export-data');

      toast({
        title: 'Dados exportados com sucesso',
        description: 'Um link de download foi gerado e aberto em uma nova aba',
      });

      // Abrir o link em uma nova aba se disponível
      if (response.data.downloadUrl) {
        window.open(response.data.downloadUrl, '_blank');
      }
    } catch (error: any) {
      toast({
        title: 'Erro ao exportar dados',
        description: error.response?.data?.error || 'Erro ao exportar dados pessoais',
        variant: 'destructive',
      });
    } finally {
      setExporting(false);
    }
  };

  const getLatestConsent = (type: string, version: string) => {
    return userData?.consents.find(
      (consent) => consent.type === type && consent.version === version
    );
  };

  const isConsentActive = (type: string, version: string) => {
    const consent = getLatestConsent(type, version);
    return Boolean(consent?.accepted && !consent.revokedAt);
  };

  const formatDateTime = (value?: string | null) => {
    if (!value) return 'Não registrado';
    return new Date(value).toLocaleString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleGiveConsent = async (option: typeof CONSENT_OPTIONS[number]) => {
    const key = `${option.type}:${option.version}`;
    if (!consentChecks[key]) {
      toast({
        title: 'Confirmação obrigatória',
        description: 'Marque a confirmação para registrar o consentimento explícito.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setConsentLoading(key);
      await api.post('/auth/consent', {
        type: option.type,
        purpose: option.purpose,
        version: option.version,
        accepted: true,
      });

      toast({
        title: 'Consentimento registrado',
        description: 'Finalidade, versão e data foram registradas.',
      });

      setConsentChecks((current) => ({ ...current, [key]: false }));
      await fetchUserData();
    } catch (error: any) {
      toast({
        title: 'Erro ao registrar consentimento',
        description: error.response?.data?.error || 'Não foi possível registrar o consentimento.',
        variant: 'destructive',
      });
    } finally {
      setConsentLoading(null);
    }
  };

  const handleRevokeConsent = async (consentId: number) => {
    try {
      setConsentLoading(`revoke:${consentId}`);
      await api.post(`/auth/consent/${consentId}/revoke`);

      toast({
        title: 'Consentimento revogado',
        description: 'A revogação foi registrada com data e hora.',
      });

      await fetchUserData();
    } catch (error: any) {
      toast({
        title: 'Erro ao revogar consentimento',
        description: error.response?.data?.error || 'Não foi possível revogar o consentimento.',
        variant: 'destructive',
      });
    } finally {
      setConsentLoading(null);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast({
        title: 'Senha obrigatória',
        description: 'Digite sua senha para confirmar a exclusão da conta',
        variant: 'destructive',
      });
      return;
    }

    try {
      setDeleting(true);
      const response = await api.post('/auth/delete-account', {
        password: deletePassword,
      });

      toast({
        title: 'Solicitação enviada',
        description: response.data.instruction || 'Verifique seu email para confirmar a exclusão',
      });

      setShowDeleteConfirm(false);
      setDeletePassword('');

      // Fazer logout após 2 segundos
      setTimeout(() => {
        logout();
        navigate('/');
      }, 2000);
    } catch (error: any) {
      toast({
        title: 'Erro ao solicitar exclusão',
        description: error.response?.data?.error || 'Erro ao deletar conta',
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Erro ao carregar dados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Não foi possível carregar seus dados. Tente novamente.
            </p>
            <Button onClick={() => navigate('/')}>Voltar</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header com voltar */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Meus Dados</h1>
        </div>

        {/* Dados Pessoais */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Seus dados cadastrais no sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-base font-medium">{userData.profile.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">ID do Usuário</label>
                <p className="text-xs font-medium font-mono">{userData.profile.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Data de Cadastro</label>
                <p className="text-base font-medium">
                  {new Date(userData.profile.createdAt).toLocaleDateString('pt-BR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Autenticação 2FA</label>
                <p className="text-base font-medium">
                  {userData.profile.twoFactorEnabled ? '✅ Ativado' : '❌ Desativado'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Segurança</CardTitle>
            <CardDescription>Informações de segurança da sua conta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Tentativas falhadas
                </label>
                <p className="text-base font-medium">{userData.security.failedAttempts}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Última tentativa falha</label>
                <p className="text-base font-medium">
                  {userData.security.lastFailedLoginAt
                    ? new Date(userData.security.lastFailedLoginAt).toLocaleDateString('pt-BR')
                    : 'Nenhuma'}
                </p>
              </div>
            </div>
            {userData.security.lockUntil && new Date(userData.security.lockUntil) > new Date() && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded">
                <p className="text-sm text-destructive">
                  ⚠️ Sua conta está bloqueada até{' '}
                  {new Date(userData.security.lockUntil).toLocaleTimeString('pt-BR')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Autenticação em Dois Fatores</CardTitle>
            <CardDescription>Adicione uma camada extra de segurança ao login</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 rounded-lg border border-border p-4 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {userData.profile.twoFactorEnabled ? '2FA ativo' : '2FA desativado'}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {userData.profile.twoFactorEnabled
                      ? 'Seu próximo login exigirá o código do aplicativo autenticador automaticamente.'
                      : 'Ative para exigir um código do aplicativo autenticador no próximo login.'}
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant={userData.profile.twoFactorEnabled ? 'outline' : 'default'}
                disabled={userData.profile.twoFactorEnabled}
                onClick={() => navigate('/2fa-setup')}
              >
                {userData.profile.twoFactorEnabled ? 'Ativado' : 'Ativar 2FA'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Consentimentos */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Consentimentos</CardTitle>
            <CardDescription>Registro explícito por finalidade, versão e data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {CONSENT_OPTIONS.map((option) => {
              const key = `${option.type}:${option.version}`;
              const consent = getLatestConsent(option.type, option.version);
              const active = isConsentActive(option.type, option.version);
              const loadingConsent = consentLoading === key || consentLoading === `revoke:${consent?.id}`;

              return (
                <div key={key} className="rounded-lg border p-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {active ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground" />
                        )}
                        <p className="font-medium">{option.title}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{option.purpose}</p>
                      <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground sm:grid-cols-3">
                        <span>Versão: {option.version}</span>
                        <span>Aceite: {formatDateTime(consent?.acceptedAt)}</span>
                        <span>Revogação: {formatDateTime(consent?.revokedAt)}</span>
                      </div>
                    </div>

                    <div className="md:min-w-48">
                      {active && consent ? (
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          disabled={loadingConsent}
                          onClick={() => handleRevokeConsent(consent.id)}
                        >
                          {loadingConsent ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : null}
                          Revogar
                        </Button>
                      ) : (
                        <div className="space-y-3">
                          <label className="flex items-start gap-2 text-sm">
                            <Checkbox
                              checked={Boolean(consentChecks[key])}
                              onCheckedChange={(checked) =>
                                setConsentChecks((current) => ({
                                  ...current,
                                  [key]: checked === true,
                                }))
                              }
                            />
                            <span>Li a finalidade e consinto explicitamente.</span>
                          </label>
                          <Button
                            type="button"
                            className="w-full"
                            disabled={loadingConsent || !consentChecks[key]}
                            onClick={() => handleGiveConsent(option)}
                          >
                            {loadingConsent ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            Consentir
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Ações de Dados */}
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader>
            <CardTitle className="text-orange-900">Gerenciar Dados Pessoais</CardTitle>
            <CardDescription className="text-orange-800">
              De acordo com a LGPD, você tem direito de acessar, exportar e deletar seus dados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Botão Exportar */}
            <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
              <div>
                <p className="font-medium">Exportar Meus Dados</p>
                <p className="text-sm text-muted-foreground">
                  Baixe uma cópia de todos seus dados pessoais em formato JSON
                </p>
              </div>
              <Button
                onClick={handleExportData}
                disabled={exporting}
                variant="outline"
                className="ml-4 whitespace-nowrap"
              >
                {exporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Exportando...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </>
                )}
              </Button>
            </div>

            {/* Botão Deletar */}
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50/50">
              <div>
                <p className="font-medium text-red-900">Deletar Minha Conta</p>
                <p className="text-sm text-red-800">
                  Remove permanentemente todos seus dados pessoais do sistema
                </p>
              </div>

              <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="ml-4 whitespace-nowrap">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Deletar Conta
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent className="max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-600">
                      ⚠️ Deletar Conta Permanentemente
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-3 pt-4">
                      <p>
                        Esta ação é <strong>irreversível</strong> e resultará em:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Exclusão permanente de todos seus dados pessoais</li>
                        <li>Encerramento de sua conta</li>
                        <li>Perda de acesso a todos os serviços</li>
                      </ul>
                      <p className="pt-4">
                        Para confirmar, digite sua senha:
                      </p>
                      <Input
                        type="password"
                        placeholder="Digite sua senha"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        disabled={deleting}
                      />
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <div className="flex gap-3 justify-end pt-4">
                    <AlertDialogCancel disabled={deleting}>
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      disabled={deleting || !deletePassword}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {deleting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Deletando...
                        </>
                      ) : (
                        'Deletar Permanentemente'
                      )}
                    </AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <p className="text-xs text-muted-foreground pt-2">
              💡 Dica: Você também pode exportar seus dados antes de deletar sua conta
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyData;
