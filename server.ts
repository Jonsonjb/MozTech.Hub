/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// -------------------------------------------------------------------------
// IN-MEMORY DATABASE WITH MOZAMBICAN REAL-WORLD PLACEHOLDERS
// -------------------------------------------------------------------------

let MOCK_USERS = [
  {
    email: "admin@jonsonjb.com",
    password: "25021995Jb@",
    name: "Jonson JB",
    role: "admin",
    phone: "+258 84 123 4567"
  },
  {
    email: "peniel@gmail.com",
    password: "password123",
    name: "Peniel Mucavele",
    role: "user",
    phone: "+258 82 987 6543"
  }
];

let HOUSE_PLANS = [
  {
    id: "plan-1",
    title: "Planta T2 Económica Moçambique",
    bedrooms: 2,
    bathrooms: 1,
    squareMeters: 85,
    floors: 1,
    estimatedCostMT: 850000,
    style: "Tradicional Moderno",
    description: "Moradia unifamiliar compacta, ideal para início de vida. Projetada com ventilação cruzada ideal para o clima quente de Moçambique. Paredes de bloco de betão económico e fundação reforçada.",
    features: ["Ventilação Cruzada", "Cozinha Americana", "Varanda Alpendrada", "Fácil Ampliação"],
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=60",
    bluePrintGrid: [
      ["[ Varanda ]", "[ Sala de Estar ]", "[ Cozinha ]"],
      ["[ Quarto 1 ]", "[ Casa de Banho ]", "[ Quarto 2 ]"]
    ]
  },
  {
    id: "plan-2",
    title: "Vivenda T3 Sommerchield Executive",
    bedrooms: 3,
    bathrooms: 2.5,
    squareMeters: 175,
    floors: 2,
    estimatedCostMT: 3500000,
    style: "Minimalista Contemporâneo",
    description: "Projeto duplex topo de gama com linhas geométricas fortes. Vidro térmico curvo na fachada, suite master com closet privativo, área gourmet de lazer integrada e estacionamento para 2 viaturas.",
    features: ["Suíte com Closet", "Duplex", "Vidro Panorâmico", "Espaço Espelho de Água"],
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=60",
    bluePrintGrid: [
      ["[ Piso 1: Garagem ]", "[ Hall Entrada ]", "[ Sala Ampla ]"],
      ["[ Piso 2: Quarto 1 ]", "[ Quarto 2 ]", "[ Master Suite ]"]
    ]
  },
  {
    id: "plan-3",
    title: "Planta T4 Zimpeto Premium Open-Space",
    bedrooms: 4,
    bathrooms: 3.5,
    squareMeters: 240,
    floors: 1,
    estimatedCostMT: 2100000,
    style: "Chic Tropical",
    description: "Desenho plano horizontal com máxima penetração de luz do sol. Integração perfeita entre sala de jantar, sala de visitas e anexo independente para serviços ou visitas de fins de semana.",
    features: ["Anexo de Serviços", "Piscina Planeada", "Open-Space Pleno", "Quatro Suites"],
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=60",
    bluePrintGrid: [
      ["[ Quarto 1 ]", "[ Sala de Convívio ]", "[ Master Suite ]"],
      ["[ Quarto 2 ]", "[ Corredor Central ]", "[ Quarto 3 ]"],
      ["[ Anexo ]", "[ Lavandaria ]", "[ Garagem ]"]
    ]
  }
];

