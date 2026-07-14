import { Zap, Clock, AlertTriangle } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="glass-card p-10">
          <div className="w-20 h-20 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-surface-900 mb-3">
            Sistema em Manutenção
          </h1>
          <p className="text-surface-500 mb-6">
            O banco de dados está temporariamente indisponível.
            Isso acontece quando o projeto fica sem uso por um período.
          </p>
          <div className="bg-surface-100 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-surface-600 text-sm">
              <Clock className="w-4 h-4" />
              <span>Tente novamente em alguns minutos</span>
            </div>
          </div>
          <div className="space-y-2 text-sm text-surface-500">
            <p>O sistema será restaurado automaticamente.</p>
            <p>Se o problema persistir, entre em contato com o suporte.</p>
          </div>
          <div className="mt-6 pt-6 border-t border-surface-200">
            <div className="flex items-center justify-center gap-2 text-surface-400">
              <Zap className="w-4 h-4" />
              <span className="text-sm">Venda Inteligente AI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
