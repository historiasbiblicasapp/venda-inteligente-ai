'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ComponentEditor } from '@/components/landing-page/ComponentEditor';
import { PagePreview } from '@/components/landing-page/PagePreview';
import { LandingPageComponent, PageSettings } from '@/types';
import { generateId } from '@/lib/utils';
import { ArrowLeft, Save, Eye, Globe, Plus, Settings, Palette, MousePointerClick, Share2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const componentTypes = [
  { type: 'banner', label: 'Banner', icon: '🖼️' },
  { type: 'video', label: 'Vídeo', icon: '🎥' },
  { type: 'text', label: 'Texto', icon: '📝' },
  { type: 'offer', label: 'Oferta', icon: '🏷️' },
  { type: 'testimonial', label: 'Depoimentos', icon: '💬' },
  { type: 'faq', label: 'FAQ', icon: '❓' },
  { type: 'guarantee', label: 'Garantia', icon: '🛡️' },
  { type: 'countdown', label: 'Contador', icon: '⏱️' },
] as const;

type Tab = 'components' | 'settings' | 'analytics' | 'pixels';

export default function EditLandingPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [components, setComponents] = useState<LandingPageComponent[]>([]);
  const [settings, setSettings] = useState<PageSettings>({
    primaryColor: '#4c6ef5',
    secondaryColor: '#fcc419',
    backgroundColor: '#ffffff',
    fontFamily: 'Inter',
    maxWidth: '1200px',
    showCountdown: false,
    countdownDate: '',
    checkoutUrl: '',
    whatsappNumber: '',
    whatsappMessage: 'Olá! Vim pela página de vendas.',
    thankYouPageUrl: '/obrigado',
  });
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft');
  const [activeTab, setActiveTab] = useState<Tab>('components');
  const [metaPixelId, setMetaPixelId] = useState('');
  const [tiktokPixelId, setTiktokPixelId] = useState('');
  const [ga4Id, setGa4Id] = useState('');
  const [gtmId, setGtmId] = useState('');
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const fetchPage = async () => {
      const { data } = await supabase
        .from('landing_pages')
        .select('*')
        .eq('id', params.id)
        .single();

      if (data) {
        setTitle(data.title);
        setSlug(data.slug);
        setComponents((data.components as unknown as LandingPageComponent[]) || []);
        setSettings((data.settings as unknown as PageSettings) || settings);
        setStatus(data.status as 'draft' | 'published' | 'archived');
        setMetaPixelId(data.meta_pixel_id || '');
        setTiktokPixelId(data.tiktok_pixel_id || '');
        setGa4Id(data.ga4_measurement_id || '');
        setGtmId(data.gtm_id || '');
      }
      setLoading(false);
    };
    fetchPage();
  }, [params.id, supabase]);

  const handleSave = async (publishStatus?: 'draft' | 'published') => {
    setSaving(true);
    const { error } = await supabase
      .from('landing_pages')
      .update({
        title,
        slug,
        components,
        settings,
        status: publishStatus || status,
        meta_pixel_id: metaPixelId || null,
        tiktok_pixel_id: tiktokPixelId || null,
        ga4_measurement_id: ga4Id || null,
        gtm_id: gtmId || null,
      })
      .eq('id', params.id);

    if (error) {
      toast.error('Erro ao salvar: ' + error.message);
    } else {
      if (publishStatus) setStatus(publishStatus);
      toast.success('Página salva com sucesso!');
    }
    setSaving(false);
  };

  const addComponent = (type: string) => {
    const newComponent: LandingPageComponent = {
      id: generateId(),
      type: type as LandingPageComponent['type'],
      content: getDefaultContent(type),
      animation: { type: 'fadeIn', delay: 0 },
    };
    setComponents([...components, newComponent]);
    setShowAddMenu(false);
    toast.success('Componente adicionado!');
  };

  const updateComponent = (index: number, updated: LandingPageComponent) => {
    const newComponents = [...components];
    newComponents[index] = updated;
    setComponents(newComponents);
  };

  const removeComponent = (index: number) => {
    setComponents(components.filter((_, i) => i !== index));
    toast.success('Componente removido');
  };

  const moveComponent = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newComponents = [...components];
    [newComponents[index], newComponents[newIndex]] = [newComponents[newIndex], newComponents[index]];
    setComponents(newComponents);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/landing-pages" className="p-2 hover:bg-surface-100 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-bold bg-transparent border-none outline-none focus:ring-0 p-0"
              placeholder="Título da página"
            />
            <p className="text-sm text-surface-500">/{slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
          }`}>
            {status === 'published' ? 'Publicada' : 'Rascunho'}
          </span>
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="btn-outline !py-2 !px-4 text-sm inline-flex items-center gap-2"
          >
            <Eye className="w-4 h-4" /> {previewMode ? 'Editor' : 'Preview'}
          </button>
          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="btn-outline !py-2 !px-4 text-sm inline-flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> {saving ? 'Salvando...' : 'Salvar'}
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={saving}
            className="btn-primary !py-2 !px-4 text-sm inline-flex items-center gap-2"
          >
            <Globe className="w-4 h-4" /> Publicar
          </button>
        </div>
      </div>

      {previewMode ? (
        <div className="bg-surface-100 rounded-2xl p-4">
          <PagePreview components={components} settings={settings} />
        </div>
      ) : (
        <div className="flex gap-4 h-[calc(100vh-140px)]">
          <div className="flex gap-1 bg-surface-100 rounded-xl p-1">
            {[
              { id: 'components' as Tab, icon: MousePointerClick, label: 'Componentes' },
              { id: 'settings' as Tab, icon: Settings, label: 'Config' },
              { id: 'pixels' as Tab, icon: Share2, label: 'Pixels' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-brand-600 shadow-sm'
                    : 'text-surface-500 hover:text-surface-700'
                }`}
              >
                <tab.icon className="w-4 h-4 inline mr-1" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 flex gap-4">
            {activeTab === 'components' && (
              <>
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                  <div className="relative">
                    <button
                      onClick={() => setShowAddMenu(!showAddMenu)}
                      className="w-full p-3 border-2 border-dashed border-surface-300 rounded-xl text-surface-500 hover:border-brand-400 hover:text-brand-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" /> Adicionar Componente
                    </button>
                    {showAddMenu && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-surface-200 p-3 z-10 grid grid-cols-2 gap-2">
                        {componentTypes.map((ct) => (
                          <button
                            key={ct.type}
                            onClick={() => addComponent(ct.type)}
                            className="flex items-center gap-2 p-3 rounded-lg hover:bg-surface-50 transition-colors text-left"
                          >
                            <span className="text-xl">{ct.icon}</span>
                            <span className="text-sm font-medium">{ct.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {components.map((comp, index) => (
                    <ComponentEditor
                      key={comp.id}
                      component={comp}
                      onUpdate={(updated) => updateComponent(index, updated)}
                      onRemove={() => removeComponent(index)}
                      onMoveUp={() => index > 0 && moveComponent(index, 'up')}
                      onMoveDown={() => index < components.length - 1 && moveComponent(index, 'down')}
                      isFirst={index === 0}
                      isLast={index === components.length - 1}
                    />
                  ))}
                </div>

                <div className="w-[400px] shrink-0 bg-surface-100 rounded-xl p-4 overflow-y-auto">
                  <p className="text-sm font-medium text-surface-600 mb-3">Pré-visualização</p>
                  <PagePreview components={components} settings={settings} />
                </div>
              </>
            )}

            {activeTab === 'settings' && (
              <div className="max-w-xl space-y-4">
                <div className="glass-card p-6 space-y-4">
                  <h3 className="font-semibold text-surface-900 flex items-center gap-2">
                    <Palette className="w-5 h-5" /> Aparência
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-surface-600 mb-1">Cor Principal</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={settings.primaryColor}
                          onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                          className="w-10 h-10 rounded border"
                        />
                        <input
                          type="text"
                          value={settings.primaryColor}
                          onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                          className="input-field text-sm flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-surface-600 mb-1">Cor de Destaque</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={settings.secondaryColor}
                          onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                          className="w-10 h-10 rounded border"
                        />
                        <input
                          type="text"
                          value={settings.secondaryColor}
                          onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                          className="input-field text-sm flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-6 space-y-4">
                  <h3 className="font-semibold text-surface-900 flex items-center gap-2">
                    <MousePointerClick className="w-5 h-5" /> Checkout & WhatsApp
                  </h3>
                  <div>
                    <label className="block text-xs font-medium text-surface-600 mb-1">Link do Checkout</label>
                    <input
                      type="url"
                      value={settings.checkoutUrl}
                      onChange={(e) => setSettings({ ...settings, checkoutUrl: e.target.value })}
                      className="input-field text-sm"
                      placeholder="https://kiwify.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-600 mb-1">Número WhatsApp</label>
                    <input
                      type="text"
                      value={settings.whatsappNumber}
                      onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                      className="input-field text-sm"
                      placeholder="5511999999999"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-600 mb-1">Mensagem WhatsApp</label>
                    <input
                      type="text"
                      value={settings.whatsappMessage}
                      onChange={(e) => setSettings({ ...settings, whatsappMessage: e.target.value })}
                      className="input-field text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pixels' && (
              <div className="max-w-xl space-y-4">
                <div className="glass-card p-6 space-y-4">
                  <h3 className="font-semibold text-surface-900">Integração com Pixels e Analytics</h3>
                  <div>
                    <label className="block text-xs font-medium text-surface-600 mb-1">Meta Pixel ID</label>
                    <input
                      type="text"
                      value={metaPixelId}
                      onChange={(e) => setMetaPixelId(e.target.value)}
                      className="input-field text-sm"
                      placeholder="Ex: 123456789012345"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-600 mb-1">TikTok Pixel ID</label>
                    <input
                      type="text"
                      value={tiktokPixelId}
                      onChange={(e) => setTiktokPixelId(e.target.value)}
                      className="input-field text-sm"
                      placeholder="Ex: CXXXXXXXXXXXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-600 mb-1">Google Analytics 4 ID</label>
                    <input
                      type="text"
                      value={ga4Id}
                      onChange={(e) => setGa4Id(e.target.value)}
                      className="input-field text-sm"
                      placeholder="Ex: G-XXXXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-600 mb-1">Google Tag Manager ID</label>
                    <input
                      type="text"
                      value={gtmId}
                      onChange={(e) => setGtmId(e.target.value)}
                      className="input-field text-sm"
                      placeholder="Ex: GTM-XXXXXXX"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function getDefaultContent(type: string): Record<string, unknown> {
  switch (type) {
    case 'banner':
      return { title: 'Título Impactante', subtitle: 'Subtítulo persuasivo', backgroundImage: '', ctaText: 'QUERO AGORA', ctaStyle: 'primary' };
    case 'video':
      return { url: '', title: 'Assista ao Vídeo' };
    case 'text':
      return { title: 'Seu Título', body: 'Escreva seu conteúdo aqui...', alignment: 'center' };
    case 'offer':
      return { title: 'Oferta Imperdível', price: 'R$ 197', originalPrice: 'R$ 497', features: ['Feature 1', 'Feature 2'], buttonText: 'GARANTIR' };
    case 'testimonial':
      return { items: [{ name: 'Cliente', text: 'Excelente produto!', avatar: '' }] };
    case 'faq':
      return { items: [{ question: 'Pergunta?', answer: 'Resposta aqui...' }] };
    case 'guarantee':
      return { title: 'Garantia de 7 Dias', text: 'Se não gostar, devolvemos seu dinheiro.', icon: 'shield' };
    case 'countdown':
      return { endDate: new Date(Date.now() + 3 * 86400000).toISOString(), text: 'Oferta termina em:' };
    default:
      return {};
  }
}
