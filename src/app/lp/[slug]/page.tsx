import { createServerSupabase } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { PublicLandingPage } from '@/components/landing-page/PublicLandingPage';

interface Props {
  params: { slug: string };
  searchParams: { [key: string]: string | undefined };
}

export async function generateMetadata({ params }: Props) {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from('landing_pages')
    .select('title, description')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single();

  if (!data) return { title: 'Página não encontrada' };

  return {
    title: data.title,
    description: data.description || '',
  };
}

export default async function PublicLandingPageRoute({ params, searchParams }: Props) {
  const supabase = createServerSupabase();

  const { data: page } = await supabase
    .from('landing_pages')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single();

  if (!page) notFound();

  return (
    <PublicLandingPage
      page={page}
      utmSource={searchParams.utm_source}
      utmMedium={searchParams.utm_medium}
      utmCampaign={searchParams.utm_campaign}
    />
  );
}
