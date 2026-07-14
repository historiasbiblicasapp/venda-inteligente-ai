import Link from 'next/link';
import { Sparkles, Layout, BarChart3, Zap, Bot, ArrowRight, Check, Target, Globe, Users, Shield, Star, MessageSquare, Image as ImageIcon } from 'lucide-react';

const features = [
  { icon: Layout, title: 'Landing Pages', description: '16 templates prontos para infoprodutos, e-commerce, consultoria, evangelico e mais.' },
  { icon: Bot, title: 'IA para Copy', description: 'Gere textos de vendas, emails e anuncios automaticamente com ChatGPT.' },
  { icon: ImageIcon, title: 'IA para Imagens', description: 'Crie imagens promocionais para Instagram, stories, banners e thumbnails.' },
  { icon: MessageSquare, title: 'Posts & Legendas', description: 'Gere posts completos com legendas, emojis, hashtags e CTAs para todas as redes.' },
  { icon: Users, title: 'CRM Completo', description: 'Gerencie seus leads do primeiro contato ate a venda com status e tags.' },
  { icon: Target, title: 'Campanhas', description: 'Crie e gerencie campanhas no Facebook, Instagram, TikTok, Kwai e Google.' },
  { icon: BarChart3, title: 'Relatorios', description: 'Acompanhe visitantes, leads, conversoes, receita e ROI em tempo real.' },
  { icon: Globe, title: 'Publicacao Instantanea', description: 'Publique suas landing pages com um clique e compartilhe o link.' },
];

const plans = [
  {
    name: 'Starter',
    price: '47',
    period: '/mes',
    description: 'Ideal para quem esta comecando',
    features: [
      '3 Landing Pages',
      '500 Leads/mes',
      'IA para Copy (50 geracoes)',
      'IA para Imagens (20 geracoes)',
      'Posts & Legendas (30 geracoes)',
      'CRM basico',
      'Relatorios basicos',
      'Suporte por email',
    ],
    cta: 'Comecar Agora',
    popular: false,
  },
  {
    name: 'Profissional',
    price: '97',
    period: '/mes',
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
    cta: 'Assinar Agora',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '197',
    period: '/mes',
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
    cta: 'Falar com Consultor',
    popular: false,
  },
];

