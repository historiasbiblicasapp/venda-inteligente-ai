'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Settings, User, Bell, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || '');
        setFullName(user.user_metadata?.full_name || '');
      }
    };
    getUser();
  }, [supabase]);

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName },
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Perfil atualizado!');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 flex items-center gap-2">
          <Settings className="w-7 h-7 text-brand-600" /> Configurações
        </h1>
        <p className="text-surface-500">Gerencie sua conta e preferências</p>
      </div>

      <div className="glass-card p-6 space-y-5">
        <h3 className="font-semibold text-surface-900 flex items-center gap-2">
          <User className="w-5 h-5" /> Perfil
        </h3>
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1">Nome</label>
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1">E-mail</label>
          <input type="email" value={email} disabled className="input-field opacity-60" />
          <p className="text-xs text-surface-500 mt-1">O e-mail não pode ser alterado</p>
        </div>
        <button onClick={handleSave} disabled={loading} className="btn-primary inline-flex items-center gap-2">
          <Save className="w-4 h-4" /> {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>

      <div className="glass-card p-6">
        <h3 className="font-semibold text-surface-900 flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5" /> Notificações
        </h3>
        <div className="space-y-3">
          {[
            { label: 'Novo lead capturado', checked: true },
            { label: 'Venda realizada', checked: true },
            { label: 'Campanha encerrada', checked: false },
            { label: 'Dicas de marketing', checked: true },
          ].map(item => (
            <label key={item.label} className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-50 cursor-pointer">
              <span className="text-sm text-surface-700">{item.label}</span>
              <input type="checkbox" defaultChecked={item.checked} className="w-4 h-4 rounded border-surface-300 text-brand-600 focus:ring-brand-500" />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
