/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  MessageSquare,
  HelpCircle,
  FileText,
  Clock,
  Send,
  Flag,
  Globe2,
  Share2
} from 'lucide-react';

interface SupportContact {
  name: string;
  role: string;
  phone: string;
  waLink: string;
  activeTime: string;
  avatarInitials: string;
}

const SUPPORT_CONTACTS: SupportContact[] = [
  {
    name: 'Jonson JB (Comercial / CEO)',
    role: 'Gestão de Plataformas & Soluções Customizadas',
    phone: '+258 84 123 4567',
    waLink: 'https://wa.me/258841234567?text=Olá%20Jonson%20JB!%20Gostaria%20de%20solicitar%20uma%20parceria%20ou%20solução%20corporativa.',
    activeTime: '08:00h - 18:00h CAT',
    avatarInitials: 'JB'
  },
  {
    name: 'Suporte Técnico MozTech',
    role: 'Apoio de Integrações, Webhooks e Erros',
    phone: '+258 82 987 6543',
    waLink: 'https://wa.me/258829876543?text=Olá%20Suporte!%20Estou%20com%20dúvidas%20técnicas%20no%20meu%20anúncio%20ou%20página.',
    activeTime: '24h Disponível',
    avatarInitials: 'ST'
  },
  {
    name: 'Finanças & Boletos',
    role: 'Notificações de Faturação, M-Pesa e e-Mola',
    phone: '+258 85 555 6666',
    waLink: 'https://wa.me/258855556666?text=Olá!%20Preciso%20de%20ajuda%20com%20o%20meu%20pagamento%20e-Mola%20ou%20M-Pesa.',
    activeTime: '08:00h - 17:00h CAT',
    avatarInitials: 'FB'
  }
];

const GENERAL_FAQS = [
  {
    q: 'Como funciona a ativação automática via M-pesa ou e-Mola?',
    a: 'Após preencher o seu anúncio premium na Netek, KayaMoz ou FixMoz, o sistema abre uma consola de transação segura. Digite o seu telemóvel e inicie o pagamento. Receberá um push USSD para inserir o seu PIN. O nosso Webhook escuta as confirmações e ativa o seu anúncio em menos de 10 segundos.'
  },
  {
    q: 'O que acontece quando o meu anúncio ou serviço expira?',
    a: 'A nossa consola envia um boleto eletrónico de notificação de cobrança por email. O anunciante tem 3 dias de bónus para efetuar a liquidação antes de o anúncio ser suspenso temporariamente.'
  },
  {
    q: 'Como encontro técnicos de reparação qualificados?',
    a: 'Basta aceder ao menu FIXMOZ. Classificamos os prestadores por províncias/cidades e mostramos o selo &ldquo;Técnico Credenciado&rdquo; naqueles que passaram na verificação de certificados operacionais.'
  },
  {
    q: 'Como o meu site http://jonsonjb.blogspot.com está conectado?',
    a: 'O portal de classificados e o blog de startups são parte do ecossistema unificado. O Jonson JB publica as suas reflexões no blog e todos os tutoriais técnicos de APIs podem ser testados/copiados aqui mesmo em tempo real.'
  }
];

const HUB_LOCATIONS = [
  {
    city: 'Maputo',
    address: 'Av. Julius Nyerere, Bloco Sommerchield II',
    coords: '-25.9521, 32.6074',
    role: 'Sede Principal e Incubação Tecnológica'
  },
  {
    city: 'Beira',
    address: 'Av. Eduardo Mondlane, Prédio Estoril',
    coords: '-19.8316, 34.8369',
    role: 'Suporte Centro e Telecomunicações'
  },
  {
    city: 'Nampula',
    address: 'Rua de Moçambique, Edifício Palmeiras',
    coords: '-15.1167, 39.2667',
    role: 'Hub de Distribuição e Tecnologias Solares'
  }
];

interface ContactLocationProps {
  onNotify: (text: string, type: 'success' | 'info' | 'error') => void;
}

