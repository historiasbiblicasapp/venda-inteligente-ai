import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, productName, targetAudience, productDescription, tone, platform, additionalInfo } = body;

    if (!productName) {
      return NextResponse.json({ error: 'Nome do produto é obrigatório' }, { status: 400 });
    }

    const prompts: Record<string, string> = {
      titles: `Gere 10 títulos chamativos e persuasivos para um anúncio de "${productName}".
Público-alvo: ${targetAudience || 'geral'}
Tom: ${tone}
Plataforma: ${platform}
Descrição: ${productDescription || 'N/A'}
Informações adicionais: ${additionalInfo || 'N/A'}
Retorne apenas os títulos, um por linha, numerados.`,
      
      descriptions: `Gere 5 descrições persuasivas para "${productName}".
Público-alvo: ${targetAudience || 'geral'}
Tom: ${tone}
Plataforma: ${platform}
Cada descrição deve ter entre 2-3 frases e ser focada em benefícios.
Retorne apenas as descrições, separadas por linha em branco.`,
      
      cta: `Gere 10 chamadas para ação (CTAs) de alta conversão para "${productName}".
Tom: ${tone}
Plataforma: ${platform}
Os CTAs devem ser curtos, diretos e urgentes.
Retorne apenas os CTAs, um por linha.`,
      
      adcopy: `Gere 5 textos completos de anúncio para "${productName}".
Público-alvo: ${targetAudience || 'geral'}
Tom: ${tone}
Plataforma: ${platform}
Descrição: ${productDescription || 'N/A'}
Cada anúncio deve ter: Gancho (primeira linha), Desenvolvimento (benefícios), CTA.
Retorne cada anúncio separado por "---".`,
      
      video_scripts: `Gere 3 roteiros de vídeo curto para "${productName}".
Duração: 15, 30 e 60 segundos
Público-alvo: ${targetAudience || 'geral'}
Tom: ${tone}
Plataforma: ${platform}
Para cada roteiro, inclua: O que falar, Ações na tela, Texto na tela.
Retorne cada roteiro separado por "---".`,
      
      email_sequence: `Gere uma sequência de 5 e-mails de vendas para "${productName}".
Público-alvo: ${targetAudience || 'geral'}
Tom: ${tone}
Descrição: ${productDescription || 'N/A'}
Para cada e-mail, inclua: Assunto, Corpo do e-mail.
Retorne cada e-mail separado por "---".`,
    };

    const prompt = prompts[type] || prompts.titles;

    if (!process.env.OPENAI_API_KEY) {
      const mockResults = getMockResults(type, productName);
      return NextResponse.json({ results: mockResults });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Você é um especialista em marketing digital e copywriting para o mercado brasileiro. Gere conteúdo persuasivo e otimizado para conversão. Responda em português brasileiro.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const mockResults = getMockResults(type, productName);
      return NextResponse.json({ results: mockResults });
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    const results = content.split('\n').filter((line: string) => line.trim() && !line.match(/^\d+\.\s*$/) === false);
    
    const cleanedResults = results
      .map((r: string) => r.replace(/^\d+[\.\)]\s*/, '').trim())
      .filter((r: string) => r.length > 0);

    return NextResponse.json({ results: cleanedResults });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

