'use client';

import { useEffect, useRef, useState } from 'react';
import { LandingPageComponent, PageSettings } from '@/types';
import { generateId } from '@/lib/utils';
import { MessageCircle } from 'lucide-react';

interface Props {
  page: {
    id: string;
    title: string;
    slug: string;
    components: unknown;
    settings: unknown;
    meta_pixel_id: string | null;
    tiktok_pixel_id: string | null;
    ga4_measurement_id: string | null;
    gtm_id: string | null;
  };
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export function PublicLandingPage({ page, utmSource, utmMedium, utmCampaign }: Props) {
  const components = (page.components as unknown as LandingPageComponent[]) || [];
  const settings = (page.settings as unknown as PageSettings) || {} as PageSettings;
  const visitorId = useRef(generateId());
  const [showFloatingButton, setShowFloatingButton] = useState(false);

  useEffect(() => {
    // Track visit
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        landing_page_id: page.id,
        visitor_id: visitorId.current,
        event_type: 'visit',
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
      }),
    });

    // Show floating button after scroll
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 30) setShowFloatingButton(true);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page.id, utmSource, utmMedium, utmCampaign]);

  // Meta Pixel
  useEffect(() => {
    if (page.meta_pixel_id) {
      const script = document.createElement('script');
      script.innerHTML = `
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
        n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
        document,'script','https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${page.meta_pixel_id}');fbq('track', 'PageView');
      `;
      document.head.appendChild(script);
    }
  }, [page.meta_pixel_id]);

  // TikTok Pixel
  useEffect(() => {
    if (page.tiktok_pixel_id) {
      const script = document.createElement('script');
      script.innerHTML = `
        !function (w, d, t) { w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e+""]=+new Date,ttq._o=ttq._o||{},ttq._o[e+""]=n||{};var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src=r+"?sdkid="+e+"&lib="+t;var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(a,s)};
        ttq.load('${page.tiktok_pixel_id}');ttq.page();}(window, document, 'ttq');
      `;
      document.head.appendChild(script);
    }
  }, [page.tiktok_pixel_id]);

  // Google Analytics 4
  useEffect(() => {
    if (page.ga4_measurement_id) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${page.ga4_measurement_id}`;
      document.head.appendChild(script);

      const configScript = document.createElement('script');
      configScript.innerHTML = `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${page.ga4_measurement_id}');`;
      document.head.appendChild(configScript);
    }
  }, [page.ga4_measurement_id]);

  const trackEvent = (eventType: string, eventData?: Record<string, unknown>) => {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        landing_page_id: page.id,
        visitor_id: visitorId.current,
        event_type: eventType,
        event_data: eventData,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
      }),
    });
  };

  const handleCTAClick = () => {
    trackEvent('click', { type: 'cta' });
    if (settings.checkoutUrl) {
      window.open(settings.checkoutUrl, '_blank');
    }
  };

  const handleWhatsApp = () => {
    trackEvent('click', { type: 'whatsapp' });
    const message = encodeURIComponent(settings.whatsappMessage || 'Olá!');
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: settings.fontFamily || 'Inter' }}>
      {components.map((comp, index) => (
        <RenderComponent
          key={comp.id}
          component={comp}
          settings={settings}
          onCTAClick={handleCTAClick}
          index={index}
        />
      ))}

      {/* Floating WhatsApp Button */}
      {settings.whatsappNumber && (
        <a
          href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(settings.whatsappMessage || 'Olá!')}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('click', { type: 'whatsapp_float' })}
          className={`fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${showFloatingButton ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
        >
          <MessageCircle className="w-7 h-7" />
        </a>
      )}

      {/* Floating CTA */}
      {showFloatingButton && (
        <div className="fixed bottom-6 left-6 z-50">
          <button
            onClick={handleCTAClick}
            className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-6 rounded-full shadow-2xl transition-all animate-pulse-glow"
          >
            {components.find(c => c.type === 'offer')?.content.buttonText || 'COMPRAR AGORA'}
          </button>
        </div>
      )}
    </div>
  );
}

function RenderComponent({
  component,
  settings,
  onCTAClick,
  index,
}: {
  component: LandingPageComponent;
  settings: PageSettings;
  onCTAClick: () => void;
  index: number;
}) {
  const animDelay = component.animation?.delay || index * 0.1;
  
  return (
    <div style={{ animationDelay: `${animDelay}s` }} className={`animate-${component.animation?.type || 'fadeIn'}`}>
      {component.type === 'banner' && (
        <div
          className="relative py-24 px-8 text-center min-h-[500px] flex items-center justify-center"
          style={{
            background: component.content.backgroundImage
              ? `url(${component.content.backgroundImage}) center/cover`
              : `linear-gradient(135deg, ${settings.primaryColor}, ${settings.primaryColor}bb)`,
          }}
        >
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {component.content.title || 'Título'}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed">
              {component.content.subtitle || 'Subtítulo'}
            </p>
            {component.content.ctaText && (
              <button
                onClick={onCTAClick}
                className="px-10 py-5 rounded-xl font-bold text-xl shadow-2xl hover:scale-105 transition-transform"
                style={{ backgroundColor: settings.secondaryColor, color: '#000' }}
              >
                {component.content.ctaText}
              </button>
            )}
          </div>
        </div>
      )}

      {component.type === 'text' && (
        <div className="py-16 px-8">
          <div className="max-w-3xl mx-auto">
            {component.content.title && (
              <h2 className="text-3xl font-bold mb-6" style={{ color: settings.primaryColor, textAlign: component.content.alignment || 'center' }}>
                {component.content.title}
              </h2>
            )}
            <div className="text-lg text-surface-700 leading-relaxed whitespace-pre-wrap" style={{ textAlign: component.content.alignment || 'left' }}>
              {component.content.body}
            </div>
          </div>
        </div>
      )}

      {component.type === 'video' && (
        <div className="py-16 px-8">
          <div className="max-w-4xl mx-auto">
            {component.content.title && (
              <h3 className="text-2xl font-bold mb-6 text-center">{component.content.title}</h3>
            )}
            <div className="aspect-video bg-surface-900 rounded-2xl overflow-hidden shadow-2xl">
              {component.content.url ? (
                <iframe
                  src={String(component.content.url).replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/50 text-lg">
                  Vídeo
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {component.type === 'offer' && (
        <div className="py-16 px-8" style={{ backgroundColor: settings.primaryColor + '08' }}>
          <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-2xl p-10 text-center border-2" style={{ borderColor: settings.primaryColor + '30' }}>
            {component.content.title && (
              <h3 className="text-3xl font-bold mb-6" style={{ color: settings.primaryColor }}>{component.content.title}</h3>
            )}
            <div className="mb-8">
              {component.content.originalPrice && (
                <p className="text-surface-400 line-through text-xl mb-1">{component.content.originalPrice}</p>
              )}
              <p className="text-5xl font-bold" style={{ color: settings.primaryColor }}>{component.content.price || 'R$ 0'}</p>
            </div>
            {component.content.features && (
              <ul className="text-left space-y-3 mb-8">
                {(component.content.features as string[]).map((feature: string, i: number) => (
                  <li key={i} className="flex items-center gap-3 text-surface-700 text-lg">
                    <span className="text-green-500 text-xl">✓</span> {feature}
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={onCTAClick}
              className="w-full py-5 rounded-xl font-bold text-xl shadow-xl hover:scale-[1.02] transition-transform"
              style={{ backgroundColor: settings.secondaryColor, color: '#000' }}
            >
              {component.content.buttonText || 'COMPRAR AGORA'}
            </button>
          </div>
        </div>
      )}

      {component.type === 'faq' && (
        <div className="py-16 px-8">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-center mb-10" style={{ color: settings.primaryColor }}>
              Perguntas Frequentes
            </h3>
            <div className="space-y-4">
              {(component.content.items || []).map((item: { question: string; answer: string }, i: number) => (
                <details key={i} className="group border border-surface-200 rounded-2xl overflow-hidden shadow-sm">
                  <summary className="p-5 font-semibold cursor-pointer hover:bg-surface-50 transition-colors list-none flex items-center justify-between">
                    <span>{item.question}</span>
                    <span className="text-surface-400 group-open:rotate-180 transition-transform text-xl">▼</span>
                  </summary>
                  <div className="p-5 pt-0 text-surface-600 leading-relaxed">{item.answer}</div>
                </details>
              ))}
            </div>
          </div>
        </div>
      )}

      {component.type === 'guarantee' && (
        <div className="py-16 px-8">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🛡️</span>
            </div>
            <h3 className="text-2xl font-bold mb-3">{component.content.title || 'Garantia'}</h3>
            <p className="text-lg text-surface-600 leading-relaxed">{component.content.text}</p>
          </div>
        </div>
      )}

      {component.type === 'countdown' && (
        <div className="py-10 px-8" style={{ backgroundColor: settings.primaryColor + '10' }}>
          <div className="max-w-lg mx-auto text-center">
            <p className="text-lg text-surface-600 mb-4">{component.content.text || 'Oferta termina em:'}</p>
            <CountdownTimer endDate={String(component.content.endDate || '')} />
          </div>
        </div>
      )}

      {component.type === 'testimonial' && (
        <div className="py-16 px-8">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-3xl font-bold text-center mb-10" style={{ color: settings.primaryColor }}>
              O que dizem nossos clientes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(component.content.items || []).map((item: { name: string; text: string; avatar?: string }, i: number) => (
                <div key={i} className="bg-white p-8 rounded-2xl border border-surface-200 shadow-lg">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map(s => <span key={s} className="text-amber-400 text-lg">★</span>)}
                  </div>
                  <p className="text-surface-600 mb-6 italic leading-relaxed">&ldquo;{item.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    {item.avatar ? (
                      <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 font-bold">
                        {item.name.charAt(0)}
                      </div>
                    )}
                    <p className="font-semibold text-surface-900">{item.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CountdownTimer({ endDate }: { endDate: string }) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(endDate).getTime();
    
    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      setTime({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  return (
    <div className="flex justify-center gap-4">
      {[
        { value: time.days, label: 'Dias' },
        { value: time.hours, label: 'Horas' },
        { value: time.minutes, label: 'Min' },
        { value: time.seconds, label: 'Seg' },
      ].map((item, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-lg p-4 min-w-[80px]">
          <p className="text-3xl font-bold text-brand-600">{String(item.value).padStart(2, '0')}</p>
          <p className="text-xs text-surface-500 mt-1">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