const testimonials = [
  { name: 'Marcos Silva', role: 'Infoprodutor', text: 'Faturei R$23.000 no primeiro mes usando as landing pages. O sistema e incrivel!', rating: 5 },
  { name: 'Ana Oliveira', role: 'E-commerce', text: 'As imagens da IA sao show de bola. Economizo R$500/mes de designer.', rating: 5 },
  { name: 'Pedro Costa', role: 'Coach', text: 'O CRM automatizado me faz fechar vendas dormindo. Recomendo demais!', rating: 5 },
  { name: 'Juliana Santos', role: 'Consultora', text: 'Migrei de outra plataforma e nao me arrependo. Tudo mais rapido e completo.', rating: 5 },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-surface-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-surface-900">Venda IA</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-surface-600 hover:text-brand-600 transition-colors">Funcionalidades</a>
              <a href="#pricing" className="text-sm text-surface-600 hover:text-brand-600 transition-colors">Planos</a>
              <a href="#testimonials" className="text-sm text-surface-600 hover:text-brand-600 transition-colors">Depoimentos</a>
              <Link href="/login" className="text-sm text-surface-600 hover:text-brand-600 transition-colors font-medium">Entrar</Link>
              <Link href="/register" className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-brand-600/25">
                Comecar Gratis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/50 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-brand-100">
            <Sparkles className="w-4 h-4" />
            Potencializado por Inteligencia Artificial
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-surface-900 mb-6 text-balance leading-tight">
            Venda Mais com{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500">
              Menos Esforco
            </span>
          </h1>
          <p className="text-xl text-surface-500 mb-10 max-w-3xl mx-auto leading-relaxed">
            Crie landing pages de alta conversao, gere textos e imagens com IA,
            gerencie leads e campanhas — tudo em uma so plataforma.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/register" className="bg-brand-600 hover:bg-brand-700 text-white text-lg font-semibold py-4 px-8 rounded-2xl inline-flex items-center justify-center gap-2 transition-all shadow-xl shadow-brand-600/25 hover:shadow-2xl hover:shadow-brand-600/30 hover:-translate-y-0.5">
              Comecar Gratis <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#features" className="border-2 border-surface-200 hover:border-brand-300 text-surface-700 text-lg font-semibold py-4 px-8 rounded-2xl transition-all hover:bg-surface-50">
              Ver Funcionalidades
            </a>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: '16+', label: 'Templates' },
              { value: '5.000+', label: 'Usuarios' },
              { value: '50k+', label: 'Landing Pages' },
              { value: '99.9%', label: 'Uptime' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-extrabold text-brand-600">{stat.value}</p>
                <p className="text-sm text-surface-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-4 bg-surface-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-surface-900 mb-4">Tudo que voce precisa</h2>
            <p className="text-xl text-surface-500 max-w-2xl mx-auto">Uma plataforma completa para criar, automatizar e escalar suas vendas online.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white rounded-2xl p-6 border border-surface-100 hover:border-brand-200 hover:shadow-xl transition-all duration-300 group">
                <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-600 transition-colors">
                  <feature.icon className="w-6 h-6 text-brand-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-surface-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-surface-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-surface-900 mb-4">Como funciona</h2>
            <p className="text-xl text-surface-500">3 passos simples para comecar a vender</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Crie sua conta', desc: 'Cadastre-se gratis em 30 segundos. Sem cartao de credito.' },
              { step: '02', title: 'Escolha um template', desc: 'Selecione entre 16 templates profissionais e personalize.' },
              { step: '03', title: 'Publique e venda', desc: 'Publique com um clique e comece a receber leads hoje.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-brand-600 text-white rounded-2xl flex items-center justify-center text-2xl font-extrabold mx-auto mb-6">{item.step}</div>
                <h3 className="text-xl font-bold text-surface-900 mb-3">{item.title}</h3>
                <p className="text-surface-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-4 bg-surface-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-surface-900 mb-4">Planos e Precos</h2>
            <p className="text-xl text-surface-500">Escolha o plano ideal para o seu negocio</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div key={plan.name} className={`bg-white rounded-3xl p-8 relative border-2 transition-all hover:-translate-y-1 ${plan.popular ? 'border-brand-600 shadow-2xl shadow-brand-600/10 scale-105' : 'border-surface-100 hover:border-brand-200'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-600 to-brand-500 text-white px-5 py-1.5 rounded-full text-sm font-bold shadow-lg">
                    Mais Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-surface-900">{plan.name}</h3>
                <p className="text-sm text-surface-500 mt-1 mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-sm text-surface-500">R$</span>
                  <span className="text-5xl font-extrabold text-surface-900">{plan.price}</span>
                  <span className="text-surface-500">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-surface-600">
                      <Check className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className={`w-full text-center block py-3.5 rounded-xl font-semibold transition-all ${plan.popular ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-600/25' : 'bg-surface-100 hover:bg-surface-200 text-surface-900'}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-surface-900 mb-4">O que nossos clientes dizem</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-surface-100 hover:shadow-xl transition-all">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-surface-600 mb-4 leading-relaxed">&quot;{t.text}&quot;</p>
                <div>
                  <p className="font-bold text-surface-900 text-sm">{t.name}</p>
                  <p className="text-xs text-surface-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-gradient-to-br from-brand-600 to-brand-800">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-extrabold mb-6">Pronto para vender mais?</h2>
          <p className="text-xl text-white/80 mb-10">Comece agora gratuitamente. Sem cartao de credito. Cancele quando quiser.</p>
          <Link href="/register" className="bg-white text-brand-700 hover:bg-surface-50 text-lg font-bold py-4 px-10 rounded-2xl inline-flex items-center gap-2 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5">
            Criar Conta Gratis <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-surface-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">Venda IA</span>
              </div>
              <p className="text-surface-400 text-sm">Plataforma de marketing inteligente com IA para vender mais.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-surface-400">
                <li><a href="#features" className="hover:text-white transition-colors">Funcionalidades</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Planos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm text-surface-400">
                <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-surface-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termos</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-surface-800 pt-8 text-center text-sm text-surface-500">
            &copy; 2026 Venda Inteligente AI. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
