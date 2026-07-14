'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Shield, Users, CreditCard, Check, X, Search, Mail, Calendar, Crown } from 'lucide-react';
import toast from 'react-hot-toast';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  subscription_status: 'inactive' | 'active' | 'cancelled' | 'expired';
  subscription_plan: 'starter' | 'profissional' | 'enterprise' | null;
  subscription_started_at: string | null;
  subscription_expires_at: string | null;
  is_admin: boolean;
  created_at: string;
}

const planNames: Record<string, string> = {
  starter: 'Starter (R$47)',
  profissional: 'Profissional (R$97)',
  enterprise: 'Enterprise (R$197)',
};

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-surface-100 text-surface-600',
  cancelled: 'bg-red-100 text-red-700',
  expired: 'bg-yellow-100 text-yellow-700',
};

export default function AdminPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (!profile?.is_admin) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setIsAdmin(true);
      loadUsers();
    };
    checkAdmin();
  }, [supabase]);

  const loadUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Erro ao carregar usuarios');
      setLoading(false);
      return;
    }

    setUsers(data || []);
    setLoading(false);
  };

  const handleApprove = async (userId: string, plan: string) => {
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'active',
        subscription_plan: plan as any,
        subscription_started_at: now.toISOString(),
        subscription_expires_at: expiresAt.toISOString(),
      })
      .eq('id', userId);

    if (error) {
      toast.error('Erro ao aprovar: ' + error.message);
    } else {
      toast.success('Assinatura aprovada!');
      loadUsers();
    }
  };

  const handleCancel = async (userId: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'cancelled',
      })
      .eq('id', userId);

    if (error) {
      toast.error('Erro ao cancelar: ' + error.message);
    } else {
      toast.success('Assinatura cancelada!');
      loadUsers();
    }
  };

  const handleReactivate = async (userId: string) => {
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'active',
        subscription_started_at: now.toISOString(),
        subscription_expires_at: expiresAt.toISOString(),
      })
      .eq('id', userId);

    if (error) {
      toast.error('Erro ao reativar: ' + error.message);
    } else {
      toast.success('Assinatura reativada!');
      loadUsers();
    }
  };

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.full_name && u.full_name.toLowerCase().includes(search.toLowerCase()))
  );

  const stats = {
    total: users.length,
    active: users.filter(u => u.subscription_status === 'active').length,
    inactive: users.filter(u => u.subscription_status === 'inactive').length,
    revenue: users.filter(u => u.subscription_status === 'active').reduce((acc, u) => {
      const prices: Record<string, number> = { starter: 47, profissional: 97, enterprise: 197 };
      return acc + (prices[u.subscription_plan || ''] || 0);
    }, 0),
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-surface-900 mb-2">Acesso Restrito</h1>
          <p className="text-surface-500">Apenas administradores podem acessar esta pagina.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 flex items-center gap-2">
            <Shield className="w-7 h-7 text-brand-600" /> Painel Admin
          </h1>
          <p className="text-surface-500">Gerenciar clientes e assinaturas</p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-900">{stats.total}</p>
              <p className="text-xs text-surface-500">Total usuarios</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-900">{stats.active}</p>
              <p className="text-xs text-surface-500">Assinantes ativos</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-surface-100 rounded-xl flex items-center justify-center">
              <X className="w-5 h-5 text-surface-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-900">{stats.inactive}</p>
              <p className="text-xs text-surface-500">Sem assinatura</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-accent-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-900">R${stats.revenue}</p>
              <p className="text-xs text-surface-500">Receita mensal</p>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="glass-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por email ou nome..."
            className="input-field pl-11 w-full"
          />
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-surface-500">Carregando...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-surface-500">Nenhum usuario encontrado</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-50 border-b border-surface-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-surface-600 uppercase">Usuario</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-surface-600 uppercase">Plano</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-surface-600 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-surface-600 uppercase">Expira em</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-surface-600 uppercase">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold text-sm">
                          {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-surface-900 text-sm">{user.full_name || 'Sem nome'}</p>
                          <p className="text-xs text-surface-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {user.email}
                            {user.is_admin && <Crown className="w-3 h-3 text-yellow-500" />}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {user.subscription_plan ? (
                        <span className="font-medium">{planNames[user.subscription_plan] || user.subscription_plan}</span>
                      ) : (
                        <span className="text-surface-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[user.subscription_status] || ''}`}>
                        {user.subscription_status === 'active' ? 'Ativo' :
                         user.subscription_status === 'inactive' ? 'Inativo' :
                         user.subscription_status === 'cancelled' ? 'Cancelado' : 'Expirado'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-surface-500">
                      {user.subscription_expires_at ? (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(user.subscription_expires_at).toLocaleDateString('pt-BR')}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {user.subscription_status !== 'active' ? (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleApprove(user.id, 'starter')}
                              className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200"
                            >
                              Starter
                            </button>
                            <button
                              onClick={() => handleApprove(user.id, 'profissional')}
                              className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200"
                            >
                              Profissional
                            </button>
                            <button
                              onClick={() => handleApprove(user.id, 'enterprise')}
                              className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium hover:bg-purple-200"
                            >
                              Enterprise
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleCancel(user.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
