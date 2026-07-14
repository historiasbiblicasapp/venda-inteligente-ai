let lastHealthCheck: { status: string; timestamp: number } | null = null;
const HEALTH_CHECK_INTERVAL = 30_000;

export async function checkSupabaseHealth(): Promise<{ status: string; healthy: boolean }> {
  if (lastHealthCheck && Date.now() - lastHealthCheck.timestamp < HEALTH_CHECK_INTERVAL) {
    return { status: lastHealthCheck.status, healthy: lastHealthCheck.status === 'healthy' || lastHealthCheck.status === 'setup_required' };
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/health`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    });
    const data = await res.json();
    
    lastHealthCheck = { status: data.status, timestamp: Date.now() };
    return { status: data.status, healthy: data.healthy };
  } catch {
    lastHealthCheck = { status: 'unreachable', timestamp: Date.now() };
    return { status: 'unreachable', healthy: false };
  }
}
