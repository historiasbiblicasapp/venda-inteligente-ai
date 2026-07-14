'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Bell, LogOut, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export function Header() {
  const [userName, setUserName] = useState('');
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário');
      }
    };
    getUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logout realizado');
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-lg border-b border-surface-200 flex items-center justify-end px-6 gap-4">
      <button className="relative p-2 text-surface-400 hover:text-surface-600 transition-colors rounded-xl hover:bg-surface-100">
        <Bell className="w-5 h-5" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>

      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-brand-100 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-brand-600" />
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-surface-900">{userName}</p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="p-2 text-surface-400 hover:text-red-500 transition-colors rounded-xl hover:bg-surface-100"
        title="Sair"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </header>
  );
}
