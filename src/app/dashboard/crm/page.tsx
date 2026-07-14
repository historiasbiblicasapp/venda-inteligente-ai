'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Tables } from '@/types/database';
import { Search, Plus, Filter, Download, Mail, Phone, Tag, MoreHorizontal, ArrowUpRight, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

type Lead = Tables<'leads'>;

const statusConfig = {
  new: { label: 'Novo', color: 'bg-blue-100 text-blue-700' },
  contacted: { label: 'Contatado', color: 'bg-yellow-100 text-yellow-700' },
  converted: { label: 'Convertido', color: 'bg-green-100 text-green-700' },
  lost: { label: 'Perdido', color: 'bg-red-100 text-red-600' },
};

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLead, setNewLead] = useState({ name: '', email: '', phone: '' });
  const supabase = createClient();

  const fetchLeads = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let query = supabase
      .from('leads')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data } = await query;
    setLeads(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter, search]);

  const handleAddLead = async () => {
    if (!newLead.name || !newLead.email) {
      toast.error('Nome e e-mail são obrigatórios');
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('leads').insert({
      user_id: user.id,
      name: newLead.name,
      email: newLead.email,
      phone: newLead.phone || null,
      status: 'new',
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Lead adicionado!');
      setShowAddModal(false);
      setNewLead({ name: '', email: '', phone: '' });
      fetchLeads();
    }
  };

  const updateStatus = async (id: string, status: Lead['status']) => {
    await supabase.from('leads').update({ status }).eq('id', id);
    setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
    toast.success('Status atualizado');
  };

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    converted: leads.filter(l => l.status === 'converted').length,
    lost: leads.filter(l => l.status === 'lost').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">CRM</h1>
          <p className="text-surface-500">Gerencie seus leads e clientes</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-outline !py-2 !px-4 text-sm inline-flex items-center gap-2">
            <Download className="w-4 h-4" /> Exportar
          </button>
          <button onClick={() => setShowAddModal(true)} className="btn-primary inline-flex items-center gap-2">
            <UserPlus className="w-5 h-5" /> Novo Lead
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'text-surface-900' },
          { label: 'Novos', value: stats.new, color: 'text-blue-600' },
          { label: 'Contatados', value: stats.contacted, color: 'text-yellow-600' },
          { label: 'Convertidos', value: stats.converted, color: 'text-green-600' },
          { label: 'Perdidos', value: stats.lost, color: 'text-red-500' },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-surface-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou e-mail..."
            className="input-field pl-11"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field !w-auto"
        >
          <option value="all">Todos os status</option>
          <option value="new">Novos</option>
          <option value="contacted">Contatados</option>
          <option value="converted">Convertidos</option>
          <option value="lost">Perdidos</option>
        </select>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200">
                <th className="text-left p-4 text-sm font-medium text-surface-500">Lead</th>
                <th className="text-left p-4 text-sm font-medium text-surface-500">Contato</th>
                <th className="text-left p-4 text-sm font-medium text-surface-500">Status</th>
                <th className="text-left p-4 text-sm font-medium text-surface-500">Origem</th>
                <th className="text-left p-4 text-sm font-medium text-surface-500">Data</th>
                <th className="text-left p-4 text-sm font-medium text-surface-500">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-surface-400">Carregando...</td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-surface-400">Nenhum lead encontrado</td></tr>
              ) : (
                leads.map(lead => (
                  <tr key={lead.id} className="border-b border-surface-100 hover:bg-surface-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 font-semibold text-sm">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-surface-900">{lead.name}</p>
                          <p className="text-xs text-surface-500">{lead.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {lead.phone && (
                        <div className="flex items-center gap-1 text-sm text-surface-600">
                          <Phone className="w-3 h-3" /> {lead.phone}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <select
                        value={lead.status}
                        onChange={(e) => updateStatus(lead.id, e.target.value as Lead['status'])}
                        className={`text-xs font-medium px-3 py-1.5 rounded-full border-0 ${statusConfig[lead.status].color} cursor-pointer`}
                      >
                        <option value="new">Novo</option>
                        <option value="contacted">Contatado</option>
                        <option value="converted">Convertido</option>
                        <option value="lost">Perdido</option>
                      </select>
                    </td>
                    <td className="p-4 text-sm text-surface-500">{lead.source || '-'}</td>
                    <td className="p-4 text-sm text-surface-500">
                      {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-4">
                      <a href={`mailto:${lead.email}`} className="p-2 hover:bg-surface-100 rounded-lg inline-block">
                        <Mail className="w-4 h-4 text-surface-400" />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Novo Lead</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={newLead.name}
                onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                placeholder="Nome"
                className="input-field"
              />
              <input
                type="email"
                value={newLead.email}
                onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                placeholder="E-mail"
                className="input-field"
              />
              <input
                type="tel"
                value={newLead.phone}
                onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                placeholder="Telefone (opcional)"
                className="input-field"
              />
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowAddModal(false)} className="btn-outline !py-2">Cancelar</button>
                <button onClick={handleAddLead} className="btn-primary !py-2">Adicionar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
