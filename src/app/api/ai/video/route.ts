import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface Scene {
  id: number;
  narration: string;
  onScreenText: string;
  imagePrompt: string;
  imageUrl: string;
  duration: number;
}

const RESOLUTIONS: Record<string, { w: number; h: number }> = {
  'feed': { w: 1080, h: 1080 },
  'stories': { w: 1080, h: 1920 },
  'reels': { w: 1080, h: 1920 },
  'tiktok': { w: 1080, h: 1920 },
  'kwai': { w: 1080, h: 1920 },
  'landscape': { w: 1280, h: 720 },
  'square': { w: 1080, h: 1080 },
};

function getSceneImagePrompt(narration: string, platform: string, style: string, sceneIndex: number, totalScenes: number): string {
  const clean = narration
    .replace(/\[.*?\]/g, '')
    .replace(/\*\*/g, '')
    .replace(/"/g, '')
    .trim()
    .slice(0, 120);

  const styleMap: Record<string, string> = {
    'Moderno e profissional': 'clean modern aesthetic, soft studio lighting, neutral tones, professional business setting',
    'Minimalista': 'minimalist composition, lots of negative space, simple geometric shapes, muted colors',
    'Colorido e vibrante': 'vibrant saturated colors, dynamic composition, energetic mood, bold contrasts',
    'Elegante e sofisticado': 'luxurious atmosphere, gold and dark tones, elegant bokeh, premium feel',
    'Casual e amigavel': 'warm natural lighting, friendly inviting atmosphere, casual lifestyle setting',
    'Futurista': 'futuristic cyberpunk style, neon lights, dark background, tech aesthetic, holographic elements',
  };

  const styleDesc = styleMap[style] || styleMap['Moderno e profissional'];

  const sceneContext: string[] = [
    'opening shot, wide angle, establishing scene, dramatic reveal',
    'medium close-up portrait, natural expression, engaging moment, focus on subject',
    'dynamic action shot, motion blur, energy and movement, decisive moment',
    'beautiful detail shot, shallow depth of field, artistic composition, key element',
    'epic wide shot, breathtaking view, cinematic scale, powerful ending',
  ];

  const context = sceneContext[sceneIndex % sceneContext.length];
  const mood = sceneIndex === 0 ? 'attention-grabbing, hook moment' :
               sceneIndex === totalScenes - 1 ? 'powerful call to action, inspiring finale' :
               'engaging storytelling moment, emotional connection';

  return `${context}, ${styleDesc}. Scene depicting: ${clean}. Mood: ${mood}. Shot on Sony A7IV, 35mm lens, f/1.8, 8K resolution, photorealistic, award-winning photography, no text, no watermark, no logos, no people faces.`;
}

function generateScenesFromScript(script: string, platform: string, style: string): Scene[] {
  const lines = script.split('\n').filter(l => l.trim());
  const scenes: Scene[] = [];
  let currentNarration = '';
  let currentOnScreen = '';
  let sceneId = 1;

  for (const line of lines) {
    const trimmed = line.trim();

    const falaMatch = trimmed.match(/^\[(?:Fala|Narracao|Voz)(?:\s+\d+-?\d*s?)?\]\s*"?([^"]*)"?$/i);
    const telaMatch = trimmed.match(/^\[(?:Tela|Texto|Texto na tela)\]\s*(?:Texto:\s*)?(.*)$/i);
    const ctaMatch = trimmed.match(/^\[CTA\]\s*"?([^"]*)"?$/i);

    if (falaMatch) {
      if (currentNarration) {
        scenes.push({
          id: sceneId++,
          narration: currentNarration,
          onScreenText: currentOnScreen,
          imagePrompt: '',
          imageUrl: '',
          duration: Math.max(3, Math.ceil(currentNarration.split(' ').length / 3)),
        });
        currentOnScreen = '';
      }
      currentNarration = falaMatch[1] || trimmed.replace(/\[.*?\]\s*"?/, '').replace(/"$/, '');
    } else if (telaMatch) {
      currentOnScreen = telaMatch[1] || trimmed.replace(/\[.*?\]\s*/, '');
    } else if (ctaMatch) {
      currentNarration = currentNarration || ctaMatch[1];
      currentOnScreen = currentOnScreen || ctaMatch[1];
    } else if (!trimmed.startsWith('**') && trimmed !== '---') {
      currentNarration += (currentNarration ? ' ' : '') + trimmed.replace(/"/g, '');
    }
  }

  if (currentNarration) {
    scenes.push({
      id: sceneId++,
      narration: currentNarration,
      onScreenText: currentOnScreen,
      imagePrompt: '',
      imageUrl: '',
      duration: Math.max(3, Math.ceil(currentNarration.split(' ').length / 3)),
    });
  }

  if (scenes.length === 0) {
    const sentences = script.replace(/\[.*?\]/g, '').replace(/\*\*/g, '').replace(/"/g, '').split(/[.!?]+/).filter(s => s.trim());
    for (const sentence of sentences.slice(0, 5)) {
      const trimmed = sentence.trim();
      if (trimmed) {
        scenes.push({
          id: sceneId++,
          narration: trimmed,
          onScreenText: '',
          imagePrompt: '',
          imageUrl: '',
          duration: Math.max(3, Math.ceil(trimmed.split(' ').length / 3)),
        });
      }
    }
  }

  const total = scenes.length;
  return scenes.map((s, i) => ({
    ...s,
    imagePrompt: getSceneImagePrompt(s.narration, platform, style, i, total),
  }));
}

function generateMockScenes(productName: string, platform: string, style: string, duration: string): Scene[] {
  const scenesByDuration: Record<string, string[]> = {
    '15': [
      `[Fala] "Voce sabia que 90% das pessoas desistem antes de ver resultado?" [Tela] Texto: "E se voce pudesse mudar isso?"`,
      `[Fala] "O ${productName} mostra exatamente como." [Tela] Texto: "${productName}" com fundo impactante`,
      `[CTA] "Clique no link e comece agora!" [Tela] Texto: "LINK NA BIO"`,
    ],
    '30': [
      `[Fala] "Se voce sente que tentou de tudo e nada funciona..." [Tela] Pessoa frustrada olhando para o celular`,
      `[Fala] "Eu vou te mostrar o ${productName}, um metodo que ja transformou centenas de vidas." [Tela] Interface do produto sendo demonstrada`,
      `[Fala] "Passo a passo, do zero ao primeiro resultado. Tudo explicado de forma simples." [Tela] Sequencia de passos com icones`,
      `[CTA] "Clique no link e garanta sua vaga. Vagas limitadas!" [Tela] Texto: "GARANTA SUA VAGA" com timer`,
    ],
    '60': [
      `[Fala] "Eu sei como e frustrar tentar de tudo e nao ver resultado. Passei por isso durante anos." [Tela] Cenas de pessoa trabalhando duro`,
      `[Fala] "Ate que descobri um padrao que mudou tudo. E criei o ${productName} pra te ensinar exatamente isso." [Tela] Logo do ${productName} com animacao`,
      `[Fala] "E um metodo passo a passo. Sem enrolacao. Sem teoria sem aplicacao. Apenas o que funciona de verdade." [Tela] Lista de modulos com checkmarks`,
      `[Fala] "Meus alunos ja estao tendo resultados incriveis. E voce pode ser o proximo." [Tela] Depoimentos e resultados`,
      `[Fala] "Clique no link, garanta sua vaga e comence sua transformacao hoje. Vagas limitadas!" [Tela] Botao CTA grande e animado`,
    ],
  };

  const sceneTexts = scenesByDuration[duration] || scenesByDuration['15'];
  const total = sceneTexts.length;

  return sceneTexts.map((text, i) => {
    const falaMatch = text.match(/\[Fala\]\s*"?([^"]*)"?/);
    const telaMatch = text.match(/\[Tela\]\s*(.*)/);
    const ctaMatch = text.match(/\[CTA\]\s*"?([^"]*)"?/);

    const narration = falaMatch?.[1] || ctaMatch?.[1] || '';
    const onScreen = telaMatch?.[1] || '';

    return {
      id: i + 1,
      narration,
      onScreenText: onScreen,
      imagePrompt: getSceneImagePrompt(narration || onScreen, platform, style, i, total),
      imageUrl: '',
      duration: Math.max(3, Math.ceil(narration.split(' ').length / 3)),
    };
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const data = body ? JSON.parse(body) : {};
    const {
      productName = '',
      targetAudience = '',
      platform = 'instagram',
      style = 'Moderno e profissional',
      duration = '15',
      script = '',
    } = data;

    if (!productName && !script) {
      return NextResponse.json({ error: 'Nome do produto ou roteiro e obrigatorio' }, { status: 400 });
    }

    let scenes: Scene[];

    if (script) {
      scenes = generateScenesFromScript(script, platform, style);
    } else if (!process.env.OPENAI_API_KEY) {
      scenes = generateMockScenes(productName, platform, style, duration);
    } else {
      try {
        const prompt = `Gere um roteiro de video de ${duration} segundos para "${productName}".
Publico-alvo: ${targetAudience || 'geral'}
Tom: ${style}
Plataforma: ${platform}
Para cada cena, use o formato:
[Fala] "texto que sera narrado"
[Tela] descricao do que aparece na tela

Gere de 3 a 5 cenas. Retorne apenas o roteiro.`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'Voce e um roteirista de videos curtos para redes sociais. Crie roteiros visuais e impactantes.' },
              { role: 'user', content: prompt },
            ],
            temperature: 0.8,
            max_tokens: 1500,
          }),
        });

        const aiData = await response.json();
        const content = aiData.choices?.[0]?.message?.content || '';

        if (content) {
          scenes = generateScenesFromScript(content, platform, style);
        } else {
          scenes = generateMockScenes(productName, platform, style, duration);
        }
      } catch {
        scenes = generateMockScenes(productName, platform, style, duration);
      }
    }

    const res = RESOLUTIONS[platform] || RESOLUTIONS['feed'];

    return NextResponse.json({ scenes, resolution: res, duration: parseInt(duration) || 15 });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
