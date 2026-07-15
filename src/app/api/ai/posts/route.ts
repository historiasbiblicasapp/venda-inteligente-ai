import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const data = body ? JSON.parse(body) : {};
    const { platform = 'instagram', topic = '', tone = 'Profissional', includeEmojis = true, includeHashtags = true, includeCTA = true } = data;

    if (!topic) {
      return NextResponse.json({ error: 'Tema é obrigatório' }, { status: 400 });
    }

    const prompt = `Crie 5 posts para ${platform} sobre "${topic}".
Tom: ${tone}
${includeEmojis ? 'Use emojis adequados.' : 'Não use emojis.'}
${includeHashtags ? 'Inclua hashtags relevantes no final.' : 'Não inclua hashtags.'}
${includeCTA ? 'Inclua uma chamada para ação (CTA).' : 'Não inclua CTA.'}

Para cada post, inclua a legenda completa. Separe cada post com "---".`;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        results: getMockPosts(platform, topic, tone, includeEmojis, includeHashtags, includeCTA),
      });
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Você é um social media manager especializado em marketing digital brasileiro. Crie posts envolventes e otimizados para engajamento.' },
            { role: 'user', content: prompt },
          ],
          temperature: 0.8,
          max_tokens: 3000,
        }),
      });

      const aiData = await response.json();
      const content = aiData.choices?.[0]?.message?.content || '';

      if (content) {
        const results = content.split('---').map((r: string) => r.trim()).filter((r: string) => r.length > 0);
        return NextResponse.json({ results });
      }
    } catch {}

    return NextResponse.json({
      results: getMockPosts(platform, topic, tone, includeEmojis, includeHashtags, includeCTA),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erro interno' }, { status: 500 });
  }
}

function getMockPosts(platform: string, topic: string, tone: string, emojis: boolean, hashtags: boolean, cta: boolean): string[] {
  const emoji = (e: string) => emojis ? e : '';
  const hash = (tags: string) => hashtags ? '\n\n' + tags : '';
  const callToAction = cta ? '\n\n💬 Salve esse post e compartilhe com quem precisa ouvir isso!' : '';

  return [
    `${emoji('🔥')} ${topic} ${emoji('🔥')}\n\nSe você quer resultados diferentes, precisa de estratégias diferentes.\n\nAqui vão 3 pontos que vão transformar sua abordagem:\n\n1️⃣ Foque no que realmente importa\n2️⃣ Aja com consistência\n3️⃣ Meça seus resultados${callToAction}${hash(`#${topic.replace(/\s+/g, '').toLowerCase()} #marketingdigital #dicas`)}`,
    
    `${emoji('💡')} PARA DE COMPLICAR!\n\n${topic} não precisa ser difícil.\n\nO segredo está em:\n✅ Simplicidade\n✅ Execução\n✅ Análise constante\n\nComece HOJE e refine no caminho.${callToAction}${hash('#empreendedorismo #resultados #dicasdemarketing')}`,
    
    `${emoji('⚡')} A verdade sobre ${topic} que ninguém te conta:\n\nA maioria das pessoas sabe O QUE fazer.\nMas poucas sabem COMO fazer.\n\nE é exatamente aqui que está a diferença entre quem conquista e quem só sonha.${callToAction}${hash('#sucesso #mentalidade #marketing')}`,
  ];
}
