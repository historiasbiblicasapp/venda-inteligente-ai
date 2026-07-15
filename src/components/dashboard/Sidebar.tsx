'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  Megaphone,
  Users,
  Bot,
  ImageIcon,
  MessageSquare,
  Settings,
  BarChart3,
  Zap,
  Shield,
  ChevronLeft,
  ChevronRight,
  Film,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

const baseNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Landing Pages', href: '/dashboard/landing-pages', icon: FileText },
  { name: 'Campanhas', href: '/dashboard/campaigns', icon: Megaphone },
  { name: 'CRM', href: '/dashboard/crm', icon: Users },
  { name: 'IA Copy', href: '/dashboard/ai-copy', icon: Bot },
  { name: 'IA Imagens', href: '/dashboard/ai-images', icon: ImageIcon },
  { name: 'IA Video', href: '/dashboard/ai-video', icon: Film },
  { name: 'Posts & Legendas', href: '/dashboard/posts', icon: MessageSquare },
  { name: 'Relatórios', href: '/dashboard/reports', icon: BarChart3 },
  { name: 'Configurações', href: '/dashboard/settings', icon: Settings },
];

const adminItem = { name: 'Admin', href: '/dashboard/admin', icon: Shield };

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();
        setIsAdmin(data?.is_admin || false);
      }
    };
    checkAdmin();
  }, []);

  const navigation = isAdmin ? [...baseNavigation, adminItem] : baseNavigation;

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full bg-white border-r border-surface-200 z-40 transition-all duration-300 flex flex-col',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      <div className="flex items-center gap-2 px-4 h-16 border-b border-surface-200 shrink-0">
        <Zap className="w-7 h-7 text-brand-600 shrink-0" />
        {!collapsed && (
          <span className="text-lg font-bold text-surface-900 truncate">Venda IA</span>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25'
                  : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900',
                collapsed && 'justify-center px-0'
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className={cn('w-5 h-5 shrink-0', isActive ? 'text-white' : 'text-surface-400')} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-3 border-t border-surface-200 text-surface-400 hover:text-surface-600 transition-colors flex items-center justify-center"
      >
        {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>
    </aside>
  );
}
