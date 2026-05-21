/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Compass, 
  Home, 
  Layers, 
  SquareDot, 
  ArrowRight, 
  PhoneCall, 
  CheckCircle,
  FileSpreadsheet,
  Ruler,
  Maximize2
} from 'lucide-react';

interface HousePlan {
  id: string;
  title: string;
  bedrooms: number;
  bathrooms: number;
  squareMeters: number;
  floors: number;
  estimatedCostMT: number;
  style: string;
  description: string;
  bluePrintGrid: string[][]; // simulated ASCII blueprint mapping
  features: string[];
  imageUrl: string;
}

const PREMADE_PLANS: HousePlan[] = [
  {
    id: 'plan-1',
    title: 'Planta T2 Económica Moçambique',
    bedrooms: 2,
    bathrooms: 1,
    squareMeters: 85,
    floors: 1,
    estimatedCostMT: 850000,
    style: 'Tradicional Moderno',
    description: 'Moradia unifamiliar compacta, ideal para início de vida. Projetada com ventilação cruzada ideal para o clima quente de Moçambique. Paredes de bloco de betão económico e fundação reforçada.',
    features: ['Ventilação Cruzada', 'Cozinha Americana', 'Varanda Alpendrada', 'Fácil Ampliação'],
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=60',
    bluePrintGrid: [
      ['[ Varanda ]', '[ Sala de Estar ]', '[ Cozinha ]'],
      ['[ Quarto 1 ]', '[ Casa de Banho ]', '[ Quarto 2 ]']
    ]
  },
  {
    id: 'plan-2',
    title: 'Vivenda T3 Sommerchield Executive',
    bedrooms: 3,
    bathrooms: 2.5,
    squareMeters: 175,
    floors: 2,
    estimatedCostMT: 3500000,
    style: 'Minimalista Contemporâneo',
    description: 'Projeto duplex topo de gama com linhas geométricas fortes. Vidro térmico curvo na fachada, suite master com closet privativo, área gourmet de lazer integrada e estacionamento para 2 viaturas.',
    features: ['Suíte com Closet', 'Duplex', 'Vidro Panorâmico', 'Espaço Espelho de Água'],
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=60',
    bluePrintGrid: [
      ['[ Piso 1: Garagem ]', '[ Hall Entrada ]', '[ Sala Ampla ]'],
      ['[ Piso 2: Quarto 1 ]', '[ Quarto 2 ]', '[ Master Suite ]']
    ]
  },
  {
    id: 'plan-3',
    title: 'Planta T4 Zimpeto Premium Open-Space',
    bedrooms: 4,
    bathrooms: 3.5,
    squareMeters: 240,
    floors: 1,
    estimatedCostMT: 2100000,
    style: 'Chic Tropical',
    description: 'Desenho plano horizontal com máxima penetração de luz do sol. Integração perfeita entre sala de jantar, sala de visitas e anexo independente para serviços ou visitas de fins de semana.',
    features: ['Anexo de Serviços', 'Piscina Planeada', 'Open-Space Pleno', 'Quatro Suites'],
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=60',
    bluePrintGrid: [
      ['[ Quarto 1 ]', '[ Sala de Convívio ]', '[ Master Suite ]'],
      ['[ Quarto 2 ]', '[ Corredor Central ]', '[ Quarto 3 ]'],
      ['[ Anexo ]', '[ Lavandaria ]', '[ Garagem ]']
    ]
  }
];

interface HousePlansProps {
  onNotify: (text: string, type: 'success' | 'info' | 'error') => void;
  currentUserPhone?: string;
  currentUserName?: string;
  plans?: HousePlan[];
}

