'use client';

import { useState, useRef, useCallback } from 'react';
import { Film, Sparkles, Download, Loader2, Play, Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface Scene {
  id: number;
  narration: string;
  onScreenText: string;
  imagePrompt: string;
  imageUrl: string;
  duration: number;
}

interface VideoData {
  scenes: Scene[];
  resolution: { w: number; h: number };
  duration: number;
}

const platforms = [
  { id: 'feed', label: 'Instagram Feed', size: '1080x1080' },
  { id: 'stories', label: 'Stories/Reels', size: '1080x1920' },
  { id: 'reels', label: 'Reels', size: '1080x1920' },
  { id: 'tiktok', label: 'TikTok', size: '1080x1920' },
  { id: 'kwai', label: 'Kwai', size: '1080x1920' },
  { id: 'landscape', label: 'YouTube/Facebook', size: '1280x720' },
];

export default function AIVideoPage() {
  const [productName, setProductName] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [platform, setPlatform] = useState('stories');
  const [style, setStyle] = useState('Moderno e profissional');
  const [duration, setDuration] = useState('15');
  const [script, setScript] = useState('');
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(false);
  const [rendering, setRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleGenerate = async () => {
    if (!productName && !script) {
      toast.error('Digite o nome do produto ou cole um roteiro');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/ai/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName, targetAudience, platform, style, duration, script }),
      });
      const data = await response.json();
      if (data.error) {
        toast.error(data.error);
        setLoading(false);
        return;
      }
      const scenesWithImages: Scene[] = data.scenes.map((s: Scene) => {
        const encoded = encodeURIComponent(s.imagePrompt);
        const seed = Math.floor(Math.random() * 10000);
        const res = data.resolution;
        return {
          ...s,
          imageUrl: `https://image.pollinations.ai/prompt/${encoded}?width=${res.w}&height=${res.h}&seed=${seed}&model=flux&nologo=true&enhance=true`,
        };
      });
      setVideoData({ scenes: scenesWithImages, resolution: data.resolution, duration: data.duration });
      toast.success(`${scenesWithImages.length} cenas geradas!`);
    } catch {
      toast.error('Erro ao gerar cenas');
    }
    setLoading(false);
  };

  const preloadImages = useCallback(async (scenes: Scene[]): Promise<HTMLImageElement[]> => {
    const images: HTMLImageElement[] = [];
    for (const scene of scenes) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve) => {
        img.onload = () => { images.push(img); resolve(); };
        img.onerror = () => {
          const fallback = new Image();
          fallback.crossOrigin = 'anonymous';
          fallback.onload = () => { images.push(fallback); resolve(); };
          fallback.onerror = () => { images.push(fallback); resolve(); };
          fallback.src = `https://placehold.co/${videoData?.resolution.w || 1080}x${videoData?.resolution.h || 1920}/333/fff?text=Scene+${scene.id}`;
        };
        img.src = scene.imageUrl;
      });
    }
    return images;
  }, [videoData]);

  const drawScene = useCallback((
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement | null,
    scene: Scene,
    w: number,
    h: number,
    progress: number,
  ) => {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);

    const isVertical = h > w;

    if (img && img.complete && img.naturalWidth > 0) {
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = w / h;
      let drawW: number, drawH: number;

      if (imgRatio > canvasRatio) {
        drawH = h * 1.2;
        drawW = drawH * imgRatio;
      } else {
        drawW = w * 1.2;
        drawH = drawW / imgRatio;
      }

      const kenBurnsType = scene.id % 4;
      let scale = 1;
      let panX = 0;
      let panY = 0;

      switch (kenBurnsType) {
        case 0: scale = 1 + progress * 0.12; break;
        case 1: scale = 1.12 - progress * 0.12; break;
        case 2: scale = 1.06; panX = (progress - 0.5) * w * 0.06; break;
        case 3: scale = 1.06; panY = (progress - 0.5) * h * 0.04; break;
      }

      const offsetX = (w - drawW) / 2;
      const offsetY = (h - drawH) / 2;

      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.scale(scale, scale);
      ctx.translate(-w / 2 + panX, -h / 2 + panY);
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
      ctx.restore();

      if (isVertical) {
        const topGrad = ctx.createLinearGradient(0, 0, 0, h * 0.25);
        topGrad.addColorStop(0, 'rgba(0,0,0,0.6)');
        topGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = topGrad;
        ctx.fillRect(0, 0, w, h * 0.25);

        const botGrad = ctx.createLinearGradient(0, h * 0.55, 0, h);
        botGrad.addColorStop(0, 'rgba(0,0,0,0)');
        botGrad.addColorStop(0.5, 'rgba(0,0,0,0.5)');
        botGrad.addColorStop(1, 'rgba(0,0,0,0.88)');
        ctx.fillStyle = botGrad;
        ctx.fillRect(0, h * 0.55, w, h * 0.45);
      } else {
        const botGrad = ctx.createLinearGradient(0, h * 0.5, 0, h);
        botGrad.addColorStop(0, 'rgba(0,0,0,0)');
        botGrad.addColorStop(1, 'rgba(0,0,0,0.82)');
        ctx.fillStyle = botGrad;
        ctx.fillRect(0, h * 0.5, w, h * 0.5);
      }

      const vigRadius = Math.max(w, h) * 0.75;
      const vigGrad = ctx.createRadialGradient(w / 2, h / 2, vigRadius * 0.4, w / 2, h / 2, vigRadius);
      vigGrad.addColorStop(0, 'rgba(0,0,0,0)');
      vigGrad.addColorStop(1, 'rgba(0,0,0,0.35)');
      ctx.fillStyle = vigGrad;
      ctx.fillRect(0, 0, w, h);
    }

    const displayText = scene.onScreenText || scene.narration;
    if (displayText) {
      const fontSize = isVertical
        ? Math.max(28, Math.min(w * 0.06, 56))
        : Math.max(22, Math.min(w * 0.038, 44));
      ctx.font = `800 ${fontSize}px "Inter", "Segoe UI", system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const maxWidth = w * 0.88;
      const words = displayText.split(' ');
      const lines: string[] = [];
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        if (ctx.measureText(testLine).width > maxWidth) {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);

      const lineHeight = fontSize * 1.5;
      const totalTextHeight = lines.length * lineHeight;
      const textBlockCenterY = isVertical ? h * 0.8 : h * 0.82;
      const startY = textBlockCenterY - totalTextHeight / 2;

      for (let i = 0; i < lines.length; i++) {
        const lineProgress = Math.min(1, Math.max(0, (progress * lines.length * 1.5) - i * 0.5));
        if (lineProgress <= 0) continue;

        const y = startY + i * lineHeight;
        const alpha = lineProgress;
        const slideY = (1 - lineProgress) * 15;

        ctx.save();
        ctx.globalAlpha = alpha;

        ctx.strokeStyle = 'rgba(0,0,0,0.8)';
        ctx.lineWidth = fontSize * 0.12;
        ctx.lineJoin = 'round';
        ctx.miterLimit = 2;
        ctx.strokeText(lines[i], w / 2, y + slideY);

        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;
        ctx.fillStyle = '#ffffff';
        ctx.fillText(lines[i], w / 2, y + slideY);

        ctx.restore();
      }
    }

    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fillRect(0, h - 3, w * progress, 3);
  }, []);

  const renderVideo = useCallback(async () => {
    if (!videoData || !canvasRef.current) return;
    setRendering(true);
    setRenderProgress(0);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const { w, h } = videoData.resolution;
    canvas.width = w;
    canvas.height = h;

    const images = await preloadImages(videoData.scenes);
    const fps = 30;
    const transitionFrames = Math.floor(fps * 0.5);

    const stream = canvas.captureStream(fps);
    const chunks: Blob[] = [];
    const recorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: 5000000,
    });

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    return new Promise<void>((resolve) => {
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${productName || 'video'}-${platform}-${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setRendering(false);
        setRenderProgress(100);
        toast.success('Video baixado!');
        resolve();
      };

      recorder.start();

      let currentFrame = 0;
      const totalFrames = videoData.scenes.reduce((acc, s) => acc + s.duration * fps, 0);

      const renderFrame = () => {
        let frameAccum = 0;
        let sceneIdx = 0;

        for (let i = 0; i < videoData.scenes.length; i++) {
          const sceneFrames = videoData.scenes[i].duration * fps;
          if (currentFrame < frameAccum + sceneFrames) {
            sceneIdx = i;
            break;
          }
          frameAccum += sceneFrames;
          if (i === videoData.scenes.length - 1) sceneIdx = i;
        }

        const sceneStartFrame = videoData.scenes.slice(0, sceneIdx).reduce((a, s) => a + s.duration * fps, 0);
        const sceneLocalFrame = currentFrame - sceneStartFrame;
        const sceneFrames = videoData.scenes[sceneIdx].duration * fps;
        const sceneProgress = sceneLocalFrame / sceneFrames;

        drawScene(ctx, images[sceneIdx] || null, videoData.scenes[sceneIdx], w, h, sceneProgress);

        if (sceneIdx > 0 && sceneLocalFrame < transitionFrames) {
          ctx.globalAlpha = 1 - sceneLocalFrame / transitionFrames;
          drawScene(ctx, images[sceneIdx - 1] || null, videoData.scenes[sceneIdx - 1], w, h, 1);
          ctx.globalAlpha = 1;
          ctx.drawImage(canvas, 0, 0);
        }

        setRenderProgress(Math.round((currentFrame / totalFrames) * 100));
        currentFrame++;

        if (currentFrame < totalFrames) {
          requestAnimationFrame(renderFrame);
        } else {
          recorder.stop();
        }
      };

      renderFrame();
    });
  }, [videoData, preloadImages, drawScene, productName, platform]);

  const updateScene = (id: number, field: keyof Scene, value: string | number) => {
    if (!videoData) return;
    setVideoData({
      ...videoData,
      scenes: videoData.scenes.map(s => s.id === id ? { ...s, [field]: value } : s),
    });
  };

  const removeScene = (id: number) => {
    if (!videoData) return;
    setVideoData({ ...videoData, scenes: videoData.scenes.filter(s => s.id !== id) });
  };

  const addScene = () => {
    if (!videoData) return;
    const newId = Math.max(...videoData.scenes.map(s => s.id), 0) + 1;
    const totalScenes = videoData.scenes.length + 1;
    const avgDuration = Math.ceil(videoData.duration / totalScenes);
    setVideoData({
      ...videoData,
      scenes: [...videoData.scenes, {
        id: newId,
        narration: '',
        onScreenText: '',
        imagePrompt: '',
        imageUrl: '',
        duration: avgDuration,
      }],
    });
  };

  const generateSceneImage = async (sceneId: number) => {
    if (!videoData) return;
    const scene = videoData.scenes.find(s => s.id === sceneId);
    if (!scene) return;

    const text = scene.narration || scene.onScreenText || 'cinematic marketing scene';
    const prompt = `Cinematic still frame for social media video. ${text}. Style: professional, dramatic lighting, 8K, photorealistic, no text, no watermark.`;
    const seed = Math.floor(Math.random() * 10000);
    const encoded = encodeURIComponent(prompt);
    const { w, h } = videoData.resolution;
    const url = `https://image.pollinations.ai/prompt/${encoded}?width=${w}&height=${h}&seed=${seed}&model=flux&nologo=true&enhance=true`;

    updateScene(sceneId, 'imagePrompt', prompt);
    updateScene(sceneId, 'imageUrl', url);
  };

  const regenerateSceneImage = async (sceneId: number) => {
    await generateSceneImage(sceneId);
  };

  const generateAllImages = async () => {
    if (!videoData) return;
    toast.loading('Gerando imagens para todas as cenas...', { id: 'gen-all' });
    for (const scene of videoData.scenes) {
      await generateSceneImage(scene.id);
    }
    toast.success('Todas as imagens geradas!', { id: 'gen-all' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 flex items-center gap-2">
          <Film className="w-7 h-7 text-brand-600" /> IA Video
        </h1>
        <p className="text-surface-500">Gere videos curtos para redes sociais com imagens AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 glass-card p-5 space-y-4">
          <h3 className="font-semibold text-surface-900">Configuracoes</h3>

          <div>
            <label className="block text-xs font-medium text-surface-600 mb-1">Nome do Produto</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Ex: Curso de Marketing"
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-surface-600 mb-1">Publico-alvo</label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="Ex: Empreendedores 25-40 anos"
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-surface-600 mb-2">Plataforma</label>
            <div className="grid grid-cols-2 gap-2">
              {platforms.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p.id)}
                  className={`p-2 rounded-xl text-xs font-medium transition-all border ${
                    platform === p.id ? 'border-brand-500 bg-brand-50' : 'border-surface-200 hover:border-surface-300'
                  }`}
                >
                  {p.label}
                  <p className="text-[10px] text-surface-400">{p.size}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-surface-600 mb-1">Duracao</label>
            <select value={duration} onChange={(e) => setDuration(e.target.value)} className="input-field text-sm">
              <option value="15">15 segundos</option>
              <option value="30">30 segundos</option>
              <option value="60">60 segundos</option>
            </select>
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
            <label className="block text-xs font-medium text-surface-600 mb-1">Roteiro (opcional)</label>
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="Cole um roteiro com [Fala] e [Tela]... ou deixe vazio para gerar auto"
              className="input-field text-sm min-h-[80px] resize-y"
            />
          </div>

          <button onClick={handleGenerate} disabled={loading} className="btn-primary w-full inline-flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Gerando...</> : <><Sparkles className="w-5 h-5" /> Gerar Cenas</>}
          </button>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {!videoData ? (
            <div className="glass-card p-12 text-center">
              <Film className="w-16 h-16 text-surface-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-surface-900 mb-2">Pronto para criar</h3>
              <p className="text-surface-500">Configure e clique em gerar para criar seu video</p>
            </div>
          ) : (
            <>
              <div className="glass-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-surface-900">{videoData.scenes.length} cenas - {videoData.resolution.w}x{videoData.resolution.h}</h3>
                  <div className="flex gap-2">
                    <button onClick={addScene} className="text-xs text-brand-600 hover:text-brand-700 font-medium inline-flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Cena
                    </button>
                    <button onClick={generateAllImages} className="text-xs text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Gerar Todas
                    </button>
                    <button
                      onClick={renderVideo}
                      disabled={rendering}
                      className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-2"
                    >
                      {rendering ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> {renderProgress}%</>
                      ) : (
                        <><Download className="w-4 h-4" /> Baixar Video</>
                      )}
                    </button>
                  </div>
                </div>
                {rendering && (
                  <div className="w-full bg-surface-200 rounded-full h-2 mb-2">
                    <div className="bg-brand-600 h-2 rounded-full transition-all" style={{ width: `${renderProgress}%` }} />
                  </div>
                )}
                <canvas ref={canvasRef} className="w-full rounded-lg bg-black" style={{ display: videoData.scenes.length > 0 ? 'block' : 'none' }} />
              </div>

              {videoData.scenes.map((scene, i) => (
                <div key={scene.id} className="glass-card p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-32 h-40 bg-surface-100 rounded-lg overflow-hidden relative group cursor-pointer"
                      onClick={() => setPreviewIndex(previewIndex === i ? null : i)}>
                      {scene.imageUrl ? (
                        <img src={scene.imageUrl} alt={`Cena ${scene.id}`} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-surface-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-1 rounded">
                          Cena {scene.id} ({scene.duration}s)
                        </span>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={1}
                            max={15}
                            value={scene.duration}
                            onChange={(e) => updateScene(scene.id, 'duration', parseInt(e.target.value) || 3)}
                            className="w-14 text-xs text-center border rounded px-1 py-0.5"
                          />
                          <span className="text-[10px] text-surface-400">seg</span>
                          <button onClick={() => removeScene(scene.id)} className="p-1 hover:bg-surface-100 rounded">
                            <Trash2 className="w-3 h-3 text-surface-400" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-medium text-surface-500">Narrazione</label>
                        <textarea
                          value={scene.narration}
                          onChange={(e) => updateScene(scene.id, 'narration', e.target.value)}
                          className="input-field text-xs min-h-[40px] resize-y w-full"
                          placeholder="Texto que sera falado..."
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-medium text-surface-500">Texto na tela</label>
                        <input
                          type="text"
                          value={scene.onScreenText}
                          onChange={(e) => updateScene(scene.id, 'onScreenText', e.target.value)}
                          className="input-field text-xs w-full"
                          placeholder="Texto que aparece na tela..."
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => generateSceneImage(scene.id)}
                          className="text-[10px] bg-brand-50 text-brand-600 hover:bg-brand-100 px-2 py-1 rounded font-medium inline-flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" /> Gerar Imagem
                        </button>
                        {scene.imageUrl && (
                          <button
                            onClick={() => regenerateSceneImage(scene.id)}
                            className="text-[10px] bg-surface-100 text-surface-600 hover:bg-surface-200 px-2 py-1 rounded font-medium inline-flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3" /> Regenerar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
