'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { generateSlug } from '@/lib/utils';
import { ArrowLeft, Globe, Sparkles } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const templates = [
  {
    id: 'blank',
    name: 'Página em Branco',
    description: 'Comece do zero com total liberdade',
    icon: '📄',
  },
  {
    id: 'product',
    name: 'Venda de Produto',
    description: 'Ideal para infoprodutos e e-books',
    icon: '🛍️',
  },
  {
    id: 'course',
    name: 'Curso Online',
    description: 'Perfeito para lançamentos de cursos',
    icon: '🎓',
  },
  {
    id: 'webinar',
    name: 'Webinar / Evento',
    description: 'Página para inscrição em eventos',
    icon: '🎥',
  },
  {
    id: 'saas',
    name: 'SaaS',
    description: 'Landing page para software',
    icon: '💻',
  },
  {
    id: 'lead-magnet',
    name: 'Lead Magnet',
    description: 'Captura de leads com conteúdo gratuito',
    icon: '🧲',
  },
  {
    id: 'infoproduto',
    name: 'Infoproduto',
    description: 'Curso, mentoria ou eBook com prova social',
    icon: '🚀',
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    description: 'Loja online com catálogo e preços',
    icon: '🛒',
  },
  {
    id: 'consultoria',
    name: 'Consultoria',
    description: 'Serviços profissionais e portfólio',
    icon: '💼',
  },
  {
    id: 'evangelico',
    name: 'Ministério Evangélico',
    description: 'Pregações, testemunhos e curiosidades bíblicas',
    icon: '✝️',
  },
  {
    id: 'personal-trainer',
    name: 'Personal Trainer',
    description: 'Treinos, transformação e planos fitness',
    icon: '💪',
  },
  {
    id: 'receitas',
    name: 'Receitas / Culinária',
    description: 'Food blogger, planos alimentares e e-books',
    icon: '🍳',
  },
  {
    id: 'imobiliario',
    name: 'Imobiliário',
    description: 'Imóveis, casas e apartamentos à venda',
    icon: '🏠',
  },
  {
    id: 'petshop',
    name: 'Pet Shop',
    description: 'Produtos, serviços e petiscos para animais',
    icon: '🐾',
  },
  {
    id: 'beleza',
    name: 'Beleza / Estética',
    description: 'Maquiagem, skincare e tratamentos',
    icon: '💄',
  },
  {
    id: 'educacao-financeira',
    name: 'Educação Financeira',
    description: 'Investimentos, renda extra e controle financeiro',
    icon: '💰',
  },
  {
    id: 'fotografo',
    name: 'Fotógrafo',
    description: 'Portfólio, ensaios e eventos',
    icon: '📸',
  },
  {
    id: 'musica-gospel',
    name: 'Música Gospel',
    description: 'Lançamentos, shows e streaming',
    icon: '🎵',
  },
  {
    id: 'eletronicos',
    name: 'Eletrônicos / Informática',
    description: 'TVs, smartphones, notebooks, computadores e mais',
    icon: '🖥️',
  },
];

