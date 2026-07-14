'use client';

import { useState } from 'react';
import { Bot, Sparkles, Copy, RefreshCw, Zap, Type, MessageSquare, Video, Megaphone, FileText, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

type CopyType = 'titles' | 'descriptions' | 'cta' | 'adcopy' | 'video_scripts' | 'email_sequence';

const copyTypes: { id: CopyType; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'titles', label: 'Títulos', icon: Type, description: 'Títulos chamativos para anúncios e landing pages' },
  { id: 'descriptions', label: 'Descrições', icon: FileText, description: 'Textos descritivos persuasivos' },
  { id: 'cta', label: 'CTAs', icon: MessageSquare, description: 'Chamadas para ação de alta conversão' },
  { id: 'adcopy', label: 'Copy para Anúncios', icon: Megaphone, description: 'Textos completos para Facebook, Instagram e mais' },
  { id: 'video_scripts', label: 'Roteiros de Vídeo', icon: Video, description: 'Roteiros de 15, 30 e 60 segundos' },
  { id: 'email_sequence', label: 'Sequência de E-mails', icon: FileText, description: 'Sequência de e-mails de vendas' },
];

const toneOptions = [
  'Profissional',
  'Casual',
  'Urgente',
  'Inspirador',
  'Divertido',
  'Luxuoso',
  'Educativo',
  'Empático',
];

const platformOptions = [
  'Facebook',
  'Instagram',
  'TikTok',
  'Kwai',
  'Google Ads',
  'LinkedIn',
];

export default function AICopyPage() {
  const [selectedType, setSelectedType] = useState<CopyType>('titles');
  const [productName, setProductName] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [tone, setTone] = useState('Profissional');
  const [platform, setPlatform] = useState('Facebook');
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState('');

  const handleGenerate = async () => {
    if (!productName) {
      toast.error('Digite o nome do produto');
      return;
    }
    setLoading(true);
    setResults([]);

    try {
      const response = await fetch('/api/ai/copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          productName,
          targetAudience,
          productDescription,
          tone,
          platform,
          additionalInfo,
        }),
      });

      const data = await response.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        setResults(data.results || []);
        toast.success('Copy gerada com sucesso!');
      }
    } catch {
      toast.error('Erro ao gerar copy. Tente novamente.');
    }
    setLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado!');
  };

  const copyAll = () => {
    navigator.clipboard.writeText(results.join('\n\n'));
    toast.success('Todas copiadas!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 flex items-center gap-2">
          <Bot className="w-7 h-7 text-brand-600" /> IA para Copy
        </h1>
        <p className="text-surface-500">Gere textos persuasivos automaticamente com inteligência artificial</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-card p-5">
            <h3 className="font-semibold text-surface-900 mb-3">Tipo de Copy</h3>
            <div className="space-y-2">
              {copyTypes.map((ct) => (
                <button
                  key={ct.id}
                  onClick={() => setSelectedType(ct.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                    selectedType === ct.id
                      ? 'bg-brand-50 border-2 border-brand-500'
                      : 'border border-surface-200 hover:border-surface-300'
                  }`}
                >
                  <ct.icon className={`w-5 h-5 shrink-0 ${selectedType === ct.id ? 'text-brand-600' : 'text-surface-400'}`} />
                  <div>
                    <p className={`text-sm font-medium ${selectedType === ct.id ? 'text-brand-700' : 'text-surface-900'}`}>{ct.label}</p>
                    <p className="text-xs text-surface-500">{ct.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-5 space-y-4">
            <h3 className="font-semibold text-surface-900">Configurações</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-surface-600 mb-1">Nome do Produto *</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Ex: Curso de Marketing Digital"
                  className="input-field text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-600 mb-1">Público-Alvo</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="Ex: Empreendedores, 25-45 anos"
                  className="input-field text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-600 mb-1">Tom</label>
                <select value={tone} onChange={(e) => setTone(e.target.value)} className="input-field text-sm">
                  {toneOptions.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-600 mb-1">Plataforma</label>
                <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="input-field text-sm">
                  {platformOptions.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-600 mb-1">Descrição do Produto</label>
              <textarea
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="Descreva brevemente o produto e seus benefícios..."
                className="input-field text-sm min-h-[80px] resize-y"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-600 mb-1">Informações Adicionais</label>
              <textarea
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Preço, garantia, diferenciais..."
                className="input-field text-sm min-h-[60px] resize-y"
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="btn-primary w-full inline-flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Gerando...</>
              ) : (
                <><Sparkles className="w-5 h-5" /> Gerar Copy com IA</>
              )}
            </button>
          </div>

          {results.length > 0 && (
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-surface-900">Resultados ({results.length})</h3>
                <div className="flex gap-2">
                  <button onClick={copyAll} className="text-sm text-brand-600 hover:text-brand-700 font-medium inline-flex items-center gap-1">
                    <Copy className="w-4 h-4" /> Copiar todas
                  </button>
                  <button onClick={handleGenerate} className="text-sm text-surface-500 hover:text-surface-700 inline-flex items-center gap-1">
                    <RefreshCw className="w-4 h-4" /> Regenerar
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {results.map((result, index) => (
                  <div key={index} className="p-4 bg-surface-50 rounded-xl group relative">
                    <p className="text-sm text-surface-700 whitespace-pre-wrap">{result}</p>
                    <button
                      onClick={() => copyToClipboard(result)}
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-2 bg-white rounded-lg shadow-sm border border-surface-200 hover:bg-brand-50 transition-all"
                    >
                      <Copy className="w-4 h-4 text-surface-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