let TUTORIALS = [
  {
    id: "tut-1",
    title: "Como Integrar APIs C2B de Mobile Money (M-Pesa / e-Mola) em NodeJS/React",
    summary: "Guia definitivo de automação de faturas e tratamento seguro de chamadas de webhooks de wallets móveis sem intermediários.",
    category: "Mobile Money",
    publishedDate: "2026-05-18",
    readTime: "6 min",
    originalUrl: "http://jonsonjb.blogspot.com/2026/05/integrar-mpesa-api-em-nodejs.html",
    steps: [
      {
        title: "Passo 1: Entender a Arquitetura de Comunicação",
        content: "O fluxo C2B (Customer-to-Business) consiste em efetuar um push USSD para o cliente digitar o PIN. Após o utilizador digitar o pin no telemóvel, as operadoras Vodacom ou Tmcel enviam um pedido POST HTTP seguro contendo as especificações da transação para o seu Webhook Express."
      },
      {
        title: "Passo 2: Configurar o Endpoint de Escuta webhook.js",
        content: "Crie uma rota para escutar as chamadas da plataforma das operadoras. Certifique-se de validar o token de segurança no header da chamada para proteger o seu banco de dados contra faturas falsas.",
        code: "// Express webhook endpoint\napp.post(\"/api/v1/payments/mpesa-callback\", (req, res) => {\n  const { transaction_id, customer_phone, amount, status } = req.body;\n  const apiKey = req.headers['authorization'];\n  \n  if (apiKey !== process.env.VODACOM_CALLBACK_SECRET) {\n    return res.status(401).json({ error: \"Chave de webhook inválida!\" });\n  }\n\n  if (status === \"SUCCESSFUL\") {\n    // Ativa o anúncio Pro ou gera fatura no sistema local\n    activateLicenseForPhone(customer_phone, transaction_id, amount);\n  }\n\n  res.status(200).json({ status: \"ACK\" });\n});",
        codeLang: "javascript"
      },
      {
        title: "Passo 3: Testar com Postman e Simulações",
        content: "Antes de colocar em produção com os certificados oficiais, teste o webhook simulando retornos locais para assegurar que se houver falhas de rede do lado do cliente o sistema tente restabelecer de forma idempotente sem duplicar créditos."
      }
    ]
  },
  {
    id: "tut-2",
    title: "Aprender SEO Local de Alta Eficiência para Blogger em Moçambique",
    summary: "Dicas práticas para configurar metatags, mapa do site de robots.txt e carregar posts do jonsonjb.blogspot.com no topo das buscas do Google.",
    category: "SEO & Blog",
    publishedDate: "2026-05-15",
    readTime: "4 min",
    originalUrl: "http://jonsonjb.blogspot.com/p/seo-local-mocambique.html",
    steps: [
      {
        title: "1. Otimizar as Metatags de Cabeçalho do Blogger",
        content: "Vá às definições ocultas de HTML do Blogger e ajuste as metas de descrição focando em termos muito pesquisados localmente em Moçambique, como \"Arrendar casas Maputo\", \"Comprar telefones baratos Beira\", ou \"Plataformas de serviços\".",
        code: "<meta name='description' content='Encontre tutoriais avançados de programação, integrações M-Pesa, marketing digital e dicas de negócios em Moçambique criados por Jonson JB.'/>\n<meta name='keywords' content='Jonson JB, Moçambique, Negócios, Tutoriais Blogger, Mpesa API, KayaMoz, Netek, FixMoz'/>",
        codeLang: "xml"
      },
      {
        title: "2. Customizar o ficheiro Robots.txt",
        content: "Assegure-se que o robô do Google indexa todas as subpáginas e pastas de buscas locais permitindo ao motor ler todas as tags criadas."
      }
    ]
  },
  {
    id: "tut-3",
    title: "Configurar subdomínios gratuitos .CO.MZ via Cloudflare com SSL Ativo",
    summary: "Aprenda a mapear redirecionamentos de domínios nacionais moçambicanos no Blogger do blogspot passo-a-passo e de graça.",
    category: "Domains & Web",
    publishedDate: "2026-05-10",
    readTime: "5 min",
    originalUrl: "http://jonsonjb.blogspot.com/2026/05/configurar-co-mz-cloudflare.html",
    steps: [
      {
        title: "1. Registar Host de DNS",
        content: "Mapeie o seu domínio .CO.MZ nos nameservers gratuitos oferecidos pela Cloudflare para obter um proxy seguro grátis de alta performance impedindo quedas de servidor e ataques DDoS em Moçambique."
      },
      {
        title: "2. Configurar Registos CNAME do Blogger",
        content: "Adicione os dois registos CNAME obrigatórios fornecidos pela consola do Blogger na sua tabela de DNS Cloudflare e desative a nuvem laranja temporariamente para verificação de propriedade.",
        code: "Tipo: CNAME | Nome: www | Alvo: ghs.google.com | Proxy: Ativo\nTipo: CNAME | Nome: [código-específico] | Alvo: [alvo-específico].google.com | Proxy: DNS Only",
        codeLang: "plaintext"
      }
    ]
  },
  {
    id: "tut-4",
    title: "Construção de Robôs de Atendimento M-Pesa Automático via WhatsApp API",
    summary: "Como criar assistentes virtuais de vendas inteligentes em Moçambique que respondem com orçamentos e aceitam pagamentos mobile.",
    category: "WhatsApp Bots",
    publishedDate: "2026-05-02",
    readTime: "8 min",
    originalUrl: "http://jonsonjb.blogspot.com/2026/05/whatsapp-bot-mocambique.html",
    steps: [
      {
        title: "Passo 1: Ligar via Biblioteca Baileys",
        content: "Use a biblioteca de código aberto Baileys do NodeJS que emula a conexão do WhatsApp Web de forma leve e rápida, eliminando os elevados custos das APIs oficiais corporativas estrangeiras.",
        code: "import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys';\n\nasync function connectToWhatsApp() {\n  const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');\n  const sock = makeWASocket({\n    auth: state,\n    printQRInTerminal: true\n  });\n  \n  sock.ev.on('messages.upsert', async m => {\n    const msg = m.messages[0];\n    if (!msg.key.fromMe && msg.message) {\n      console.log('Mensagem de:', msg.key.remoteJid, msg.message.conversation);\n      // Responde com as opções do menu\n      await sock.sendMessage(msg.key.remoteJid, { text: \"Olá! Seja bem-vindo ao suporte de classificados do Moz Tech Hub.\" });\n    }\n  });\n}",
        codeLang: "typescript"
      },
      {
        title: "Passo 2: Configurar o Menu interativo",
        content: "Crie opções claras para que os utilizadores possam digitar \"1\" para imobiliários KayaMoz, \"2\" para reparações FixMoz, ou \"3\" para classificados Netek, ligando fluxos automáticos."
      }
    ]
  }
];

let DOCUMENT_REQUESTS = [
  {
    id: "req-1",
    documentType: "BI",
    fullName: "Nelson Banze Sigaúque",
    contactPhone: "+258 84 888 1122",
    whatsappNumber: "+258 84 888 1122",
    preferredProvince: "Maputo Cidade",
    preferredDate: "2026-06-02",
    status: "Processado",
    feesChargedMT: 150,
    paymentStatus: "Pago",
    paymentMethod: "M-Pesa",
    createdAt: "2026-05-19T14:20:00Z",
    userEmail: "peniel@gmail.com",
    notes: "Preciso que agendem para o período da manhã na DNIC de Maputo."
  },
  {
    id: "req-2",
    documentType: "Passaporte",
    fullName: "Sílvia Conceição Come",
    contactPhone: "+258 82 444 9900",
    whatsappNumber: "",
    preferredProvince: "Sofala",
    preferredDate: "2026-06-15",
    status: "Pendente",
    feesChargedMT: 150,
    paymentStatus: "Pendente",
    paymentMethod: "e-Mola",
    createdAt: "2026-05-21T08:15:00Z",
    userEmail: "penieldinismucavele@gmail.com",
    notes: "Primeira emissão do passaporte para viagem em Julho."
  }
];

