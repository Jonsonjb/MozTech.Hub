/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, 
  Globe, 
  Sparkles, 
  Calendar, 
  User, 
  Phone, 
  MapPin, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  ExternalLink,
  DollarSign,
  Coffee,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DocumentRequest, UserSession } from '../types';

interface DocumentPreBookingsProps {
  onNotify: (text: string, type: 'success' | 'info' | 'error') => void;
  currentUser: UserSession | null;
  documentRequests: DocumentRequest[];
  onCreateRequest: (requestData: Omit<DocumentRequest, 'id' | 'createdAt' | 'status' | 'paymentStatus'>) => Promise<boolean>;
}

interface DocumentDetail {
  id: string;
  name: string;
  fullName: string;
  institution: string;
  officialPrice: string;
  processingTime: string;
  bookingUrl: string;
  requisites: string[];
  description: string;
}

const OFFICIAL_DOCUMENTS: DocumentDetail[] = [
  {
    id: 'BI',
    name: 'BI',
    fullName: 'Bilhete de Identidade (BI)',
    institution: 'Direcção Nacional de Identificação Civil (DNIC)',
    officialPrice: '185,00 MT (Taxa Normal) ou 435,00 MT (Taxa de Urgência)',
    processingTime: '5 a 15 dias úteis',
    bookingUrl: 'https://www.dnic.gov.mz/',
    description: 'Documento nacional de identificação obrigatório para todos os cidadãos moçambicanos de 6 ou mais anos.',
    requisites: [
      'Cópia da Certidão de Nascimento ou Assento de Nascimento recente',
      'Declaração de Residência válida (para primeiro BI)',
      'Número de Identificação Tributária (NUIT)',
      'BI anterior (no caso de renovação por caducidade ou extravio)'
    ]
  },
  {
    id: 'NUIT',
    name: 'NUIT',
    fullName: 'Número de Identificação Tributária (NUIT)',
    institution: 'Autoridade Tributária de Moçambique (AT)',
    officialPrice: 'Gratuito (Emissão pública direta)',
    processingTime: 'No mesmo dia (balcão físico) ou 2-3 dias úteis (Portal e-Tax)',
    bookingUrl: 'https://www.at.gov.mz/',
    description: 'Documento individual único que serve para identificar o cidadão perante a administração fiscal e aduaneira moçambicana.',
    requisites: [
      'Cópia simples de BI válido ou passaporte',
      'Preenchimento da declaração de início de atividade tributária (M/01)',
      'Comprovativo de morada de residência (opcional, recomendado)'
    ]
  },
  {
    id: 'Passaporte',
    name: 'Passaporte',
    fullName: 'Passaporte Biométrico Moçambicano',
    institution: 'Serviço Nacional de Migração (SENAMI)',
    officialPrice: '3.000,00 MT (Normal) ou 6.000,00 MT (Urgência extrema)',
    processingTime: '7 a 15 dias nas capitais providenciais',
    bookingUrl: 'http://www.senami.gov.mz/',
    description: 'Documento oficial de viagem internacional emitido pelas autoridades moçambicanas com dados biométricos integrados.',
    requisites: [
      'Bilhete de Identidade (BI) original e cópia em formato físico legível',
      'Número de Identificação de Contribuinte (NUIT)',
      'Declaração policial oficial em caso de extravio do passaporte anterior',
      'Autorização dos pais ou tutores legais para menores de 18 anos'
    ]
  },
  {
    id: 'Carta de Condução',
    name: 'Carta de Condução',
    fullName: 'Carta de Condução Moçambicana (Biométrica)',
    institution: 'Instituto Nacional dos Transportes Terrestres (INATRANS)',
    officialPrice: 'Aprox. 2.500,00 MT (Isento taxas de formação autónoma)',
    processingTime: '15 a 30 dias após submissão de exames aprovados',
    bookingUrl: 'https://www.inatrans.gov.mz/',
    description: 'Documento habilitador oficial que autoriza a condução de veículos automóveis em vias públicas moçambicanas e SADC.',
    requisites: [
      'Documento de Identidade original válido (BI, DIRE ou Passaporte)',
      'Atestado médico de aptidão física, visual e mental válido',
      'Cópia autenticada do certificado de aprovação em escola de condução',
      'Duas fotografias modelo tipo-passe'
    ]
  },
  {
    id: 'Registo Criminal',
    name: 'Registo Criminal',
    fullName: 'Certificado de Registo Criminal',
    institution: 'Ministério da Justiça, Assuntos Constitucionais e Religiosos',
    officialPrice: '250,00 MT (Emissão padrão)',
    processingTime: '1 a 3 dias úteis',
    bookingUrl: 'https://www.mjcr.gov.mz/',
    description: 'Documento que certifica os antecedentes judiciais do cidadão, essencial para candidaturas a emprego ou concursos públicos.',
    requisites: [
      'Cópia autenticada do Bilhete de Identidade legível',
      'Formulário específico para requerimento do Registo Criminal',
      'Taxa de emissão paga por depósito ou referência bancária'
    ]
  }
];

