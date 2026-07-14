'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils';
import {
  Eye,
  MousePointerClick,
  Users,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  Layout,
  FileText,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const chartData = [
  { name: 'Jan', visitantes: 4000, leads: 240, vendas: 40 },
  { name: 'Fev', visitantes: 3000, leads: 139, vendas: 30 },
  { name: 'Mar', visitantes: 5000, leads: 980, vendas: 70 },
  { name: 'Abr', visitantes: 2780, leads: 390, vendas: 50 },
  { name: 'Mai', visitantes: 1890, leads: 480, vendas: 60 },
  { name: 'Jun', visitantes: 2390, leads: 380, vendas: 55 },
  { name: 'Jul', visitantes: 3490, leads: 430, vendas: 65 },
];

const pieData = [
  { name: 'Facebook', value: 400, color: '#1877F2' },
  { name: 'Instagram', value: 300, color: '#E4405F' },
  { name: 'TikTok', value: 200, color: '#010101' },
  { name: 'Kwai', value: 100, color: '#FF6600' },
];

const stats = [
  { name: 'Visitantes', value: 12450, change: 12.5, up: true, icon: Eye, color: 'bg-blue-100 text-blue-600' },
  { name: 'Cliques', value: 8230, change: 8.2, up: true, icon: MousePointerClick, color: 'bg-purple-100 text-purple-600' },
  { name: 'Leads', value: 3420, change: 15.3, up: true, icon: Users, color: 'bg-green-100 text-green-600' },
  { name: 'Conversões', value: 342, change: 2.1, up: false, icon: TrendingUp, color: 'bg-amber-100 text-amber-600' },
  { name: 'Vendas', value: 189, change: 5.7, up: true, icon: ShoppingCart, color: 'bg-red-100 text-red-600' },
  { name: 'Receita', value: 28450, change: 12.8, up: true, icon: DollarSign, color: 'bg-emerald-100 text-emerald-600', isCurrency: true },
  { name: 'Taxa de Conversão', value: 10.1, change: 1.2, up: true, icon: TrendingUp, color: 'bg-cyan-100 text-cyan-600', isPercent: true },
];

const recentActivity = [
  { id: 1, action: 'Novo lead capturado', detail: 'João Silva - Página: Curso de Marketing', time: '2 min' },
  { id: 2, action: 'Venda confirmada', detail: 'R$ 197,00 - Kiwify - Maria Santos', time: '15 min' },
  { id: 3, action: 'Página publicada', detail: 'Landing Page "Oferta Especial"', time: '1 hora' },
  { id: 4, action: 'Lead convertido', detail: 'Pedro Lima comprou produto X', time: '2 horas' },
  { id: 5, action: 'Campanha ativada', detail: 'Facebook Ads - Campanha Verão', time: '3 horas' },
];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    setLoading(false);
  }, [supabase]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Dashboard</h1>
          <p className="text-surface-500">Visão geral do seu desempenho</p>
        </div>
        <div className="flex gap-3">
          <select className="input-field text-sm !w-auto">
            <option>Últimos 7 dias</option>
            <option>Últimos 30 dias</option>
            <option>Últimos 90 dias</option>
            <option>Este ano</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="glass-card p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${stat.up ? 'text-green-600' : 'text-red-500'}`}>
                {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}%
              </div>
            </div>
            <p className="text-2xl font-bold text-surface-900">
              {stat.isCurrency ? formatCurrency(stat.value) : stat.isPercent ? formatPercent(stat.value) : formatNumber(stat.value)}
            </p>
            <p className="text-xs text-surface-500 mt-1">{stat.name}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Performance dos Últimos Meses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorVisitantes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5c7cfa" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#5c7cfa" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip />
              <Area type="monotone" dataKey="visitantes" stroke="#5c7cfa" fillOpacity={1} fill="url(#colorVisitantes)" />
              <Area type="monotone" dataKey="leads" stroke="#22c55e" fillOpacity={1} fill="url(#colorLeads)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Tráfego por Plataforma</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-surface-600">{item.name}</span>
                </div>
                <span className="font-medium text-surface-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Atividade Recente</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-50 transition-colors">
                <div className="w-2 h-2 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-900">{activity.action}</p>
                  <p className="text-xs text-surface-500 truncate">{activity.detail}</p>
                </div>
                <span className="text-xs text-surface-400 shrink-0">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Acesso Rápido</h3>
          <div className="grid grid-cols-2 gap-3">
            <a href="/dashboard/landing-pages/new" className="flex items-center gap-3 p-4 rounded-xl border border-surface-200 hover:border-brand-300 hover:bg-brand-50 transition-all group">
              <Layout className="w-8 h-8 text-brand-600 group-hover:scale-110 transition-transform" />
              <div>
                <p className="font-medium text-surface-900 text-sm">Nova Página</p>
                <p className="text-xs text-surface-500">Criar landing page</p>
              </div>
            </a>
            <a href="/dashboard/ai-copy" className="flex items-center gap-3 p-4 rounded-xl border border-surface-200 hover:border-green-300 hover:bg-green-50 transition-all group">
              <FileText className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform" />
              <div>
                <p className="font-medium text-surface-900 text-sm">Gerar Copy</p>
                <p className="text-xs text-surface-500">Texto com IA</p>
              </div>
            </a>
            <a href="/dashboard/crm" className="flex items-center gap-3 p-4 rounded-xl border border-surface-200 hover:border-purple-300 hover:bg-purple-50 transition-all group">
              <Users className="w-8 h-8 text-purple-600 group-hover:scale-110 transition-transform" />
              <div>
                <p className="font-medium text-surface-900 text-sm">CRM</p>
                <p className="text-xs text-surface-500">Gerenciar leads</p>
              </div>
            </a>
            <a href="/dashboard/campaigns" className="flex items-center gap-3 p-4 rounded-xl border border-surface-200 hover:border-amber-300 hover:bg-amber-50 transition-all group">
              <TrendingUp className="w-8 h-8 text-amber-600 group-hover:scale-110 transition-transform" />
              <div>
                <p className="font-medium text-surface-900 text-sm">Campanhas</p>
                <p className="text-xs text-surface-500">Criar campanha</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