let LISTINGS = [
  {
    id: "lst-1",
    title: "Apartamento T3 Elegante na Polana",
    description: "Excelente apartamento T3 remodelado, pronto a habitar. Localizado na Avenida Julius Nyerere, Polana Cimento, Maputo. Cozinha moderna equipada, 3 casas de banho, estacionamento privativo e segurança 24h. Ideal para habitação corporativa.",
    category: "KayaMoz",
    price: 120000,
    location: "Polana, Maputo",
    status: "Ativo",
    ownerEmail: "penieldinismucavele@gmail.com",
    contactPhone: "+258 84 111 2222",
    subscriptionTier: "Mensal",
    paymentMethod: "M-Pesa",
    paymentId: "TX-MP-883A9",
    createdAt: "2026-05-10T10:00:00Z",
    views: 342,
    features: ["T3", "Mobilado", "Segurança 24h", "Garagem"],
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=60",
    expiryDate: "2026-06-10"
  },
  {
    id: "lst-2",
    title: "Vivenda T4 de Luxo no Sommerchield II",
    description: "Vivenda de alto padrão para venda ou arrendamento. 4 suites espaçosas, piscina privativa, jardim verdejante, gerador e canil. Pronto a entrar em condomínio fechado de altíssimo prestígio.",
    category: "KayaMoz",
    price: 350000,
    location: "Sommerchield, Maputo",
    status: "Ativo",
    ownerEmail: "lucio.junior@gmail.com",
    contactPhone: "+258 82 333 4444",
    subscriptionTier: "Anual",
    paymentMethod: "e-Mola",
    paymentId: "TX-EM-772D9",
    createdAt: "2026-04-01T14:30:00Z",
    views: 890,
    features: ["T4", "Piscina", "Condomínio", "Gerador"],
    imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=60",
    expiryDate: "2027-04-01"
  },
  {
    id: "lst-3",
    title: "iPhone 15 Pro Max 256GB - Selado",
    description: "Vendo iPhone 15 Pro Max, 256GB, cor Titanium Natural. Aparelho completamente selado na caixa com garantia oficial Apple de 1 ano. Entrego em mão no Standard Bank da Avenida 25 de Setembro.",
    category: "Netek",
    price: 85000,
    location: "Baixa, Maputo",
    status: "Ativo",
    ownerEmail: "vendas.tech@netek.co.mz",
    contactPhone: "+258 85 555 6666",
    subscriptionTier: "Gratuito",
    paymentMethod: "Nenhum",
    createdAt: "2026-05-18T09:00:00Z",
    views: 120,
    features: ["Apple", "Selado", "Garantia 1 ano"],
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "lst-4",
    title: "Placa Solar Monocristalina 450W",
    description: "Painéis Solares de Alta Eficiência perfeitos para reduzir consumo de energia ou sistemas de backup na província. Kit completo com inversor e controlador sob consulta.",
    category: "Netek",
    price: 12500,
    location: "Chimoio, Manica",
    status: "Ativo",
    ownerEmail: "solar.moz@netek.co.mz",
    contactPhone: "+258 84 333 9999",
    subscriptionTier: "Mensal",
    paymentMethod: "M-Pesa",
    paymentId: "TX-MP-129B2",
    createdAt: "2026-05-12T11:20:00Z",
    views: 45,
    features: ["Energia Solar", "450W", "Monocristalina"],
    imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&auto=format&fit=crop&q=60",
    expiryDate: "2026-06-12"
  },
  {
    id: "lst-5",
    title: "Eletricista Técnico Credenciado EDM",
    description: "Instalações elétricas profissionais, reparação de curtos-circuitos, montagem de quadros elétricos trifásicos e monofásicos, instalação de ar condicionado. Desloco-me a qualquer zona de Maputo e Matola.",
    category: "FixMoz",
    price: 1500, // Preço base por visita
    location: "Matola, Maputo",
    status: "Ativo",
    ownerEmail: "samuel. EDM@outlook.com",
    contactPhone: "+258 84 999 8888",
    subscriptionTier: "Mensal",
    paymentMethod: "M-Pesa",
    paymentId: "TX-MP-543K2",
    createdAt: "2026-05-15T16:45:00Z",
    views: 156,
    features: ["Técnico Credenciado", "Disponibilidade 24h", "Ferramenta Própria"],
    imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=60",
    expiryDate: "2026-06-15"
  },
  {
    id: "lst-6",
    title: "Desenvolvedor Full-Stack Senior React/Node",
    description: "Desenvolvimento de portais web sob medida, integrações de APIs locais (M-Pesa, e-Mola), sistemas de facturação compatíveis com as regras da Autoridade Tributária. UX/UI polido e código escalável.",
    category: "FixMoz",
    price: 50000,
    location: "Sommerchield, Maputo",
    status: "Pendente",
    ownerEmail: "juniordeveloper@fixmoz.co.mz",
    contactPhone: "+258 84 777 6666",
    subscriptionTier: "Mensal",
    paymentMethod: "M-Pesa",
    createdAt: "2026-05-21T18:00:00Z",
    views: 12,
    features: ["React / Node", "Integração M-Pesa", "Desenvolvimento Ágil"],
    imageUrl: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=600&auto=format&fit=crop&q=60"
  }
];

let BLOG_POSTS = [
  {
    id: "post-1",
    title: "A Revolução Fintech e Sistemas C2B M-Pesa em Moçambique",
    summary: "Como a digitalização bancária e webhooks automatizados de wallets de telecomunicações como Vodacom M-Pesa e Tmcel e-Mola estão a transformar pequenos negócios locais.",
    content: `Os canais tradicionais de pagamento estão rapidamente a ser superados pela agilidade do Mobile Money em Moçambique. Serviços como o **M-Pesa** e o **e-Mola** já não são apenas carteiras de envio pessoal; tornaram-se o pilar central da infraestrutura financeira do e-commerce nacional.

### O Funcionamento Técnico do Webhook C2B do M-Pesa

Para um desenvolvedor em Moçambique, integrar estes canais significa trabalhar com webhooks seguros. Quando o cliente digita o código PIN no seu telemóvel motivado por um USSD push originado via API (` + "`C2B`" +`):
1. A operadora valida a liquidez.
2. É gerado um ID de transação único.
3. É feito um pedido POST REST HTTP do servidor da operadora para o endpoint configurado na nossa aplicação (Webhook).

Este portal demonstra exatamente este fluxo de maneira simulada de alta fidelidade: o anúncio com status 'Pendente' ativa instantaneamente assim que o webhook simula a resposta positiva, registando o log financeiro completo para auditoria administrativa. Isto evita fraudes e elimina a necessidade de envio manual de comprovativos.`,
    author: "Jonson JB",
    category: "Tecnologia",
    createdAt: "2026-05-18T12:00:00Z",
    readTime: "4 min",
    isDraft: false,
    imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1d704d3?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "post-2",
    title: "KayaMoz e FixMoz: Unificando o Ecossistema de Habitação",
    summary: "Unificar plataformas de arrendamento residencial a prestadores de serviços de reparações resolve a maior dor de cabeça dos inquilinos.",
    content: `Ao longo dos anos, verifiquei que arrendar uma casa em Maputo ou na Beira pela **KayaMoz** é apenas a metade do trabalho. A outra metade envolve manutenção: encontrar canalizadores de confiança, eletricistas qualificados ou pintores para renovar divisões.

Com a integração do ecossistema de serviços da **FixMoz** diretamente no portal de listagens residenciais:
- O morador pode solicitar reparações com um clique.
- Os profissionais locais ganham visibilidade qualificada e têm acesso a leads diretos.
- O sistema de pagamentos unificado M-Pesa/e-Mola opera nos bastidores garantindo subscrições estáveis aos profissionais.

A unificação do ecossistema garante escala técnica e comercial, maximizando custos de gestão de servidores sob uma única suite NodeJS e React.`,
    author: "Jonson JB",
    category: "Negócios",
    createdAt: "2026-05-20T14:00:00Z",
    readTime: "3 min",
    isDraft: false,
    imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=60"
  }
];

