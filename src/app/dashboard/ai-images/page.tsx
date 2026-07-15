'use client';

import { useState } from 'react';
import { ImageIcon, Sparkles, Download, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const formats = [
  { id: 'facebook-feed', label: 'Facebook Feed', size: '1200x630', icon: '📱' },
  { id: 'instagram-feed', label: 'Instagram Feed', size: '1080x1080', icon: '📸' },
  { id: 'instagram-stories', label: 'Instagram Stories', size: '1080x1920', icon: '📱' },
  { id: 'reels', label: 'Reels', size: '1080x1920', icon: '🎬' },
  { id: 'tiktok', label: 'TikTok', size: '1080x1920', icon: '🎵' },
  { id: 'kwai', label: 'Kwai', size: '1080x1920', icon: '🎭' },
];

export default function AIImagesPage() {
  const [prompt, setPrompt] = useState('');
  const [selectedFormats, setSelectedFormats] = useState<string[]>(['facebook-feed']);
  const [style, setStyle] = useState('Moderno e profissional');
  const [brandColors, setBrandColors] = useState('#4c6ef5, #fcc419');
  const [loading, setLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<{ url: string; format: string }[]>([]);
  const [previewImage, setPreviewImage] = useState<{ url: string; format: string } | null>(null);

  const toggleFormat = (id: string) => {
    setSelectedFormats(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const downloadImage = async (url: string, format: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `${format}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      toast.success('Download iniciado!');
    } catch {
      toast.error('Erro ao baixar imagem');
    }
  };

  const handleGenerate = async () => {
    if (!prompt) {
      toast.error('Descreva a imagem que deseja criar');
      return;
    }
    if (selectedFormats.length === 0) {
      toast.error('Selecione pelo menos um formato');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/ai/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, formats: selectedFormats, style, brandColors }),
      });
      const data = await response.json();
      setGeneratedImages(data.images || []);
      toast.success('Imagens geradas!');
    } catch {
      toast.error('Erro ao gerar imagens');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 flex items-center gap-2">
          <ImageIcon className="w-7 h-7 text-brand-600" /> IA para Imagens
        </h1>
        <p className="text-surface-500">Crie imagens profissionais para suas campanhas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 glass-card p-5 space-y-5">
          <h3 className="font-semibold text-surface-900">Configurações</h3>

          <div>
            <label className="block text-xs font-medium text-surface-600 mb-2">Formatos</label>
            <div className="grid grid-cols-2 gap-2">
              {formats.map(f => (
                <button
                  key={f.id}
                  onClick={() => toggleFormat(f.id)}
                  className={`p-3 rounded-xl text-left transition-all border-2 ${
                    selectedFormats.includes(f.id)
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-surface-200 hover:border-surface-300'
                  }`}
                >
                  <span className="text-lg">{f.icon}</span>
                  <p className="text-xs font-medium mt-1">{f.label}</p>
                  <p className="text-[10px] text-surface-400">{f.size}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-surface-600 mb-1">Descricao da Imagem</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Uma mulher sorrindo usando um laptop, com fundo gradient azul e amarelo..."
              className="input-field text-sm min-h-[100px] resize-y"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-surface-600 mb-1">Estilo</label>
            <select value={style} onChange={(e) => setStyle(e.target.value)} className="input-field text-sm">
              <option>Moderno e profissional</option>
              <option>Minimalista</option>
              <option>Colorido e vibrante</option>
              <option>Elegante e sofisticado</option>
              <option>Casual e amigavel</option>
              <option>Futurista</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-surface-600 mb-1">Cores da Marca (hex)</label>
            <input
              type="text"
              value={brandColors}
              onChange={(e) => setBrandColors(e.target.value)}
              className="input-field text-sm"
              placeholder="#4c6ef5, #fcc419"
            />
          </div>

          <button onClick={handleGenerate} disabled={loading} className="btn-primary w-full inline-flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Gerando...</> : <><Sparkles className="w-5 h-5" /> Gerar Imagens</>}
          </button>
        </div>

        <div className="lg:col-span-2">
          {generatedImages.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <ImageIcon className="w-16 h-16 text-surface-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-surface-900 mb-2">Pronto para criar</h3>
              <p className="text-surface-500">Descreva a imagem e selecione os formatos</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedImages.map((img, i) => (
                <div key={i} className="glass-card overflow-hidden group">
                  <div className="aspect-video bg-surface-100 relative cursor-pointer" onClick={() => setPreviewImage(img)}>
                    <img src={img.url} alt={`Imagem ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={(e) => { e.stopPropagation(); downloadImage(img.url, img.format); }}
                      className="absolute top-3 right-3 p-2 bg-white/90 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <Download className="w-4 h-4 text-surface-700" />
                    </button>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-xs text-surface-500 capitalize">{img.format.replace('-', ' ')}</span>
                    <button onClick={() => downloadImage(img.url, img.format)} className="text-xs text-brand-600 hover:text-brand-700 font-medium">
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setPreviewImage(null)}>
          <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setPreviewImage(null)} className="absolute -top-12 right-0 p-2 text-white hover:text-surface-300">
              <X className="w-8 h-8" />
            </button>
            <img src={previewImage.url} alt={previewImage.format} className="max-h-[85vh] rounded-lg shadow-2xl" />
            <div className="flex gap-3 mt-3 justify-center">
              <button
                onClick={() => downloadImage(previewImage.url, previewImage.format)}
                className="bg-white text-surface-900 px-6 py-2 rounded-lg font-medium hover:bg-surface-100 inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