export default function HousePlans({ onNotify, currentUserPhone, currentUserName, plans }: HousePlansProps) {
  const [selectedPlan, setSelectedPlan] = useState<HousePlan | null>(null);
  
  // Custom Quote Request states
  const [clientName, setClientName] = useState(currentUserName || '');
  const [clientPhone, setClientPhone] = useState(currentUserPhone || '+258 84 ');
  const [constructionLocation, setConstructionLocation] = useState('Maputo Cidade');
  const [customModifications, setCustomModifications] = useState('');
  const [customQuoteList, setCustomQuoteList] = useState<any[]>([]);
  const [activePlanTab, setActivePlanTab] = useState<string>('plan-1');

  const [activeTabDetail, setActiveTabDetail] = useState<'info' | 'blueprint'>('info');

  const displayPlans = plans && plans.length > 0 ? plans : PREMADE_PLANS;
  const currentPlan = displayPlans.find(p => p.id === activePlanTab) || displayPlans[0];

  const handleRequestQuote = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName || !clientPhone) {
      onNotify('Por favor preencha o seu nome e telefone para podermos responder.', 'error');
      return;
    }

    const newQuote = {
      id: `qt-${Date.now()}`,
      planTitle: currentPlan?.title || 'Planta',
      clientName,
      clientPhone,
      location: constructionLocation,
      modifications: customModifications || 'Sem modificações solicitadas',
      timestamp: new Date().toISOString(),
      status: 'Pendente JB'
    };

    setCustomQuoteList([newQuote, ...customQuoteList]);
    onNotify('Solicitação de orçamento registada com sucesso na nossa plataforma!', 'success');

    // Build the beautiful, human-friendly WhatsApp Message Link
    const waText = `Olá Jonson JB / Equipa Moz Tech Hub! 
Solicito um orçamento para o seguinte projeto:
*Projeto:* ${currentPlan?.title} (${currentPlan?.bedrooms} quartos, ${currentPlan?.squareMeters}m²)
*Cliente:* ${clientName}
*Telemóvel:* ${clientPhone}
*Local de Construção:* ${constructionLocation}
*Modificações pretendidas:* ${customModifications || 'Nenhuma, pretendo o plano padrão do site'}

Gostaria de agendar uma reunião técnica para discutir os pormenores.`;

    const encodedText = encodeURIComponent(waText);
    const waUrl = `https://wa.me/258835109190?text=${encodedText}`; // updated WhatsApp number dynamically

    // Show a helpful trigger informing the redirect
    setTimeout(() => {
      window.open(waUrl, '_blank');
      onNotify('A redirecionar contato diretamente para o WhatsApp do Jonson JB (+258 835109190)...', 'info');
    }, 1200);

    // Reset fields
    setCustomModifications('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* LEFT COLUMN: ACTIVE PLAN DETAILS & BLUEPRINTS INTERACTIVE PANEL */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Selector Tabs matching platform architecture */}
        <div className="border border-zinc-800 bg-zinc-950 p-2 rounded-xs flex gap-1.5 overflow-x-auto">
          {displayPlans.map(plan => (
            <button
              key={plan.id}
              onClick={() => {
                setActivePlanTab(plan.id);
                setActiveTabDetail('info');
              }}
              className={`flex-1 min-w-[140px] px-3 py-2.5 rounded-xs font-display text-[10px] font-bold uppercase tracking-wider text-center transition-all ${
                activePlanTab === plan.id 
                  ? 'bg-gold-500 text-black font-extrabold' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
              }`}
            >
              {plan.title.replace('Moçambique', '').replace('Executive', '').replace('Premium', '').split(' ')[1] || 'T2'} &bull; {plan.squareMeters}m²
            </button>
          ))}
        </div>

        {/* Selected Plan Details Frame */}
        <div className="border border-zinc-800 bg-zinc-950 p-6 rounded-xs relative group overflow-hidden">
          
          <div className="absolute top-0 right-0 bg-gold-500 text-black px-3 py-1 font-mono text-[9px] font-black uppercase tracking-widest leading-none select-none">
            PROJETO ARQUITETÓNICO
          </div>

          <div className="mb-5">
            <span className="font-mono text-[8px] font-bold text-zinc-500 uppercase tracking-widest">{currentPlan.style}</span>
            <h3 className="font-display font-black text-2xl uppercase tracking-tight text-white mt-1">
              {currentPlan.title}
            </h3>
            <p className="font-mono text-xs text-gold-500 font-bold block mt-1 uppercase">
              Custo Estimado Obra: ~ {(currentPlan.estimatedCostMT / 1000000).toFixed(1)}M MT (Meticais)
            </p>
          </div>

          {/* Toggle Info / Blueprint */}
          <div className="flex border-b border-zinc-900 mb-5">
            <button
              onClick={() => setActiveTabDetail('info')}
              className={`pb-2 px-4 font-mono text-[10px] font-bold uppercase tracking-wider transition-all relative ${
                activeTabDetail === 'info' ? 'text-white font-extrabold' : 'text-zinc-500 hover:text-zinc-350'
              }`}
            >
              {activeTabDetail === 'info' && <span className="absolute bottom-0 inset-x-0 h-[2px] bg-gold-500" />}
              Ficha Técnica
            </button>
            <button
              onClick={() => setActiveTabDetail('blueprint')}
              className={`pb-2 px-4 font-mono text-[10px] font-bold uppercase tracking-wider transition-all relative ${
                activeTabDetail === 'blueprint' ? 'text-white font-extrabold' : 'text-zinc-500 hover:text-zinc-350'
              }`}
            >
              {activeTabDetail === 'blueprint' && <span className="absolute bottom-0 inset-x-0 h-[2px] bg-gold-500" />}
              Esquema de Planta (Grid)
            </button>
          </div>

          {activeTabDetail === 'info' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-4">
                <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                  {currentPlan.description}
                </p>

                <div className="grid grid-cols-3 gap-2 border border-zinc-900 bg-zinc-900/10 p-3 rounded-xs text-center font-mono text-[10px] text-zinc-400">
                  <div>
                    <span className="block text-white font-display font-black text-base">{currentPlan.bedrooms}</span>
                    QUARTOS
                  </div>
                  <div>
                    <span className="block text-white font-display font-black text-base">{currentPlan.bathrooms}</span>
                    WCs
                  </div>
                  <div>
                    <span className="block text-white font-display font-black text-base">{currentPlan.squareMeters}m²</span>
                    ÁREA ÚTIL
                  </div>
                </div>
              </div>

              <div>
                <img 
                  src={currentPlan.imageUrl} 
                  alt={currentPlan.title} 
                  className="w-full h-44 object-cover border border-zinc-850 rounded-xs bg-zinc-900 mb-3"
                  referrerPolicy="no-referrer"
                />
                
                <h4 className="font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-2">EXTRAS E DIFERENCIAIS</h4>
                <div className="flex flex-wrap gap-1.5">
                  {currentPlan.features.map((feat, i) => (
                    <span 
                      key={i} 
                      className="px-2 py-0.5 rounded-none bg-zinc-900 border border-zinc-850 text-[9px] font-mono font-bold text-zinc-400 uppercase select-none"
                    >
                      &bull; {feat}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            // INTERACTIVE SCHEMATIC BLUEPRINT VIEW
            <div className="space-y-4">
              <p className="text-zinc-450 text-[11px] leading-relaxed font-sans mb-3">
                Esboço esquemático de alta fidelidade visual para visualização das divisões e fluxo arquitetónico aproximado:
              </p>

              <div className="p-5 font-mono text-[11px] bg-black border border-zinc-900 text-[#22C55E] rounded-xs grid grid-cols-1 md:grid-cols-3 gap-3">
                {currentPlan.bluePrintGrid.map((row, rIdx) => (
                  <React.Fragment key={rIdx}>
                    {row.map((col, cIdx) => (
                      <div 
                        key={cIdx} 
                        className="p-4 border border-dashed border-emerald-900/65 bg-zinc-950/80 rounded-xs text-center flex flex-col justify-center items-center hover:bg-emerald-950/15 cursor-crosshair group transition-all"
                      >
                        <span className="font-bold tracking-wider">{col}</span>
                        <span className="text-[8px] text-zinc-600 uppercase mt-1">Nível &bull; {rIdx + 1}</span>
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>

              <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono uppercase bg-zinc-900/40 p-2 rounded-xs border border-zinc-900">
                <span className="flex items-center gap-1"><Ruler className="h-3 w-3" /> Escala: 1:100 Metros</span>
                <span className="flex items-center gap-1"><Maximize2 className="h-3 w-3" /> Orientação Sombra: Otimizada Sul</span>
              </div>
            </div>
          )}

        </div>

        {/* Dynamic quote requested tracking list */}
        {customQuoteList.length > 0 && (
          <div className="border border-zinc-800 bg-zinc-950 p-5 rounded-xs">
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-[#22C55E] mb-3 flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4" /> PEDIDOS DE ORÇAMENTOS RECENTES
            </h4>
            <div className="space-y-2 max-h-[160px] overflow-y-auto">
              {customQuoteList.map((q, i) => (
                <div key={i} className="p-3 bg-zinc-900/70 border border-zinc-850 rounded-xs flex justify-between items-start text-xs font-mono">
                  <div className="space-y-0.5">
                    <p className="text-white font-bold uppercase">{q.planTitle}</p>
                    <p className="text-zinc-500 text-[10px] uppercase">LOCALIZAÇÃO: {q.location} &bull; MUDANÇA: {q.modifications.slice(0, 35)}...</p>
                  </div>
                  <span className="bg-[#22C55E]/15 text-[#22C55E] px-2 py-0.5 rounded-none font-bold text-[9px] uppercase tracking-wider animate-pulse">
                    {q.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* RIGHT COLUMN: REQUEST THE QUOTE FORM COMPONENT */}
      <div className="space-y-6">
        <div className="border border-zinc-800 bg-zinc-950 p-6 rounded-xs relative">
          
          <h3 className="font-display font-black text-sm uppercase tracking-widest text-gold-500 mb-2 border-b border-zinc-900 pb-2">
            SOLICITAR ORÇAMENTO GRÁTIS
          </h3>

          <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-5">
            Deseja construir este plano? Preencha os dados e receba resposta imediata
          </p>

          <form onSubmit={handleRequestQuote} className="space-y-4 font-mono text-xs">
            
            <div>
              <label className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-1 font-bold">O Seu Nome Completo *</label>
              <input
                type="text"
                required
                placeholder="Ex: Peniel Mucavele"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full p-2.5 bg-zinc-900 border border-zinc-800 text-white rounded-xs focus:outline-none focus:border-gold-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-1 font-bold">Número de Telemóvel *</label>
              <input
                type="text"
                required
                placeholder="Ex: +258 84 123 4567"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full p-2.5 bg-zinc-900 border border-zinc-800 text-white rounded-xs focus:outline-none focus:border-gold-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-1 font-bold">Local Proposto para Construção</label>
              <input
                type="text"
                placeholder="Ex: Matola Rio, Maputo Província"
                value={constructionLocation}
                onChange={(e) => setConstructionLocation(e.target.value)}
                className="w-full p-2.5 bg-zinc-900 border border-zinc-800 text-white rounded-xs focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-1 font-bold">Projeto Selecionado</label>
              <div className="p-3 bg-zinc-900 border border-zinc-850 rounded-xs text-[11px] font-bold text-white uppercase font-sans">
                {currentPlan.title}
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-1 font-bold">Alterações Pretendidas / Mensagem</label>
              <textarea
                placeholder="Ex: Quero com anexo T1 atrás, piscina de 6 metros, ou garagem aberta..."
                value={customModifications}
                onChange={(e) => setCustomModifications(e.target.value)}
                className="w-full p-2.5 bg-zinc-900 border border-zinc-800 text-white rounded-xs focus:outline-none focus:border-gold-500 h-24 font-sans text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 rounded-xs bg-gold-500 hover:bg-gold-600 text-black font-display text-xs font-black tracking-widest uppercase py-3.5 mt-4 cursor-pointer transition-all active:scale-98"
            >
              <PhoneCall className="h-4 w-4" />
              <span>SOLICITAR & ENVIAR WHATSAPP</span>
            </button>

          </form>

        </div>
      </div>

    </div>
  );
}
