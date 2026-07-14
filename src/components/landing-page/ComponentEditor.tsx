'use client';

import { useState } from 'react';
import { LandingPageComponent } from '@/types';
import {
  GripVertical,
  Trash2,
  ChevronDown,
  ChevronUp,
  Image,
  Video,
  Type,
  MousePointerClick,
  MessageSquare,
  HelpCircle,
  ShieldCheck,
  Timer,
  Tag,
  Camera,
  ClipboardList,
  BarChart3,
} from 'lucide-react';

interface ComponentEditorProps {
  component: LandingPageComponent;
  onUpdate: (updated: LandingPageComponent) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const typeIcons: Record<string, React.ElementType> = {
  banner: Image,
  video: Video,
  text: Type,
  button: MousePointerClick,
  testimonial: MessageSquare,
  faq: HelpCircle,
  guarantee: ShieldCheck,
  countdown: Timer,
  offer: Tag,
  gallery: Camera,
  form: ClipboardList,
  progress_bar: BarChart3,
};

const typeLabels: Record<string, string> = {
  banner: 'Banner',
  video: 'Vídeo',
  text: 'Texto',
  button: 'Botão',
  testimonial: 'Depoimentos',
  faq: 'FAQ',
  guarantee: 'Garantia',
  countdown: 'Contador Regressivo',
  offer: 'Oferta',
  gallery: 'Galeria',
  form: 'Formulário',
  progress_bar: 'Barra de Progresso',
};

export function ComponentEditor({
  component,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: ComponentEditorProps) {
  const [expanded, setExpanded] = useState(true);
  const Icon = typeIcons[component.type] || Type;

  const updateContent = (key: string, value: unknown) => {
    onUpdate({
      ...component,
      content: { ...component.content, [key]: value },
    });
  };

  const updateAnimation = (key: string, value: unknown) => {
    onUpdate({
      ...component,
      animation: { ...component.animation, [key]: value } as LandingPageComponent['animation'],
    });
  };

  return (
    <div className="border border-surface-200 rounded-xl bg-white overflow-hidden">
      <div
        className="flex items-center gap-3 p-4 cursor-pointer hover:bg-surface-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <GripVertical className="w-5 h-5 text-surface-300 cursor-grab" />
        <Icon className="w-5 h-5 text-brand-600" />
        <span className="font-medium text-surface-900 flex-1">{typeLabels[component.type]}</span>
        
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
            disabled={isFirst}
            className="p-1 rounded hover:bg-surface-100 disabled:opacity-30"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
            disabled={isLast}
            className="p-1 rounded hover:bg-surface-100 disabled:opacity-30"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="p-1 rounded hover:bg-red-50 text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {expanded && (
        <div className="p-4 border-t border-surface-100 space-y-4 bg-surface-50/50">
          {component.type === 'banner' && (
            <>
              <div>
                <label className="block text-xs font-medium text-surface-600 mb-1">Título</label>
                <input
                  type="text"
                  value={component.content.title || ''}
                  onChange={(e) => updateContent('title', e.target.value)}
                  className="input-field text-sm"
                  placeholder="Título do banner"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-600 mb-1">Subtítulo</label>
                <input
                  type="text"
                  value={component.content.subtitle || ''}
                  onChange={(e) => updateContent('subtitle', e.target.value)}
                  className="input-field text-sm"
                  placeholder="Subtítulo"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-600 mb-1">URL da Imagem de Fundo</label>
                <input
                  type="url"
                  value={component.content.backgroundImage || ''}
                  onChange={(e) => updateContent('backgroundImage', e.target.value)}
                  className="input-field text-sm"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-600 mb-1">Texto do Botão CTA</label>
                <input
                  type="text"
                  value={component.content.ctaText || ''}
                  onChange={(e) => updateContent('ctaText', e.target.value)}
                  className="input-field text-sm"
                  placeholder="QUERO COMPRAR"
                />
              </div>
            </>
          )}

          {component.type === 'video' && (
            <>
              <div>
                <label className="block text-xs font-medium text-surface-600 mb-1">URL do Vídeo (YouTube/Vimeo)</label>
                <input
                  type="url"
                  value={component.content.url || ''}
                  onChange={(e) => updateContent('url', e.target.value)}
                  className="input-field text-sm"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-600 mb-1">Título</label>
                <input
                  type="text"
                  value={component.content.title || ''}
                  onChange={(e) => updateContent('title', e.target.value)}
                  className="input-field text-sm"
                  placeholder="Assista ao Vídeo"
                />
              </div>
            </>
          )}

          {component.type === 'text' && (
            <>
              <div>
                <label className="block text-xs font-medium text-surface-600 mb-1">Título</label>
                <input
                  type="text"
                  value={component.content.title || ''}
                  onChange={(e) => updateContent('title', e.target.value)}
                  className="input-field text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-600 mb-1">Conteúdo</label>
                <textarea
                  value={component.content.body || ''}
                  onChange={(e) => updateContent('body', e.target.value)}
                  className="input-field text-sm min-h-[100px] resize-y"
                  placeholder="Escreva o conteúdo..."
                />
              </div>
            </>
          )}

          {component.type === 'offer' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-surface-600 mb-1">Título</label>
                  <input
                    type="text"
                    value={component.content.title || ''}
                    onChange={(e) => updateContent('title', e.target.value)}
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-600 mb-1">Preço</label>
                  <input
                    type="text"
                    value={component.content.price || ''}
                    onChange={(e) => updateContent('price', e.target.value)}
                    className="input-field text-sm"
                    placeholder="R$ 197"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-surface-600 mb-1">Preço Original</label>
                  <input
                    type="text"
                    value={component.content.originalPrice || ''}
                    onChange={(e) => updateContent('originalPrice', e.target.value)}
                    className="input-field text-sm"
                    placeholder="R$ 497"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-600 mb-1">Texto do Botão</label>
                  <input
                    type="text"
                    value={component.content.buttonText || ''}
                    onChange={(e) => updateContent('buttonText', e.target.value)}
                    className="input-field text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-600 mb-1">Features (uma por linha)</label>
                <textarea
                  value={(component.content.features || []).join('\n')}
                  onChange={(e) => updateContent('features', e.target.value.split('\n').filter(Boolean))}
                  className="input-field text-sm min-h-[80px] resize-y"
                  placeholder="Acesso vitalício&#10;Suporte 24h&#10;Certificado"
                />
              </div>
            </>
          )}

          {component.type === 'countdown' && (
            <>
              <div>
                <label className="block text-xs font-medium text-surface-600 mb-1">Data/Hora Final</label>
                <input
                  type="datetime-local"
                  value={component.content.endDate ? new Date(component.content.endDate).toISOString().slice(0, 16) : ''}
                  onChange={(e) => updateContent('endDate', new Date(e.target.value).toISOString())}
                  className="input-field text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-600 mb-1">Texto</label>
                <input
                  type="text"
                  value={component.content.text || ''}
                  onChange={(e) => updateContent('text', e.target.value)}
                  className="input-field text-sm"
                  placeholder="Oferta termina em:"
                />
              </div>
            </>
          )}

          {component.type === 'faq' && (
            <div>
              <label className="block text-xs font-medium text-surface-600 mb-2">Perguntas Frequentes</label>
              {(component.content.items || []).map((item: { question: string; answer: string }, index: number) => (
                <div key={index} className="space-y-2 mb-3 p-3 bg-white rounded-lg border border-surface-200">
                  <input
                    type="text"
                    value={item.question}
                    onChange={(e) => {
                      const items = [...(component.content.items || [])];
                      items[index] = { ...items[index], question: e.target.value };
                      updateContent('items', items);
                    }}
                    className="input-field text-sm"
                    placeholder="Pergunta"
                  />
                  <textarea
                    value={item.answer}
                    onChange={(e) => {
                      const items = [...(component.content.items || [])];
                      items[index] = { ...items[index], answer: e.target.value };
                      updateContent('items', items);
                    }}
                    className="input-field text-sm resize-y"
                    placeholder="Resposta"
                    rows={2}
                  />
                  <button
                    onClick={() => {
                      const items = (component.content.items || []).filter((_: unknown, i: number) => i !== index);
                      updateContent('items', items);
                    }}
                    className="text-xs text-red-500 hover:text-red-600"
                  >
                    Remover
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const items = [...(component.content.items || []), { question: '', answer: '' }];
                  updateContent('items', items);
                }}
                className="text-sm text-brand-600 hover:text-brand-700 font-medium"
              >
                + Adicionar pergunta
              </button>
            </div>
          )}

          {component.type === 'guarantee' && (
            <>
              <div>
                <label className="block text-xs font-medium text-surface-600 mb-1">Título da Garantia</label>
                <input
                  type="text"
                  value={component.content.title || ''}
                  onChange={(e) => updateContent('title', e.target.value)}
                  className="input-field text-sm"
                  placeholder="Garantia de 7 Dias"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-600 mb-1">Texto</label>
                <textarea
                  value={component.content.text || ''}
                  onChange={(e) => updateContent('text', e.target.value)}
                  className="input-field text-sm min-h-[60px] resize-y"
                  placeholder="Se não ficar satisfeito..."
                />
              </div>
            </>
          )}

          {component.type === 'testimonial' && (
            <div>
              <label className="block text-xs font-medium text-surface-600 mb-2">Depoimentos</label>
              {(component.content.items || []).map((item: { name: string; text: string; avatar?: string }, index: number) => (
                <div key={index} className="space-y-2 mb-3 p-3 bg-white rounded-lg border border-surface-200">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => {
                        const items = [...(component.content.items || [])];
                        items[index] = { ...items[index], name: e.target.value };
                        updateContent('items', items);
                      }}
                      className="input-field text-sm"
                      placeholder="Nome"
                    />
                    <input
                      type="url"
                      value={item.avatar || ''}
                      onChange={(e) => {
                        const items = [...(component.content.items || [])];
                        items[index] = { ...items[index], avatar: e.target.value };
                        updateContent('items', items);
                      }}
                      className="input-field text-sm"
                      placeholder="URL da foto"
                    />
                  </div>
                  <textarea
                    value={item.text}
                    onChange={(e) => {
                      const items = [...(component.content.items || [])];
                      items[index] = { ...items[index], text: e.target.value };
                      updateContent('items', items);
                    }}
                    className="input-field text-sm resize-y"
                    placeholder="Depoimento"
                    rows={2}
                  />
                  <button
                    onClick={() => {
                      const items = (component.content.items || []).filter((_: unknown, i: number) => i !== index);
                      updateContent('items', items);
                    }}
                    className="text-xs text-red-500 hover:text-red-600"
                  >
                    Remover
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const items = [...(component.content.items || []), { name: '', text: '', avatar: '' }];
                  updateContent('items', items);
                }}
                className="text-sm text-brand-600 hover:text-brand-700 font-medium"
              >
                + Adicionar depoimento
              </button>
            </div>
          )}

          {/* Animation settings */}
          <div className="pt-3 border-t border-surface-200">
            <p className="text-xs font-medium text-surface-600 mb-2">Animação</p>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={component.animation?.type || 'none'}
                onChange={(e) => updateAnimation('type', e.target.value === 'none' ? undefined : e.target.value)}
                className="input-field text-sm"
              >
                <option value="none">Sem animação</option>
                <option value="fadeIn">Fade In</option>
                <option value="zoom">Zoom</option>
                <option value="slide">Slide</option>
                <option value="bounce">Bounce</option>
                <option value="pulse">Pulse</option>
                <option value="typewriter">Typewriter</option>
              </select>
              <input
                type="number"
                value={component.animation?.delay || 0}
                onChange={(e) => updateAnimation('delay', parseFloat(e.target.value))}
                className="input-field text-sm"
                placeholder="Delay (s)"
                step={0.1}
                min={0}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