function getMockResults(type: string, productName: string): string[] {
  const mockData: Record<string, string[]> = {
    titles: [
      `🔥 ${productName} - A Última Chance Que Você Estava Esperando!`,
      `DESCUBRA Como ${productName} Pode Transformar Seu Resultado`,
      `Atenção: ${productName} Com Desconto Por Tempo Limitado!`,
      `${productName}: O Segredo Que Ninguém Te Contou`,
      `Você Sabia Que ${productName} Pode Mudar Sua Vida?`,
      `⚡ ${productName} Disponível Com 70% OFF - Últimas Vagas!`,
      `${productName}: O Caminho Mais Rápido Para Seus Resultados`,
      `Não Perca! ${productName} Com Condição Especial`,
      `${productName}: Comece Hoje e Veja Resultados Já!`,
      `Último Aviso: ${productName} Sai Do Ar Hoje À Meia-Noite`,
    ],
    descriptions: [
      `${productName} é a solução que você precisava para alcançar seus objetivos. Com uma abordagem completa e comprovado por centenas de alunos, este é o caminho mais rápido para seus resultados.`,
      `Imagine ter em suas mãos todas as estratégias necessárias para transformar sua realidade. O ${productName} foi criado especialmente para quem quer resultados reais e duradouros.`,
      `Com ${productName}, você terá acesso a um método passo a passo que já transformou a vida de milhares de pessoas. Não é mais uma promessa vazia - é um sistema comprovado.`,
      `Chega de tentar e errar. O ${productName} te dá exatamente o que você precisa, no momento certo, para finalmente conquistar o que tanto deseja.`,
      `${productName} não é apenas mais um produto. É uma transformação completa. Do conhecimento à prática, tudo foi pensado para você ter resultados reais.`,
    ],
    cta: [
      'QUERO COMPRAR AGORA',
      'GARANTIR MINHA VAGA',
      'COMEÇAR AGORA',
      'SIM, EU QUERO!',
      'GARANTIR MEU ACESSO',
      'QUERO ESSE RESULTADO!',
      'APROVEITAR OFERTA',
      'NÃO QUERO PERDER',
      'QUERO COMEÇAR HOJE',
      'VALIDAR MEU ACESSO',
    ],
    adcopy: [
      `STORY: Você sente que está estagnado e não consegue avançar?\n\nSOLUÇÃO: O ${productName} foi criado exatamente para quebrar esse ciclo.\n\nCTA: Clique no link e garanta sua vaga com desconto especial!`,
      `PROBLEMA: Todo dia a mesma rotina, sem ver resultados.\n\nCONTRAPonto: Mas e se existisse um caminho mais inteligente?\n\nO ${productName} te mostra exatamente como fazer isso. Acesse agora!`,
      `DEPOIMENTO: "Minha vida mudou depois que conheci o ${productName}" - Maria, aluna.\n\nVocê também pode ter essa transformação. Link na bio!`,
      `DADOS: 95% dos nossos alunos relatam melhoria nos primeiros 30 dias.\n\nO ${productName} funciona. E você pode ser o próximo caso de sucesso.\n\nGaranta agora!`,
      `CURIOSIDADE: Sabe o que separa quem conquista de quem só sonha?\n\nÉ ter o método certo. O ${productName} é esse método.\n\nNão perca essa oportunidade!`,
    ],
    video_scripts: [
      `**15 SEGUNDOS**\n\n[Fala] "Você sabia que 90% das pessoas desistem antes de ver resultado?"\n\n[Tela] Texto: "E se você pudesse mudar isso?"\n\n[Fala] "O ${productName} mostra exatamente como."\n\n[CTA] "Clique no link e comece agora!"`,
      `**30 SEGUNDOS**\n\n[Fala 0-5s] "Se você sente que tentou de tudo e nada funciona..." \n\n[Fala 5-15s] "Eu vou te mostrar o ${productName}, um método que já transformou centenas de vidas."\n\n[Fala 15-25s] "Passo a passo, do zero ao primeiro resultado. Tudo explicado de forma simples."\n\n[Fala 25-30s] "Clique no link e garanta sua vaga. Vagas limitadas!"`,
      `**60 SEGUNDOS**\n\n[Fala 0-10s] "Eu sei como é frustrar tentar de tudo e não ver resultado. Passei por isso durante anos."\n\n[Fala 10-20s] "Até que descobri um padrão que mudou tudo. E criei o ${productName} pra te ensinar exatamente isso."\n\n[Fala 20-35s] "É um método passo a passo. Sem enrolação. Sem teoria sem aplicação. Apenas o que funciona de verdade."\n\n[Fala 35-50s] "Meus alunos já estão tendo resultados incríveis. E você pode ser o próximo."\n\n[Fala 50-60s] "Clique no link, garanta sua vaga e comece sua transformação hoje. Vagas limitadas!"`,
    ],
    email_sequence: [
      `**Assunto:** Você está perdendo oportunidades...\n\nOi [Nome],\n\nSe você está lendo isso, é porque algo na sua vida precisa mudar.\n\nE eu tenho a certeza de que o ${productName} pode te ajudar.\n\nAmanhã, eu vou te mostrar como.\n\nAbraço,\n[Remetente]`,
      `**Assunto:** O que ninguém te conta sobre resultados\n\nOi [Nome],\n\nHoje vou ser direto: a maioria das pessoas faz tudo errado.\n\nElas tentam, falham, desistem. E o ciclo repete.\n\nO ${productName} quebra esse ciclo. Porque ele não é baseado em achismos - é baseado em resultado.\n\nSaiba mais: [link]\n\nAté breve,\n[Remetente]`,
      `**Assunto:** História real de transformação\n\nOi [Nome],\n\nQuero te contar a história do João.\n\nHá 6 meses, ele estava exatamente onde você está. Hoje, ele transformou sua realidade.\n\nComo? Com o ${productName}.\n\nSe ele conseguiu, por que você não consegue?\n\nAcesse: [link]\n\n[Terço]\n[Remetente]`,
      `**Assunto:** Última chance (sério)\n\nOi [Nome],\n\nEsta é a última vez que vou falar sobre isso.\n\nO ${productName} está com uma condição especial que expira amanhã.\n\nDepois disso, o preço volta ao normal. Sem exceções.\n\nSe você quer mudar de vida, agora é o momento.\n\nGaranta sua vaga: [link]\n\nAbraço,\n[Remetente]`,
      `**Assunto:** Você decidiu?\n\nOi [Nome],\n\nSei que a decisão nem sempre é fácil.\n\nMas saiba que cada dia que passa é um dia a menos de resultado.\n\nO ${productName} está aqui pra te ajudar. A escolha é sua.\n\nSe precisar de qualquer coisa, estou aqui.\n\nUm abraço,\n[Remetente]`,
    ],
  };

  return mockData[type] || mockData.titles;
}
