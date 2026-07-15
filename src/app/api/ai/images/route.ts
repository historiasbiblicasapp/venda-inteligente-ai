import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const parsed = body ? JSON.parse(body) : {};
    const { prompt = '', formats = [], style = 'moderno', brandColors = '#4c6ef5' } = parsed;

    if (!prompt) {
      return NextResponse.json({ error: 'Descrição é obrigatória' }, { status: 400 });
    }

    const images = formats.map((f: string) => {
      const size = getSize(f);
      const fullPrompt = `${prompt}. Style: ${style}. Brand colors: ${brandColors}. Professional marketing image for ${f.replace('-', ' ')}. High quality, no text overlay.`;
      const encoded = encodeURIComponent(fullPrompt);
      return {
        url: `https://image.pollinations.ai/prompt/${encoded}?width=${size.w}&height=${size.h}&seed=${Math.floor(Math.random() * 10000)}&nologo=true`,
        format: f,
      };
    });

    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

function getSize(format: string): { w: number; h: number } {
  if (format.includes('stories') || format.includes('reels') || format.includes('tiktok') || format.includes('kwai')) {
    return { w: 1080, h: 1920 };
  }
  if (format === 'instagram-feed') {
    return { w: 1080, h: 1080 };
  }
  return { w: 1200, h: 630 };
}
