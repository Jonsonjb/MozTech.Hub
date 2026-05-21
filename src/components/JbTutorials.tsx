/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Award, 
  BookOpen, 
  ExternalLink, 
  Search, 
  Code, 
  HelpCircle, 
  Send,
  Cpu,
  ChevronRight,
  ClipboardCheck,
  Check
} from 'lucide-react';

interface Tutorial {
  id: string;
  title: string;
  summary: string;
  category: 'Mobile Money' | 'SEO & Blog' | 'Domains & Web' | 'WhatsApp Bots';
  publishedDate: string;
  readTime: string;
  originalUrl: string;
  steps: { title: string; content: string; code?: string; codeLang?: string }[];
}

const JB_TUTORIALS_DATA: Tutorial[] = [
  {
    id: 'tut-1',
    title: 'Como Integrar APIs C2B de Mobile Money (M-Pesa / e-Mola) em NodeJS/React',
    summary: 'Guia definitivo de automação de faturas e tratamento seguro de chamadas de webhooks de wallets móveis sem intermediários.',
    category: 'Mobile Money',
    publishedDate: '2026-05-18',
    readTime: '6 min',
    originalUrl: 'http://jonsonjb.blogspot.com/2026/05/integrar-mpesa-api-em-nodejs.html',
    steps: [
      {
        title: 'Passo 1: Entender a Arquitetura de Comunicação',
        content: 'O fluxo C2B (Customer-to-Business) consiste em efetuar um push USSD para o cliente digitar o PIN. Após o utilizador digitar o pin no telemóvel, as operadoras Vodacom ou Tmcel enviam um pedido POST HTTP seguro contendo as especificações da transação para o seu Webhook Express.',
      },
      {
        title: 'Passo 2: Configurar o Endpoint de Escuta webhook.js',
        content: 'Crie uma rota para escutar as chamadas da plataforma das operadoras. Certifique-se de validar o token de segurança no header da chamada para proteger o seu banco de dados contra faturas falsas.',
        code: `// Express webhook endpoint
app.post("/api/v1/payments/mpesa-callback", (req, res) => {
  const { transaction_id, customer_phone, amount, status } = req.body;
  const apiKey = req.headers['authorization'];
  
  if (apiKey !== process.env.VODACOM_CALLBACK_SECRET) {
    return res.status(401).json({ error: "Chave de webhook inválida!" });
  }

  if (status === "SUCCESSFUL") {
    // Ativa o anúncio Pro ou gera fatura no sistema local
    activateLicenseForPhone(customer_phone, transaction_id, amount);
  }

  res.status(200).json({ status: "ACK" });
});`,
        codeLang: 'javascript'
      },
      {
        title: 'Passo 3: Testar com Postman e Simulações',
        content: 'Antes de colocar em produção com os certificados oficiais, teste o webhook simulando retornos locais para assegurar que se houver falhas de rede do lado do cliente o sistema tente restabelecer de forma idempotente sem duplicar créditos.',
      }
    ]
  },
  {
    id: 'tut-2',
    title: 'Aprender SEO Local de Alta Eficiência para Blogger em Moçambique',
    summary: 'Dicas práticas para configurar metatags, mapa do site de robots.txt e carregar posts do jonsonjb.blogspot.com no topo das buscas do Google.',
    category: 'SEO & Blog',
    publishedDate: '2026-05-15',
    readTime: '4 min',
    originalUrl: 'http://jonsonjb.blogspot.com/p/seo-local-mocambique.html',
    steps: [
      {
        title: '1. Otimizar as Metatags de Cabeçalho do Blogger',
        content: 'Vá às definições ocultas de HTML do Blogger e ajuste as metas de descrição focando em termos muito pesquisados localmente em Moçambique, como "Arrendar casas Maputo", "Comprar telefones baratos Beira", ou "Plataformas de serviços".',
        code: `<meta name='description' content='Encontre tutoriais avançados de programação, integrações M-Pesa, marketing digital e dicas de negócios em Moçambique criados por Jonson JB.'/>
<meta name='keywords' content='Jonson JB, Moçambique, Negócios, Tutoriais Blogger, Mpesa API, KayaMoz, Netek, FixMoz'/>`,
        codeLang: 'xml'
      },
      {
        title: '2. Customizar o ficheiro Robots.txt',
        content: 'Assegure-se que o robô do Google indexa todas as subpáginas e pastas de buscas locais permitindo ao motor ler todas as tags criadas.',
      }
    ]
  },
  {
    id: 'tut-3',
    title: 'Configurar subdomínios gratuitos .CO.MZ via Cloudflare com SSL Ativo',
    summary: 'Aprenda a mapear redirecionamentos de domínios nacionais moçambicanos no Blogger do blogspot passo-a-passo e de graça.',
    category: 'Domains & Web',
    publishedDate: '2026-05-10',
    readTime: '5 min',
    originalUrl: 'http://jonsonjb.blogspot.com/2026/05/configurar-co-mz-cloudflare.html',
    steps: [
      {
        title: '1. Registar Host de DNS',
        content: 'Mapeie o seu domínio .CO.MZ nos nameservers gratuitos oferecidos pela Cloudflare para obter um proxy seguro grátis de alta performance impedindo quedas de servidor e ataques DDoS em Moçambique.',
      },
      {
        title: '2. Configurar Registos CNAME do Blogger',
        content: 'Adicione os dois registos CNAME obrigatórios fornecidos pela consola do Blogger na sua tabela de DNS Cloudflare e desative a nuvem laranja temporariamente para verificação de propriedade.',
        code: `Tipo: CNAME | Nome: www | Alvo: ghs.google.com | Proxy: Ativo
Tipo: CNAME | Nome: [código-específico] | Alvo: [alvo-específico].google.com | Proxy: DNS Only`,
        codeLang: 'plaintext'
      }
    ]
  },
  {
    id: 'tut-4',
    title: 'Construção de Robôs de Atendimento M-Pesa Automático via WhatsApp API',
    summary: 'Como criar assistentes virtuais de vendas inteligentes em Moçambique que respondem com orçamentos e aceitam pagamentos mobile.',
    category: 'WhatsApp Bots',
    publishedDate: '2026-05-02',
    readTime: '8 min',
    originalUrl: 'http://jonsonjb.blogspot.com/2026/05/whatsapp-bot-mocambique.html',
    steps: [
      {
        title: 'Passo 1: Ligar via Biblioteca Baileys',
        content: 'Use a biblioteca de código aberto Baileys do NodeJS que emula a conexão do WhatsApp Web de forma leve e rápida, eliminando os elevados custos das APIs oficiais corporativas estrangeiras.',
        code: `import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys';

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
  });
  
  sock.ev.on('messages.upsert', async m => {
    const msg = m.messages[0];
    if (!msg.key.fromMe && msg.message) {
      console.log('Mensagem de:', msg.key.remoteJid, msg.message.conversation);
      // Responde com as opções do menu
      await sock.sendMessage(msg.key.remoteJid, { text: "Olá! Seja bem-vindo ao suporte de classificados do Moz Tech Hub." });
    }
  });
}`,
        codeLang: 'typescript'
      },
      {
        title: 'Passo 2: Configurar o Menu interativo',
        content: 'Crie opções claras para que os utilizadores possam digitar "1" para imobiliários KayaMoz, "2" para reparações FixMoz, ou "3" para classificados Netek, ligando fluxos automáticos.',
      }
    ]
  }
];