export default function DocumentPreBookings({ 
  onNotify, 
  currentUser, 
  documentRequests, 
  onCreateRequest 
}: DocumentPreBookingsProps) {
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [selectedDocId, setSelectedDocId] = useState<string>('BI');
  
  // Form states
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '+258 84 ');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [preferredProvince, setPreferredProvince] = useState('Maputo');
  const [preferredDate, setPreferredDate] = useState('');
  const [notes, setNotes] = useState('');
  const [payMethod, setPayMethod] = useState<'M-Pesa' | 'e-Mola'>('M-Pesa');
  
  const [showFormModal, setShowFormModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleExpand = (id: string) => {
    if (expandedDoc === id) {
      setExpandedDoc(null);
    } else {
      setExpandedDoc(id);
    }
  };

  const handleOpenBooking = (docId: string) => {
    setSelectedDocId(docId);
    setShowFormModal(true);
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !contactPhone || !preferredDate) {
      onNotify('Por favor preencha os campos obrigatórios (Nome, Telefone e Data).', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await onCreateRequest({
        documentType: selectedDocId as any,
        fullName,
        contactPhone,
        whatsappNumber: whatsappNumber || undefined,
        preferredProvince,
        preferredDate,
        feesChargedMT: 150, // Standard fee for time and megabytes
        paymentMethod: payMethod,
        userEmail: currentUser?.email || undefined,
        notes: notes || undefined
      });

      if (success) {
        onNotify('Solicitação de pré-marcação registada sob auditoria com sucesso!', 'success');
        setShowFormModal(false);
        // Reset form
        setNotes('');
        setWhatsappNumber('');
      } else {
        onNotify('Houve um erro ao enviar a sua solicitação. Tente novamente.', 'error');
      }
    } catch (err) {
      onNotify('Falha de rede ao conectar ao servidor de marcações.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter requests corresponding only to the active user (if not admin)
  const myRequests = documentRequests.filter(req => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true; // Admins see all for monitoring
    return req.userEmail === currentUser.email; 
  });

  return (
    <div id="documents-pre-booking-suite" className="space-y-8">
      
      {/* Intro Banner */}
      <div className="border border-zinc-850 bg-gradient-to-br from-zinc-950 via-zinc-950 to-neutral-900 p-6 sm:p-8 rounded-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 bg-gold-500/5 rounded-full blur-3xl"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-gold-550/10 border border-gold-500/20 px-3 py-1 text-gold-500 text-[10px] font-mono uppercase tracking-widest rounded-xs mb-4">
            <Sparkles className="h-3 w-3" />
            <span>Guia de Serviços Públicos &amp; Suporte</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-white uppercase">
            PRÉ-MARCAÇÕES DE DOCUMENTOS OFICIAIS MOÇAMBICANOS
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-3 font-sans leading-relaxed">
            Aqui mostramos os <span className="text-white font-semibold">Canais Oficiais Legítimos</span> e gratuitos do Governo de Moçambique para que faça o seu agendamento gratuitamente. 
          </p>
          <div className="mt-4 p-3.5 border border-zinc-800/80 bg-zinc-900/30 rounded-xs flex items-start space-x-3">
            <Coffee className="h-5 w-5 text-gold-500 flex-shrink-0 mt-0.5 animate-pulse" />
            <div>
              <h4 className="font-display text-xs font-bold text-white uppercase">Não consegue fazer a sua marcação online?</h4>
              <p className="text-zinc-400 text-[11px] font-sans mt-1 leading-relaxed">
                Nós podemos realizar a pré-marcação para si! Cobramos apenas uma taxa simbólica de <span className="text-gold-500 font-bold">150,00 MT</span> para cobrir o trabalho técnico, energia e o pacote de dados (<span className="text-white font-mono">megas</span>) utilizados na consola oficial.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Guide catalog */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-xs uppercase tracking-widest text-zinc-300">
          GUIA DE DOCUMENTOS & REQUISITOS OFICIAIS
        </h3>

        <div className="grid grid-cols-1 gap-3">
          {OFFICIAL_DOCUMENTS.map((doc) => {
            const isExpanded = expandedDoc === doc.id;
            return (
              <div 
                key={doc.id}
                className="border border-zinc-850 bg-zinc-950/80 rounded-xs overflow-hidden transition-all hover:border-zinc-800"
              >
                {/* Header row */}
                <div 
                  onClick={() => toggleExpand(doc.id)}
                  className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 cursor-pointer select-none bg-zinc-950 hover:bg-zinc-900/40"
                >
                  <div className="flex items-start space-x-3.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xs bg-zinc-900 border border-zinc-800 text-gold-500 font-bold text-sm">
                      <FileText className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="font-display font-black text-sm text-white uppercase tracking-tight">{doc.fullName}</h4>
                      <p className="font-mono text-[10px] text-zinc-500 mt-0.5">{doc.institution}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t border-zinc-900 sm:border-0">
                    <div className="text-left sm:text-right font-mono text-[10px] text-zinc-450">
                      <div>Tempo estimado: <span className="text-zinc-300 font-bold">{doc.processingTime}</span></div>
                      <div className="mt-0.5">Custo Oficial: <span className="text-emerald-500 font-semibold">{doc.officialPrice}</span></div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenBooking(doc.id);
                        }}
                        className="p-1.5 px-3 bg-gold-500 hover:bg-gold-600 text-black font-display text-[10px] font-black uppercase tracking-wider rounded-xs cursor-pointer active:scale-97 transition-all"
                      >
                        Pedir Marcação (150 MT)
                      </button>
                      <span className="text-zinc-650">
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Body details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="border-t border-zinc-900 bg-neutral-900/30 overflow-hidden"
                    >
                      <div className="p-4 sm:p-5 space-y-4 text-xs font-sans">
                        <p className="text-zinc-350 leading-relaxed">{doc.description}</p>
                        
                        <div className="bg-zinc-950 p-4 border border-zinc-900 rounded-none space-y-2.5">
                          <h5 className="font-display text-[11px] font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                            <span className="h-1.5 w-1.5 bg-gold-500 rounded-full" />
                            <span>Requisitos Obrigatórios para Submeter:</span>
                          </h5>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-zinc-400 pl-2">
                            {doc.requisites.map((req, i) => (
                              <li key={i} className="flex items-start space-x-2">
                                <span className="text-gold-500 font-bold">&bull;</span>
                                <span className="leading-tight">{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between p-3 border border-zinc-900 bg-zinc-950 rounded-xs gap-3">
                          <div className="flex items-center space-x-2">
                            <Globe className="h-4 w-4 text-zinc-500" />
                            <span className="font-mono text-[10px] text-zinc-400">Canal Gratuito do Estado moçambicano:</span>
                          </div>
                          <a 
                            href={doc.bookingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono text-[10px] uppercase rounded-xs transition-colors border border-zinc-850"
                          >
                            <span>Visitar Site Oficial</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Booking Form Modal */}
      <AnimatePresence>
        {showFormModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg border border-zinc-800 bg-zinc-950 p-6 rounded-xs shadow-2xl relative"
            >
              <div className="flex justify-between items-center pb-3 border-b border-zinc-900 mb-4">
                <h3 className="font-display font-black text-sm text-white uppercase tracking-widest flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gold-500" />
                  <span>SOLICITAR PRÉ-MARCAÇÃO ({selectedDocId})</span>
                </h3>
                <button 
                  onClick={() => setShowFormModal(false)}
                  className="text-zinc-500 hover:text-white p-1 rounded-sm"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-4 bg-zinc-900 border border-zinc-850 p-3 rounded-xs flex items-center justify-between">
                <div>
                  <span className="block text-[8px] font-mono text-zinc-500 uppercase tracking-widest">Taxa de Dados &amp; Operadora</span>
                  <span className="text-white text-xs font-bold font-sans">Time + Megabytes consumidos</span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-black text-gold-500">150.00 MT</span>
                </div>
              </div>

              <form onSubmit={handleSubmitRequest} className="space-y-4">
                <div>
                  <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Nome Completo do Cidadão *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-650" />
                    <input
                      type="text"
                      className="w-full bg-zinc-950 border border-zinc-850 p-2 pl-9 text-xs text-white uppercase focus:border-gold-500 focus:outline-none"
                      placeholder="Introduza o nome idêntico aos dados oficiais"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Telefone Principal *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-650" />
                      <input
                        type="tel"
                        className="w-full bg-zinc-950 border border-zinc-850 p-2 pl-9 text-xs text-white focus:border-gold-500 focus:outline-none"
                        placeholder="+258 84 123 4567"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Nº WhatsApp para Alertas (Opcional)</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-650 animate-pulse" />
                      <input
                        type="tel"
                        className="w-full bg-zinc-950 border border-zinc-850 p-2 pl-9 text-xs text-white focus:border-gold-500 focus:outline-none"
                        placeholder="+258 84 123 4567"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Província Preferida *</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-650" />
                      <select
                        className="w-full bg-zinc-950 border border-zinc-850 p-2 pl-9 text-xs text-zinc-300 focus:border-gold-500 focus:outline-none"
                        value={preferredProvince}
                        onChange={(e) => setPreferredProvince(e.target.value)}
                      >
                        {['Maputo Cidade', 'Maputo Província', 'Gaza', 'Inhambane', 'Sofala', 'Manica', 'Tete', 'Zambézia', 'Nampula', 'Cabo Delgado', 'Niassa'].map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Data Desejada da Marcação *</label>
                    <input
                      type="date"
                      className="w-full bg-zinc-950 border border-zinc-850 p-2 text-xs text-zinc-300 focus:border-gold-500 focus:outline-none"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Notas, NUIT ou Requisitos Fornecidos</label>
                  <textarea
                    className="w-full bg-zinc-950 border border-zinc-850 p-2 text-xs text-white h-16 focus:border-gold-500 focus:outline-none resize-none"
                    placeholder="Adicione referências necessárias, número de NUIT se aplicável, ou horário que prefere."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Método de Liquidação de Taxa (Mobile Money)</label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => setPayMethod('M-Pesa')}
                      className={`p-2.5 flex items-center justify-center space-x-2 border rounded-xs font-display text-[10px] font-bold uppercase transition-all tracking-wider ${
                        payMethod === 'M-Pesa' 
                          ? 'border-red-600 bg-red-950/20 text-red-500' 
                          : 'border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-450'
                      }`}
                    >
                      <span className="h-2 w-2 rounded-full bg-red-600 inline-block"></span>
                      <span>M-Pesa M-Kesh</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayMethod('e-Mola')}
                      className={`p-2.5 flex items-center justify-center space-x-2 border rounded-xs font-display text-[10px] font-bold uppercase transition-all tracking-wider ${
                        payMethod === 'e-Mola' 
                          ? 'border-orange-600 bg-orange-950/20 text-orange-500' 
                          : 'border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-450'
                      }`}
                    >
                      <span className="h-2 w-2 rounded-full bg-orange-650 inline-block"></span>
                      <span>e-Mola Express</span>
                    </button>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-500 mt-1.5 block">
                    * Após o envio, entraremos em contacto para obter o pin push da taxa simbólica de 150 MT.
                  </span>
                </div>

                <div className="flex justify-end space-x-2 pt-3 border-t border-zinc-900">
                  <button
                    type="button"
                    onClick={() => setShowFormModal(false)}
                    className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 font-mono text-[10px] uppercase rounded-xs font-bold"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-gold-400 hover:bg-gold-500 text-black font-display text-[10px] font-black uppercase tracking-wider rounded-xs cursor-pointer flex items-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin h-3.5 w-3.5 border-2 border-black border-t-transparent rounded-full block"></span>
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <span>Registar Solicitação</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Display Registered solicitudes corresponding to User */}
      <div className="border border-zinc-850 bg-zinc-950 p-5 rounded-xs">
        <h3 className="font-display font-bold text-xs uppercase tracking-widest text-zinc-300 mb-4 pb-2 border-b border-zinc-900 flex justify-between items-center">
          <span>MONITORIZAR AS MINHAS MARCAÇÕES</span>
          <span className="font-mono text-[10px] bg-zinc-900 text-zinc-500 px-2 py-0.5 border border-zinc-850 rounded-xs">
            {myRequests.length} Solicitada{myRequests.length !== 1 ? 's' : ''}
          </span>
        </h3>

        {!currentUser ? (
          <div className="text-center py-6">
            <AlertCircle className="h-8 w-8 text-zinc-650 mx-auto mb-2" />
            <p className="text-zinc-500 text-xs font-semibold">Autentique-se no canto superior para monitorizar as suas marcações efetuadas.</p>
          </div>
        ) : myRequests.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-8 w-8 text-zinc-700 mx-auto mb-2" />
            <p className="text-zinc-500 text-xs font-semibold">Ainda não solicitou nenhuma pré-marcação de documentos.</p>
            <p className="text-zinc-600 text-[10px] mt-1 font-mono uppercase">COBRAMOS VALOR JUSTO PELO SEU TEMPO E MEGAS.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs text-zinc-400 border-collapse">
              <thead>
                <tr className="border-b border-zinc-900 text-zinc-500 font-bold uppercase text-[9px] tracking-wider">
                  <th className="py-2.5">Documento</th>
                  <th className="py-2.5">Cidadão</th>
                  <th className="py-2.5 text-center">Província</th>
                  <th className="py-2.5 text-center">Data Pretendida</th>
                  <th className="py-2.5 text-right font-mono">Taxa</th>
                  <th className="py-2.5 text-center">Pagamento</th>
                  <th className="py-2.5 text-right">Status do Processo</th>
                </tr>
              </thead>
              <tbody>
                {myRequests.map((req, idx) => (
                  <tr key={req.id || idx} className="border-b border-zinc-900 hover:bg-zinc-900/10">
                    <td className="py-3 font-display font-semibold text-white uppercase">{req.documentType}</td>
                    <td className="py-3 text-zinc-350 tracking-tight font-sans text-[11px] font-semibold uppercase">{req.fullName}</td>
                    <td className="py-3 text-center text-zinc-400 font-sans text-[11px]">{req.preferredProvince}</td>
                    <td className="py-3 text-center text-zinc-300 font-bold">{req.preferredDate}</td>
                    <td className="py-3 text-right text-gold-500 font-bold">{req.feesChargedMT},00 MT</td>
                    <td className="py-3 text-center">
                      <span className={`inline-flex items-center rounded-xs px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        req.paymentStatus === 'Pago'
                          ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30'
                          : 'bg-amber-950/40 text-amber-500 border border-amber-900/30 animate-pulse'
                      }`}>
                        {req.paymentStatus === 'Pago' ? 'Pago' : `Pendente (${req.paymentMethod})`}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <span className={`inline-flex items-center rounded-xs px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${
                        req.status === 'Concluido'
                          ? 'bg-[#22C55E]/10 text-[#22C55E]'
                          : req.status === 'Processado'
                          ? 'bg-sky-500/10 text-sky-400'
                          : req.status === 'Cancelado'
                          ? 'bg-red-950 text-red-500'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {req.status === 'Pendente' ? 'Recebido / Aguardando Pago' : req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Helpful Hint banner */}
      <div className="p-4 border border-zinc-850 bg-zinc-950 rounded-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <HelpCircle className="h-5 w-5 text-gold-500 flex-shrink-0" />
          <p className="text-zinc-400 text-xs font-sans leading-relaxed">
            Dúvidas no preenchimento de BI ou NUIT? Fale agora com Jonson JB para apoio personalizado offline.
          </p>
        </div>
        <a 
          href="https://wa.me/258841234567?text=Olá%20Jonson%20JB!%20Estou%20na%20consola%20de%20pré-marcação%20de%20documentos%20e%20preciso%20de%20ajuda."
          target="_blank" 
          rel="noopener"
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-gold-500 font-display font-black text-[10px] tracking-widest uppercase border border-zinc-850 rounded-xs text-center w-full md:w-auto"
        >
          Apoio Imediato WhatsApp
        </a>
      </div>

    </div>
  );
}

// Inline fallback icon imports check
const X = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
