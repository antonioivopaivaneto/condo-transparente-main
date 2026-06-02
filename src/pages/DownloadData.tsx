import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/services/api';

type DownloadStatus = 'loading' | 'success' | 'error';

const getFilename = (contentDisposition?: string) => {
  const match = contentDisposition?.match(/filename="?([^"]+)"?/i);
  return match?.[1] || 'meus-dados.json';
};

const DownloadData = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<DownloadStatus>('loading');
  const [message, setMessage] = useState('Preparando o download dos seus dados...');

  const downloadData = async () => {
    if (!token) {
      setStatus('error');
      setMessage('Token de exportação não encontrado.');
      return;
    }

    try {
      setStatus('loading');
      setMessage('Preparando o download dos seus dados...');

      const response = await api.get(`/auth/download-data/${token}`, {
        responseType: 'blob',
      });

      const filename = getFilename(response.headers['content-disposition']);
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setStatus('success');
      setMessage('Download iniciado. Este link não poderá ser usado novamente.');
    } catch (error: any) {
      const blob = error.response?.data;
      let errorMessage = 'Não foi possível baixar seus dados.';

      if (blob instanceof Blob) {
        try {
          const text = await blob.text();
          errorMessage = JSON.parse(text).error || errorMessage;
        } catch {
          errorMessage = 'Não foi possível interpretar a resposta do servidor.';
        }
      }

      setStatus('error');
      setMessage(errorMessage);
    }
  };

  useEffect(() => {
    downloadData();
  }, [token]);

  const Icon = status === 'loading' ? Loader2 : status === 'success' ? CheckCircle2 : AlertCircle;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md border-border shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
            <Icon className={`h-6 w-6 ${status === 'loading' ? 'animate-spin' : ''}`} />
          </div>
          <CardTitle className="text-2xl font-bold">Exportação de Dados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">{message}</p>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            {status === 'error' && (
              <Button type="button" onClick={downloadData}>
                <Download className="mr-2 h-4 w-4" />
                Tentar novamente
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => navigate('/login')}>
              Voltar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DownloadData;
