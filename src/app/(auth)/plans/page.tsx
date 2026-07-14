'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Check, Zap, ArrowRight, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: '47',
    description: 'Ideal para quem esta comecando',
    features: [
      '3 Landing Pages',
      '500 Leads/mes',
      'IA para Copy (50 geracoes)',
      'IA para Imagens (20 geracoes)',
      'Posts & Legendas (30 geracoes)',
      'CRM basico',
      'Suporte por email',
    ],
    popular: false,
  },
  {
    id: 'profissional',
    name: 'Profissional',
    price: '97',
    description: 'Para quem quer escalar vendas',
    features: [
      '15 Landing Pages',
      '5.000 Leads/mes',
      'IA para Copy ilimitada',
      'IA para Imagens (100 geracoes)',
      'Posts & Legendas ilimitados',
      'Campanhas multi-plataforma',
      'CRM completo com tags',
      'Relatorios avancados',
      'Pixels (Meta, TikTok, GA4)',
      'Suporte prioritario',
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '197',
    description: 'Para agencias e empresas',
    features: [
      'Landing Pages ilimitadas',
      'Leads ilimitados',
      'Toda IA ilimitada',
      'Campanhas ilimitadas',
      'CRM white-label',
      'Relatorios personalizados',
      'API de integracao',
      'Webhooks (Kiwify, Hotmart)',
      'Suporte dedicado',
      'Treinamento incluso',
    ],
    popular: false,
  },
];

export default function PlansPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_plan, subscription_status')
          .eq('id', user.id)
          .single();
        if (profile?.subscription_status === 'active' && profile?.subscription_plan) {
          router.push('/dashboard');
        }
        setCurrentPlan(profile?.subscription_plan || null);
      }
    };
    checkProfile();
  }, [supabase, router]);

  const handleSelectPlan = async (planId: string) => {
    setSelectedPlan(planId);
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Voce precisa estar logado');
      setLoading(false);
      return;
    }

    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'active',
        subscription_plan: planId as any,
        subscription_started_at: now.toISOString(),
        subscription_expires_at: expiresAt.toISOString(),
      })
      .eq('id', user.id);

    if (error) {
      toast.error('Erro ao ativar plano: ' + error.message);
      setLoading(false);
      return;
    }

    toast.success('Plano ativado com sucesso!');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-surface-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Escolha seu plano
          </div>
          <h1 className="text-4xl font-extrabold text-surface-900 mb-4">Seu proximo passo para vender mais</h1>
          <p className="text-lg text-surface-500">Selecione o plano ideal para o seu negocio. Cancele quando quiser.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-3xl p-8 border-2 transition-all cursor-pointer hover:-translate-y-1 ${
                selectedPlan === plan.id
                  ? 'border-brand-600 shadow-2xl shadow-brand-600/10 scale-105'
                  : plan.popular
                  ? 'border-brand-600 shadow-xl shadow-brand-600/10 scale-105'
                  : 'border-surface-100 hover:border-brand-200'
              }`}
              onClick={() => !loading && setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-600 to-brand-500 text-white px-5 py-1.5 rounded-full text-sm font-bold shadow-lg relative">
                  Mais Popular
                </div>
              )}
              <h3 className="text-2xl font-bold text-surface-900">{plan.name}</h3>
              <p className="text-sm text-surface-500 mt-1 mb-4">{plan.description}</p>
              <div className="mb-6">
                <span className="text-sm text-surface-500">R$</span>
                <span className="text-5xl font-extrabold text-surface-900">{plan.price}</span>
                <span className="text-surface-500">/mes</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-surface-600">
                    <Check className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={(e) => { e.stopPropagation(); handleSelectPlan(plan.id); }}
                disabled={loading || currentPlan === plan.id}
                className={`w-full py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  currentPlan === plan.id
                    ? 'bg-surface-100 text-surface-500 cursor-default'
                    : selectedPlan === plan.id
                    ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-600/25'
                    : 'bg-surface-100 hover:bg-surface-200 text-surface-900'
                }`}
              >
                {loading && selectedPlan === plan.id ? (
                  'Ativando...'
                ) : currentPlan === plan.id ? (
                  'Plano Atual'
                ) : (
                  <>
                    Selecionar {plan.name}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button onClick={() => router.push('/dashboard')} className="text-surface-500 hover:text-surface-700 text-sm font-medium">
            Pular por agora &rarr;
          </button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-sm text-surface-400">
          <Shield className="w-4 h-4" />
          Pagamento 100% seguro. Cancele quando quiser.
        </div>
      </div>
    </div>
  );
}
