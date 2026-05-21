/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Sparkles, 
  Copy, 
  Download, 
  User, 
  Briefcase, 
  GraduationCap, 
  Check, 
  RefreshCw, 
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  FileCheck,
  Send,
  Save
} from 'lucide-react';

interface ResumeBuilderProps {
  onNotify: (text: string, type: 'success' | 'info' | 'error') => void;
  currentUserPhone?: string;
}

export default function ResumeBuilder({ onNotify, currentUserPhone }: ResumeBuilderProps) {
  // Mode: 'cv' or 'letter'
  const [builderMode, setBuilderMode] = useState<'cv' | 'letter'>('cv');
  
  // Custom CV inputs
  const [fullName, setFullName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(currentUserPhone || '+258 83 ');
  const [location, setLocation] = useState('Maputo');
  const [summary, setSummary] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [education, setEducation] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  
  // Cover Letter inputs
  const [recipientCompany, setRecipientCompany] = useState('');
  const [recipientRole, setRecipientRole] = useState('');
  const [letterTone, setLetterTone] = useState<'Formal' | 'Criativo' | 'Persuasivo'>('Formal');
  const [letterFocus, setLetterFocus] = useState('');

  // Generated Outputs
  const [generatedCvContent, setGeneratedCvContent] = useState('');
  const [generatedLetterContent, setGeneratedLetterContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Load saved state on mount
  useEffect(() => {
    try {
      const savedCv = localStorage.getItem('jb_cv_data');
      if (savedCv) {
        const parsed = JSON.parse(savedCv);
        if (parsed.fullName) setFullName(parsed.fullName);
        if (parsed.jobTitle) setJobTitle(parsed.jobTitle);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.location) setLocation(parsed.location);
        if (parsed.summary) setSummary(parsed.summary);
        if (parsed.skills) setSkills(parsed.skills);
        if (parsed.experience) setExperience(parsed.experience);
        if (parsed.education) setEducation(parsed.education);
        if (parsed.generatedCvContent) setGeneratedCvContent(parsed.generatedCvContent);
      }

      const savedLetter = localStorage.getItem('jb_letter_data');
      if (savedLetter) {
        const parsed = JSON.parse(savedLetter);
        if (parsed.recipientCompany) setRecipientCompany(parsed.recipientCompany);
        if (parsed.recipientRole) setRecipientRole(parsed.recipientRole);
        if (parsed.letterTone) setLetterTone(parsed.letterTone);
        if (parsed.letterFocus) setLetterFocus(parsed.letterFocus);
        if (parsed.generatedLetterContent) setGeneratedLetterContent(parsed.generatedLetterContent);
      }
    } catch (e) {
      console.error('Falha ao carregar dados do localStorage:', e);
    }
  }, []);

  // Auto-Save CV changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        const dataObj = { fullName, jobTitle, email, phone, location, summary, skills, experience, education, generatedCvContent };
        localStorage.setItem('jb_cv_data', JSON.stringify(dataObj));
      } catch (e) {
        console.error(e);
      }
    }, 800);
    return () => clearTimeout(timeoutId);
  }, [fullName, jobTitle, email, phone, location, summary, skills, experience, education, generatedCvContent]);

  // Auto-Save Letter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        const dataObj = { recipientCompany, recipientRole, letterTone, letterFocus, generatedLetterContent };
        localStorage.setItem('jb_letter_data', JSON.stringify(dataObj));
      } catch (e) {
        console.error(e);
      }
    }, 800);
    return () => clearTimeout(timeoutId);
  }, [recipientCompany, recipientRole, letterTone, letterFocus, generatedLetterContent]);

  // Trigger CV AI Generation via backend proxy
  const handleGenerateCv = async () => {
    if (!fullName || !jobTitle) {
      onNotify('Introduza pelo menos o Nome Completo e o Cargo Alvo.', 'error');
      return;
    }

    setIsGenerating(true);
    const complexPrompt = `
      Crie um currículo profissional em Português de Moçambique com estrutura impecável e redação profissional e marcante.
      DADOS DO CANDIDATO:
      - Nome: ${fullName}
      - Título Profissional: ${jobTitle}
      - Email: ${email || 'não fornecido'}
      - Telefone: ${phone}
      - Localização: ${location}
      - Resumo de Perfil: ${summary || 'Estudante/Profissional dedicado de Moçambique em busca de novos desafios'}
      - Habilidades Chave: ${skills || 'Trabalho em equipa, pontualidade, ambição'}
      - Experiência Profissional: ${experience || 'Buscando o primeiro estágio/emprego formal'}
      - Educação: ${education || 'Ensinos primários/secundários concluídos'}
      
      NOTAS DE ESTILO MOÇAMBICANO:
      Faça menção a áreas locais e realismo corporativo técnico de Moçambique (e.g. M-Pesa, e-Mola, EDM, Tmcel, Vodacom, MCel, Standard Bank ou BCI se apropriado para o contexto de experiência). Forneça um currículo refinado, pronto para leitura de recrutadores. Use formatação Markdown limpa e espaçada.
    `;

    try {
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'resume',
          promptInput: complexPrompt
        })
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedCvContent(data.result);
        onNotify('Currículo gerado de forma impecável com o JB Co-pilot!', 'success');
      } else {
        // Fallback robusto auto-gerado
        generateFallbackCv();
      }
    } catch (err) {
      generateFallbackCv();
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFallbackCv = () => {
    const formattedSkills = skills ? skills.split(',').map(s => s.trim()) : ['Inclusão Técnica', 'Comunicação Amigável', 'Trabalho sob Pressão'];
    const fallback = `# CURRÍCULO PROFISSIONAL: ${fullName.toUpperCase()}
*Cargo Alvo:* **${jobTitle.toUpperCase()}**

---

## 📞 CONTACTOS & INFORMAÇÃO PESSOAL
- **Telefone:** ${phone}
- **Email:** ${email || `${fullName.toLowerCase().replace(/\s+/g, '')}@gmail.com`}
- **Localização:** ${location}, Moçambique
- **Nacionalidade:** Moçambicana

---

## 🌟 PERFIL PROFISSIONAL
${summary || `Profissional dedicado, proativo e com forte desejo de expansão profissional no mercado local de ${location}. Elevado sentido de ética, facilidade de autogestão corporativa, pontualidade rigorosa e adaptabilidade ao ecossistema digital moçambicano moderno de alta escala (incluindo wallets mobile-money M-Pesa e e-Mola).`}

---

## 🛠️ COMPETÊNCIAS TÉCNICAS E INTERPESSOAIS
${formattedSkills.map(sk => `- **${sk}**`).join('\n')}

---

## 💼 PERCURSO PROFISSIONAL
${experience || `- **Profissional Independente / Assistente Prático de Serviços** (${location}, Moçambique)
  *Atividades prontas de suporte e intervenção técnica aos clientes das vizinhanças.*
  *Lidança diária com o público em dinâmicas de atendimento urgente de alto padrão.*`}

---

## 🎓 HISTÓRICO ACADÉMICO
${education || `- **Bacharel / Ensino Médio Técnico Completo**
  *Institutos Técnicos Estatais ou Escolas de Ensino Geral localizadas em Moçambique.*`}

---
*Gerado via Moz Tech Hub Resume Copilot - Licença Jonson JB*`;

    setGeneratedCvContent(fallback);
    onNotify('Currículo gerado com a engine de fallback local com sucesso!', 'info');
  };

  // Trigger Cover Letter AI Generation via backend proxy
  const handleGenerateLetter = async () => {
    if (!fullName || !recipientCompany || !recipientRole) {
      onNotify('Preencha os campos obrigatórios (Nome, Empresa Alvo, Cargo Alvo).', 'error');
      return;
    }

    setIsGenerating(true);
    const complexPrompt = `
      Crie uma Carta de Apresentação formal e marcante em Português de Moçambique, endereçada a um recrutador.
      DADOS DO CANDIDATO:
      - Candidato: ${fullName}
      - Contacto: ${phone} (${location})
      EMPRESA ALVO:
      - Empresa: ${recipientCompany}
      - Cargo pretendido: ${recipientRole}
      ESTILO E FOCO:
      - Tom: ${letterTone}
      - Detalhes Customizados de Foco: ${letterFocus || 'Desejo contribuir para o crescimento e simplificação operacional da empresa.'}
      
      NOTAS DE CONTEXTO:
      Personalize a linguagem moçambicana com extremo profissionalismo, mostrando respeito profissional profundo (termos de tratamento respeitoso português de Moçambique) e grande entusiasmo para apresentar ao recrutador qualidades úteis imediatas. Use formatação Markdown.
    `;

    try {
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'resume',
          promptInput: complexPrompt
        })
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedLetterContent(data.result);
        onNotify('Carta de Apresentação elaborada com alto impacto!', 'success');
      } else {
        generateFallbackLetter();
      }
    } catch (err) {
      generateFallbackLetter();
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFallbackLetter = () => {
    const fallback = `À Direção de Recursos Humanos da **${recipientCompany}**
Maputo, Moçambique

**Assunto: Candidatura para a vaga de ${recipientRole}**

Prezados Senhores,

Dirijo-me a Vossas Excelências com o maior interesse na oportunidade para desempenhar o cargo de **${recipientRole}** na prestigiada **${recipientCompany}**, um de cujos pilares operacionais acompanho com enorme admiração e respeito comercial.

Chamo-me **${fullName}**, residente em ${location}. ${letterFocus || 'Possuo fortes competências no tratamento de tarefas organizacionais e possuo um foco inabalável na superação de objetivos e cooperação interna saudável.'}

Acredito genuinamente que a minha dedicação ao trabalho técnico, a agilidade no atendimento corporativo e as minhas habilidades interpessoais estão plenamente alinhadas com os valores primários da **${recipientCompany}**. Estou disponível para prestar as minhas provas iniciais de qualificação e para dinamizar os vossos processos imediatas.

Fico ao inteiro dispor de Vossas Excelências para uma eventual entrevista técnica e pessoal, onde poderei partilhar detalhadamente as minhas convicções profissionais. Agradeço desde já a atenção dedicada à leitura desta missiva.

Com os meus melhores cumprimentos respeitosos,

**${fullName}**
Telefone: ${phone}
Nacionalidade: Moçambicana`;

    setGeneratedLetterContent(fallback);
    onNotify('Carta de Apresentação elaborada com o motor de fallback local!', 'info');
  };

  // Helper actions
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    onNotify('Copiado para a área de transferência com sucesso!', 'success');
  };

  const downloadTextFile = (text: string, filename: string) => {
    const element = document.createElement('a');
    const file = new Blob([text], {type: 'text/plain;charset=utf-8'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    onNotify('Download efetuado! Ficheiro guardado.', 'success');
  };

  const handleSendToWhatsapp = () => {
    let message = '';
    if (builderMode === 'cv') {
      if (!fullName) {
        onNotify('Por favor, indique pelo menos o seu Nome Completo antes de enviar os dados.', 'error');
        return;
      }
      message = `Olá Jonson JB! Preenchi os dados de Currículo no Moz Tech Hub:\n\n` +
                `*Nome Completo:* ${fullName}\n` +
                `*Telemóvel:* ${phone || 'Não indicado'}\n` +
                `*Cidade/Distrito:* ${location || 'Não indicado'}\n` +
                `*Cargo Alvo:* ${jobTitle || 'Não indicado'}\n` +
                `*Email:* ${email || 'Não indicado'}\n` +
                `*Resumo:* ${summary || 'Não indicado'}\n` +
                `*Habilidades:* ${skills || 'Não indicadas'}\n` +
                `*Experiência:* ${experience || 'Não indicada'}\n` +
                `*Formação:* ${education || 'Não indicada'}\n\n` +
                `Por favor, ajude-me a refinar ou guardar o meu Currículo JB. Obrigado!`;
    } else {
      if (!fullName || !recipientCompany) {
        onNotify('Por favor, indique o seu Nome e a Empresa Alvo antes de enviar os dados.', 'error');
        return;
      }
      message = `Olá Jonson JB! Preenchi os dados de Carta de Apresentação no Moz Tech Hub:\n\n` +
                `*Nome Completo:* ${fullName}\n` +
                `*Telemóvel:* ${phone || 'Não indicado'}\n` +
                `*Cidade/Distrito:* ${location || 'Não indicado'}\n` +
                `*Empresa Alvo:* ${recipientCompany}\n` +
                `*Cargo a Candidatar:* ${recipientRole || 'Não indicado'}\n` +
                `*Tom de Escrita:* ${letterTone || 'Formal'}\n` +
                `*Diferenciais de Foco:* ${letterFocus || 'Não indicado'}\n\n` +
                `Por favor, ajude-me a analisar e finalizar a minha Carta de Apresentação. Obrigado!`;
    }

    const encodedText = encodeURIComponent(message);
    const waUrl = `https://wa.me/258835109190?text=${encodedText}`;
    
    // Explicit immediate save to localStorage
    try {
      if (builderMode === 'cv') {
        const dataObj = { fullName, jobTitle, email, phone, location, summary, skills, experience, education, generatedCvContent };
        localStorage.setItem('jb_cv_data', JSON.stringify(dataObj));
      } else {
        const dataObj = { recipientCompany, recipientRole, letterTone, letterFocus, generatedLetterContent };
        localStorage.setItem('jb_letter_data', JSON.stringify(dataObj));
      }
    } catch(e) {
      console.error(e);
    }

    window.open(waUrl, '_blank');
    onNotify('Dados guardados localmente e redirecionado para o WhatsApp +258 835109190!', 'success');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* LEFT FORM GRID COMPONENT */}
      <div className="lg:col-span-2 space-y-6">
        <div className="border border-zinc-800 bg-zinc-950 p-6 rounded-xs relative">
          
          <div className="flex gap-2 p-1.5 border border-zinc-900 bg-zinc-900/50 rounded-xs mb-6">
            <button
              onClick={() => {
                setBuilderMode('cv');
                setCustomPrompt('');
              }}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 text-xs font-bold tracking-wider rounded-xs uppercase transition-all ${
                builderMode === 'cv' ? 'bg-gold-500 text-black font-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Currículo (CV)</span>
            </button>
            <button
              onClick={() => {
                setBuilderMode('letter');
                setCustomPrompt('');
              }}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 text-xs font-bold tracking-wider rounded-xs uppercase transition-all ${
                builderMode === 'letter' ? 'bg-gold-500 text-black font-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <FileCheck className="h-3.5 w-3.5" />
              <span>Carta de Apresentação</span>
            </button>
          </div>

          <h3 className="font-display font-black text-sm uppercase tracking-widest text-gold-500 mb-2 border-b border-zinc-900 pb-2">
            {builderMode === 'cv' ? 'DADOS PARA CONSTRUÇÃO DE CV' : 'ESTRUTURA DA CARTA'}
          </h3>

          <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-6">
            Preencha e clica para gerar o documento com Inteligência Artificial
          </p>

          <div className="space-y-4">
            {/* Common fields */}
            <div>
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Nome Completo *</label>
              <input
                type="text"
                placeholder="Ex: Peniel Dinis Mucavele"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2.5 text-xs font-mono bg-zinc-900 border border-zinc-800 text-white rounded-xs focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Telefone *</label>
                <input
                  type="text"
                  placeholder="+258 84 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 text-xs font-mono bg-zinc-900 border border-zinc-800 text-white rounded-xs focus:outline-none focus:border-gold-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Cidade / Distrito *</label>
                <input
                  type="text"
                  placeholder="Ex: Sommerchield, Maputo"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2.5 text-xs font-mono bg-zinc-900 border border-zinc-800 text-white rounded-xs focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            {builderMode === 'cv' ? (
              // CV Specific
              <>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Cargo Alvo / Profissão *</label>
                  <input
                    type="text"
                    placeholder="Ex: Programador Frontend ou Canalizador Geral"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full p-2.5 text-xs font-mono bg-zinc-900 border border-zinc-800 text-white rounded-xs focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Email de Contacto</label>
                  <input
                    type="email"
                    placeholder="Ex: peniel.dinis@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 text-xs font-mono bg-zinc-900 border border-zinc-800 text-white rounded-xs focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Resumo do seu Perfil (Opcional)</label>
                  <textarea
                    placeholder="Fale brevemente de si, ambições e pontos fortes..."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full p-2.5 text-xs font-sans bg-zinc-900 border border-zinc-800 text-white rounded-xs focus:outline-none focus:border-gold-500 h-20"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Habilidades / Skills (Por vírgulas)</label>
                  <input
                    type="text"
                    placeholder="Ex: ReactJS, NodeJS, JavaScript, Integração M-Pesa"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="w-full p-2.5 text-xs font-mono bg-zinc-900 border border-zinc-800 text-white rounded-xs focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Experiência Profissional (Opcional)</label>
                  <textarea
                    placeholder="Cargo e empresa anterior, datas de trabalho, etc."
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full p-2.5 text-xs font-sans bg-zinc-900 border border-zinc-800 text-white rounded-xs focus:outline-none focus:border-gold-500 h-20"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Formação Académica (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Ex: Licenciatura em Engenharia Informática - UEM"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className="w-full p-2.5 text-xs font-sans bg-zinc-900 border border-zinc-800 text-white rounded-xs focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="mt-3 p-2 bg-zinc-900/60 border border-zinc-850 rounded-xs flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span className="flex items-center gap-1.5"><Save className="h-3.5 w-3.5 text-zinc-500" /> DADOS GUARDADOS NO NAVEGADOR</span>
                  <span className="text-emerald-500 font-bold uppercase text-[9px]">Sincronizado</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <button
                    onClick={handleGenerateCv}
                    disabled={isGenerating}
                    className="flex items-center justify-center space-x-2 rounded-xs bg-gold-500 hover:bg-gold-600 text-black font-display text-xs font-black tracking-widest uppercase py-3 cursor-pointer shadow-md transition-all"
                  >
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    <span>{isGenerating ? 'A GERAR...' : 'GERAR IA'}</span>
                  </button>

                  <button
                    onClick={handleSendToWhatsapp}
                    className="flex items-center justify-center space-x-2 rounded-xs bg-[#22C55E]/15 hover:bg-[#22C55E]/25 text-[#22C55E] border border-emerald-900/60 font-display text-xs font-black tracking-widest uppercase py-3 cursor-pointer shadow-md transition-all"
                    title="Mandar os dados do currículo preenchido diretamente por WhatsApp"
                  >
                    <Send className="h-4 w-4 text-[#22C55E]" />
                    <span>Mandar Dados</span>
                  </button>
                </div>
              </>
            ) : (
              // Cover Letter Specific
              <>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Nome da Empresa Alvo *</label>
                  <input
                    type="text"
                    placeholder="Ex: NETEK Classificados ou Standard Bank"
                    value={recipientCompany}
                    onChange={(e) => setRecipientCompany(e.target.value)}
                    className="w-full p-2.5 text-xs font-mono bg-zinc-900 border border-zinc-800 text-white rounded-xs focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Cargo a Candidatar-se *</label>
                  <input
                    type="text"
                    placeholder="Ex: Desenvolvedor Júnior Flutter ou Gestor Tributário"
                    value={recipientRole}
                    onChange={(e) => setRecipientRole(e.target.value)}
                    className="w-full p-2.5 text-xs font-mono bg-zinc-900 border border-zinc-800 text-white rounded-xs focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Tom de Escrita</label>
                  <select
                    value={letterTone}
                    onChange={(e) => setLetterTone(e.target.value as any)}
                    className="w-full p-2.5 text-xs font-mono bg-zinc-900 border border-zinc-800 text-white rounded-xs focus:outline-none focus:border-gold-500"
                  >
                    <option value="Formal">Formal (Muito respeitoso e corporativo)</option>
                    <option value="Criativo">Criativo (Inovador, bom para startups)</option>
                    <option value="Persuasivo">Persuasivo (Focado em resultados comerciais)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Foco / Qualidades Diferenciais (Opcional)</label>
                  <textarea
                    placeholder="Ex: Possuo sólida experiência prática com o webhook e as APIs móveis de operadoras..."
                    value={letterFocus}
                    onChange={(e) => setLetterFocus(e.target.value)}
                    className="w-full p-2.5 text-xs font-sans bg-zinc-900 border border-zinc-800 text-white rounded-xs focus:outline-none focus:border-gold-500 h-24"
                  />
                </div>

                <div className="mt-3 p-2 bg-zinc-900/60 border border-zinc-850 rounded-xs flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span className="flex items-center gap-1.5"><Save className="h-3.5 w-3.5 text-zinc-500" /> DADOS GUARDADOS NO NAVEGADOR</span>
                  <span className="text-emerald-500 font-bold uppercase text-[9px]">Sincronizado</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <button
                    onClick={handleGenerateLetter}
                    disabled={isGenerating}
                    className="flex items-center justify-center space-x-2 rounded-xs bg-gold-500 hover:bg-gold-600 text-black font-display text-xs font-black tracking-widest uppercase py-3 cursor-pointer shadow-md transition-all"
                  >
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    <span>{isGenerating ? 'A GERAR...' : 'GERAR IA'}</span>
                  </button>

                  <button
                    onClick={handleSendToWhatsapp}
                    className="flex items-center justify-center space-x-2 rounded-xs bg-[#22C55E]/15 hover:bg-[#22C55E]/25 text-[#22C55E] border border-emerald-900/60 font-display text-xs font-black tracking-widest uppercase py-3 cursor-pointer shadow-md transition-all"
                    title="Mandar os dados da carta de apresentação preenchida diretamente por WhatsApp"
                  >
                    <Send className="h-4 w-4 text-[#22C55E]" />
                    <span>Mandar Dados</span>
                  </button>
                </div>
              </>
            )}
          </div>

        </div>
      </div>

      {/* RIGHT DISPLAY TERMINAL SCREEN COMPONENT */}
      <div className="lg:col-span-3">
        <div className="border border-zinc-800 bg-zinc-950 p-6 rounded-xs h-full flex flex-col justify-between relative min-h-[500px]">
          
          <div>
            <div className="flex justify-between items-center mb-6 border-b border-zinc-900 pb-3">
              <div className="flex items-center space-x-2">
                <FileCheck className="h-4.5 w-4.5 text-gold-500" />
                <h3 className="font-display font-bold text-xs uppercase tracking-widest text-zinc-100">
                  {builderMode === 'cv' ? 'TERMINAL CURRÍCULO PRO' : 'TERMINAL CARTA DE APRESENTAÇÃO'}
                </h3>
              </div>

              {((builderMode === 'cv' && generatedCvContent) || (builderMode === 'letter' && generatedLetterContent)) && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyToClipboard(builderMode === 'cv' ? generatedCvContent : generatedLetterContent)}
                    title="Copiar Conteúdo"
                    className="p-1.5 rounded-xs border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => downloadTextFile(
                      builderMode === 'cv' ? generatedCvContent : generatedLetterContent, 
                      builderMode === 'cv' ? 'curriculo_moz.txt' : 'carta_apresentacao_moz.txt'
                    )}
                    title="Descarregar TXT"
                    className="p-1.5 rounded-xs border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Simulated Printed document paper inside a computer window visual container */}
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <RefreshCw className="h-10 w-10 text-gold-500 animate-spin" />
                <div className="text-center">
                  <p className="font-mono text-xs font-bold uppercase text-white animate-pulse">Copiloto Editorial a Redigir...</p>
                  <p className="text-[10px] text-zinc-500 font-sans mt-1">Refinando os termos locais com Inteligência Artificial</p>
                </div>
              </div>
            ) : builderMode === 'cv' ? (
              generatedCvContent ? (
                <div className="font-mono text-[11px] text-zinc-300 whitespace-pre-wrap p-5 bg-black rounded-xs border border-zinc-900 leading-relaxed max-h-[580px] overflow-y-auto selection:bg-gold-500 selection:text-black">
                  {generatedCvContent}
                </div>
              ) : (
                <div className="text-center py-28 border border-dashed border-zinc-900 bg-black/20 rounded-xs">
                  <FileText className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                  <p className="font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Nenhum Documento Gerado</p>
                  <p className="text-xs text-zinc-500 font-sans max-w-sm mx-auto mt-2 leading-relaxed">
                    Preencha os dados do lado esquerdo e faça clique em **&ldquo;GERAR CURRÍCULO COM IA&rdquo;** para ver o resultado formatado aqui.
                  </p>
                </div>
              )
            ) : (
              generatedLetterContent ? (
                <div className="font-mono text-[11px] text-zinc-300 whitespace-pre-wrap p-5 bg-black rounded-xs border border-zinc-900 leading-relaxed max-h-[580px] overflow-y-auto selection:bg-gold-500 selection:text-black">
                  {generatedLetterContent}
                </div>
              ) : (
                <div className="text-center py-28 border border-dashed border-zinc-900 bg-black/20 rounded-xs">
                  <FileCheck className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                  <p className="font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Nenhuma Carta de Apresentação Gerada</p>
                  <p className="text-xs text-zinc-500 font-sans max-w-sm mx-auto mt-2 leading-relaxed">
                    Preencha as especificações corporativas e clique em **&ldquo;GERAR CARTA COM IA&rdquo;** para formular instantaneamente o pitch.
                  </p>
                </div>
              )
            )}
          </div>

          {/* Premium Advice section */}
          <div className="mt-6 p-3 bg-zinc-900/50 rounded-xs border border-zinc-900 text-[10px] text-zinc-400 leading-relaxed flex items-center justify-between">
            <span className="font-sans">Precisa de suporte personalizado com recrutamento em Moçambique?</span>
            <a 
              href="https://wa.me/258835109190?text=Olá%20Jonson%20JB,%20gostaria%20de%20ajuda%20para%20melhorar%20o%20meu%20currículo%20de%20candidatura"
              target="_blank"
              rel="referrer"
              className="font-mono text-gold-500 font-bold uppercase tracking-wider hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Phone className="h-3 w-3" /> WhatsApp JB
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
