import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, formats, style, brandColors } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Descrição é obrigatória' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        images: formats.map((f: string) => ({
          url: `https://placehold.co/${f.includes('stories') || f.includes('reels') || f.includes('tiktok') || f.includes('kwai') ? '1080x1920' : f === 'instagram-feed' ? '1080x1080' : '1200x630'}/4c6ef5/ffffff?text=${encodeURIComponent(f)}`,
          format: f,
        })),
      });
    }

    const images = [];
    for (const format of formats) {
      const sizes: Record<string, string> = {
        'facebook-feed': '1024x1024',
        'instagram-feed': '1024x1024',
        'instagram-stories': '1024x1792',
        'reels': '1024x1792',
        'tiktok': '1024x1792',
        'kwai': '1024x1792',
      };

      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: `${prompt}. Style: ${style}. Brand colors: ${brandColors}. Professional marketing image for ${format.replace('-', ' ')}. High quality, no text overlay.`,
          n: 1,
          size: sizes[format] || '1024x1024',
          quality: 'hd',
        }),
      });

      const data = await response.json();
      if (data.data?.[0]?.url) {
        images.push({ url: data.data[0].url, format });
      }
    }

    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
