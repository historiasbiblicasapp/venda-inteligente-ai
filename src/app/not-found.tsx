import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50">
      <div className="text-center space-y-4">
        <p className="text-6xl font-bold text-brand-600">404</p>
        <h1 className="text-2xl font-bold text-surface-900">Página não encontrada</h1>
        <p className="text-surface-500">O link que você acessou não existe ou foi removido.</p>
        <div className="flex gap-3 justify-center mt-4">
          <Link href="/" className="px-6 py-3 border border-surface-300 text-surface-700 rounded-xl font-medium hover:bg-surface-100 transition-colors">
            Página Inicial
          </Link>
          <Link href="/dashboard" className="px-6 py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
