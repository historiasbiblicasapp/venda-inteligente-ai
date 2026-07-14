'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Eye, ShoppingCart, ArrowUpRight, ArrowDownRight, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils';

const data = [
  { name: 'Jan', vendas: 4000, receita: 24000, leads: 240 },
  { name: 'Fev', vendas: 3000, receita: 18000, leads: 139 },
  { name: 'Mar', vendas: 5000, receita: 35000, leads: 980 },
  { name: 'Abr', vendas: 2780, receita: 15000, leads: 390 },
  { name: 'Mai', vendas: 1890, receita: 22000, leads: 480 },
  { name: 'Jun', vendas: 2390, receita: 28000, leads: 380 },
];

const topProducts = [
  { name: 'Curso Marketing Digital', vendas: 89, receita: 17533 },
  { name: 'E-book Networking', vendas: 156, receita: 7800 },
  { name: 'Mentoria 1:1', vendas: 12, receita: 18000 },
  { name: 'Pack de Templates', vendas: 234, receita: 7020 },
];

const trafficSources = [
  { name: 'Facebook Ads', cliques: 4500, conversoes: 340, roi: 320 },
  { name: 'Instagram Organic', cliques: 2800, conversoes: 180, roi: 450 },
  { name: 'TikTok', cliques: 3200, conversoes: 220, roi: 280 },
  { name: 'Google Ads', cliques: 1800, conversoes: 150, roi: 380 },
  { name: 'Tráfego Direto', cliques: 1200, conversoes: 90, roi: 0 },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState('30d');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-brand-600" /> Relatórios
          </h1>
          <p className="text-surface-500">Análise completa do seu desempenho</p>
        </div>
        <div className="flex gap-3">
          <select value={period} onChange={(e) => setPeriod(e.target.value)} className="input-field !w-auto text-sm">
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
            <option value="1y">Este ano</option>
          </select>
          <button className="btn-outline !py-2 !px-4 text-sm inline-flex items-center gap-2">
            <Download className="w-4 h-4" /> Exportar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Receita Total', value: formatCurrency(120500), change: 15.3, icon: DollarSign, color: 'bg-green-100 text-green-600' },
          { label: 'Total de Vendas', value: formatNumber(542), change: 8.7, icon: ShoppingCart, color: 'bg-blue-100 text-blue-600' },
          { label: 'ROI Médio', value: '362%', change: 12.1, icon: TrendingUp, color: 'bg-purple-100 text-purple-600' },
          { label: 'Conversão Média', value: formatPercent(8.4), change: -2.3, icon: Eye, color: 'bg-amber-100 text-amber-600' },
        ].map(stat => (
          <div key={stat.label} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium ${stat.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {stat.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(stat.change)}%
              </span>
            </div>
            <p className="text-2xl font-bold text-surface-900">{stat.value}</p>
            <p className="text-xs text-surface-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="font-semibold text-surface-900 mb-4">Receita Mensal</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Area type="monotone" dataKey="receita" stroke="#22c55e" fillOpacity={1} fill="url(#colorReceita)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-semibold text-surface-900 mb-4">Vendas por Mês</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip />
              <Bar dataKey="vendas" fill="#5c7cfa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="font-semibold text-surface-900 mb-4">Produtos Mais Vendidos</h3>
          <div className="space-y-4">
            {topProducts.map((product, i) => (
              <div key={product.name} className="flex items-center gap-4">
                <span className="text-lg font-bold text-surface-300 w-6">{i + 1}</span>
                <div className="flex-1">
                  <p className="font-medium text-surface-900">{product.name}</p>
                  <p className="text-sm text-surface-500">{product.vendas} vendas</p>
                </div>
                <p className="font-semibold text-surface-900">{formatCurrency(product.receita)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-semibold text-surface-900 mb-4">Origem do Tráfego</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200">
                  <th className="text-left p-3 text-xs font-medium text-surface-500">Fonte</th>
                  <th className="text-right p-3 text-xs font-medium text-surface-500">Cliques</th>
                  <th className="text-right p-3 text-xs font-medium text-surface-500">Conversões</th>
                  <th className="text-right p-3 text-xs font-medium text-surface-500">ROI</th>
                </tr>
              </thead>
              <tbody>
                {trafficSources.map(source => (
                  <tr key={source.name} className="border-b border-surface-100">
                    <td className="p-3 text-sm font-medium text-surface-900">{source.name}</td>
                    <td className="p-3 text-sm text-surface-600 text-right">{formatNumber(source.cliques)}</td>
                    <td className="p-3 text-sm text-surface-600 text-right">{formatNumber(source.conversoes)}</td>
                    <td className="p-3 text-sm font-medium text-right">
                      {source.roi > 0 ? (
                        <span className="text-green-600">{source.roi}%</span>
                      ) : (
                        <span className="text-surface-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