export default function NewLandingPage() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('blank');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(value));
    }
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error('Digite um título para a página');
      return;
    }
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Você precisa estar logado');
      setLoading(false);
      return;
    }

    const defaultComponents = selectedTemplate === 'blank' ? [] : getTemplateComponents(selectedTemplate);

    const { data, error } = await supabase
      .from('landing_pages')
      .insert({
        user_id: user.id,
        title,
        slug: slug || generateSlug(title),
        description,
        components: defaultComponents,
        settings: {
          primaryColor: '#4c6ef5',
          secondaryColor: '#fcc419',
          backgroundColor: '#ffffff',
          fontFamily: 'Inter',
          maxWidth: '1200px',
          showCountdown: false,
          countdownDate: '',
          checkoutUrl: '',
          whatsappNumber: '',
          whatsappMessage: 'Olá! Vim pela página de vendas.',
          thankYouPageUrl: '/obrigado',
        },
        status: 'draft',
      })
      .select()
      .single();

    if (error) {
      toast.error('Erro ao criar página: ' + error.message);
      setLoading(false);
      return;
    }

    toast.success('Página criada com sucesso!');
    router.push(`/dashboard/landing-pages/${data.id}/edit`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link href="/dashboard/landing-pages" className="inline-flex items-center gap-2 text-surface-500 hover:text-surface-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        <h1 className="text-2xl font-bold text-surface-900">Nova Landing Page</h1>
        <p className="text-surface-500">Configure os dados iniciais da sua página</p>
      </div>

      <div className="glass-card p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">Título da Página</label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Ex: Curso de Marketing Digital"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">Slug (URL)</label>
          <div className="flex items-center gap-2">
            <span className="text-surface-400 text-sm">/lp/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="curso-marketing-digital"
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">Descrição (opcional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Uma breve descrição da página..."
            className="input-field min-h-[80px] resize-none"
          />
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-brand-600" />
          <h3 className="font-semibold text-surface-900">Escolher Template</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                selectedTemplate === template.id
                  ? 'border-brand-600 bg-brand-50'
                  : 'border-surface-200 hover:border-surface-300'
              }`}
            >
              <span className="text-2xl mb-2 block">{template.icon}</span>
              <p className="font-medium text-surface-900 text-sm">{template.name}</p>
              <p className="text-xs text-surface-500 mt-1">{template.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Link href="/dashboard/landing-pages" className="btn-outline">
          Cancelar
        </Link>
        <button onClick={handleCreate} disabled={loading} className="btn-primary inline-flex items-center gap-2">
          <Globe className="w-5 h-5" />
          {loading ? 'Criando...' : 'Criar e Editar'}
        </button>
      </div>
    </div>
  );
}

function getTemplateComponents(template: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const base: { id: string; type: string; content: Record<string, any>; animation?: Record<string, any> }[] = [
    {
      id: 'banner-1',
      type: 'banner',
      content: {
        title: 'Título da Sua Oferta',
        subtitle: 'Subtítulo persuasivo aqui',
        backgroundImage: '',
        ctaText: 'QUERO COMPRAR AGORA',
        ctaStyle: 'primary',
      },
      animation: { type: 'fadeIn', delay: 0 },
    },
  ];

  if (template === 'product' || template === 'course') {
    base.push(
      {
        id: 'video-1',
        type: 'video',
        content: { url: '', title: 'Assista ao Vídeo' },
        animation: { type: 'fadeIn', delay: 0.2 },
      },
      {
        id: 'text-1',
        type: 'text',
        content: {
          title: 'O que você vai aprender',
          body: 'Descreva os benefícios do seu produto aqui...',
          alignment: 'center',
        },
        animation: { type: 'slideUp', delay: 0.3 },
      },
      {
        id: 'offer-1',
        type: 'offer',
        content: {
          title: 'Oferta Especial',
          price: 'R$ 197',
          originalPrice: 'R$ 497',
          features: ['Acesso vitalício', 'Suporte dedicado', 'Certificado'],
          buttonText: 'GARANTIR MINHA VAGA',
        },
        animation: { type: 'zoom', delay: 0.4 },
      },
      {
        id: 'testimonials-1',
        type: 'testimonial',
        content: {
          items: [
            { name: 'Ana Silva', text: 'Excelente produto! Recomendo.', avatar: '' },
            { name: 'Carlos Santos', text: 'Transformou meu negócio.', avatar: '' },
          ],
        },
        animation: { type: 'fadeIn', delay: 0.5 },
      },
      {
        id: 'guarantee-1',
        type: 'guarantee',
        content: {
          title: 'Garantia de 7 Dias',
          text: 'Se não ficar satisfeito, devolvemos 100% do seu dinheiro.',
          icon: 'shield',
        },
        animation: { type: 'fadeIn', delay: 0.6 },
      },
      {
        id: 'faq-1',
        type: 'faq',
        content: {
          items: [
            { question: 'Como acesso o conteúdo?', answer: 'Após a confirmação do pagamento, você receberá um e-mail com as instruções.' },
            { question: 'Tem suporte?', answer: 'Sim! Oferecemos suporte por e-mail e WhatsApp.' },
          ],
        },
        animation: { type: 'fadeIn', delay: 0.7 },
      },
      {
        id: 'countdown-1',
        type: 'countdown',
        content: {
          endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          text: 'Oferta termina em:',
        },
        animation: { type: 'pulse', delay: 0 },
      }
    );
  }

  if (template === 'infoproduto') {
    base.push(
      {
        id: 'video-1',
        type: 'video',
        content: { url: '', title: 'Assista à Aula Gratuita' },
        animation: { type: 'fadeIn', delay: 0.1 },
      },
      {
        id: 'text-1',
        type: 'text',
        content: {
          title: 'Você Sabia?',
          body: '95% das pessoas que tentam empreender falham por falta de conhecimento certo. Este método já transformou mais de 1.000 vidas em 12 meses.',
          alignment: 'center',
        },
        animation: { type: 'slideUp', delay: 0.2 },
      },
      {
        id: 'text-2',
        type: 'text',
        content: {
          title: 'O que Você Vai Aprender',
          body: '• Módulo 1: Fundamentos para estruturar seu negócio do zero\n• Módulo 2: Como atrair clientes todos os dias sem depender de indicação\n• Módulo 3: Fechamento de vendas com técnica comprovada\n• Módulo 4: Escalar de R$1.000 a R$10.000/mês',
          alignment: 'left',
        },
        animation: { type: 'slideUp', delay: 0.3 },
      },
      {
        id: 'offer-1',
        type: 'offer',
        content: {
          title: 'Acesso Completo ao Método',
          price: '12x de R$97',
          originalPrice: 'R$1.997 à vista',
          features: [
            'Acesso a todos os módulos',
            'Comunidade exclusiva no Telegram',
            'Mentoria em grupo semanal',
            'Suporte direto por 6 meses',
            'Certificado de conclusão',
          ],
          buttonText: 'QUERO COMEÇAR AGORA',
        },
        animation: { type: 'zoom', delay: 0.4 },
      },
      {
        id: 'testimonials-1',
        type: 'testimonial',
        content: {
          items: [
            { name: 'Mariana Costa', text: 'Faturei R$8.000 no primeiro mês aplicando o método. Nunca imaginei que seria possível!', avatar: '' },
            { name: 'Pedro Henrique', text: 'Saí do zero para R$15.000/mês em 4 meses. O suporte é incrível.', avatar: '' },
            { name: 'Juliana Alves', text: 'Melhor investimento que já fiz. O conteúdo é muito prático e direto ao ponto.', avatar: '' },
          ],
        },
        animation: { type: 'fadeIn', delay: 0.5 },
      },
      {
        id: 'guarantee-1',
        type: 'guarantee',
        content: {
          title: 'Garantia Incondicional de 30 Dias',
          text: 'Se em 30 dias você não sentir que o conteúdo vale pelo menos 10x o investimento, devolvemos cada centavo. Sem perguntas.',
          icon: 'shield',
        },
        animation: { type: 'fadeIn', delay: 0.6 },
      },
      {
        id: 'countdown-1',
        type: 'countdown',
        content: {
          endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          text: 'Inscrições encerram em:',
        },
        animation: { type: 'pulse', delay: 0 },
      },
      {
        id: 'faq-1',
        type: 'faq',
        content: {
          items: [
            { question: 'Preciso de experiência prévia?', answer: 'Não! O método foi pensado para quem está começando do absoluto zero.' },
            { question: 'E se eu não conseguir acompanhar?', answer: 'Você tem acesso vitalício ao conteúdo e pode assistir no seu ritmo.' },
            { question: 'Tem garantia?', answer: 'Sim! 30 dias de garantia incondicional. Se não gostar, devolvemos seu dinheiro.' },
          ],
        },
        animation: { type: 'fadeIn', delay: 0.7 },
      },
    );
  }

  if (template === 'ecommerce') {
    base.push(
      {
        id: 'text-1',
        type: 'text',
        content: {
          title: 'Produtos em Destaque',
          body: 'Confira nossa seleção exclusiva com os melhores preços e frete grátis para todo o Brasil.',
          alignment: 'center',
        },
        animation: { type: 'fadeIn', delay: 0.1 },
      },
      {
        id: 'offer-1',
        type: 'offer',
        content: {
          title: 'Kit Essencial',
          price: '12x de R$49,90',
          originalPrice: 'R$899,90',
          features: [
            'Produto premium com acabamento profissional',
            'Frete grátis para todo Brasil',
            'Troca garantida em 7 dias',
            'Suporte ao cliente por WhatsApp',
          ],
          buttonText: 'COMPRAR COM FRETE GRÁTIS',
        },
        animation: { type: 'zoom', delay: 0.2 },
      },
      {
        id: 'text-2',
        type: 'text',
        content: {
          title: 'Por que Escolher a Nossa Loja?',
          body: '✓ Mais de 5.000 clientes satisfeitos\n✓ Envio em até 24h após confirmação\n✓ Parceiros com as melhores marcas\n✓ Pagamento 100% seguro via PIX ou Cartão',
          alignment: 'left',
        },
        animation: { type: 'slideUp', delay: 0.3 },
      },
      {
        id: 'testimonials-1',
        type: 'testimonial',
        content: {
          items: [
            { name: 'Fernanda Lima', text: 'Produto chegou antes do prazo e superou minhas expectativas. Comprarei novamente!', avatar: '' },
            { name: 'Ricardo Souza', text: 'Atendimento nota 10. Tive uma dúvida no WhatsApp e resolveram em minutos.', avatar: '' },
            { name: 'Camila Rocha', text: 'Preço imbatível e qualidade excelente. Recomendo de olhos fechados!', avatar: '' },
          ],
        },
        animation: { type: 'fadeIn', delay: 0.4 },
      },
      {
        id: 'guarantee-1',
        type: 'guarantee',
        content: {
          title: 'Compra 100% Segura',
          text: 'Se não gostar do produto, devolvemos seu dinheiro em até 7 dias. Sem burocracia.',
          icon: 'shield',
        },
        animation: { type: 'fadeIn', delay: 0.5 },
      },
      {
        id: 'faq-1',
        type: 'faq',
        content: {
          items: [
            { question: 'Qual o prazo de entrega?', answer: 'Envio em até 24h após confirmação do pagamento. Prazo de entrega: 3 a 7 dias úteis dependendo da região.' },
            { question: 'Aceitam PIX?', answer: 'Sim! PIX, cartão de crédito em até 12x, boleto bancário e Cartão de Débito.' },
            { question: 'Posso trocar se não gostar?', answer: 'Claro! Você tem 7 dias para solicitar a troca ou devolução.' },
          ],
        },
        animation: { type: 'fadeIn', delay: 0.6 },
      },
      {
        id: 'countdown-1',
        type: 'countdown',
        content: {
          endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          text: 'Promoção termina em:',
        },
        animation: { type: 'pulse', delay: 0 },
      },
    );
  }

  if (template === 'consultoria') {
    base.push(
      {
        id: 'text-1',
        type: 'text',
        content: {
          title: 'Transforme Seu Negócio com Mentoria Personalizada',
          body: 'Mais de 500 empresas atendidas. Aumento médio de 3x no faturamento em 90 dias. Estratégia sob medida para o seu mercado.',
          alignment: 'center',
        },
        animation: { type: 'fadeIn', delay: 0.1 },
      },
      {
        id: 'text-2',
        type: 'text',
        content: {
          title: 'Como Funciona a Consultoria',
          body: '1️⃣ Diagnóstico: Analisamos sua empresa, mercado e concorrência\n2️⃣ Estratégia: Criamos um plano personalizado com metas claras\n3️⃣ Execução: Acompanhamos a implementação passo a passo\n4️⃣ Resultados: Medimos e otimizamos até atingir seus objetivos',
          alignment: 'left',
        },
        animation: { type: 'slideUp', delay: 0.2 },
      },
      {
        id: 'offer-1',
        type: 'offer',
        content: {
          title: 'Pacote de Consultoria 90 Dias',
          price: 'R$2.997',
          originalPrice: 'R$5.997',
          features: [
            'Sessão inicial de 2h de diagnóstico',
            'Plano estratégico personalizado',
            'Reuniões semanais de acompanhamento',
            'Suporte via WhatsApp durante todo o processo',
            'Relatório mensal de resultados',
            'Garantia de resultado ou estendemos o contrato',
          ],
          buttonText: 'AGENDAR MINHA ANÁLISE GRATUITA',
        },
        animation: { type: 'zoom', delay: 0.3 },
      },
      {
        id: 'testimonials-1',
        type: 'testimonial',
        content: {
          items: [
            { name: 'Roberto Martins', text: 'Em 3 meses saí de R$20.000 para R$65.000/mês de faturamento. A consultoria pagou sozinha.', avatar: '' },
            { name: 'Ana Beatriz', text: 'A consultoria transformou completamente a operação da minha loja. Reduzi custos em 40%.', avatar: '' },
            { name: 'Lucas Oliveira', text: 'Profissional excepcional. Entendeu meu mercado rapidamente e entregou resultados reais.', avatar: '' },
          ],
        },
        animation: { type: 'fadeIn', delay: 0.4 },
      },
      {
        id: 'guarantee-1',
        type: 'guarantee',
        content: {
          title: 'Garantia de Resultado',
          text: 'Se em 90 dias não entregarmos o resultado prometido, estendemos o contrato sem custo adicional até alcançarmos.',
          icon: 'shield',
        },
        animation: { type: 'fadeIn', delay: 0.5 },
      },
      {
        id: 'faq-1',
        type: 'faq',
        content: {
          items: [
            { question: 'Funciona para qualquer tipo de negócio?', answer: 'Trabalhamos com empresas de serviços, e-commerce, infoprodutos e indústrias. O diagnóstico inicial é gratuito.' },
            { question: 'Qual o investimento?', answer: 'O pacote completo de 90 dias custa R$2.997 (ou 12x de R$347). Mas começamos com uma análise gratuita.' },
            { question: 'Como são as reuniões?', answer: 'Via Google Meet ou Zoom, semanalmente, com duração de 45 minutos. Também temos suporte contínuo no WhatsApp.' },
          ],
        },
        animation: { type: 'fadeIn', delay: 0.6 },
      },
    );
  }

  if (template === 'evangelico') {
    base.push(
      {
        id: 'text-1',
        type: 'text',
        content: {
          title: 'A Palavra que Transforma Vidas',
          body: '"Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o SENHOR; pensamentos de paz, e não de mal, para vos dar o fim que esperais." — Jeremias 29:11',
          alignment: 'center',
        },
        animation: { type: 'fadeIn', delay: 0.1 },
      },
      {
        id: 'video-1',
        type: 'video',
        content: { url: '', title: 'Ouça a Pregação da Semana' },
        animation: { type: 'fadeIn', delay: 0.2 },
      },
      {
        id: 'text-2',
        type: 'text',
        content: {
          title: 'Pregações em Destaque',
          body: 'Explore nossas mensagens que tocam o coração e fortalecem a fé. Cada pregação é uma oportunidade de se aproximar de Deus e descobrir Seus propósitos para a sua vida.',
          alignment: 'center',
        },
        animation: { type: 'slideUp', delay: 0.3 },
      },
      {
        id: 'text-3',
        type: 'text',
        content: {
          title: 'Curiosidades Bíblicas Pouco Conhecidas',
          body: '1️⃣ O nome "Bíblia" vem do grego "biblos", que significa "livro" — mas a Bíblia é, na verdade, uma biblioteca com 66 livros!\n\n2️⃣ Moisés escreveu os Salmos 90 e 91, que são os mais antigos do livro de Salmos.\n\n3️⃣ O livro de Jonas tem apenas 48 versículos, mas é um dos mais poderosos exemplos de arrependimento no Antigo Testamento.\n\n4️⃣ Jesus falou mais sobre dinheiro do que sobre céu e inferno — 13 das 39 parábolas tratam de bens materiais.\n\n5️⃣ O apóstolo Paulo escreveu 13 das 27 cartas do Novo Testamento, muitas delas de prisão.',
          alignment: 'left',
        },
        animation: { type: 'slideUp', delay: 0.4 },
      },
      {
        id: 'testimonials-1',
        type: 'testimonial',
        content: {
          items: [
            { name: 'Maria Silva', text: 'A pregação da semana passada mudou minha perspectiva. Eu estava passando por um momento difícil e Deus me falou através da Palavra.', avatar: '' },
            { name: 'João Paulo', text: 'Comecei a ouvir as pregações há 3 meses e minha vida espiritual nunca foi tão forte. Recomendo para todos!', avatar: '' },
            { name: 'Raquel Santos', text: 'As curiosidades bíblicas me fizeram estudar a Bíblia com outros olhos. Nunca imaginei que havia tantos tesouros escondidos!', avatar: '' },
          ],
        },
        animation: { type: 'fadeIn', delay: 0.5 },
      },
      {
        id: 'offer-1',
        type: 'offer',
        content: {
          title: 'Nosso Ministério',
          price: 'Contribua com qualquer valor',
          originalPrice: '',
          features: [
            'Pregações novas toda semana',
            'Testemunhos reais de transformação',
            'Estudos bíblicos aprofundados',
            'Comunidade de fé ativa',
            'Conteúdo 100% gratuito',
          ],
          buttonText: 'QUERO FAZER PARTE',
        },
        animation: { type: 'zoom', delay: 0.6 },
      },
      {
        id: 'guarantee-1',
        type: 'guarantee',
        content: {
          title: 'Nossa Missão',
          text: 'Levar a Palavra de Deus a cada coração que busca verdade, esperança e transformação. Somos guiados pelo amor e pela fé.',
          icon: 'shield',
        },
        animation: { type: 'fadeIn', delay: 0.7 },
      },
      {
        id: 'faq-1',
        type: 'faq',
        content: {
          items: [
            { question: 'Preciso ser evangélico para assistir?', answer: 'Todos são bem-vindos! Nossas pregações são para qualquer pessoa que busca conhecimento espiritual e paz interior.' },
            { question: 'Como posso contribuir?', answer: 'Aceitamos contribuições via PIX, transferência bancária ou presencialmente nos cultos. Qualquer valor ajuda a manter o ministério.' },
            { question: 'Vocês fazem eventos presenciais?', answer: 'Sim! Realizamos encontros mensais e retiros semanais. Acesse nosso calendário para conferir as datas.' },
          ],
        },
        animation: { type: 'fadeIn', delay: 0.8 },
      },
    );
  }

  if (template === 'personal-trainer') {
    base.push(
      {
        id: 'text-1',
        type: 'text',
        content: {
          title: 'Transforme Seu Corpo e Sua Vida',
          body: 'Mais de 800 alunos já transformaram seus corpos com nosso método exclusivo. Treinos personalizados, planos alimentares e acompanhamento próximo.',
          alignment: 'center',
        },
        animation: { type: 'fadeIn', delay: 0.1 },
      },
      {
        id: 'video-1',
        type: 'video',
        content: { url: '', title: 'Conheça Nosso Método de Treino' },
        animation: { type: 'fadeIn', delay: 0.2 },
      },
      {
        id: 'text-2',
        type: 'text',
        content: {
          title: 'O que Você Vai Receber',
          body: '1️⃣ Treinos personalizados para o seu objetivo (emagrecimento, hipertrofia, resistência)\n2️⃣ Plano alimentar adaptado ao seu gosto e rotina\n3️⃣ Acompanhamento semanal por WhatsApp\n4️⃣ Comunidade exclusiva com outros alunos\n5️⃣ Aulas ao vivo toda semana com dicas práticas',
          alignment: 'left',
        },
        animation: { type: 'slideUp', delay: 0.3 },
      },
      {
        id: 'offer-1',
        type: 'offer',
        content: {
          title: 'Plano Completo 3 Meses',
          price: '12x de R$147',
          originalPrice: 'R$897 à vista',
          features: [
            'Treinos 100% personalizados',
            'Plano alimentar completo',
            'Suporte diário via WhatsApp',
            'Comunidade exclusiva',
            'Aulas ao vivo semanais',
          ],
          buttonText: 'QUERO COMEÇAR MINHA TRANSFORMAÇÃO',
        },
        animation: { type: 'zoom', delay: 0.4 },
      },
      {
        id: 'testimonials-1',
        type: 'testimonial',
        content: {
          items: [
            { name: 'Fernanda Lima', text: 'Perdi 15kg em 4 meses! O treino é desafiador mas o resultado compensa muito. Nunca mais volto atrás.', avatar: '' },
            { name: 'Carlos Eduardo', text: 'Ganhei 8kg de massa magra em 3 meses. O plano alimentar é incrível, não passo fome.', avatar: '' },
            { name: 'Amanda Rocha', text: 'Melhor investimento em saúde que já fiz. Me sinto mais disposta e confiante.', avatar: '' },
          ],
        },
        animation: { type: 'fadeIn', delay: 0.5 },
      },
      {
        id: 'guarantee-1',
        type: 'guarantee',
        content: {
          title: 'Garantia de 7 Dias',
          text: 'Se nos primeiros 7 dias você não gostar do método, devolvemos 100% do valor. Sem perguntas.',
          icon: 'shield',
        },
        animation: { type: 'fadeIn', delay: 0.6 },
      },
      {
        id: 'faq-1',
        type: 'faq',
        content: {
          items: [
            { question: 'Preciso ter experiência com academia?', answer: 'Não! O programa é para todos os níveis — iniciante, intermediário ou avançado.' },
            { question: 'Os treinos são em casa ou academia?', answer: 'Ambos! Temos opções para treinar em casa com pouco equipamento e para academia completa.' },
            { question: 'Tem garantia?', answer: 'Sim! 7 dias de garantia incondicional. Se não gostar, devolvemos seu dinheiro.' },
          ],
        },
        animation: { type: 'fadeIn', delay: 0.7 },
      },
    );
  }

  if (template === 'receitas') {
    base.push(
      {
        id: 'text-1',
        type: 'text',
        content: {
          title: 'Receitas Deliciosas para o Dia a Dia',
          body: 'Mais de 200 receitas práticas, rápidas e saudáveis. Planos alimentares personalizados para sua rotina e objetivos.',
          alignment: 'center',
        },
        animation: { type: 'fadeIn', delay: 0.1 },
      },
      {
        id: 'video-1',
        type: 'video',
        content: { url: '', title: 'Assista: Como Preparar sua Primeira Receita' },
        animation: { type: 'fadeIn', delay: 0.2 },
      },
      {
        id: 'text-2',
        type: 'text',
        content: {
          title: 'O que Você Vai Encontrar',
          body: '• Receitas para café da manhã, almoço, jantar e lanches saudáveis\n• Planos de emagrecimento e ganho de massa\n• Lista de compras organizada por semana\n• Receitas em até 15 minutos para quem tem pressa\n• Variações para dietas específicas (low carb, vegetariana, etc)',
          alignment: 'left',
        },
        animation: { type: 'slideUp', delay: 0.3 },
      },
      {
        id: 'offer-1',
        type: 'offer',
        content: {
          title: 'E-book Completo + Bônus',
          price: '12x de R$37',
          originalPrice: 'R$397',
          features: [
            '200+ receitas com fotos',
            '7 dias de planos alimentares',
            'Lista de compras semanal',
            'Vídeo-aulas de preparo',
            'Acesso vitalício a atualizações',
          ],
          buttonText: 'QUERO COMPRAR AGORA',
        },
        animation: { type: 'zoom', delay: 0.4 },
      },
      {
        id: 'testimonials-1',
        type: 'testimonial',
        content: {
          items: [
            { name: 'Patrícia Santos', text: 'Nunca cozinhava e agora faço tudo em casa! Minha família adora e economizo muito.', avatar: '' },
            { name: 'Marcos Oliveira', text: 'Perdi 10kg em 2 meses com as receitas. São deliciosas e fáceis de fazer.', avatar: '' },
            { name: 'Camila Ferreira', text: 'O melhor e-book de receitas que já comprei. Vale muito mais do que paguei!', avatar: '' },
          ],
        },
        animation: { type: 'fadeIn', delay: 0.5 },
      },
      {
        id: 'guarantee-1',
        type: 'guarantee',
        content: {
          title: 'Garantia de 30 Dias',
          text: 'Se não gostar das receitas, devolvemos seu dinheiro. Risco zero para você!',
          icon: 'shield',
        },
        animation: { type: 'fadeIn', delay: 0.6 },
      },
      {
        id: 'faq-1',
        type: 'faq',
        content: {
          items: [
            { question: 'As receitas são difíceis de fazer?', answer: 'Todas são pensadas para serem práticas e rápidas. A maioria leva menos de 30 minutos.' },
            { question: 'Serve para vegetarianos?', answer: 'Sim! Temos muitas opções vegetarianas e veganas, além de adaptações para qualquer dieta.' },
            { question: 'Recebo atualizações?', answer: 'Sim! Novas receitas são adicionadas todo mês e você recebe gratuitamente.' },
          ],
        },
        animation: { type: 'fadeIn', delay: 0.7 },
      },
    );
  }

  if (template === 'imobiliario') {
    base.push(
      {
        id: 'text-1',
        type: 'text',
        content: {
          title: 'Encontre o Imóvel dos Seus Sonhos',
          body: 'Mais de 500 imóveis disponíveis. Casas, apartamentos, terrenos e salas comerciais. Financiamento com as melhores condições do mercado.',
          alignment: 'center',
        },
        animation: { type: 'fadeIn', delay: 0.1 },
      },
      {
        id: 'text-2',
        type: 'text',
        content: {
          title: 'Destaques da Semana',
          body: '🏠 Apartamento 3 quartos - Centro - R$450.000\n🏡 Casa 4 quartos - Jardins - R$680.000\n🏢 Sala Comercial - Business Park - R$320.000\n🌳 Terreno 500m² - Condomínio Fechado - R$280.000',
          alignment: 'left',
        },
        animation: { type: 'slideUp', delay: 0.2 },
      },
      {
        id: 'text-3',
        type: 'text',
        content: {
          title: 'Por que Comprar Conosco?',
          body: '✓ Atendimento personalizado por corretores certificados\n✓ Análise de crédito gratuita\n✓ Financiamento com bancos parceiros\n• Documentação assistida do início ao fim\n✓ Visitas agendadas no seu ritmo',
          alignment: 'left',
        },
        animation: { type: 'slideUp', delay: 0.3 },
      },
      {
        id: 'offer-1',
        type: 'offer',
        content: {
          title: 'Avaliação Gratuita',
          price: 'Grátis',
          originalPrice: 'R$1.500',
          features: [
            'Avaliação profissional do imóvel',
            'Análise de mercado da região',
            'Sugestão de preço de venda',
            'Relatório completo em PDF',
            'Consultoria com especialista',
          ],
          buttonText: 'SOLICITAR AVALIAÇÃO GRÁTIS',
        },
        animation: { type: 'zoom', delay: 0.4 },
      },
      {
        id: 'testimonials-1',
        type: 'testimonial',
        content: {
          items: [
            { name: 'Roberto Almeida', text: 'Comprei meu apartamento ideal com a ajuda deles. O financiamento saiu com taxa de 0.99% ao mês!', avatar: '' },
            { name: 'Sandra Costa', text: 'Vendi meu imóvel em apenas 2 semanas. Profissionais excelentes!', avatar: '' },
            { name: 'Pedro Santos', text: 'Melhor imobiliária da região. Atendimento nota 10 e preços justos.', avatar: '' },
          ],
        },
        animation: { type: 'fadeIn', delay: 0.5 },
      },
      {
        id: 'faq-1',
        type: 'faq',
        content: {
          items: [
            { question: 'Fazem financiamento?', answer: 'Sim! Trabalhamos com todos os bancos e temos taxas a partir de 0.99% ao mês para crédito imobiliário.' },
            { question: 'Posso agendar visitas?', answer: 'Claro! Ligue ou envie WhatsApp para agendar visitas nos horários que melhor se encaixam na sua rotina.' },
            { question: 'Avaliação é realmente grátis?', answer: 'Sim! A primeira avaliação do seu imóvel é 100% gratuita, sem compromisso.' },
          ],
        },
        animation: { type: 'fadeIn', delay: 0.6 },
      },
    );
  }

  if (template === 'petshop') {
    base.push(
      {
        id: 'text-1',
        type: 'text',
        content: {
          title: 'Tudo Para o Seu Melhor Amigo',
          body: 'Produtos premium, banho e tosa, veterinário e petiscos artesanais. Seu pet merece o melhor!',
          alignment: 'center',
        },
        animation: { type: 'fadeIn', delay: 0.1 },
      },
      {
        id: 'text-2',
        type: 'text',
        content: {
          title: 'Nossos Serviços',
          body: '🐕 Banho e tosa profissional\n🐾 Hotel para pets (hospedagem)\n💉 Vacinação e consultas veterinárias\n🦴 Petiscos artesanais naturais\n🎾 Brinquedos e acessórios premium',
          alignment: 'center',
        },
        animation: { type: 'slideUp', delay: 0.2 },
      },
      {
        id: 'offer-1',
        type: 'offer',
        content: {
          title: 'Kit Bem-Estar Completo',
          price: '12x de R$89',
          originalPrice: 'R$1.290',
          features: [
            'Banho e tosa mensal',
            'Vacinas em dia',
            'Ração premium (5kg/mês)',
            'Petisco natural semanal',
            'Check-up veterinário trimestral',
          ],
          buttonText: 'QUERO CUIDAR DO MEU PET',
        },
        animation: { type: 'zoom', delay: 0.3 },
      },
      {
        id: 'testimonials-1',
        type: 'testimonial',
        content: {
          items: [
            { name: 'Ana Paula', text: 'Meu cachorro adora ir ao pet shop! O atendimento é carinhoso e profissional.', avatar: '' },
            { name: 'Ricardo Mendes', text: 'O hotel para pets salvou minhas férias. Meu gato ficou super bem cuidado.', avatar: '' },
            { name: 'Juliana Costa', text: 'Os petiscos artesanais são incríveis! Meu cão não quer mais outra marca.', avatar: '' },
          ],
        },
        animation: { type: 'fadeIn', delay: 0.4 },
      },
      {
        id: 'guarantee-1',
        type: 'guarantee',
        content: {
          title: 'Satisfação Garantida',
          text: 'Se seu pet não curtir algum produto, trocamos sem custo adicional. Amor pelos animais é o que nos move!',
          icon: 'shield',
        },
        animation: { type: 'fadeIn', delay: 0.5 },
      },
      {
        id: 'faq-1',
        type: 'faq',
        content: {
          items: [
            { question: 'Atendem quais animais?', answer: 'Cães, gatos, coelhos, hamsters e aves. Para animais exóticos, consulte disponibilidade.' },
            { question: 'Preciso agendar?', answer: 'Para banho e tosa sim. Para compras e petiscos, é só aparecer na loja!' },
            { question: 'Fazem entrega?', answer: 'Sim! Entrega gratuita para compras acima de R$100 na região.' },
          ],
        },
        animation: { type: 'fadeIn', delay: 0.6 },
      },
    );
  }

  if (template === 'beleza') {
    base.push(
      {
        id: 'text-1',
        type: 'text',
        content: {
          title: 'Realce Sua Beleza Natural',
          body: 'Produtos profissionais de maquiagem, skincare e tratamentos capilares. Qualidade premium com preço acessível.',
          alignment: 'center',
        },
        animation: { type: 'fadeIn', delay: 0.1 },
      },
      {
        id: 'video-1',
        type: 'video',
        content: { url: '', title: 'Tutorial: Maquiagem Completa em 15 Minutos' },
        animation: { type: 'fadeIn', delay: 0.2 },
      },
      {
        id: 'text-2',
        type: 'text',
        content: {
          title: 'Categorias em Destaque',
          body: '💄 Maquiagem profissional (bases, batons, sombras)\n✨ Skincare (sérums, hidratantes, protetor solar)\n💅 Esmaltes e unhas decoradas\n💆 Tratamento capilar (máscaras, óleos, shampoos)\n🌸 Perfumes importados',
          alignment: 'left',
        },
        animation: { type: 'slideUp', delay: 0.3 },
      },
      {
        id: 'offer-1',
        type: 'offer',
        content: {
          title: 'Kit Skincare Completo',
          price: '12x de R$79',
          originalPrice: 'R$1.190',
          features: [
            'Limpeza profunda',
            'Sérum de vitamina C',
            'Hidratante facial',
            'Protetor solar FPS 50',
            'Máscaras de ácido hialurônico',
          ],
          buttonText: 'QUERO ME CUIDAR',
        },
        animation: { type: 'zoom', delay: 0.4 },
      },
      {
        id: 'testimonials-1',
        type: 'testimonial',
        content: {
          items: [
            { name: 'Carla Mendonça', text: 'Minha pele mudou completamente! As rugas diminuíram e estou mais confiante.', avatar: '' },
            { name: 'Patrícia Lopes', text: 'A melhor loja de beleza online! Produtos originais e entrega super rápida.', avatar: '' },
            { name: 'Fernanda Dias', text: 'Comprei o kit completo e não me arrependo. Vale cada centavo!', avatar: '' },
          ],
        },
        animation: { type: 'fadeIn', delay: 0.5 },
      },
      {
        id: 'guarantee-1',
        type: 'guarantee',
        content: {
          title: 'Troca Garantida',
          text: 'Se não gostar de algum produto, troque em até 30 dias. Sua satisfação é nossa prioridade.',
          icon: 'shield',
        },
        animation: { type: 'fadeIn', delay: 0.6 },
      },
      {
        id: 'faq-1',
        type: 'faq',
        content: {
          items: [
            { question: 'Os produtos são originais?', answer: 'Sim! Trabalhamos apenas com marcas autorizadas e produtos 100% originais.' },
            { question: 'Fazem consultoria de pele?', answer: 'Sim! Nossas especialistas analisam seu tipo de pele e indicam os produtos ideais.' },
            { question: 'Tem programa de fidelidade?', answer: 'Sim! A cada R$100 em compras, você ganha 10% de desconto na próxima compra.' },
          ],
        },
        animation: { type: 'fadeIn', delay: 0.7 },
      },
    );
  }

  if (template === 'educacao-financeira') {
    base.push(
      {
        id: 'text-1',
        type: 'text',
        content: {
          title: 'Domine Suas Finanças e Ganhe Mais Dinheiro',
          body: 'Mais de 3.000 alunos já transformaram sua vida financeira. Método comprovado para sair das dívidas e construir patrimônio.',
          alignment: 'center',
        },
        animation: { type: 'fadeIn', delay: 0.1 },
      },
      {
        id: 'video-1',
        type: 'video',
        content: { url: '', title: 'Aula Gratuita: Como Investir seu Primeiro R$1.000' },
        animation: { type: 'fadeIn', delay: 0.2 },
      },
      {
        id: 'text-2',
        type: 'text',
        content: {
          title: 'O que Você Vai Aprender',
          body: '1️⃣ Eliminar dívidas com o método balls de neutron\n2️⃣ Criar uma reserva de emergência em 6 meses\n3️⃣ Investir em renda fixa, ações e criptomoedas\n4️⃣ Ganhar renda extra com freelancing e negócios\n5️⃣ Planejar sua aposentadoria com tranquilidade',
          alignment: 'left',
        },
        animation: { type: 'slideUp', delay: 0.3 },
      },
      {
        id: 'offer-1',
        type: 'offer',
        content: {
          title: 'Mentoria Financeira 6 Meses',
          price: '12x de R$197',
          originalPrice: 'R$2.997',
          features: [
            'Acesso à comunidade exclusiva',
            'Planilhas de controle financeiro',
            'Sessões ao vivo semanais',
            'Suporte direto por WhatsApp',
            'Certificado de conclusão',
          ],
          buttonText: 'QUERO SAIR DAS DÍVIDAS',
        },
        animation: { type: 'zoom', delay: 0.4 },
      },
      {
        id: 'testimonials-1',
        type: 'testimonial',
        content: {
          items: [
            { name: 'Lucas Pereira', text: 'Saí de R$30.000 em dívidas para R$50.000 investidos em 12 meses. Método revolucionário!', avatar: '' },
            { name: 'Mariana Santos', text: 'Consegui minha reserva de emergência e já comecei a investir. Nunca pensei que seria possível.', avatar: '' },
            { name: 'Ricardo Oliveira', text: 'Minha renda extra já supera meu salário! O método funciona de verdade.', avatar: '' },
          ],
        },
        animation: { type: 'fadeIn', delay: 0.5 },
      },
      {
        id: 'guarantee-1',
        type: 'guarantee',
        content: {
          title: 'Garantia de 30 Dias',
          text: 'Se em 30 dias não sentir que o conteúdo vale pelo menos 10x o investimento, devolvemos seu dinheiro.',
          icon: 'shield',
        },
        animation: { type: 'fadeIn', delay: 0.6 },
      },
      {
        id: 'faq-1',
        type: 'faq',
        content: {
          items: [
            { question: 'Preciso ter dinheiro para investir?', answer: 'Não! O método começa do zero absoluto. Você aprende a economizar o primeiro R$100.' },
            { question: 'Funciona para quem já tem dívidas?', answer: 'Sim! O método balls de neutron é específico para eliminar dívidas rapidamente.' },
            { question: 'Tem garantia?', answer: 'Sim! 30 dias de garantia incondicional. Se não gostar, devolvemos seu dinheiro.' },
          ],
        },
        animation: { type: 'fadeIn', delay: 0.7 },
      },
    );
  }

  if (template === 'fotografo') {
    base.push(
      {
        id: 'text-1',
        type: 'text',
        content: {
          title: 'Registre os Momentos Mais Especiais',
          body: 'Fotografia profissional para casamentos, eventos, ensaios corporativos e portfolios. Sua história merece ser contada com arte.',
          alignment: 'center',
        },
        animation: { type: 'fadeIn', delay: 0.1 },
      },
      {
        id: 'text-2',
        type: 'text',
        content: {
          title: 'Serviços em Destaque',
          body: '📸 Ensaios fotográficos (individual, casal, família)\n💒 Fotografia de casamentos e compromissos\n🏢 Fotografia corporativa e institucional\n🎨 Edição profissional com tratamento de imagem\n📦 Álbum fotográfico personalizado',
          alignment: 'center',
        },
        animation: { type: 'slideUp', delay: 0.2 },
      },
      {
        id: 'offer-1',
        type: 'offer',
        content: {
          title: 'Pacote Ensaiamento Completo',
          price: '12x de R$127',
          originalPrice: 'R$1.490',
          features: [
            '2h de sessão fotográfica',
            '100 fotos editadas em alta resolução',
            'Álbum digital personalizado',
            '10 fotos impressas em papel fotográfico',
            'Diretório online para download',
          ],
          buttonText: 'AGENDAR MEU ENSAIO',
        },
        animation: { type: 'zoom', delay: 0.3 },
      },
      {
        id: 'testimonials-1',
        type: 'testimonial',
        content: {
          items: [
            { name: 'Isabela Rocha', text: 'As fotos do meu casamento ficaram lindas! Cada momento capturado com muito carinho.', avatar: '' },
            { name: 'Thiago Mendes', text: 'Ensaio corporativo profissional. Minha empresa amou o resultado!', avatar: '' },
            { name: 'Amanda Costa', text: 'Fotógrafo incrível! As fotos da família ficaram perfeitas para presentear os avós.', avatar: '' },
          ],
        },
        animation: { type: 'fadeIn', delay: 0.4 },
      },
      {
        id: 'faq-1',
        type: 'faq',
        content: {
          items: [
            { question: 'Como é o processo de agendamento?', answer: 'Entre em contato, escolha a data e horário. Fazemos uma pré-análise do local e suas preferências.' },
            { question: 'Fazem pacotes para casamentos?', answer: 'Sim! Temos pacotes completos com cobertura do pré-cerimônia até a festa, incluindo álbuns.' },
            { question: 'Qual o prazo de entrega?', answer: 'Ensaios: 7 dias úteis. Casamentos: 30 dias úteis. Entregamos tudo via link seguro online.' },
          ],
        },
        animation: { type: 'fadeIn', delay: 0.5 },
      },
    );
  }

  if (template === 'musica-gospel') {
    base.push(
      {
        id: 'text-1',
        type: 'text',
        content: {
          title: 'Música que Toca o Coração',
          body: 'Novos lançamentos, shows ao vivo e streaming. A música gospel que fortalece sua fé e alegra seu dia.',
          alignment: 'center',
        },
        animation: { type: 'fadeIn', delay: 0.1 },
      },
      {
        id: 'video-1',
        type: 'video',
        content: { url: '', title: 'Ouça o Novo Single Agora' },
        animation: { type: 'fadeIn', delay: 0.2 },
      },
      {
        id: 'text-2',
        type: 'text',
        content: {
          title: 'Shows e Turnês',
          body: '🎶 Turnê "Fé Inabalável" - 15 cidades pelo Brasil\n🎤 Show Acústico - Toda sexta-feira às 20h\n🎸 Festival de Música Gospel - Dezembro 2025\n📍 Encontro de Louvor - Mensal em São Paulo',
          alignment: 'center',
        },
        animation: { type: 'slideUp', delay: 0.3 },
      },
      {
        id: 'offer-1',
        type: 'offer',
        content: {
          title: 'Álbum Completo + Bônus',
          price: '12x de R$27',
          originalPrice: 'R$297',
          features: [
            '12 faixas inéditas',
            'Making of exclusivo',
            'Acesso ao show virtual',
            'Letras e cifras completas',
            'Conteúdo bônus behind the scenes',
          ],
          buttonText: 'OUVIR AGORA',
        },
        animation: { type: 'zoom', delay: 0.4 },
      },
      {
        id: 'testimonials-1',
        type: 'testimonial',
        content: {
          items: [
            { name: 'Paulo Henrique', text: 'A música "Fé Inabalável" mudou minha vida. Ouvço todo dia e me fortalece.', avatar: '' },
            { name: 'Mariana Costa', text: 'O show ao vivo foi incrível! A energia da plateia e a mensagem foram perfeitas.', avatar: '' },
            { name: 'Lucas Ferreira', text: 'Melhor álbum gospel do ano! Cada música é uma bênção.', avatar: '' },
          ],
        },
        animation: { type: 'fadeIn', delay: 0.5 },
      },
      {
        id: 'guarantee-1',
        type: 'guarantee',
        content: {
          title: 'Nossa Missão',
          text: 'Levar a música gospel que transforma vidas a cada ouvinte. Feito com amor, fé e excelência.',
          icon: 'shield',
        },
        animation: { type: 'fadeIn', delay: 0.6 },
      },
      {
        id: 'faq-1',
        type: 'faq',
        content: {
          items: [
            { question: 'Onde comprar ingressos?', answer: 'Acesse nossa página de shows ou compre via Sympla, Eventbrite e plataformas parceiras.' },
            { question: 'Fazem shows particulares?', answer: 'Sim! Entra em contato para agendar apresentações em igrejas, eventos e empresas.' },
            { question: 'Tem streaming?', answer: 'Sim! Nossas músicas estão disponíveis em Spotify, Apple Music, YouTube Music e todas as plataformas.' },
          ],
        },
        animation: { type: 'fadeIn', delay: 0.7 },
      },
    );
  }

  if (template === 'eletronicos') {
    base.push(
      {
        id: 'text-1',
        type: 'text',
        content: {
          title: 'Os Melhores Eletrônicos com os Melhores Preços',
          body: 'TVs, smartphones, notebooks, computadores, periféricos e muito mais. Marcas como Samsung, Apple, Dell, Lenovo, LG e Xiaomi com garantia e frete grátis.',
          alignment: 'center',
        },
        animation: { type: 'fadeIn', delay: 0.1 },
      },
      {
        id: 'text-2',
        type: 'text',
        content: {
          title: 'Categorias em Destaque',
          body: '📱 Smartphones (iPhone, Samsung Galaxy, Xiaomi, Motorola)\n📺 Smart TVs (4K, 8K, OLED, QLED)\n💻 Notebooks (Gamer, Ultrabook, Corporativo)\n🖥️ Computadores (Desktop, All-in-One, Mini PC)\n🎧 Periféricos (Fones, Teclados, Mouses, Webcams)\n🎮 Games (Consoles, Controles, Acessórios)',
          alignment: 'left',
        },
        animation: { type: 'slideUp', delay: 0.2 },
      },
      {
        id: 'offer-1',
        type: 'offer',
        content: {
          title: 'iPhone 15 Pro Max 256GB',
          price: '12x de R$749',
          originalPrice: 'R$10.499',
          features: [
            'Tela Super Retina XDR de 6.7"',
            'Chip A17 Pro de última geração',
            'Câmera de 48MP com zoom óptico 5x',
            'Bateria de até 29h de reprodução de vídeo',
            'Garantia Apple de 1 ano',
          ],
          buttonText: 'COMPRAR AGORA',
        },
        animation: { type: 'zoom', delay: 0.3 },
      },
      {
        id: 'text-3',
        type: 'text',
        content: {
          title: 'Por que Comprar Conosco?',
          body: '✓ Preço mais baixo garantido ou devolvemos a diferença\n✓ Frete grátis para todo Brasil em compras acima de R$500\n✓ Parcelamento em até 12x sem juros\n✓ Garantia estendida disponível\n✓ Suporte técnico especializado\n✓ Troca em até 30 dias',
          alignment: 'left',
        },
        animation: { type: 'slideUp', delay: 0.4 },
      },
      {
        id: 'testimonials-1',
        type: 'testimonial',
        content: {
          items: [
            { name: 'Ricardo Mendes', text: 'Comprei um notebook Dell por R$2.000 mais barato que na loja física. Entrega rápida e produto original!', avatar: '' },
            { name: 'Amanda Costa', text: 'A TV Samsung 65" chegou impecável. O suporte técnico me ajudou a configurar tudo por WhatsApp.', avatar: '' },
            { name: 'Fernando Lima', text: 'Melhor loja online de eletrônicos. Já comprei celular, fone e teclado. Tudo com garantia!', avatar: '' },
          ],
        },
        animation: { type: 'fadeIn', delay: 0.5 },
      },
      {
        id: 'guarantee-1',
        type: 'guarantee',
        content: {
          title: 'Compra 100% Segura',
          text: 'Produtos 100% originais com nota fiscal e garantia do fabricante. Se não gostar, troque em até 30 dias.',
          icon: 'shield',
        },
        animation: { type: 'fadeIn', delay: 0.6 },
      },
      {
        id: 'faq-1',
        type: 'faq',
        content: {
          items: [
            { question: 'Os produtos são originais?', answer: 'Sim! Trabalhamos apenas com distribuidores autorizados. Todo produto acompanha nota fiscal e garantia do fabricante.' },
            { question: 'Qual o prazo de entrega?', answer: 'Capital: 1-2 dias úteis. Demais regiões: 3-7 dias úteis. Frete grátis acima de R$500.' },
            { question: 'Fazem troca?', answer: 'Sim! Troca em até 30 dias para produtos na embalagem original. Para defeitos, garantia de até 12 meses.' },
          ],
        },
        animation: { type: 'fadeIn', delay: 0.7 },
      },
    );
  }

  return base;
}
