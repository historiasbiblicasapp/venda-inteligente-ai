'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Tables } from '@/types/database';
import { Plus, Megaphone, Facebook, Instagram, Play, Pause, BarChart3, Calendar, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

type Campaign = Tables<'campaigns'>;

const platformIcons: Record<string, React.ElementType> = {
  facebook: Facebook,
  instagram: Instagram,
  tiktok: Megaphone,
  kwai: Megaphone,
  google: Megaphone,
};

const platformColors: Record<string, string> = {
  facebook: '#1877F2',
  instagram: '#E4405F',
  tiktok: '#010101',
  kwai: '#FF6600',
  google: '#4285F4',
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState({ name: '', platform: 'facebook' as 'facebook' | 'instagram' | 'tiktok' | 'kwai' | 'google', budget: '' });
  const supabase = createClient();

  const fetchCampaigns = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setCampaigns(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchCampaigns(); }, []);

  const handleCreate = async () => {
    if (!newCampaign.name) {
      toast.error('Digite o nome da campanha');
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase.from('campaigns').insert({
      user_id: user.id,
      name: newCampaign.name,
      platform: newCampaign.platform,
      budget: newCampaign.budget ? parseFloat(newCampaign.budget) : null,
      status: 'draft',
    }).select().single();

    if (!error && data) {
      setCampaigns([data, ...campaigns]);
      setShowCreateModal(false);
      setNewCampaign({ name: '', platform: 'facebook', budget: '' });
      toast.success('Campanha criada!');
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    await supabase.from('campaigns').update({ status: newStatus }).eq('id', id);
    setCampaigns(campaigns.map(c => c.id === id ? { ...c, status: newStatus } : c));
    toast.success(`Campanha ${newStatus === 'active' ? 'ativada' : 'pausada'}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Campanhas</h1>
          <p className="text-surface-500">Gerencie suas campanhas de marketing</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary inline-flex items-center gap-2">
          <Plus className="w-5 h-5" /> Nova Campanha
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="h-4 bg-surface-200 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-surface-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-surface-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Megaphone className="w-16 h-16 text-surface-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-surface-900 mb-2">Nenhuma campanha</h3>
          <p className="text-surface-500 mb-6">Crie sua primeira campanha de marketing</p>
          <button onClick={() => setShowCreateModal(true)} className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-5 h-5" /> Criar Campanha
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map(campaign => {
            const PlatformIcon = platformIcons[campaign.platform] || Megaphone;
            return (
              <div key={campaign.id} className="glass-card p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: platformColors[campaign.platform] + '20' }}
                    >
                      <PlatformIcon className="w-5 h-5" style={{ color: platformColors[campaign.platform] }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-surface-900">{campaign.name}</h3>
                      <p className="text-xs text-surface-500 capitalize">{campaign.platform}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    campaign.status === 'active' ? 'bg-green-100 text-green-700' :
                    campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-surface-100 text-surface-600'
                  }`}>
                    {campaign.status === 'active' ? 'Ativa' : campaign.status === 'paused' ? 'Pausada' : 'Rascunho'}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-surface-500 mb-4">
                  {campaign.budget && (
                    <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />{formatCurrency(campaign.budget)}</span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(campaign.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex gap-2">
                  {campaign.status === 'draft' ? (
                    <button onClick={() => toggleStatus(campaign.id, campaign.status)} className="flex-1 btn-primary !py-2 text-sm inline-flex items-center justify-center gap-1">
                      <Play className="w-4 h-4" /> Ativar
                    </button>
                  ) : (
                    <button onClick={() => toggleStatus(campaign.id, campaign.status)} className="flex-1 btn-outline !py-2 text-sm inline-flex items-center justify-center gap-1">
                      {campaign.status === 'active' ? <><Pause className="w-4 h-4" /> Pausar</> : <><Play className="w-4 h-4" /> Retomar</>}
                    </button>
                  )}
                  <button className="p-2 rounded-xl border border-surface-200 hover:bg-surface-50">
                    <BarChart3 className="w-4 h-4 text-surface-500" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Nova Campanha</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                placeholder="Nome da campanha"
                className="input-field"
              />
              <select
                value={newCampaign.platform}
                onChange={(e) => setNewCampaign({ ...newCampaign, platform: e.target.value as 'facebook' | 'instagram' | 'tiktok' | 'kwai' | 'google' })}
                className="input-field"
              >
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="kwai">Kwai</option>
                <option value="google">Google Ads</option>
              </select>
              <input
                type="number"
                value={newCampaign.budget}
                onChange={(e) => setNewCampaign({ ...newCampaign, budget: e.target.value })}
                placeholder="Orçamento (opcional)"
                className="input-field"
              />
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowCreateModal(false)} className="btn-outline !py-2">Cancelar</button>
                <button onClick={handleCreate} className="btn-primary !py-2">Criar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
