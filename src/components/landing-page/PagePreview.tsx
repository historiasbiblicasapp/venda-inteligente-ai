'use client';

import { LandingPageComponent, PageSettings } from '@/types';

interface PagePreviewProps {
  components: LandingPageComponent[];
  settings: PageSettings;
}

export function PagePreview({ components, settings }: PagePreviewProps) {
  return (
    <div
      className="min-h-[600px] bg-white rounded-xl border border-surface-200 overflow-hidden"
      style={{ fontFamily: settings.fontFamily }}
    >
      {components.length === 0 ? (
        <div className="h-full flex items-center justify-center text-surface-400">
          <p>Adicione componentes para ver a pré-visualização</p>
        </div>
      ) : (
        components.map((comp) => <PreviewComponent key={comp.id} component={comp} settings={settings} />)
      )}
    </div>
  );
}

function PreviewComponent({ component, settings }: { component: LandingPageComponent; settings: PageSettings }) {
  const animClass = component.animation?.type
    ? `animate-${component.animation.type === 'typewriter' ? 'fade-in' : component.animation.type}`
    : '';

  switch (component.type) {
    case 'banner':
      return (
        <div
          className={`relative py-20 px-8 text-center ${animClass}`}
          style={{
            background: component.content.backgroundImage
              ? `url(${component.content.backgroundImage}) center/cover`
              : `linear-gradient(135deg, ${settings.primaryColor}, ${settings.primaryColor}dd)`,
          }}
        >
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-white mb-4">{component.content.title || 'Título'}</h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">{component.content.subtitle || 'Subtítulo'}</p>
            {component.content.ctaText && (
              <button
                className="px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-transform"
                style={{ backgroundColor: settings.secondaryColor, color: '#000' }}
              >
                {component.content.ctaText}
              </button>
            )}
          </div>
        </div>
      );

    case 'text':
      return (
        <div className={`py-12 px-8 ${animClass}`}>
          <div className="max-w-3xl mx-auto">
            {component.content.title && (
              <h2 className="text-2xl font-bold mb-4" style={{ color: settings.primaryColor }}>
                {component.content.title}
              </h2>
            )}
            <div className="text-surface-700 leading-relaxed whitespace-pre-wrap">
              {component.content.body || 'Texto do componente...'}
            </div>
          </div>
        </div>
      );

    case 'video':
      return (
        <div className={`py-12 px-8 ${animClass}`}>
          <div className="max-w-3xl mx-auto">
            {component.content.title && (
              <h3 className="text-xl font-semibold mb-4 text-center">{component.content.title}</h3>
            )}
            <div className="aspect-video bg-surface-100 rounded-xl overflow-hidden">
              {component.content.url ? (
                <iframe
                  src={component.content.url.replace('watch?v=', 'embed/')}
                  className="w-full h-full"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-surface-400">
                  Adicione a URL do vídeo
                </div>
              )}
            </div>
          </div>
        </div>
      );

    case 'offer':
      return (
        <div className={`py-12 px-8 ${animClass}`} style={{ backgroundColor: settings.primaryColor + '08' }}>
          <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-8 text-center border-2" style={{ borderColor: settings.primaryColor }}>
            {component.content.title && (
              <h3 className="text-2xl font-bold mb-4" style={{ color: settings.primaryColor }}>{component.content.title}</h3>
            )}
            <div className="mb-6">
              {component.content.originalPrice && (
                <p className="text-surface-400 line-through text-lg">{component.content.originalPrice}</p>
              )}
              <p className="text-4xl font-bold" style={{ color: settings.primaryColor }}>{component.content.price || 'R$ 0'}</p>
            </div>
            {component.content.features && (
              <ul className="text-left space-y-2 mb-8">
                {(component.content.features as string[]).map((feature: string, i: number) => (
                  <li key={i} className="flex items-center gap-2 text-surface-700">
                    <span className="text-green-500">✓</span> {feature}
                  </li>
                ))}
              </ul>
            )}
            <button
              className="w-full py-4 rounded-xl font-bold text-lg shadow-lg hover:scale-[1.02] transition-transform"
              style={{ backgroundColor: settings.secondaryColor, color: '#000' }}
            >
              {component.content.buttonText || 'COMPRAR AGORA'}
            </button>
          </div>
        </div>
      );

    case 'faq':
      return (
        <div className={`py-12 px-8 ${animClass}`}>
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8" style={{ color: settings.primaryColor }}>
              Perguntas Frequentes
            </h3>
            <div className="space-y-3">
              {(component.content.items || []).map((item: { question: string; answer: string }, i: number) => (
                <details key={i} className="group border border-surface-200 rounded-xl overflow-hidden">
                  <summary className="p-4 font-medium cursor-pointer hover:bg-surface-50 transition-colors list-none flex items-center justify-between">
                    {item.question || 'Pergunta'}
                    <span className="text-surface-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="p-4 pt-0 text-surface-600">{item.answer || 'Resposta'}</div>
                </details>
              ))}
            </div>
          </div>
        </div>
      );

    case 'guarantee':
      return (
        <div className={`py-12 px-8 ${animClass}`}>
          <div className="max-w-lg mx-auto text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🛡️</span>
            </div>
            <h3 className="text-xl font-bold mb-2">{component.content.title || 'Garantia'}</h3>
            <p className="text-surface-600">{component.content.text || 'Texto da garantia'}</p>
          </div>
        </div>
      );

    case 'countdown':
      return (
        <div
          className={`py-8 px-8 ${animClass}`}
          style={{ backgroundColor: settings.primaryColor + '10' }}
        >
          <div className="max-w-lg mx-auto text-center">
            <p className="text-surface-600 mb-3">{component.content.text || 'Oferta termina em:'}</p>
            <div className="flex justify-center gap-3">
              {['03', '12', '45', '30'].map((val, i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg p-3 min-w-[70px]">
                  <p className="text-2xl font-bold" style={{ color: settings.primaryColor }}>{val}</p>
                  <p className="text-xs text-surface-500">{['Dias', 'Horas', 'Min', 'Seg'][i]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'testimonial':
      return (
        <div className={`py-12 px-8 ${animClass}`}>
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8" style={{ color: settings.primaryColor }}>
              O que dizem nossos clientes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(component.content.items || []).map((item: { name: string; text: string }, i: number) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-surface-200 shadow-sm">
                  <p className="text-surface-600 mb-4 italic">&ldquo;{item.text || 'Depoimento'}&rdquo;</p>
                  <p className="font-semibold text-surface-900">{item.name || 'Nome'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="py-8 px-8 text-center text-surface-400">
          Componente: {component.type}
        </div>
      );
  }
}