let PAYMENT_NOTIFICATIONS: any[] = [
  {
    id: "pay-1",
    listingId: "lst-1",
    listingTitle: "Apartamento T3 Elegante na Polana",
    amount: 1499,
    phone: "+258 84 111 2222",
    paymentMethod: "M-Pesa",
    status: "Sucesso",
    transactionCode: "MP260510.1000.E883A9",
    timestamp: "2026-05-10T10:00:00Z"
  },
  {
    id: "pay-2",
    listingId: "lst-2",
    listingTitle: "Vivenda T4 de Luxo no Sommerchield II",
    amount: 12999,
    phone: "+258 82 333 4444",
    paymentMethod: "e-Mola",
    status: "Sucesso",
    transactionCode: "EM260401.1430.G772D9",
    timestamp: "2026-04-01T14:30:00Z"
  },
  {
    id: "pay-3",
    listingId: "lst-5",
    listingTitle: "Eletricista Técnico Credenciado EDM",
    amount: 1499,
    phone: "+258 84 999 8888",
    paymentMethod: "M-Pesa",
    status: "Sucesso",
    transactionCode: "MP260515.1645.X543K2",
    timestamp: "2026-05-15T16:45:00Z"
  }
];

// Extrato de Alertas de Vencimento
let SUBSCRIBER_EXPIRATIONS = [
  {
    listingId: "lst-1",
    ownerEmail: "penieldinismucavele@gmail.com",
    title: "Apartamento T3 Elegante na Polana",
    daysRemaining: 19,
    amountDue: 1499,
    status: "Pendente"
  },
  {
    listingId: "lst-4",
    ownerEmail: "solar.moz@netek.co.mz",
    title: "Placa Solar Monocristalina 450W",
    daysRemaining: 21,
    amountDue: 1499,
    status: "Pendente"
  },
  {
    listingId: "lst-5",
    ownerEmail: "samuel.EDM@outlook.com",
    title: "Eletricista Técnico Credenciado EDM",
    daysRemaining: 24,
    amountDue: 1499,
    status: "Pendente"
  }
];

// -------------------------------------------------------------------------
// LAZY INITIALIZATION FOR @google/genai (SAFETY MEASURES FOR LACK OF API KEYS)
// -------------------------------------------------------------------------
let genAIClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  if (!genAIClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      genAIClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
    }
  }
  return genAIClient;
}

// -------------------------------------------------------------------------
// REST API ROUTES
// -------------------------------------------------------------------------

// Auth Login API
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha são obrigatórios." });
  }

  const user = MOCK_USERS.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (user) {
    return res.json({
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone
    });
  }

  return res.status(401).json({ error: "Credenciais inválidas. Verifique o email ou password." });
});

