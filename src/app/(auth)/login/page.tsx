'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    // Get user and check subscription
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status, is_admin')
        .eq('id', user.id)
        .single();

      toast.success('Login realizado com sucesso!');

      if (profile?.is_admin || profile?.subscription_status === 'active') {
        router.push('/dashboard');
      } else {
        router.push('/plans');
      }
    } else {
      toast.success('Login realizado com sucesso!');
      router.push('/dashboard');
    }
    router.refresh();
  };

  const handleMagicLink = async () => {
    if (!email) {
      toast.error('Digite seu e-mail');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Link enviado! Verifique seu e-mail.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <Zap className="w-8 h-8 text-brand-600 group-hover:scale-110 transition-transform" />
            <span className="text-xl font-bold text-surface-900">Venda Inteligente AI</span>
          </Link>
          <h1 className="text-3xl font-bold text-surface-900">Bem-vindo de volta</h1>
          <p className="text-surface-500 mt-2">Entre na sua conta para continuar</p>
          <Link href="/" className="inline-flex items-center gap-1 mt-4 text-sm text-brand-600 hover:text-brand-700 font-medium transition-colors">
            &larr; Ver apresentacao do sistema
          </Link>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="input-field pl-11"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  className="input-field pl-11 pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? 'Entrando...' : 'Entrar'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-surface-500">ou</span>
            </div>
          </div>

          <button
            onClick={handleMagicLink}
            disabled={loading}
            className="mt-6 w-full btn-outline flex items-center justify-center gap-2"
          >
            <Mail className="w-5 h-5" />
            Enviar link mágico
          </button>
        </div>

        <p className="text-center mt-6 text-surface-500">
          Não tem uma conta?{' '}
          <Link href="/register" className="text-brand-600 hover:text-brand-700 font-semibold">
            Cadastre-se grátis
          </Link>
        </p>
      </div>
    </div>
  );
}