interface JbTutorialsProps {
  onNotify: (text: string, type: 'success' | 'info' | 'error') => void;
  tutorials?: Tutorial[];
}

export default function JbTutorials({ onNotify, tutorials }: JbTutorialsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [activeTutorial, setActiveTutorial] = useState<Tutorial | null>(null);
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);
  
  // Custom suggestion
  const [requestedTopic, setRequestedTopic] = useState('');
  const [requestedEmail, setRequestedEmail] = useState('');

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIdx(idx);
    onNotify('Código do tutorial copiado com sucesso!', 'success');
    setTimeout(() => setCopiedCodeIdx(null), 2500);
  };

  const handleRequestTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestedTopic) return;

    onNotify('Sugestão de tempo enviada com sucesso ao Jonson JB! Iremos adicionar este tópico em breve em http://jonsonjb.blogspot.com', 'success');
    setRequestedTopic('');
    setRequestedEmail('');
  };

  const displayTutorials = tutorials && tutorials.length > 0 ? tutorials : JB_TUTORIALS_DATA;

  // Filter logic
  const filteredTutorials = displayTutorials.filter(t => {
    const matchesCategory = selectedCategory === 'todos' || t.category === selectedCategory;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* LEFT & MID COLUMNS: TUTORIALS DIRECTORY SEARCH SCREEN */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Search controls themed precisely */}
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between bg-zinc-950 p-4 border border-zinc-850 rounded-xs">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Pesquisar tutoriais por palavra-chave..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs font-mono font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-800 text-white rounded-xs focus:outline-none focus:border-gold-500 placeholder-zinc-650"
            />
          </div>

          <div className="flex items-center space-x-2">
            {['todos', 'Mobile Money', 'SEO & Blog', 'Domains & Web', 'WhatsApp Bots'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-[9px] font-mono font-bold uppercase tracking-wider rounded-xs border transition-all ${
                  selectedCategory === cat 
                    ? 'bg-gold-500 border-gold-500 text-black' 
                    : 'border-zinc-850 bg-zinc-900/40 text-zinc-400 hover:text-white'
                }`}
              >
                {cat === 'todos' ? 'TODOS' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Directory details grids */}
        <div className="space-y-4">
          {filteredTutorials.length > 0 ? (
            filteredTutorials.map((tut) => (
              <div 
                key={tut.id}
                className="border border-zinc-800 bg-zinc-950 p-5 rounded-xs hover:border-zinc-700 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center text-[9px] font-mono font-bold text-zinc-500 mb-2 uppercase">
                    <span className="text-gold-500 tracking-wider font-extrabold">{tut.category}</span>
                    <span>{new Date(tut.publishedDate).toLocaleDateString('pt-MZ')} &bull; {tut.readTime} LEITURA</span>
                  </div>

                  <h3 className="font-display font-black text-lg uppercase tracking-tight text-white group-hover:text-gold-400 transition-colors">
                    {tut.title}
                  </h3>

                  <p className="text-zinc-400 text-xs mt-2 leading-relaxed font-sans uppercase tracking-wide">
                    {tut.summary}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-zinc-900 flex flex-wrap gap-3 justify-between items-center">
                  <button
                    onClick={() => setActiveTutorial(tut)}
                    className="flex items-center space-x-1.5 rounded-xs bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 px-4 py-2 font-display text-[10px] font-bold tracking-widest uppercase cursor-pointer"
                  >
                    <BookOpen className="h-3 w-3" />
                    <span>Ler Tutorial</span>
                  </button>

                  <a
                    href={tut.originalUrl}
                    target="_blank"
                    rel="referrer"
                    className="flex items-center space-x-1 text-gold-500 hover:text-gold-400 font-mono text-[9.5px] font-bold uppercase tracking-widest hover:underline cursor-pointer"
                  >
                    <span>Ver no Blogspot</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 border border-dashed border-zinc-800 rounded-xs bg-zinc-950/30">
              <p className="font-mono text-zinc-500 text-xs font-bold uppercase tracking-widest">Nenhum Tutorial Localizado</p>
            </div>
          )}
        </div>

      </div>

      {/* RIGHT SIDEBAR: SUGGEST TOPIC & ARCHIVE PROMOTION INFO */}
      <div className="space-y-6">
        
        {/* Blogspot redirection callout card block */}
        <div className="border border-zinc-800 bg-zinc-950 p-5 rounded-xs text-center relative group">
          <Cpu className="h-10 w-10 text-gold-500 mx-auto mb-3" />
          <h4 className="font-display font-extrabold text-xs tracking-wider text-white uppercase mb-1">
            JONSONJB.BLOGSPOT.COM
          </h4>
          <p className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest mb-3">SITE ORIGINAL INTEGRADO</p>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans mb-4">
            Aceda diretamente à vasta biblioteca de artigos de programação, tecnologia em Angola/Moçambique, desenvolvimento de startups e templates Blogger premium de Jonson JB.
          </p>
          <a
            href="http://jonsonjb.blogspot.com"
            target="_blank"
            rel="referrer"
            className="w-full flex items-center justify-center space-x-1.5 rounded-xs bg-gold-500 hover:bg-gold-600 text-black font-display text-[10px] font-black tracking-widest uppercase py-3 cursor-pointer shadow-md"
          >
            <span>VISITAR SITE DE TUTORIAIS</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Suggest a new topic custom box */}
        <div className="border border-zinc-800 bg-zinc-950 p-5 rounded-xs">
          <h4 className="font-display font-bold text-xs uppercase tracking-widest text-gold-500 mb-3 border-b border-zinc-900 pb-2">
            SUGERIR NOVO TUTORIAL
          </h4>
          <p className="text-[10px] text-zinc-500 leading-relaxed mb-3 uppercase tracking-wider font-mono">
            Não encontrou o que procurava? Sugira uma integração técnica ao Jonson JB:
          </p>

          <form onSubmit={handleRequestTopic} className="space-y-3 font-mono text-[11px]">
            <div>
              <label className="block text-[9px] text-zinc-500 uppercase mb-0.5 tracking-wider font-extrabold">Qual é o Tópico? *</label>
              <input
                type="text"
                required
                placeholder="Ex: Como integrar SMS em Moçambique..."
                value={requestedTopic}
                onChange={(e) => setRequestedTopic(e.target.value)}
                className="w-full p-2.5 bg-zinc-900 border border-zinc-850 text-white rounded-xs focus:outline-none focus:border-gold-500 text-xs"
              />
            </div>
            <div>
              <label className="block text-[9px] text-zinc-500 uppercase mb-0.5 tracking-wider font-extrabold">O seu Email de Contato</label>
              <input
                type="email"
                placeholder="Ex: seuemail@gmail.com"
                value={requestedEmail}
                onChange={(e) => setRequestedEmail(e.target.value)}
                className="w-full p-2.5 bg-zinc-900 border border-zinc-850 text-white rounded-xs focus:outline-none focus:border-gold-500 text-xs"
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-1.5 rounded-xs bg-white text-black font-display text-[9.5px] font-black tracking-widest uppercase py-2.5 cursor-pointer shadow-inner hover:bg-zinc-200"
            >
              <Send className="h-3.5 w-3.5" />
              <span>ENVIAR SUGESTÃO DE TÓPICO</span>
            </button>
          </form>
        </div>

      </div>

      {/* DETAILED TUTORIAL EXPANSION DRAWER MODAL */}
      {activeTutorial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl border border-zinc-850 bg-zinc-950 p-6 sm:p-8 rounded-xs flex flex-col max-h-[85vh] overflow-y-auto font-sans relative">
            
            <button
              onClick={() => {
                setActiveTutorial(null);
                setCopiedCodeIdx(null);
              }}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white font-mono text-xs font-bold"
            >
              [ FECHAR X ]
            </button>

            <span className="font-mono text-[9px] font-bold text-gold-500 uppercase tracking-widest">{activeTutorial.category}</span>
            <h2 className="font-display font-black text-xl uppercase tracking-tight text-white mt-1 border-b border-zinc-905 pb-3">
              {activeTutorial.title}
            </h2>

            <div className="mt-5 space-y-6 flex-1 text-sm text-zinc-300 leading-relaxed">
              {activeTutorial.steps.map((step, idx) => (
                <div key={idx} className="space-y-2 border-l-2 border-gold-500/40 pl-4 py-1">
                  <h4 className="font-mono text-xs font-black uppercase text-white tracking-wide">
                    {step.title}
                  </h4>
                  <p className="text-zinc-400 font-sans text-xs">
                    {step.content}
                  </p>

                  {step.code && (
                    <div className="relative mt-2">
                      <div className="absolute top-2 right-2 flex items-center space-x-1">
                        <button
                          onClick={() => handleCopyCode(step.code!, idx)}
                          className="px-2 py-1 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 rounded-sm text-[9px] font-mono text-zinc-400 hover:text-white cursor-pointer"
                        >
                          {copiedCodeIdx === idx ? 'COPIADO!' : 'COPIAR'}
                        </button>
                      </div>
                      <pre className="p-4 bg-black border border-zinc-900 text-zinc-300 overflow-x-auto text-[10.5px] font-mono rounded-xs leading-relaxed max-h-[200px] overflow-y-auto">
                        <code>{step.code}</code>
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-900 flex justify-between items-center">
              <span className="font-mono text-[9px] text-zinc-500 uppercase font-bold">Publicado originalmente em {new Date(activeTutorial.publishedDate).toLocaleDateString('pt-MZ')}</span>
              <a
                href={activeTutorial.originalUrl}
                target="_blank"
                rel="referrer"
                className="flex items-center space-x-1.5 rounded-xs bg-gold-500 hover:bg-gold-650 text-black font-display text-[10px] font-black tracking-widest uppercase px-5 py-2.5 cursor-pointer shadow-md"
              >
                <span>Ler Artigo no Blogspot</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