// GET Listings
app.get("/api/listings", (req, res) => {
  const { category, search, status } = req.query;
  let filtered = [...LISTINGS];

  if (category) {
    filtered = filtered.filter(l => l.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (status) {
    filtered = filtered.filter(l => l.status.toLowerCase() === (status as string).toLowerCase());
  }

  if (search) {
    const q = (search as string).toLowerCase();
    filtered = filtered.filter(
      l => l.title.toLowerCase().includes(q) || 
           l.description.toLowerCase().includes(q) || 
           l.location.toLowerCase().includes(q)
    );
  }

  // Ordenar por premium primeiro e depois mais recentes
  filtered.sort((a, b) => {
    if (a.subscriptionTier !== "Gratuito" && b.subscriptionTier === "Gratuito") return -1;
    if (a.subscriptionTier === "Gratuito" && b.subscriptionTier !== "Gratuito") return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  res.json(filtered);
});

// POST Listings
app.post("/api/listings", (req, res) => {
  const { title, description, category, price, location, ownerEmail, contactPhone, subscriptionTier, paymentMethod, features } = req.body;

  if (!title || !description || !category || !price || !location) {
    return res.status(400).json({ error: "Campos obrigatórios em falta." });
  }

  // Se for premium mas não houver pagamento e-mola/mpesa, o status inicial é Pendente
  const isPremium = subscriptionTier === "Mensal" || subscriptionTier === "Anual";
  const status = isPremium ? "Pendente" : "Ativo";

  const newListing = {
    id: `lst-${Date.now()}`,
    title,
    description,
    category,
    price: Number(price),
    location,
    status,
    ownerEmail: ownerEmail || "visitante@mozconnect.co.mz",
    contactPhone: contactPhone || "+258 84 000 0000",
    subscriptionTier: subscriptionTier || "Gratuito",
    paymentMethod: paymentMethod || "Nenhum",
    createdAt: new Date().toISOString(),
    views: 0,
    features: Array.isArray(features) ? features : [],
    imageUrl: category === "KayaMoz" 
      ? "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&auto=format&fit=crop&q=60"
      : category === "FixMoz"
      ? "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=60"
      : "https://images.unsplash.com/photo-1523474253046-2cd2748b5fd2?w=600&auto=format&fit=crop&q=60"
  };

  LISTINGS.unshift(newListing);

  // Se necessitar de pagamento premium, adicionar alerta de vencimento pendente correspondente
  if (isPremium && status === "Pendente") {
    SUBSCRIBER_EXPIRATIONS.push({
      listingId: newListing.id,
      ownerEmail: newListing.ownerEmail,
      title: newListing.title,
      daysRemaining: 1, // Expirará rapidamente se não for pago
      amountDue: subscriptionTier === "Mensal" ? 1499 : 12999,
      status: "Pendente"
    });
  }

  res.status(211).json(newListing);
});

// DELETE Listing (Admin option)
app.delete("/api/listings/:id", (req, res) => {
  const { id } = req.params;
  const initialLength = LISTINGS.length;
  LISTINGS = LISTINGS.filter(l => l.id !== id);
  SUBSCRIBER_EXPIRATIONS = SUBSCRIBER_EXPIRATIONS.filter(e => e.listingId !== id);

  if (LISTINGS.length < initialLength) {
    res.json({ success: true, message: "Anúncio eliminado com sucesso." });
  } else {
    res.status(404).json({ error: "Anúncio não encontrado." });
  }
});

// -------------------------------------------------------------------------
// M-PESA & E-MOLA C2B WEBHOOK SIMULATION + TRANSACTION MANAGEMENT
// -------------------------------------------------------------------------

app.post("/api/payments/simulate", (req, res) => {
  const { listingId, phone, amount, paymentMethod } = req.body;

  if (!listingId || !phone || !amount || !paymentMethod) {
    return res.status(400).json({ error: "Parâmetros de pagamento em falta (listingId, phone, amount, paymentMethod)." });
  }

  const listing = LISTINGS.find(l => l.id === listingId);
  if (!listing) {
    return res.status(404).json({ error: "Anúncio correspondente ao pagamento não foi encontrado." });
  }

  // Gerar ID de Transação Mozambicana de Alta Fidelidade
  const now = new Date();
  const dateStr = now.toISOString().slice(2, 10).replace(/-/g, "");
  const randCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  const txPrefix = paymentMethod === "M-Pesa" ? "MP" : "EM";
  const transactionCode = `${txPrefix}${dateStr}.${now.getHours()}${now.getMinutes()}.${randCode}`;

  // Actualizar Anúncio para ATIVO
  listing.status = "Ativo";
  listing.paymentMethod = paymentMethod;
  listing.paymentId = transactionCode;
  
  // Definir data de expiração (30 dias para Mensal, 365 para Anual)
  const daysBonus = listing.subscriptionTier === "Anual" ? 365 : 30;
  const expDate = new Date();
  expDate.setDate(expDate.getDate() + daysBonus);
  listing.expiryDate = expDate.toISOString().split("T")[0];

  // Adicionar notificação ao ledger geral de auditoria administrativa
  const notification = {
    id: `pay-${Date.now()}`,
    listingId,
    listingTitle: listing.title,
    amount: Number(amount),
    phone,
    paymentMethod,
    status: "Sucesso",
    transactionCode,
    timestamp: now.toISOString()
  };

  PAYMENT_NOTIFICATIONS.unshift(notification);

  // Actualizar lista de alertas de expiração do admin
  const expiryItem = SUBSCRIBER_EXPIRATIONS.find(e => e.listingId === listingId);
  if (expiryItem) {
    expiryItem.daysRemaining = daysBonus;
    expiryItem.status = "Pendente"; // Volta ao status normal de pendência com contagem reiniciada
  }

  res.json({
    success: true,
    message: `Notificação de pagamento processada via Webhook ${paymentMethod} com sucesso!`,
    transactionCode,
    listingStatus: "Ativo",
    listing
  });
});

// Endpoint de Envio de Notificação Automática de Vencimento de Boletos
app.post("/api/payments/send-notification", (req, res) => {
  const { listingId } = req.body;
  if (!listingId) {
    return res.status(400).json({ error: "ID do anúncio em falta" });
  }

  const expiryItem = SUBSCRIBER_EXPIRATIONS.find(e => e.listingId === listingId);
  if (expiryItem) {
    expiryItem.status = "Aviso Enviado";
    return res.json({
      success: true,
      message: `Notificação automatizada de vencimento enviada com sucesso para o utilizador ${expiryItem.ownerEmail}!`,
      item: expiryItem
    });
  }

  res.status(404).json({ error: "Estatuto de vencimento não localizado para este anúncio." });
});

// -------------------------------------------------------------------------
// BLOG POSTS API
// -------------------------------------------------------------------------

app.get("/api/blog", (req, res) => {
  const { isDraft } = req.query;
  let posts = [...BLOG_POSTS];
  if (isDraft === "false") {
    posts = posts.filter(p => !p.isDraft);
  }
  res.json(posts);
});

app.post("/api/blog", (req, res) => {
  const { title, summary, content, author, category, isDraft } = req.body;

  if (!title || !content || !summary) {
    return res.status(400).json({ error: "Título, resumo e conteúdo são obrigatórios." });
  }

  const newPost = {
    id: `post-${Date.now()}`,
    title,
    summary,
    content,
    author: author || "Jonson JB",
    category: category || "Geral",
    createdAt: new Date().toISOString(),
    readTime: `${Math.max(1, Math.round(content.split(" ").length / 200))} min`,
    isDraft: isDraft === true,
    imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&auto=format&fit=crop&q=60"
  };

  BLOG_POSTS.unshift(newPost);
  res.status(211).json(newPost);
});

app.delete("/api/blog/:id", (req, res) => {
  const { id } = req.params;
  const initialLength = BLOG_POSTS.length;
  BLOG_POSTS = BLOG_POSTS.filter(p => p.id !== id);

  if (BLOG_POSTS.length < initialLength) {
    res.json({ success: true, message: "Artigo do blog removido com sucesso." });
  } else {
    res.status(404).json({ error: "Artigo não encontrado." });
  }
});

// -------------------------------------------------------------------------
// COMPREHENSIVE ADMINISTRATIVE CONTROL API
// -------------------------------------------------------------------------

// Edit any listing Details (Update price, location, title, status)
app.put("/api/listings/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, category, price, location, status, subscriptionTier, contactPhone } = req.body;
  const listing = LISTINGS.find(l => l.id === id);

  if (!listing) {
    return res.status(404).json({ error: "Anúncio não encontrado." });
  }

  if (title !== undefined) listing.title = title;
  if (description !== undefined) listing.description = description;
  if (category !== undefined) listing.category = category;
  if (price !== undefined) listing.price = Number(price);
  if (location !== undefined) listing.location = location;
  if (status !== undefined) listing.status = status;
  if (subscriptionTier !== undefined) listing.subscriptionTier = subscriptionTier;
  if (contactPhone !== undefined) listing.contactPhone = contactPhone;

  res.json({ success: true, listing });
});

// Edit any blog post
app.put("/api/blog/:id", (req, res) => {
  const { id } = req.params;
  const { title, summary, content, category, isDraft } = req.body;
  const post = BLOG_POSTS.find(p => p.id === id);

  if (!post) {
    return res.status(404).json({ error: "Artigo não encontrado." });
  }

  if (title !== undefined) post.title = title;
  if (summary !== undefined) post.summary = summary;
  if (content !== undefined) post.content = content;
  if (category !== undefined) post.category = category;
  if (isDraft !== undefined) post.isDraft = isDraft === true;

  res.json({ success: true, post });
});

// Users Management APIs
app.get("/api/admin/users", (req, res) => {
  res.json(MOCK_USERS);
});

app.post("/api/admin/users", (req, res) => {
  const { email, name, role, phone, password } = req.body;
  if (!email || !name || !role || !password) {
    return res.status(400).json({ error: "Campos obrigatórios em falta (email, name, role, password)." });
  }

  const exists = MOCK_USERS.some(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(400).json({ error: "Já existe um utilizador registado com este email." });
  }

  const newUser = {
    email: email.toLowerCase(),
    password,
    name,
    role,
    phone: phone || ""
  };
  MOCK_USERS.push(newUser);
  res.json({ success: true, user: newUser });
});

app.put("/api/admin/users/:email", (req, res) => {
  const { email } = req.params;
  const { name, role, phone, password } = req.body;
  const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(404).json({ error: "Utilizador não encontrado." });
  }

  if (name !== undefined) user.name = name;
  if (role !== undefined) user.role = role;
  if (phone !== undefined) user.phone = phone;
  if (password !== undefined) user.password = password;

  res.json({ success: true, user });
});

app.delete("/api/admin/users/:email", (req, res) => {
  const { email } = req.params;
  const initialLength = MOCK_USERS.length;
  MOCK_USERS = MOCK_USERS.filter(u => u.email.toLowerCase() !== email.toLowerCase());

  if (MOCK_USERS.length < initialLength) {
    res.json({ success: true, message: "Utilizador removido com sucesso." });
  } else {
    res.status(404).json({ error: "Utilizador não encontrado." });
  }
});

// House plans APIs
app.get("/api/house-plans", (req, res) => {
  res.json(HOUSE_PLANS);
});

app.post("/api/house-plans", (req, res) => {
  const { title, bedrooms, bathrooms, squareMeters, floors, estimatedCostMT, style, description, features, imageUrl } = req.body;
  if (!title || !bedrooms || !bathrooms || !squareMeters || !estimatedCostMT) {
    return res.status(400).json({ error: "Campos obrigatórios em falta." });
  }
  const newPlan = {
    id: `plan-${Date.now()}`,
    title,
    bedrooms: Number(bedrooms),
    bathrooms: Number(bathrooms),
    squareMeters: Number(squareMeters),
    floors: Number(floors || 1),
    estimatedCostMT: Number(estimatedCostMT),
    style: style || "Moderno",
    description: description || "",
    features: Array.isArray(features) ? features : ["Design de Alta Relevância"],
    imageUrl: imageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=60",
    bluePrintGrid: [
      ["[ Varanda ]", "[ Sala de Estar ]", "[ Cozinha ]"],
      ["[ Quarto 1 ]", "[ Banheiro ]", "[ Quarto 2 ]"]
    ]
  };
  HOUSE_PLANS.push(newPlan);
  res.json({ success: true, plan: newPlan });
});

app.put("/api/house-plans/:id", (req, res) => {
  const { id } = req.params;
  const { title, bedrooms, bathrooms, squareMeters, floors, estimatedCostMT, style, description, features, imageUrl } = req.body;
  const plan = HOUSE_PLANS.find(p => p.id === id);

  if (!plan) {
    return res.status(404).json({ error: "Planta não encontrada." });
  }

  if (title !== undefined) plan.title = title;
  if (bedrooms !== undefined) plan.bedrooms = Number(bedrooms);
  if (bathrooms !== undefined) plan.bathrooms = Number(bathrooms);
  if (squareMeters !== undefined) plan.squareMeters = Number(squareMeters);
  if (floors !== undefined) plan.floors = Number(floors);
  if (estimatedCostMT !== undefined) plan.estimatedCostMT = Number(estimatedCostMT);
  if (style !== undefined) plan.style = style;
  if (description !== undefined) plan.description = description;
  if (features !== undefined) plan.features = features;
  if (imageUrl !== undefined) plan.imageUrl = imageUrl;

  res.json({ success: true, plan });
});

app.delete("/api/house-plans/:id", (req, res) => {
  const { id } = req.params;
  const initialLength = HOUSE_PLANS.length;
  HOUSE_PLANS = HOUSE_PLANS.filter(p => p.id !== id);

  if (HOUSE_PLANS.length < initialLength) {
    res.json({ success: true, message: "Planta eliminada com sucesso." });
  } else {
    res.status(404).json({ error: "Planta não encontrada." });
  }
});

// Tutorials APIs
app.get("/api/tutorials", (req, res) => {
  res.json(TUTORIALS);
});

app.post("/api/tutorials", (req, res) => {
  const { title, summary, category, originalUrl, steps } = req.body;
  if (!title || !summary || !category) {
    return res.status(400).json({ error: "Título, resumo e categoria de tutorial são obrigatórios." });
  }
  const newTutorial = {
    id: `tut-${Date.now()}`,
    title,
    summary,
    category: category || "Mobile Money",
    publishedDate: new Date().toISOString().split("T")[0],
    readTime: `${Math.max(1, Math.round(summary.split(" ").length / 20))} min`,
    originalUrl: originalUrl || "http://jonsonjb.blogspot.com",
    steps: Array.isArray(steps) && steps.length > 0 ? steps : [
      { title: "Passo 1: Introdução", content: "Ler o artigo no blog oficial de Jonson JB." }
    ]
  };
  TUTORIALS.push(newTutorial);
  res.json({ success: true, tutorial: newTutorial });
});

app.put("/api/tutorials/:id", (req, res) => {
  const { id } = req.params;
  const { title, summary, category, originalUrl, steps } = req.body;
  const tutorial = TUTORIALS.find(t => t.id === id);

  if (!tutorial) {
    return res.status(404).json({ error: "Tutorial não encontrado." });
  }

  if (title !== undefined) tutorial.title = title;
  if (summary !== undefined) tutorial.summary = summary;
  if (category !== undefined) tutorial.category = category;
  if (originalUrl !== undefined) tutorial.originalUrl = originalUrl;
  if (steps !== undefined) tutorial.steps = steps;

  res.json({ success: true, tutorial });
});

app.delete("/api/tutorials/:id", (req, res) => {
  const { id } = req.params;
  const initialLength = TUTORIALS.length;
  TUTORIALS = TUTORIALS.filter(t => t.id !== id);

  if (TUTORIALS.length < initialLength) {
    res.json({ success: true, message: "Tutorial eliminado com sucesso." });
  } else {
    res.status(404).json({ error: "Tutorial não encontrado." });
  }
});

// Document Pre-Bookings APIs
app.get("/api/document-requests", (req, res) => {
  res.json(DOCUMENT_REQUESTS);
});

app.post("/api/document-requests", (req, res) => {
  const { documentType, fullName, contactPhone, whatsappNumber, preferredProvince, preferredDate, feesChargedMT, paymentMethod, userEmail, notes } = req.body;
  
  if (!documentType || !fullName || !contactPhone || !preferredDate) {
    return res.status(400).json({ error: "Documento, Nome, Telefone e Data preferida são obrigatórios." });
  }

  const newRequest = {
    id: `req-${Date.now()}`,
    documentType,
    fullName,
    contactPhone,
    whatsappNumber: whatsappNumber || "",
    preferredProvince,
    preferredDate,
    status: "Pendente",
    feesChargedMT: Number(feesChargedMT) || 150,
    paymentStatus: "Pendente",
    paymentMethod: paymentMethod || "M-Pesa",
    createdAt: new Date().toISOString(),
    userEmail: userEmail || "",
    notes: notes || ""
  };

  DOCUMENT_REQUESTS.push(newRequest);
  res.json({ success: true, request: newRequest });
});

app.put("/api/document-requests/:id", (req, res) => {
  const { id } = req.params;
  const { status, paymentStatus, paymentMethod, notes, fullName, contactPhone, whatsappNumber, preferredProvince, preferredDate, documentType } = req.body;
  const docReq = DOCUMENT_REQUESTS.find(r => r.id === id);

  if (!docReq) {
    return res.status(404).json({ error: "Solicitação não encontrada." });
  }

  if (status !== undefined) docReq.status = status;
  if (paymentStatus !== undefined) docReq.paymentStatus = paymentStatus;
  if (paymentMethod !== undefined) docReq.paymentMethod = paymentMethod;
  if (notes !== undefined) docReq.notes = notes;
  if (fullName !== undefined) docReq.fullName = fullName;
  if (contactPhone !== undefined) docReq.contactPhone = contactPhone;
  if (whatsappNumber !== undefined) docReq.whatsappNumber = whatsappNumber;
  if (preferredProvince !== undefined) docReq.preferredProvince = preferredProvince;
  if (preferredDate !== undefined) docReq.preferredDate = preferredDate;
  if (documentType !== undefined) docReq.documentType = documentType;

  res.json({ success: true, request: docReq });
});

app.delete("/api/document-requests/:id", (req, res) => {
  const { id } = req.params;
  const initialLength = DOCUMENT_REQUESTS.length;
  DOCUMENT_REQUESTS = DOCUMENT_REQUESTS.filter(r => r.id !== id);

  if (DOCUMENT_REQUESTS.length < initialLength) {
    res.json({ success: true, message: "Solicitação de agendamento eliminada com sucesso." });
  } else {
    res.status(404).json({ error: "Solicitação não encontrada." });
  }
});

// -------------------------------------------------------------------------
// ADMINISTRATIVE METRICS & METICAL (MT) REVENUE DASHBOARD
// -------------------------------------------------------------------------

app.get("/api/metrics", (req, res) => {
  // Somar receita total dos pagamentos confirmados + taxas de pré-marcação concluídas/pagas
  const paidDocFees = DOCUMENT_REQUESTS.reduce((sum, reqData) => reqData.paymentStatus === "Pago" ? sum + reqData.feesChargedMT : sum, 0);
  const totalRevenueMT = PAYMENT_NOTIFICATIONS.reduce((sum, pay) => pay.status === "Sucesso" ? sum + pay.amount : sum, 0) + paidDocFees;
  
  // Contar assinantes Premium ativos
  const activeSubscribers = LISTINGS.filter(l => l.status === "Ativo" && l.subscriptionTier !== "Gratuito").length;

  // Distribuição por plataforma
  const platformDistribution = {
    Netek: LISTINGS.filter(l => l.category === "Netek").length,
    KayaMoz: LISTINGS.filter(l => l.category === "KayaMoz").length,
    FixMoz: LISTINGS.filter(l => l.category === "FixMoz").length
  };

  // Curva de Receita Mensal Dinâmica
  const monthlyRevenueCurve = [
    { month: "Jan", amount: 15400 },
    { month: "Fev", amount: 19800 },
    { month: "Mar", amount: 24700 },
    { month: "Abr", amount: 32900 },
    { month: "Mai", amount: totalRevenueMT } // Receita ajustada com o live actual em Meticais
  ];

  res.json({
    totalRevenueMT,
    activeSubscribers,
    platformDistribution,
    monthlyRevenueCurve,
    transactions: PAYMENT_NOTIFICATIONS,
    subscriberExpirations: SUBSCRIBER_EXPIRATIONS
  });
});

// -------------------------------------------------------------------------
// SERVER-SIDE AI DESCRIPTIONS GENERATOR (GEMINI 3.5 FLASH) IN CO-PILOT
// -------------------------------------------------------------------------

app.post("/api/ai/suggest", async (req, res) => {
  const { type, promptInput } = req.body;

  if (!promptInput) {
    return res.status(400).json({ error: "O prompt de sugestão é necessário." });
  }

  const ai = getGenAI();

  // Prompt contextual para o mercado moçambicano
  let systemContext = "Atue como um Especialista de Conteúdos e Engenheiro de Copywriting Sénior de Moçambique. Crie textos extremamente atrativos para plataformas online, mencionando bairros famosos de Maputo, Sofala ou Nampula como Polana, Sommerchield, Triunfo, Central, Ferroviário, Ponta do Ouro, Beira, etc. Use a moeda Meticais (MT) nos anúncios de habitação ou tecnologia, e enfatize facilidade de pagamento por M-Pesa ou e-Mola. Traga um tom profissional, limpo e direto.";

  if (type === "blog") {
    systemContext = "Tu é o Jonson JB, criador da Netek, KayaMoz e FixMoz. Escreves posts estimulantes para o teu blog digital reflexivo pessoal, analisando a transformação das wallets em Moçambique, empreendorismo e startups em Maputo. Estilo directo, inteligente e inspirador.";
  }

  if (ai) {
    try {
      const gResponse = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptInput,
        config: {
          systemInstruction: systemContext,
          temperature: 0.7
        }
      });

      return res.json({ result: gResponse.text });
    } catch (err: any) {
      console.error("Erro ao chamar o Gemini API:", err);
      // Retornar fallback simulado de alto padrão caso ocorram limites de cota ou rede
      return res.json({
        result: simulateFallbackResponse(type, promptInput)
      });
    }
  } else {
    // Retornar fallback elegante imediatamente se a API key não estiver totalmente configurada
    return res.json({
      result: simulateFallbackResponse(type, promptInput)
    });
  }
});

