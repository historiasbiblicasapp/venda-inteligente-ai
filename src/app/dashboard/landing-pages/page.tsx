'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Plus, ExternalLink, MoreVertical, Eye, BarChart3, Trash2, Copy, Globe } from 'lucide-react';
import { Tables } from '@/types/database';

type LandingPage = Tables<'landing_pages'>;

export default function LandingPagesPage() {
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchPages = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('landing_pages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setPages(data || []);
      setLoading(false);
    };
    fetchPages();
  }, [supabase]);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta página?')) return;
    await supabase.from('landing_pages').delete().eq('id', id);
    setPages(pages.filter(p => p.id !== id));
  };

  const handleDuplicate = async (page: LandingPage) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('landing_pages')
      .insert({
        user_id: user.id,
        title: `${page.title} (Cópia)`,
        slug: `${page.slug}-copia-${Date.now()}`,
        description: page.description,
        components: page.components,
        settings: page.settings,
        status: 'draft',
      })
      .select()
      .single();

    if (data) {
      setPages([data, ...pages]);
    }
  };

  const statusColors = {
    draft: 'bg-yellow-100 text-yellow-700',
    published: 'bg-green-100 text-green-700',
    archived: 'bg-gray-100 text-gray-600',
  };

  const statusLabels = {
    draft: 'Rascunho',
    published: 'Publicada',
    archived: 'Arquivada',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Landing Pages</h1>
          <p className="text-surface-500">Gerencie suas páginas de vendas</p>
        </div>
        <Link
          href="/dashboard/landing-pages/new"
          className="btn-primary inline-flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nova Página
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="h-4 bg-surface-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-surface-200 rounded w-1/2 mb-6"></div>
              <div className="h-32 bg-surface-100 rounded-xl mb-4"></div>
              <div className="flex gap-2">
                <div className="h-8 bg-surface-200 rounded flex-1"></div>
                <div className="h-8 bg-surface-200 rounded flex-1"></div>
              </div>
            </div>
          ))}
        </div>
      ) : pages.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Globe className="w-16 h-16 text-surface-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-surface-900 mb-2">Nenhuma página criada</h3>
          <p className="text-surface-500 mb-6">Crie sua primeira landing page de alta conversão</p>
          <Link href="/dashboard/landing-pages/new" className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Criar Primeira Página
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => (
            <div key={page.id} className="glass-card overflow-hidden hover:shadow-xl transition-shadow group">
              <div className="h-40 bg-gradient-to-br from-brand-500 to-brand-700 p-6 flex items-end relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <h3 className="text-lg font-bold text-white">{page.title}</h3>
                  <p className="text-white/80 text-sm">/{page.slug}</p>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[page.status]}`}>
                    {statusLabels[page.status]}
                  </span>
                  <span className="text-xs text-surface-400">
                    {new Date(page.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/landing-pages/${page.id}/edit`}
                    className="flex-1 btn-outline !py-2 !px-3 text-sm text-center"
                  >
                    Editar
                  </Link>
                  {page.status === 'published' && (
                    <a
                      href={`/lp/${page.slug}`}
                      target="_blank"
                      className="flex-1 btn-primary !py-2 !px-3 text-sm text-center flex items-center justify-center gap-1"
                    >
                      <ExternalLink className="w-4 h-4" /> Ver
                    </a>
                  )}
                  <button
                    onClick={() => handleDuplicate(page)}
                    className="p-2 rounded-xl border border-surface-200 hover:bg-surface-50 transition-colors"
                    title="Duplicar"
                  >
                    <Copy className="w-4 h-4 text-surface-500" />
                  </button>
                  <button
                    onClick={() => handleDelete(page.id)}
                    className="p-2 rounded-xl border border-surface-200 hover:bg-red-50 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
