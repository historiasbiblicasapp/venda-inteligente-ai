'use client';

import { useState } from 'react';
import { Zap, Database, CheckCircle2, XCircle, Loader2, ArrowRight, Copy, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SetupPage() {
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'manual'>('idle');
  const [result, setResult] = useState<any>(null);

  const runMigration = async () => {
    setStatus('running');
    try {
      const res = await fetch('/api/setup/migrate', { method: 'POST' });
      const data = await res.json();
      setResult(data);
      if (data.success) {
        setStatus('success');
        toast.success('Banco de dados configurado!');
      } else {
        setStatus('manual');
      }
    } catch (e: any) {
      setStatus('manual');
      setResult({ error: e.message });
    }
  };

  const copySQL = () => {
    if (result?.sql) {
      navigator.clipboard.writeText(result.sql);
      toast.success('SQL copiado!');
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Zap className="w-12 h-12 text-brand-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-surface-900">Configuração Inicial</h1>
          <p className="text-surface-500 mt-2">Vamos configurar o banco de dados da plataforma</p>
        </div>

        <div className="glass-card p-8">
          {status === 'idle' && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto">
                <Database className="w-8 h-8 text-brand-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-surface-900">Banco de Dados</h2>
                <p className="text-surface-500 mt-1">
                  Clique no botão abaixo para criar todas as tabelas necessárias no Supabase.
                </p>
              </div>
              <button onClick={runMigration} className="btn-primary inline-flex items-center gap-2">
                <Database className="w-5 h-5" /> Configurar Banco de Dados
              </button>
            </div>
          )}

          {status === 'running' && (
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 text-brand-600 animate-spin mx-auto" />
              <p className="text-lg font-medium text-surface-900">Configurando banco de dados...</p>
              <p className="text-sm text-surface-500">Aguarde enquanto criamos as tabelas</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
              <h2 className="text-xl font-semibold text-surface-900">Configuração Concluída!</h2>
              <p className="text-surface-500">Todas as tabelas foram criadas com sucesso.</p>
              <a href="/register" className="btn-primary inline-flex items-center gap-2">
                Criar Minha Conta <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          )}

          {status === 'manual' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                <XCircle className="w-6 h-6 text-amber-600 shrink-0" />
                <div>
                  <p className="font-medium text-amber-800">Configuração manual necessária</p>
                  <p className="text-sm text-amber-700">
                    Execute o SQL manualmente no Supabase Dashboard.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={copySQL} className="btn-outline inline-flex items-center gap-2">
                  <Copy className="w-4 h-4" /> Copiar SQL
                </button>
                <a
                  href={`https://supabase.com/dashboard/project/${window.location.hostname === 'localhost' ? 'cdznlgccxmtowqnwcglh' : ''}/sql/new`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" /> Abrir SQL Editor
                </a>
              </div>

              <div className="bg-surface-100 rounded-xl p-4 max-h-64 overflow-auto">
                <pre className="text-xs text-surface-700 whitespace-pre-wrap">
                  {result?.sql || 'SQL não disponível'}
                </pre>
              </div>

              <div className="space-y-2 text-sm text-surface-600">
                <p className="font-medium">Passos:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Clique em &quot;Abrir SQL Editor&quot; ou acesse o dashboard do Supabase</li>
                  <li>Clique em &quot;New Query&quot;</li>
                  <li>Cole o SQL copiado (Ctrl+V)</li>
                  <li>Clique em &quot;Run&quot;</li>
                  <li>Volte aqui e clique em &quot;Configurar&quot; novamente</li>
                </ol>
              </div>

              <button onClick={runMigration} className="btn-outline w-full inline-flex items-center justify-center gap-2">
                <Database className="w-4 h-4" /> Tentar Novamente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