export default function ContactLocation({ onNotify }: ContactLocationProps) {
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const [selectedHub, setSelectedHub] = useState<string>('Maputo');
  
  const handleShareSystem = () => {
    if (navigator.share) {
      navigator.share({
        title: 'MOZ TECH HUB',
        text: 'Confira as melhores plataformas integradas de Moçambique!',
        url: window.location.href,
      }).then(() => {
        onNotify('Plataforma partilhada com sucesso!', 'success');
      }).catch(() => {
        onNotify('Copiado link de partilha!', 'info');
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      onNotify('URL de partilha do Moz Tech Hub copiada!', 'success');
    }
  };

  const activeHubInfo = HUB_LOCATIONS.find(h => h.city === selectedHub) || HUB_LOCATIONS[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* LEFT COLUMN: INTERACTIVE NATIONAL MAP & HUB PINPOINTS */}
      <div className="lg:col-span-2 space-y-6">
        
        <div className="border border-zinc-800 bg-zinc-950 p-6 rounded-xs relative overflow-hidden">
          
          <div className="flex justify-between items-start border-b border-zinc-900 pb-3 mb-5">
            <div>
              <span className="font-mono text-[8px] text-zinc-550 uppercase tracking-widest font-bold">Distribuição Territorial</span>
              <h3 className="font-display font-black text-lg text-white uppercase tracking-tight mt-0.5">
                INTERATIVIDADE DE COBERTURA NACIONAL
              </h3>
            </div>
            
            <div className="flex gap-1">
              {HUB_LOCATIONS.map(h => (
                <button
                  key={h.city}
                  onClick={() => setSelectedHub(h.city)}
                  className={`px-2.5 py-1 font-mono text-[9px] font-bold uppercase rounded-xs transition-all ${
                    selectedHub === h.city 
                      ? 'bg-gold-500 text-black font-extrabold' 
                      : 'bg-zinc-900 text-zinc-400 hover:text-white'
                  }`}
                >
                  {h.city}
                </button>
              ))}
            </div>
          </div>

          <p className="text-zinc-400 text-xs leading-relaxed font-sans mb-6">
            O ecossistema unificado do **Moz Tech Hub** cobre todas as províncias de Moçambique. Escolha e clique nas estações na coluna acima ou passe o rato no mapa esquemático para ver a conectividade de suporte.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            
            {/* INTERACTIVE SCHEMATIC SVG MAP OF MOZAMBIQUE */}
            <div className="relative p-2 bg-black border border-zinc-900 rounded-xs flex items-center justify-center h-64 group">
              
              <svg 
                viewBox="0 0 200 320" 
                className="w-full h-full max-h-[220px] transition-transform duration-300 group-hover:scale-102"
              >
                {/* Simplified vector polygon shapes representing Cabo Delgado/Niassa (North) */}
                <path 
                  d="M 120,40 L 170,50 L 160,110 L 110,100 Z" 
                  fill={hoveredProvince === 'Norte' ? 'rgba(212, 175, 55, 0.35)' : 'rgba(255, 255, 255, 0.05)'} 
                  stroke={hoveredProvince === 'Norte' ? '#D4AF37' : '#27272A'}
                  strokeWidth="1.5"
                  className="transition-all cursor-pointer"
                  onMouseEnter={() => setHoveredProvince('Norte')}
                  onClick={() => {
                    setSelectedHub('Nampula');
                    onNotify('Nampula selecionado! Sede de distribuição Norte.', 'info');
                  }}
                />

                {/* Simplified shape representing Tete/Zambézia/Sofala/Manica (Center) */}
                <path 
                  d="M 70,100 L 150,110 L 120,180 L 60,160 Z" 
                  fill={hoveredProvince === 'Centro' ? 'rgba(212, 175, 55, 0.35)' : 'rgba(255, 255, 255, 0.05)'} 
                  stroke={hoveredProvince === 'Centro' ? '#D4AF37' : '#27272A'}
                  strokeWidth="1.5"
                  className="transition-all cursor-pointer"
                  onMouseEnter={() => setHoveredProvince('Centro')}
                  onClick={() => {
                    setSelectedHub('Beira');
                    onNotify('Beira selecionado! Sede regional Centro.', 'info');
                  }}
                />

                {/* Simplified shape representing Inhambane/Gaza/Maputo (South) */}
                <path 
                  d="M 50,170 L 110,190 L 80,280 L 40,260 Z" 
                  fill={hoveredProvince === 'Sul' ? 'rgba(212, 175, 55, 0.35)' : 'rgba(255, 255, 255, 0.05)'} 
                  stroke={hoveredProvince === 'Sul' ? '#D4AF37' : '#27272A'}
                  strokeWidth="1.5"
                  className="transition-all cursor-pointer"
                  onMouseEnter={() => setHoveredProvince('Sul')}
                  onClick={() => {
                    setSelectedHub('Maputo');
                    onNotify('Maputo selecionado! Direção Geral e Coordenação Sul.', 'info');
                  }}
                />

                {/* Target pointers / dots for active hubs */}
                <circle cx="130" cy="80" r="4" fill="#E11D48" className="animate-ping" />
                <circle cx="130" cy="80" r="3" fill="#D4AF37" /> {/* Nampula */}

                <circle cx="95" cy="140" r="4" fill="#E11D48" className="animate-ping" />
                <circle cx="95" cy="140" r="3" fill="#D4AF37" /> {/* Beira */}

                <circle cx="65" cy="240" r="4" fill="#E11D48" className="animate-ping" />
                <circle cx="65" cy="240" r="3" fill="#D4AF37" /> {/* Maputo */}

                {/* Map labels */}
                <text x="135" y="75" fill="#A1A1AA" fontSize="7" fontFamily="monospace" fontWeight="bold">NAMPULA</text>
                <text x="100" y="135" fill="#A1A1AA" fontSize="7" fontFamily="monospace" fontWeight="bold">BEIRA</text>
                <text x="70" y="235" fill="#A1A1AA" fontSize="7" fontFamily="monospace" fontWeight="bold">MAPUTO</text>
              </svg>

              <div 
                className="absolute bottom-3 left-3 bg-zinc-950 px-2 py-1 border border-zinc-900 rounded-sm font-mono text-[9px] uppercase tracking-wider text-zinc-400 select-none pointer-events-none"
                onMouseLeave={() => setHoveredProvince(null)}
              >
                ZONA FOCO: <strong className="text-white">{hoveredProvince || 'PASSE O RATO'}</strong>
              </div>
            </div>

            {/* SELECTED STATION DATA CONTAINER */}
            <div className="space-y-4 font-mono text-xs p-4 bg-zinc-900/40 border border-zinc-900 rounded-xs">
              <div>
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block font-bold">SEDE SELECIONADA</span>
                <span className="font-display font-black text-xl text-white uppercase">{activeHubInfo.city}</span>
              </div>
              
              <div className="space-y-2 border-t border-zinc-900 pt-3 text-[11px]">
                <p className="flex items-start gap-2 text-zinc-300">
                  <MapPin className="h-4 w-4 text-gold-500 shrink-0 mt-0.5" />
                  <span>{activeHubInfo.address}</span>
                </p>
                <p className="flex items-center gap-2 text-zinc-400">
                  <Globe2 className="h-4 w-4 text-zinc-550 shrink-0" />
                  <span>Cordenadas: <strong className="text-white font-mono">{activeHubInfo.coords}</strong></span>
                </p>
                <p className="text-[10px] text-zinc-500 uppercase leading-relaxed pt-2 border-t border-zinc-900/50">
                  {activeHubInfo.role}
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* FREQUENTLY ASKED QUESTIONS SECTION */}
        <div className="border border-zinc-800 bg-zinc-950 p-6 rounded-xs relative">
          <div className="flex items-center space-x-2.5 mb-5 border-b border-zinc-900 pb-3">
            <HelpCircle className="h-4.5 w-4.5 text-gold-500" />
            <h3 className="font-display font-bold text-xs uppercase tracking-widest text-[#FFFFFF]">
              TUDO MAIS QUE AS PESSOAS PROCURAM (PERGUNTAS FREQUENTES & RESPOSTAS)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GENERAL_FAQS.map((faq, i) => (
              <div key={i} className="p-4 bg-zinc-900/50 border border-zinc-900 rounded-xs space-y-1.5 selection:bg-gold-500 selection:text-black">
                <h4 className="font-mono text-[11px] font-black uppercase text-gold-500 tracking-wide flex items-start gap-1">
                  <span>Q{i+1}:</span> <span>{faq.q}</span>
                </h4>
                <p className="text-zinc-400 text-xs font-sans leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* RIGHT SIDEBAR: DIRECT OFFICE WHATSAP CHATS & HELP CONTROLLER */}
      <div className="space-y-6">
        
        {/* Support contacts directory */}
        <div className="border border-zinc-800 bg-zinc-950 p-6 rounded-xs relative">
          
          <h3 className="font-display font-black text-sm uppercase tracking-widest text-gold-500 mb-2 border-b border-zinc-900 pb-2">
            CANAIS DIRETOS DE WHATSAPP
          </h3>

          <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-6">
            Ligue-se interativamente com a nossa equipa operacional
          </p>

          <div className="space-y-4">
            {SUPPORT_CONTACTS.map((sc, i) => (
              <div 
                key={i} 
                className="p-4 bg-zinc-900 border border-zinc-850 rounded-xs flex items-start justify-between group hover:border-zinc-700 transition-all"
              >
                <div className="flex items-start space-x-3 text-xs leading-relaxed">
                  <div className="h-9 w-9 bg-zinc-800 border border-zinc-750 group-hover:border-gold-500 rounded-none flex items-center justify-center font-display font-black text-white shrink-0">
                    {sc.avatarInitials}
                  </div>
                  <div>
                    <h4 className="font-display font-extrabold text-white text-xs uppercase group-hover:text-gold-400 transition-colors">{sc.name}</h4>
                    <p className="text-[10px] text-zinc-400 font-sans">{sc.role}</p>
                    
                    <div className="flex items-center gap-3.5 text-[9px] font-mono text-zinc-500 uppercase mt-1">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {sc.activeTime}</span>
                    </div>
                  </div>
                </div>

                <a
                  href={sc.waLink}
                  target="_blank"
                  rel="referrer"
                  onClick={() => onNotify(`A abrir chat com ${sc.name}...`, 'info')}
                  className="p-2 bg-emerald-950/20 text-[#22C55E] border border-emerald-900 hover:bg-[#22C55E] hover:text-black rounded-xs shrink-0 cursor-pointer transition-all"
                  title="Enviar mensagem WhatsApp"
                >
                  <MessageSquare className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-zinc-900 text-center space-y-3 font-mono text-[10px] text-zinc-500">
            <p className="uppercase font-bold">GERAL CENTRALE HUB MOZCONNECT</p>
            <p className="text-white text-xs font-bold leading-none">+258 84 123 4567</p>
            <button
              onClick={handleShareSystem}
              className="mt-2 w-full flex items-center justify-center space-x-1.5 rounded-xs bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-display text-[9px] font-bold tracking-widest uppercase py-2 cursor-pointer transition-all"
            >
              <Share2 className="h-3 w-3" />
              <span>PARTILHAR SITE PORTAL</span>
            </button>
          </div>

        </div>

        {/* Security / Mozambique Local Compliance Warning banner */}
        <div className="border border-zinc-800 bg-zinc-950 p-5 rounded-xs">
          <h4 className="font-display font-bold text-xs uppercase tracking-widest text-[#22C55E] mb-2">ORDEM & REGULAMENTAÇÃO</h4>
          <p className="text-zinc-400 text-xs font-sans leading-relaxed mb-3">
            O ecossistema Moz Tech Hub atua em estrita conformidade com os regulamentos de classificados do INAGE e da Autoridade Reguladora das Comunicações de Moçambique (ARECOM).
          </p>
          <span className="font-mono text-[9px] text-zinc-550 block uppercase tracking-wider">REGISTO LEGAL PROTEGIDO POR LICENÇA DE SERVIÇOS</span>
        </div>

      </div>

    </div>
  );
}