// Emissor de respostas inteligentes simuladas de alta qualidade (Português de Moçambique)
function simulateFallbackResponse(type: string, input: string): string {
  const q = input.toLowerCase();
  
  if (type === "blog") {
    return `### [Rascunho Inteligente de Jonson JB]
**Título Sugerido:** Empreendedorismo de Plataformas: O Novo Horizonte de Maputo

O ecossistema de startups moçambicano vive o seu momento mais maduro. Quando imaginei a conexidade entre a **Netek** (classificados de tecnologia), a **KayaMoz** (arrendamento imobiliário digital) e os prestadores independentes da **FixMoz**, percebi que o elo que nos unia sempre foi a facilidade de pagamento com moeda móvel.

Neste artigo, reflito sobre como a centralização dos fluxos operacionais de M-Pesa e e-Mola sob uma suite NodeJS/React flexibiliza o percurso do cliente e gera valor escalonável em Meticais (MT).

*Publicar este rascunho no seu blog permitirá alavancar as métricas da comunidade através de conteúdos de elevadíssima relevância técnica e social!*`;
  }

  if (q.includes("apartamento") || q.includes("casa") || q.includes("quarto") || q.includes("polana") || q.includes("t3")) {
    return `### [KayaMoz Copilot] Anúncio Premium Sugerido:
**Excelente Apartamento T3 de Luxo na Polana Cimento**

* **Localização:** Avenida Armando Tivane, Polana, Maputo
* **Preço:** 125.000 MT / mensal (Negociável)
* **Condições de Pagamento:** Aceitam-se pagamentos diretos e renovações mensais automáticas via **M-Pesa** ou **e-Mola**.

**Descrição Detalhada:**
Desfrute de habitar no coração da Polana cimento neste deslumbrante T3 moderno. Dispõe de 3 quartos (1 suite principal), roupeiros embutidos de madeira nobre, cozinha planejada em formato open-space importada do exterior, sala de estar ampla com varanda magnífica e vistas parciais do mar azul da baía. Prédio seguro com guarita dedicada, gerador automático de suporte e lugar reservado para viatura. Próximo a cafés requintados e embaixadas.`;
  }

  if (q.includes("canalizador") || q.includes("eletricista") || q.includes("pintor") || q.includes("designer") || q.includes("serviço")) {
    return `### [FixMoz Copilot] Pitch de Prestador Sugerido:
**Serviços Profissionais de Instalação e Pintura Expressa Maputo**

* **Preço Base do Serviço:** 2.500 MT (Orçamentos customizados sem compromisso).
* **Meios de Cobrança Rápidos:** Simplicidade de pagamento por **M-Pesa** de forma instantânea na hora da conclusão.

**Sobre o Profissional:**
Disponho de mais de 8 anos acumulados de experiência em remodelações civis, revestimentos modernos, reparações hidráulicas profundas que evitam infiltrações e pintura esmalte/acrílica premium para vivendas e escritórios comerciais na Matola e Maputo. Ofereço garantia estendida de 6 meses em todos os serviços executados. Compromisso com pontualidade moçambicana rígida e arrumação pós-obra!`;
  }

  return `### [MozConnect Copilot - Esboço Geral]
**Proposta de Anúncio Publicitário Inteligente**

* **Preço Estimado:** 15.000 MT (Meticais)
* **Vantagens de Plataforma:** Visibilidade prioritária bento-grid nas buscas integradas de Moçambique.

**Sugestão de Descrição:**
Anúncio premium otimizado para o algoritmo unificado. Pronto para captar clientes interessados de Maputo à Beira com dados estruturados completos e suporte a reservas instantâneas via mobile money M-Pesa ou e-Mola.`;
}

// -------------------------------------------------------------------------
// VITE OR STATIC FILE SERVING MIDDLEWARE (VITE-DRIVEN IN DEV, STATIC IN PROD)
// -------------------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[MozConnect] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
