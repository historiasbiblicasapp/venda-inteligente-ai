'use client';

import { useState } from 'react';
import { MessageSquare, Sparkles, Copy, Facebook, Instagram, Linkedin, ArrowRight, Loader2, Hash } from 'lucide-react';
import toast from 'react-hot-toast';

type Platform = 'facebook' | 'instagram' | 'linkedin' | 'tiktok' | 'kwai';

const platforms: { id: Platform; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'facebook', label: 'Facebook', icon: Facebook, color: '#1877F2' },
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: '#E4405F' },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: '#0A66C2' },
  { id: 'tiktok', label: 'TikTok', icon: ArrowRight, color: '#010101' },
  { id: 'kwai', label: 'Kwai', icon: ArrowRight, color: '#FF6600' },
];

export default function PostsPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('instagram');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Profissional');
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeCTA, setIncludeCTA] = useState(true);
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic) {
      toast.error('Digite o tema do post');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/ai/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: selectedPlatform, topic, tone, includeEmojis, includeHashtags, includeCTA }),
      });
      const data = await response.json();
      setResults(data.results || []);
      toast.success('Posts gerados!');
    } catch {
      toast.error('Erro ao gerar posts');
    }
    setLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 flex items-center gap-2">
          <MessageSquare className="w-7 h-7 text-brand-600" /> Posts & Legendas
        </h1>
        <p className="text-surface-500">Gere posts completos para todas as plataformas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 glass-card p-5 space-y-4">
          <h3 className="font-semibold text-surface-900">Configurações</h3>
          
          <div>
            <label className="block text-xs font-medium text-surface-600 mb-2">Plataforma</label>
            <div className="grid grid-cols-3 gap-2">
              {platforms.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlatform(p.id)}
                  className={`p-2 rounded-xl text-center text-xs font-medium transition-all ${
                    selectedPlatform === p.id ? 'bg-brand-50 border-2 border-brand-500' : 'border border-surface-200 hover:border-surface-300'
                  }`}
                >
                  <p.icon className="w-5 h-5 mx-auto mb-1" style={{ color: p.color }} />
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-surface-600 mb-1">Tema do Post</label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex: 5 dicas para vender mais online"
              className="input-field text-sm min-h-[80px] resize-y"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-surface-600 mb-1">Tom</label>
            <select value={tone} onChange={(e) => setTone(e.target.value)} className="input-field text-sm">
              <option>Profissional</option>
              <option>Casual</option>
              <option>Inspirador</option>
              <option>Divertido</option>
              <option>Urgente</option>
            </select>
          </div>

          <div className="space-y-2">
            {[
              { label: 'Incluir emojis', value: includeEmojis, set: setIncludeEmojis, icon: '😊' },
              { label: 'Incluir hashtags', value: includeHashtags, set: setIncludeHashtags, icon: '#' },
              { label: 'Incluir CTA', value: includeCTA, set: setIncludeCTA, icon: '🎯' },
            ].map(opt => (
              <label key={opt.label} className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={opt.value}
                  onChange={(e) => opt.set(e.target.checked)}
                  className="w-4 h-4 rounded border-surface-300 text-brand-600 focus:ring-brand-500"
                />
                <span className="text-sm">{opt.icon}</span>
                <span className="text-sm text-surface-700">{opt.label}</span>
              </label>
            ))}
          </div>

          <button onClick={handleGenerate} disabled={loading} className="btn-primary w-full inline-flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Gerando...</> : <><Sparkles className="w-5 h-5" /> Gerar Posts</>}
          </button>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {results.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <MessageSquare className="w-16 h-16 text-surface-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-surface-900 mb-2">Pronto para gerar</h3>
              <p className="text-surface-500">Configure e clique em gerar para criar seus posts</p>
            </div>
          ) : (
            results.map((result, index) => (
              <div key={index} className="glass-card p-5 group relative">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-medium text-brand-600 bg-brand-50 px-2 py-1 rounded">Post {index + 1}</span>
                  <button
                    onClick={() => copyToClipboard(result)}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-surface-100 transition-all"
                  >
                    <Copy className="w-4 h-4 text-surface-500" />
                  </button>
                </div>
                <p className="text-sm text-surface-700 whitespace-pre-wrap leading-relaxed">{result}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
