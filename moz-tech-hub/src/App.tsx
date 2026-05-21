/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navigation, { ActiveTabType } from './components/Navigation';
import ListingCard from './components/ListingCard';
import ResumeBuilder from './components/ResumeBuilder';
import HousePlans from './components/HousePlans';
import JbTutorials from './components/JbTutorials';
import ContactLocation from './components/ContactLocation';
import { Listing, BlogPost, FinancialStats, UserSession, HousePlan, Tutorial } from './types';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Search, 
  Plus, 
  Sparkles, 
  DollarSign, 
  Bell, 
  Activity, 
  Database,
  Fingerprint, 
  Trash2, 
  Send,
  User,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  FileText,
  Edit,
  Shield,
  Settings,
  Ban,
  UserPlus,
  Save,
  Check,
  X,
  Compass,
  ArrowRight,
  Layers
} from 'lucide-react';

export default function App() {
  // Navigation & Session State
  const [activeTab, setActiveTab] = useState<ActiveTabType>('Netek');
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  
  // Data State
  const [listings, setListings] = useState<Listing[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [metrics, setMetrics] = useState<FinancialStats | null>(null);
  const [housePlans, setHousePlans] = useState<HousePlan[]>([]);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [usersList, setUsersList] = useState<UserSession[]>([]);
  
  // Admin Management Panel State
  const [adminActiveSubTab, setAdminActiveSubTab] = useState<'listings' | 'blog' | 'plans' | 'tutorials' | 'users' | 'ledger'>('listings');
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);
  const [editingHousePlan, setEditingHousePlan] = useState<HousePlan | null>(null);
  const [editingTutorial, setEditingTutorial] = useState<Tutorial | null>(null);
  const [editingUser, setEditingUser] = useState<UserSession | null>(null);

  // Quick Inline Creation Form triggers
  const [showAddPlanForm, setShowAddPlanForm] = useState(false);
  const [showAddTutorialForm, setShowAddTutorialForm] = useState(false);
  const [showAddUserForm, setShowAddUserForm] = useState(false);

  // New form states for admin dynamic entries
  const [newPlanFields, setNewPlanFields] = useState({
    title: '', bedrooms: 2, bathrooms: 1, squareMeters: 90, floors: 1, estimatedCostMT: 950000, style: 'Tradicional', description: '', features: ''
  });
  const [newTutorialFields, setNewTutorialFields] = useState({
    title: '', summary: '', category: 'Mobile Money' as any, originalUrl: '', stepTitle: '', stepContent: ''
  });
  const [newUserFields, setNewUserFields] = useState({
    email: '', name: '', role: 'user' as 'admin'|'user', phone: '', password: ''
  });
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal / Interaction States
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showBiometricScreen, setShowBiometricScreen] = useState(false);
  const [biometricSimulating, setBiometricSimulating] = useState(false);
  
  // Create Form States (Listing)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<'Netek' | 'KayaMoz' | 'FixMoz'>('Netek');
  const [newPrice, setNewPrice] = useState('');
  const [newLocation, setNewLocation] = useState('Maputo');
  const [newPhone, setNewPhone] = useState('+258 84 ');
  const [newTier, setNewTier] = useState<'Gratuito' | 'Mensal' | 'Anual'>('Gratuito');
  const [newFeatures, setNewFeatures] = useState('');
  const [suggestPrompt, setSuggestPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  
  // Payment Simulation Modal
  const [payingListing, setPayingListing] = useState<Listing | null>(null);
  const [paymentPhone, setPaymentPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'M-Pesa' | 'e-Mola'>('M-Pesa');
  const [simulatingWebhook, setSimulatingWebhook] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);

  // Create Form States (Blog)
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSummary, setBlogSummary] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogCategory, setBlogCategory] = useState('Tecnologia');
  const [blogPrompt, setBlogPrompt] = useState('');
  const [blogAiLoading, setBlogAiLoading] = useState(false);

  // System Notification Banner State
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Helper function to show notifications
  const triggerToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  // Fetch initial data
  const loadData = async () => {
    try {
      const listRes = await fetch('/api/listings');
      const listData = await listRes.json();
      setListings(listData);

      const blogRes = await fetch('/api/blog');
      const blogData = await blogRes.json();
      setPosts(blogData);

      const metRes = await fetch('/api/metrics');
      const metData = await metRes.json();
      setMetrics(metData);

      const plansRes = await fetch('/api/house-plans');
      const plansData = await plansRes.json();
      setHousePlans(plansData);

      const tutsRes = await fetch('/api/tutorials');
      const tutsData = await tutsRes.json();
      setTutorials(tutsData);

      const usersRes = await fetch('/api/admin/users');
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsersList(usersData);
      }
    } catch (err) {
      console.error('Error loading API data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter listings based on active category and search
  const filteredListings = listings.filter(l => {
    const matchesCategory = l.category === activeTab;
    const matchesSearch = 
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      l.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle Login Flow
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      if (res.ok) {
        const userData: UserSession = await res.json();
        
        // Simular fluxo de autenticação biométrica profissional solicitado quando necessário
        if (userData.role === 'admin') {
          setShowBiometricScreen(true);
          return;
        }

        setCurrentUser(userData);
        setShowLoginModal(false);
        triggerToast(`Bem-vindo, ${userData.name}! Login efetuado com sucesso.`);
      } else {
        const errData = await res.json();
        setLoginError(errData.error || 'Falha na autenticação.');
      }
    } catch (err) {
      setLoginError('Problema ao conectar com o servidor.');
    }
  };

  // Simular Biometria para o Admin
  const handleBiometricSimulate = () => {
    setBiometricSimulating(true);
    setTimeout(() => {
      setBiometricSimulating(false);
      setShowBiometricScreen(false);
      setShowLoginModal(false);
      // Logado como Admin principal
      const adminSession: UserSession = {
        email: 'admin@jonsonjb.com',
        role: 'admin',
        name: 'Jonson JB',
        phone: '+258 84 123 4567'
      };
      setCurrentUser(adminSession);
      triggerToast('Autenticação Biométrica Confirmada! Bem-vindo Administrador.', 'success');
      setActiveTab('Admin');
    }, 1800);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    if (activeTab === 'Admin') {
      setActiveTab('Netek');
    }
    triggerToast('Sessão encerrada com sucesso.', 'info');
  };

  // Create Listing
  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc || !newPrice) {
      triggerToast('Preencha os campos obrigatórios.', 'error');
      return;
    }

    const featureList = newFeatures ? newFeatures.split(',').map(f => f.trim()) : [];

    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          description: newDesc,
          category: newCategory,
          price: Number(newPrice),
          location: newLocation,
          ownerEmail: currentUser?.email || 'visitante@mozconnect.co.mz',
          contactPhone: newPhone,
          subscriptionTier: newTier,
          paymentMethod: 'Nenhum',
          features: featureList
        })
      });

      if (res.ok) {
        const created = await res.json();
        triggerToast(
          newTier !== 'Gratuito' 
            ? 'Anúncio Premium criado! Aguardando simulação de pagamento via Webhook.'
            : 'Anúncio publicado com sucesso!',
          'success'
        );
        setShowCreateModal(false);
        // Limpar form
        setNewTitle('');
        setNewDesc('');
        setNewPrice('');
        setNewFeatures('');
        setSuggestPrompt('');
        loadData();
      } else {
        triggerToast('Erro ao submeter anúncio.', 'error');
      }
    } catch (err) {
      triggerToast('Falha na comunicação de rede.', 'error');
    }
  };

  // Generate AI Description using internal Full-stack Gemini proxy
  const generateAiDescription = async () => {
    if (!suggestPrompt) {
      triggerToast('Insira ideias básicas no prompt do Assistente.', 'info');
      return;
    }
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'listing',
          promptInput: suggestPrompt
        })
      });

      if (res.ok) {
        const data = await res.json();
        // Filtrar possíveis marcações de Markdown do assistente se desejar
        setNewDesc(data.result);
        triggerToast('Inovação Gemini: Descrição elaborada para o mercado de Moçambique!', 'success');
      } else {
        triggerToast('Algoritmo de sugestão offline. Insira manualmente.', 'info');
      }
    } catch (err) {
      triggerToast('Dificuldade de conexão com o Gemini.', 'error');
    } finally {
      setAiLoading(false);
    }
  };

  // Generate Jonson's Blog Outline using Gemini proxy
  const generateBlogOutline = async () => {
    if (!blogPrompt) {
      triggerToast('Indique tópicos ou palavra-chave para o rascunho.', 'info');
      return;
    }
    setBlogAiLoading(true);
    try {
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'blog',
          promptInput: blogPrompt
        })
      });

      if (res.ok) {
        const data = await res.json();
        setBlogContent(data.result);
        triggerToast('Rascunho Editorial do Jonson JB formulado!', 'success');
      } else {
        triggerToast('Erro de conexão do Assistente para Blog.', 'error');
      }
    } catch (err) {
      triggerToast('Erro ao contactar IA.', 'error');
    } finally {
      setBlogAiLoading(false);
    }
  };

  // Post blog entry
  const handleCreateBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle || !blogSummary || !blogContent) {
      triggerToast('Título, resumo e conteúdo do blog são obrigatórios.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: blogTitle,
          summary: blogSummary,
          content: blogContent,
          isDraft: false,
          category: blogCategory,
          author: currentUser?.name || 'Jonson JB'
        })
      });

      if (res.ok) {
        triggerToast('Artigo publicado de Jonson JB publicado ao vivo!', 'success');
        setBlogTitle('');
        setBlogSummary('');
        setBlogContent('');
        setBlogPrompt('');
        loadData();
      } else {
        triggerToast('Erro ao submeter post no blog.', 'error');
      }
    } catch (err) {
      triggerToast('Erro na requisição.', 'error');
    }
  };

  // Deletar anúncio ou post do blog (Admin)
  const handleDeleteListing = async (id: string) => {
    if (!window.confirm('Pretende realmente remover este anúncio do ecossistema?')) return;
    try {
      const res = await fetch(`/api/listings/${id}`, { method: 'DELETE' });
      if (res.ok) {
        triggerToast('Anúncio eliminado com sucesso!', 'success');
        loadData();
      }
    } catch (err) {
      triggerToast('Erro ao remover.', 'error');
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!window.confirm('Pretende remover este artigo de opinião?')) return;
    try {
      const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
      if (res.ok) {
        triggerToast('Artigo removido!', 'info');
        loadData();
      }
    } catch (err) {
      triggerToast('Erro ao remover artigo.', 'error');
    }
  };

  // PUT Updates (Admin option for Listing edit)
  const handleUpdateListing = async (id: string, updatedFields: Partial<Listing>) => {
    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });
      if (res.ok) {
        triggerToast('Anúncio atualizado com sucesso!', 'success');
        setEditingListing(null);
        loadData();
      } else {
        triggerToast('Erro ao atualizar anúncio.', 'error');
      }
    } catch (err) {
      triggerToast('Erro de ligação ao servidor.', 'error');
    }
  };

  // PUT Updates (Admin option for Blog Edit)
  const handleUpdateBlogPost = async (id: string, updatedFields: Partial<BlogPost>) => {
    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });
      if (res.ok) {
        triggerToast('Artigo atualizado com sucesso!', 'success');
        setEditingBlogPost(null);
        loadData();
      } else {
        triggerToast('Erro ao atualizar artigo.', 'error');
      }
    } catch (err) {
      triggerToast('Erro de ligação ao servidor.', 'error');
    }
  };

  // House Plans API calls
  const handleCreateHousePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanFields.title || !newPlanFields.estimatedCostMT || !newPlanFields.squareMeters) {
      triggerToast('Preencha os campos obrigatórios da planta.', 'error');
      return;
    }
    try {
      const featuresArray = newPlanFields.features ? newPlanFields.features.split(',').map(f => f.trim()) : [];
      const res = await fetch('/api/house-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newPlanFields, features: featuresArray }),
      });
      if (res.ok) {
        triggerToast('Nova planta de arquitetura publicada com sucesso!', 'success');
        setShowAddPlanForm(false);
        setNewPlanFields({
          title: '', bedrooms: 2, bathrooms: 1, squareMeters: 90, floors: 1, estimatedCostMT: 950000, style: 'Tradicional', description: '', features: ''
        });
        loadData();
      } else {
        triggerToast('Erro ao criar planta.', 'error');
      }
    } catch (err) {
      triggerToast('Erro na requisição da planta.', 'error');
    }
  };

  const handleUpdateHousePlan = async (id: string, updatedPlan: Partial<HousePlan>) => {
    try {
      const res = await fetch(`/api/house-plans/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPlan),
      });
      if (res.ok) {
        triggerToast('Planta atualizada com sucesso!', 'success');
        setEditingHousePlan(null);
        loadData();
      } else {
        triggerToast('Erro ao guardar alterações.', 'error');
      }
    } catch (err) {
      triggerToast('Erro de ligação ao servidor.', 'error');
    }
  };

  const handleDeleteHousePlan = async (id: string) => {
    if (!window.confirm('Eliminar esta planta de casa definitivamente?')) return;
    try {
      const res = await fetch(`/api/house-plans/${id}`, { method: 'DELETE' });
      if (res.ok) {
        triggerToast('Planta de casa eliminada com sucesso!', 'info');
        loadData();
      } else {
        triggerToast('Erro ao remover planta.', 'error');
      }
    } catch (err) {
      triggerToast('Falha na operação.', 'error');
    }
  };

  // Tutorials API calls
  const handleCreateTutorial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTutorialFields.title || !newTutorialFields.summary || !newTutorialFields.category) {
      triggerToast('Preencha os dados do cabeçalho do tutorial.', 'error');
      return;
    }
    const stepsArray = newTutorialFields.stepTitle && newTutorialFields.stepContent ? [
      { title: newTutorialFields.stepTitle, content: newTutorialFields.stepContent }
    ] : [];
    try {
      const res = await fetch('/api/tutorials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTutorialFields.title,
          summary: newTutorialFields.summary,
          category: newTutorialFields.category,
          originalUrl: newTutorialFields.originalUrl,
          steps: stepsArray
        }),
      });
      if (res.ok) {
        triggerToast('Tutorial adicionado ao acervo com sucesso!', 'success');
        setShowAddTutorialForm(false);
        setNewTutorialFields({
          title: '', summary: '', category: 'Mobile Money', originalUrl: '', stepTitle: '', stepContent: ''
        });
        loadData();
      } else {
        triggerToast('Erro ao registar tutorial.', 'error');
      }
    } catch (err) {
      triggerToast('Erro na requisição.', 'error');
    }
  };

  const handleUpdateTutorial = async (id: string, updatedTutorial: Partial<Tutorial>) => {
    try {
      const res = await fetch(`/api/tutorials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTutorial),
      });
      if (res.ok) {
        triggerToast('Tutorial editado com sucesso!', 'success');
        setEditingTutorial(null);
        loadData();
      } else {
        triggerToast('Erro ao atualizar tutorial.', 'error');
      }
    } catch (err) {
      triggerToast('Erro de ligação.', 'error');
    }
  };

  const handleDeleteTutorial = async (id: string) => {
    if (!window.confirm('Excluir este tutorial do acervo permanente?')) return;
    try {
      const res = await fetch(`/api/tutorials/${id}`, { method: 'DELETE' });
      if (res.ok) {
        triggerToast('Tutorial removido!', 'info');
        loadData();
      } else {
        triggerToast('Erro ao remover.', 'error');
      }
    } catch (err) {
      triggerToast('Falha na operação.', 'error');
    }
  };

  // User Administration calls
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserFields.email || !newUserFields.name || !newUserFields.password) {
      triggerToast('Email, nome e palavra-passe são obrigatórios.', 'error');
      return;
    }
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserFields),
      });
      if (res.ok) {
        triggerToast('Novo utilizador registado com sucesso!', 'success');
        setShowAddUserForm(false);
        setNewUserFields({ email: '', name: '', role: 'user', phone: '', password: '' });
        loadData();
      } else {
        const data = await res.json();
        triggerToast(data.error || 'Erro ao registar utilizador.', 'error');
      }
    } catch (err) {
      triggerToast('Erro na requisição.', 'error');
    }
  };

  const handleUpdateUser = async (email: string, updatedUser: Partial<UserSession>) => {
    try {
      const res = await fetch(`/api/admin/users/${email}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });
      if (res.ok) {
        triggerToast('Perfil de utilizador alterado com sucesso!', 'success');
        setEditingUser(null);
        loadData();
      } else {
        triggerToast('Erro ao aplicar atualizações.', 'error');
      }
    } catch (err) {
      triggerToast('Erro ao enviar dados.', 'error');
    }
  };

  const handleDeleteUser = async (email: string) => {
    if (email === 'admin@jonsonjb.com') {
      triggerToast('Erro: Não é permitido eliminar a conta root Jonson Master admin.', 'error');
      return;
    }
    if (!window.confirm(`Tem certeza de que quer banir/eliminar o utilizador: ${email}?`)) return;
    try {
      const res = await fetch(`/api/admin/users/${email}`, { method: 'DELETE' });
      if (res.ok) {
        triggerToast('Utilizador banido e removido do sistema.', 'info');
        loadData();
      } else {
        triggerToast('Erro ao remover utilizador.', 'error');
      }
    } catch (err) {
      triggerToast('Falha na operação.', 'error');
    }
  };

  // Iniciar Simulador de Webhook de Mobile Money (M-Pesa / e-Mola)
  const openPaymentSimulation = (listing: Listing) => {
    setPayingListing(listing);
    // Calcular valor do anúncio premium de acordo com o tier
    const amount = listing.subscriptionTier === 'Anual' ? 12999 : 1499;
    setPaymentAmount(amount);
    setPaymentPhone(currentUser?.phone || '+258 84 ');
    setPayingListing(listing);
  };

  // Executar simulação de webhook de mobile money
  const executePaymentSimulation = async () => {
    if (!payingListing || !paymentPhone) {
      triggerToast('Introduza um número de telemóvel moçambicano válido.', 'error');
      return;
    }

    setSimulatingWebhook(true);
    try {
      const res = await fetch('/api/payments/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: payingListing.id,
          phone: paymentPhone,
          amount: paymentAmount,
          paymentMethod: paymentMethod
        })
      });

      if (res.ok) {
        const data = await res.json();
        triggerToast(`Notificação recebida com sucesso! Transação: ${data.transactionCode}`, 'success');
        setPayingListing(null);
        loadData();
      } else {
        triggerToast('Falha no callback simulado do webhook.', 'error');
      }
    } catch (err) {
      triggerToast('Falha na ligação.', 'error');
    } finally {
      setSimulatingWebhook(false);
    }
  };

  // Enviar aviso automatizado (Billing Alert) de expiração ao usuário
  const sendBillingAlert = async (listingId: string) => {
    try {
      const res = await fetch('/api/payments/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId })
      });

      if (res.ok) {
        triggerToast('Alerta de vencimento enviado com sucesso ao e-mail correspondente!', 'success');
        loadData();
      } else {
        triggerToast('Erro ao processar notificação de cobrança.', 'error');
      }
    } catch (err) {
      triggerToast('Erro de rede.', 'error');
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' })
      .format(val)
      .replace('MZN', 'MT');
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white flex flex-col selection:bg-gold-500 selection:text-black">
      
      {/* Dynamic Toast Notifications */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-55 max-w-sm rounded-xs border p-4 shadow-xl translate-x-0 transition-transform duration-300 bg-zinc-950 border-zinc-800">
          <div className="flex items-start space-x-3">
            <span className={`h-2.5 w-2.5 rounded-full mt-1.5 shrink-0 ${
              toastMessage.type === 'success' ? 'bg-[#22C55E] animate-pulse' : toastMessage.type === 'error' ? 'bg-red-500' : 'bg-blue-400'
            }`} />
            <div>
              <p className="font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Aviso de Sistema</p>
              <p className="font-sans text-xs text-zinc-200 mt-1 leading-relaxed">{toastMessage.text}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Corporate Title Bar Header Component */}
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSearchQuery('');
        }} 
        currentUser={currentUser}
        onLogin={() => {}} 
        onLogout={handleLogout}
        onOpenLoginModal={() => {
          setLoginError('');
          setShowLoginModal(true);
        }}
      />

      {/* Hero Header Area styled with editorial BOLD TYPOGRAPHY */}
      <section className="relative overflow-hidden border-b border-zinc-850 bg-radial from-zinc-900 to-dark-bg py-10 px-4 md:py-14 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40" />
        <div className="relative mx-auto max-w-7xl">
          <span className="editorial-section-title">Inovação Tecnológica Moçambicana</span>
          
          <div className="mt-4 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h2 className="editorial-hero-title">
                {activeTab === 'Netek' && <>NETEK<br/>CLASSIFICADOS</>}
                {activeTab === 'KayaMoz' && <>KAYAMOZ<br/>IMOBILIÁRIO</>}
                {activeTab === 'FixMoz' && <>FIXMOZ<br/>SERVIÇOS</>}
                {activeTab === 'CVBuilder' && <>GERADOR IA<br/>CURRÍCULOS & CARTAS</>}
                {activeTab === 'HousePlans' && <>PROJETOS KAYA<br/>PLANTAS DE CASAS</>}
                {activeTab === 'Tutorials' && <>TUTORIAIS JB<br/>BLOGSPOT INTEGRADO</>}
                {activeTab === 'Blog' && <>JONSON JB<br/>BLOG DE STARTUPS</>}
                {activeTab === 'Locations' && <>CONECTIVIDADE<br/>CONTACTOS & MAPAS</>}
                {activeTab === 'Admin' && <>CONSOLA<br/>ADMINISTRATIVA</>}
              </h2>
              <p className="mt-4 max-w-xl text-zinc-400 text-sm leading-relaxed">
                {activeTab === 'Netek' && 'Classificados de tecnologia e produtos em Moçambique. Otimize a sua procura técnica de alta velocidade de Maputo a Pemba.'}
                {activeTab === 'KayaMoz' && 'Simplificando o arrendamento residencial e comercial. Conexão direta com proprietários auditados e faturas rastreáveis.'}
                {activeTab === 'FixMoz' && 'Profissionais de reparações civis certificados, conectando técnicos das províncias a moradores necessitados.'}
                {activeTab === 'CVBuilder' && 'Aproveite a Inteligência Artificial do motor JB Co-pilot integrado para gerar currículos profissionais de alto impacto e cartas de apresentação personalizadas.'}
                {activeTab === 'HousePlans' && 'Consulte o nosso catálogo interativo de plantas arquitetónicas e solicite orçamentos automáticos ou fale diretamente pelo WhatsApp do Jonson JB.'}
                {activeTab === 'Tutorials' && 'Série de tutoriais oficiais extraídos do jonsonjb.blogspot.com com código-fonte para implementar M-Pesa, e-Mola, bots e domínio .CO.MZ.'}
                {activeTab === 'Blog' && 'Reflexões e crónicas sobre Mobile Money, infraestruturas de telecomunicações, integrações de APIs locais e startups em Maputo.'}
                {activeTab === 'Locations' && 'Consulte o diretório de suporte geográfico moçambicano, localizações dos nossos centros regionais e fale diretamente por canais de WhatsApp dedicados.'}
                {activeTab === 'Admin' && 'Controle financeiro, auditoria de transações C2B M-Pesa / e-Mola ao vivo e alertas automáticos de expiração de boletos.'}
              </p>
            </div>

            {/* Platform Metrics Summary Ticker */}
            <div className="grid grid-cols-2 gap-4 rounded-xs border border-zinc-800 bg-zinc-950 p-4 sm:p-5 max-w-md w-full lg:mb-1">
              <div>
                <p className="font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-wider">UPTIME ECOSSISTEMA</p>
                <div className="flex items-baseline space-x-1.5 mt-1">
                  <span className="font-display text-2xl font-black text-white">98.4%</span>
                  <span className="h-2 w-2 rounded-full bg-[#22C55E] animate-pulse" />
                </div>
              </div>
              
              <div>
                <p className="font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-wider">RECEITA PREVISTA</p>
                <p className="font-display text-2xl font-black text-gold-500 mt-1">
                  {metrics ? formatCurrency(metrics.totalRevenueMT) : 'MT 0,00'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Portal View split into editorial structures */}
      <main className="mx-auto flex-1 w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* LISTINGS CLASSIFIEDS SECTOR (Netek, KayaMoz, FixMoz Tabs) */}
        {(activeTab === 'Netek' || activeTab === 'KayaMoz' || activeTab === 'FixMoz') && (
          <div className="space-y-8">
            
            {/* Control Bar Actions: Search Filter & Add action */}
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between bg-zinc-950/80 p-4 border border-zinc-850 rounded-xs">
              
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder={`Pesquisar anúncios em ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs font-mono font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-800 text-white rounded-xs focus:outline-none focus:border-gold-500 placeholder-zinc-550"
                />
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setNewCategory(activeTab);
                    setShowCreateModal(true);
                  }}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xs bg-white text-black font-display text-xs font-black tracking-widest uppercase hover:bg-zinc-200 px-5 py-2.5 transition-all shadow-md cursor-pointer"
                >
                  <Plus className="h-4 w-4 stroke-[3]" />
                  <span>Publicar Anúncio</span>
                </button>
              </div>
            </div>

            {/* Listings Renderer */}
            {filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onPayPremium={openPaymentSimulation}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed border-zinc-800 rounded-xs bg-zinc-950/30">
                <p className="font-mono text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Nenhum Registo Localizado</p>
                <p className="text-sm text-zinc-400">Não existem anúncios ou prestadores criados na categoria {activeTab} para a procura atual.</p>
              </div>
            )}
          </div>
        )}

        {/* BLOG REFLECTIVE TAB (Personal blog of Jonson JB) */}
        {activeTab === 'Blog' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Editorial Articles Feed List (Left Column) */}
            <div className="lg:col-span-2 space-y-8">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <article key={post.id} className="border border-zinc-800 bg-zinc-950 p-6 sm:p-8 rounded-xs relative group hover:border-zinc-700 transition-all">
                    
                    <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-4 font-bold">
                      <span className="text-gold-500 uppercase tracking-widest">{post.category}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString('pt-MZ')} &bull; {post.readTime} LEITURA</span>
                    </div>

                    <h3 className="font-display font-black text-2xl uppercase tracking-tight text-white mb-4 group-hover:text-gold-400 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-zinc-400 text-xs mb-6 leading-relaxed font-mono uppercase tracking-wider">{post.summary}</p>
                    
                    <div className="prose prose-invert max-w-none text-zinc-300 text-sm whitespace-pre-line leading-relaxed border-t border-zinc-900 pt-5 font-sans">
                      {post.content}
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-zinc-900 pt-4 font-mono text-[10px] text-zinc-500 font-bold uppercase">
                      <span>Autor: <strong className="text-white font-mono">{post.author}</strong></span>
                      {currentUser?.role === 'admin' && (
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="text-red-550 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          Eliminar Artigo
                        </button>
                      )}
                    </div>
                  </article>
                ))
              ) : (
                <div className="text-center py-12 border border-dashed border-zinc-800 rounded-none">
                  <p className="font-mono text-zinc-500 uppercase tracking-wider">A carregar editoriais...</p>
                </div>
              )}
            </div>

            {/* Sidebar with Platform optimization and static UI items matching theme */}
            <div className="space-y-6">
              <div className="border border-zinc-800 bg-zinc-950 p-5 rounded-xs">
                <h3 className="font-display font-bold text-xs uppercase tracking-widest text-gold-500 mb-4 border-b border-zinc-900 pb-2">CONCEITO DO BLOG</h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans mb-3">
                  Este blog pessoal foi desenvolvido por **Jonson JB** para refletir sobre a digitalização estrutural de Moçambique.
                </p>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  Abordamos a convergência das finanças móveis, integrações de telecomunicações baseadas em REST/USSD, e como pequenas plataformas podem ser monetizadas de forma segura e descentralizada.
                </p>
              </div>

              {/* Jonson's Writing Copilot AI Input (Only visible for Admin, but visible as preview for transparency) */}
              <div className="border border-zinc-800 bg-zinc-950 p-5 rounded-xs">
                <div className="flex items-center space-x-2 text-gold-500 mb-3">
                  <Sparkles className="h-4.5 w-4.5" />
                  <h3 className="font-display font-bold text-xs uppercase tracking-widest leading-none">JB AI COPILOT</h3>
                </div>
                
                <p className="text-2.5 font-mono uppercase tracking-wider text-zinc-500 mb-3">
                  Gere esboços sobre mobile-payment moçambicano via Gemini 3.5 Flash no servidor:
                </p>

                <textarea
                  placeholder="Ex: Como lidar com falhas de rede no webhook M-Pesa..."
                  value={blogPrompt}
                  onChange={(e) => setBlogPrompt(e.target.value)}
                  disabled={currentUser?.role !== 'admin'}
                  className="w-full p-2.5 text-xs font-mono bg-zinc-900 border border-zinc-800 text-white rounded-xs focus:outline-none focus:border-gold-500 placeholder-zinc-600 mb-3 h-24"
                />

                {currentUser?.role === 'admin' ? (
                  <button
                    onClick={generateBlogOutline}
                    disabled={blogAiLoading}
                    className="w-full flex items-center justify-center space-x-2 rounded-xs bg-gold-500 hover:bg-gold-650 text-black font-display text-[10px] font-black tracking-widest uppercase py-2 shadow-inner cursor-pointer"
                  >
                    <span>{blogAiLoading ? 'A PROCESSAR...' : 'ELABORAR ARTIGO'}</span>
                  </button>
                ) : (
                  <div className="rounded-xs bg-zinc-900/50 p-3 border border-zinc-900 text-[10px] font-sans text-zinc-500">
                    Acesso exclusivo ao administrador para rascunhos. Efetue login como Admin para interagir.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CV AND COVER LETTER GENERATION BUILDER */}
        {activeTab === 'CVBuilder' && (
          <ResumeBuilder 
            onNotify={(txt, type) => triggerToast(txt, type)} 
            currentUserPhone={currentUser?.phone || ''} 
          />
        )}

        {/* HOUSE PLANS & ESTIMATED COST PORTAL */}
        {activeTab === 'HousePlans' && (
          <HousePlans 
            onNotify={(txt, type) => triggerToast(txt, type)} 
            currentUserPhone={currentUser?.phone || ''}
            currentUserName={currentUser?.name || ''}
            plans={housePlans}
          />
        )}

        {/* JB BLOGSPOT INTEGRATED TUTORIALS */}
        {activeTab === 'Tutorials' && (
          <JbTutorials 
            onNotify={(txt, type) => triggerToast(txt, type)} 
            tutorials={tutorials}
          />
        )}

        {/* INTERACTIVE GEOGRAPHICAL COMMUNICATIONS DIRECTORY */}
        {activeTab === 'Locations' && (
          <ContactLocation 
            onNotify={(txt, type) => triggerToast(txt, type)} 
          />
        )}

        {/* COMPREHENSIVE ADMINISTRATIVE DASHBOARD (Password protected panel) */}
        {activeTab === 'Admin' && (
          <div>
            {currentUser?.role !== 'admin' ? (
              <div className="max-w-md mx-auto my-12 border border-zinc-800 bg-zinc-950 p-8 rounded-xs text-center">
                <Fingerprint className="h-12 w-12 text-gold-500 mx-auto mb-4" />
                <h3 className="font-display font-black text-lg uppercase tracking-tight text-white mb-2">ACESSO RESTRITO</h3>
                <p className="text-zinc-400 text-xs mb-6 font-mono uppercase tracking-wider">CONSOLA ADMINISTRAÇÃO PRIVADA</p>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-6">
                  Esta zona do ecossistema requer login credenciado para monitoramento de métricas financeiras de Moçambique, auditoria e publicação.
                </p>
                <button
                  onClick={() => {
                    setLoginEmail('admin@jonsonjb.com');
                    setLoginPassword('25021995Jb@');
                    setShowLoginModal(true);
                  }}
                  className="w-full rounded-xs bg-gold-500 hover:bg-gold-600 text-black font-display text-xs font-black tracking-widest uppercase py-3 transition-colors cursor-pointer"
                >
                  Autenticar como Admin
                </button>
              </div>
            ) : (
              // ADMIN CONTROL CENTER SUITE
              <div className="space-y-6">
                
                {/* 1. Metric Indicators Widgets */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="border border-zinc-850 bg-zinc-950 p-4 rounded-xs">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Soma Total Receita</p>
                      <DollarSign className="h-4 w-4 text-gold-500" />
                    </div>
                    <p className="font-display text-xl font-black text-white">
                      {metrics ? formatCurrency(metrics.totalRevenueMT) : 'MT 0,00'}
                    </p>
                    <span className="text-[9px] font-mono text-[#22C55E] block mt-0.5 uppercase">100% Unificado</span>
                  </div>

                  <div className="border border-zinc-850 bg-zinc-950 p-4 rounded-xs">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Anúncios / Assinantes</p>
                      <Layers className="h-4 w-4 text-emerald-500" />
                    </div>
                    <p className="font-display text-xl font-black text-white">
                      {listings.length} Ativos / {metrics ? metrics.activeSubscribers : '0'} PRO
                    </p>
                    <span className="text-[9px] font-mono text-zinc-500 block mt-0.5 uppercase">Netek / Kaya / Fix</span>
                  </div>

                  <div className="border border-zinc-850 bg-zinc-950 p-4 rounded-xs">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Projetos de Casas</p>
                      <Compass className="h-4 w-4 text-amber-500" />
                    </div>
                    <p className="font-display text-xl font-black text-white">
                      {housePlans.length} Modelos Disponíveis
                    </p>
                    <span className="text-[9px] font-mono text-zinc-500 block mt-0.5 uppercase">Orçamentos no WhatsApp</span>
                  </div>

                  <div className="border border-zinc-850 bg-zinc-950 p-4 rounded-xs">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Utilizadores Registados</p>
                      <Users className="h-4 w-4 text-sky-500" />
                    </div>
                    <p className="font-display text-xl font-black text-white">
                      {usersList.length || 2} Credenciados
                    </p>
                    <span className="text-[9px] font-mono text-zinc-500 block mt-0.5 uppercase">Painel de Contas</span>
                  </div>
                </div>

                {/* Subtab Navigation Row */}
                <div className="border-b border-zinc-800 flex flex-wrap gap-1 bg-zinc-950 p-1 rounded-xs">
                  {[
                    { id: 'listings', label: 'Anúncios', icon: Layers },
                    { id: 'blog', label: 'Startups Blog', icon: FileText },
                    { id: 'plans', label: 'Modelos de Casas', icon: Compass },
                    { id: 'tutorials', label: 'Aulas & Tutoriais', icon: BookOpen },
                    { id: 'users', label: 'Utilizadores', icon: Users },
                    { id: 'ledger', label: 'Relatório & Logs', icon: Database }
                  ].map((sub) => {
                    const IconComp = sub.icon;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => {
                          setAdminActiveSubTab(sub.id as any);
                          // Reset individual editings
                          setEditingListing(null);
                          setEditingBlogPost(null);
                          setEditingHousePlan(null);
                          setEditingTutorial(null);
                          setEditingUser(null);
                        }}
                        className={`flex items-center space-x-1.5 px-3 py-2 rounded-xs font-display text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          adminActiveSubTab === sub.id 
                            ? 'bg-gold-500 text-black font-extrabold' 
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                        }`}
                      >
                        <IconComp className="h-3 w-3" />
                        <span>{sub.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* ------------ 1. SUBTAB: LISTINGS ------------ */}
                {adminActiveSubTab === 'listings' && (
                  <div className="space-y-6">
                    <div className="border border-zinc-850 bg-zinc-950 p-5 rounded-xs">
                      <h3 className="font-display font-bold text-xs uppercase tracking-widest text-zinc-100 mb-4 pb-2 border-b border-zinc-900">
                        GERENCIAR ANÚNCIOS DO PORTAL (NETEK / KAYAMOZ / FIXMOZ)
                      </h3>

                      {editingListing ? (
                        <div className="bg-zinc-900 p-4 border border-zinc-800 rounded-xs space-y-4 mb-4">
                          <h4 className="font-display font-bold text-xs text-gold-500 uppercase tracking-widest">EDITAR DETALHES DO ANÚNCIO</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Título</label>
                              <input
                                type="text"
                                className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-white"
                                value={editingListing.title}
                                onChange={(e) => setEditingListing({ ...editingListing, title: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Preço (MT)</label>
                              <input
                                type="number"
                                className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-white text-gold-500"
                                value={editingListing.price}
                                onChange={(e) => setEditingListing({ ...editingListing, price: Number(e.target.value) })}
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Status</label>
                              <select
                                className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-zinc-300"
                                value={editingListing.status}
                                onChange={(e) => setEditingListing({ ...editingListing, status: e.target.value as any })}
                              >
                                <option value="Ativo">Ativo</option>
                                <option value="Pendente">Pendente</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Localização</label>
                              <input
                                type="text"
                                className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-white"
                                value={editingListing.location}
                                onChange={(e) => setEditingListing({ ...editingListing, location: e.target.value })}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Descrição Completa</label>
                            <textarea
                              className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-white h-20"
                              value={editingListing.description}
                              onChange={(e) => setEditingListing({ ...editingListing, description: e.target.value })}
                            />
                          </div>
                          <div className="flex justify-end space-x-2 pt-2 border-t border-zinc-950">
                            <button
                              onClick={() => setEditingListing(null)}
                              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-[10px] uppercase font-bold"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => handleUpdateListing(editingListing.id, editingListing)}
                              className="px-4 py-1.5 bg-gold-500 hover:bg-gold-600 text-black font-display text-[10px] uppercase font-black"
                            >
                              Guardar
                            </button>
                          </div>
                        </div>
                      ) : null}

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {listings.map((l) => (
                          <div key={l.id} className="p-3 border border-zinc-850 bg-zinc-900/50 rounded-xs flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-center">
                                <span className="font-mono text-[9px] uppercase font-bold bg-zinc-800 text-zinc-300 px-1.5 py-0.5">{l.category}</span>
                                <span className={`font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 ${l.status === 'Ativo' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'}`}>{l.status}</span>
                              </div>
                              <h4 className="font-display text-xs font-bold uppercase tracking-tight text-white mt-2 line-clamp-1">{l.title}</h4>
                              <p className="font-mono text-[10px] mt-1 text-gold-500 font-semibold">{formatCurrency(l.price)}</p>
                              <p className="text-zinc-500 text-[9px] font-mono mt-0.5">{l.location}</p>
                            </div>
                            <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-850">
                              <button
                                onClick={() => setEditingListing(l)}
                                className="flex items-center space-x-1.5 p-1 px-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[9px] font-bold uppercase"
                              >
                                <Edit className="h-2.5 w-2.5" />
                                <span>Editar</span>
                              </button>
                              <button
                                onClick={() => handleDeleteListing(l.id)}
                                className="flex items-center space-x-1.5 p-1 px-2.5 bg-red-950/40 hover:bg-red-950/80 border border-red-900/50 text-red-400 text-[9px] font-bold uppercase"
                              >
                                <Trash2 className="h-2.5 w-2.5" />
                                <span>Apagar</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ------------ 2. SUBTAB: BLOG & EDITORIAL CONTINUITY ------------ */}
                {adminActiveSubTab === 'blog' && (
                  <div className="space-y-6">
                    <div className="border border-zinc-850 bg-zinc-950 p-5 rounded-xs">
                      <div className="flex justify-between items-center mb-4 pb-2 border-b border-zinc-900">
                        <h3 className="font-display font-bold text-xs uppercase tracking-widest text-zinc-100">
                          CONTEÚDO EDITORIAL DO BLOGGER (JONSONJB.BLOGSPOT.COM)
                        </h3>
                      </div>

                      {editingBlogPost ? (
                        <div className="bg-zinc-900 p-4 border border-zinc-800 rounded-xs space-y-4 mb-4">
                          <h4 className="font-display font-bold text-xs text-gold-500 uppercase tracking-widest">EDITAR ARTIGO EXISTENTE</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Título</label>
                              <input
                                type="text"
                                className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-white"
                                value={editingBlogPost.title}
                                onChange={(e) => setEditingBlogPost({ ...editingBlogPost, title: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Categoria de Publicação</label>
                              <input
                                type="text"
                                className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-white"
                                value={editingBlogPost.category}
                                onChange={(e) => setEditingBlogPost({ ...editingBlogPost, category: e.target.value })}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Resumo Otimizado SEO</label>
                            <input
                              type="text"
                              className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-white"
                              value={editingBlogPost.summary}
                              onChange={(e) => setEditingBlogPost({ ...editingBlogPost, summary: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Conteúdo (Suporta Markdown)</label>
                            <textarea
                              className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-white h-24 font-sans"
                              value={editingBlogPost.content}
                              onChange={(e) => setEditingBlogPost({ ...editingBlogPost, content: e.target.value })}
                            />
                          </div>
                          <div className="flex justify-end space-x-2 pt-2 border-t border-zinc-950">
                            <button
                              onClick={() => setEditingBlogPost(null)}
                              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-[10px] uppercase font-bold"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => handleUpdateBlogPost(editingBlogPost.id, editingBlogPost)}
                              className="px-4 py-1.5 bg-gold-500 hover:bg-gold-600 text-black font-display text-[10px] uppercase font-black"
                            >
                              Guardar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-zinc-900/30 p-4 border border-zinc-900 rounded-xs space-y-4 mb-6">
                          <h4 className="font-display font-bold text-xs text-zinc-300 uppercase tracking-widest">PUBLICAR NOVO EDITORIAL LOCAL / BLOGSPOT INTEGRADO</h4>
                          <form onSubmit={handleCreateBlogPost} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[9px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Título</label>
                                <input
                                  type="text"
                                  placeholder="Novidades Tecnológicas em Moçambique"
                                  className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-white focus:outline-none"
                                  value={blogTitle}
                                  onChange={(e) => setBlogTitle(e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Categoria</label>
                                <input
                                  type="text"
                                  placeholder="Empreendedorismo"
                                  className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-white focus:outline-none"
                                  value={blogCategory}
                                  onChange={(e) => setBlogCategory(e.target.value)}
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Resumo Otimizado</label>
                              <input
                                type="text"
                                placeholder="Uma breve sinopse de 1 frase para reter atenção."
                                className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-white focus:outline-none"
                                value={blogSummary}
                                onChange={(e) => setBlogSummary(e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Texto Principal</label>
                              <textarea
                                placeholder="O seu conhecimento transcrito..."
                                className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-white focus:outline-none h-16 font-sans"
                                value={blogContent}
                                onChange={(e) => setBlogContent(e.target.value)}
                              />
                            </div>
                            <button
                              type="submit"
                              className="w-full rounded-xs bg-gold-500 hover:bg-gold-600 text-black font-display text-[10px] font-black tracking-widest uppercase py-2 cursor-pointer transition-all"
                            >
                              Disparar Novo Post do Blog
                            </button>
                          </form>
                        </div>
                      )}

                      <div className="space-y-3">
                        <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider">Histórico de Artigos de Opinião</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {posts.map((p) => (
                            <div key={p.id} className="p-3 border border-zinc-850 bg-zinc-900/20 rounded-xs flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="font-mono text-[9px] uppercase font-bold text-gold-500">{p.category}</span>
                                  <span className="font-mono text-[9px] text-zinc-500">{p.readTime}</span>
                                </div>
                                <h4 className="font-display text-xs font-bold uppercase tracking-tight text-white line-clamp-1">{p.title}</h4>
                                <p className="text-zinc-400 text-[10px] line-clamp-2 mt-1">{p.summary}</p>
                              </div>
                              <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-zinc-900">
                                <button
                                  onClick={() => setEditingBlogPost(p)}
                                  className="flex items-center space-x-1 p-1 px-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[9px] font-bold uppercase"
                                >
                                  <Edit className="h-2.5 w-2.5" />
                                  <span>Editar</span>
                                </button>
                                <button
                                  onClick={() => handleDeletePost(p.id)}
                                  className="flex items-center space-x-1 p-1 px-2.5 bg-red-950/40 hover:bg-red-950/80 text-red-400 text-[9px] font-bold uppercase"
                                >
                                  <Trash2 className="h-2.5 w-2.5" />
                                  <span>Remover</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ------------ 3. SUBTAB: HOUSE PLANS & ARCHITECTURE ------------ */}
                {adminActiveSubTab === 'plans' && (
                  <div className="space-y-6">
                    <div className="border border-zinc-850 bg-zinc-950 p-5 rounded-xs">
                      <div className="flex justify-between items-center mb-4 pb-2 border-b border-zinc-900">
                        <h3 className="font-display font-bold text-xs uppercase tracking-widest text-zinc-100">
                          EDITAR & REGISTAR MODELOS DE PLANTAS DE CASAS (COBRANÇAS DE ORÇAMENTO)
                        </h3>
                        <button
                          onClick={() => setShowAddPlanForm(!showAddPlanForm)}
                          className="flex items-center space-x-1.5 p-1 px-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-gold-500 text-[10px] uppercase font-bold"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>{showAddPlanForm ? 'Ver Lista' : 'Adicionar Planta'}</span>
                        </button>
                      </div>

                      {editingHousePlan ? (
                        <div className="bg-zinc-900 p-4 border border-zinc-800 rounded-xs space-y-4 mb-4">
                          <h4 className="font-display font-bold text-xs text-gold-500 uppercase tracking-widest">EDITAR PLANTA: {editingHousePlan.title}</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Título da Planta</label>
                              <input
                                type="text"
                                className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-white"
                                value={editingHousePlan.title}
                                onChange={(e) => setEditingHousePlan({ ...editingHousePlan, title: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Preço Construção (MT)</label>
                              <input
                                type="number"
                                className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-white"
                                value={editingHousePlan.estimatedCostMT}
                                onChange={(e) => setEditingHousePlan({ ...editingHousePlan, estimatedCostMT: Number(e.target.value) })}
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Área Quadrada (M²)</label>
                              <input
                                type="number"
                                className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-white"
                                value={editingHousePlan.squareMeters}
                                onChange={(e) => setEditingHousePlan({ ...editingHousePlan, squareMeters: Number(e.target.value) })}
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Quartos (T)</label>
                              <input
                                type="number"
                                className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-white"
                                value={editingHousePlan.bedrooms}
                                onChange={(e) => setEditingHousePlan({ ...editingHousePlan, bedrooms: Number(e.target.value) })}
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Casas de Banho</label>
                              <input
                                type="number"
                                className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-white"
                                value={editingHousePlan.bathrooms}
                                onChange={(e) => setEditingHousePlan({ ...editingHousePlan, bathrooms: Number(e.target.value) })}
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Estilo de Design</label>
                              <input
                                type="text"
                                className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-white"
                                value={editingHousePlan.style}
                                onChange={(e) => setEditingHousePlan({ ...editingHousePlan, style: e.target.value })}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-1">Descrição</label>
                            <textarea
                              className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-white h-12"
                              value={editingHousePlan.description}
                              onChange={(e) => setEditingHousePlan({ ...editingHousePlan, description: e.target.value })}
                            />
                          </div>
                          <div className="flex justify-end space-x-2 pt-2 border-t border-zinc-950">
                            <button
                              onClick={() => setEditingHousePlan(null)}
                              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-[10px] uppercase font-bold"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => handleUpdateHousePlan(editingHousePlan.id, editingHousePlan)}
                              className="px-4 py-1.5 bg-gold-500 hover:bg-gold-600 text-black font-display text-[10px] uppercase font-black"
                            >
                              Confirmar Mudanças
                            </button>
                          </div>
                        </div>
                      ) : null}

                      {showAddPlanForm ? (
                        <form onSubmit={handleCreateHousePlan} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xs space-y-4 mb-4">
                          <h4 className="font-display font-bold text-xs text-gold-500 uppercase tracking-widest">ADICIONAR NOVA PLANTA DE CONSTRUÇÃO</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider">Título da Moradia</label>
                              <input
                                type="text"
                                className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-white mt-1"
                                placeholder="Vivenda T4 Jb Deluxe"
                                value={newPlanFields.title}
                                onChange={(e) => setNewPlanFields({ ...newPlanFields, title: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider">Custo de Construção Estimado (MT)</label>
                              <input
                                type="number"
                                className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-white mt-1"
                                placeholder="2400000"
                                value={newPlanFields.estimatedCostMT}
                                onChange={(e) => setNewPlanFields({ ...newPlanFields, estimatedCostMT: Number(e.target.value) })}
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider">Área em Metros Quadrados</label>
                              <input
                                type="number"
                                className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-white mt-1"
                                placeholder="180"
                                value={newPlanFields.squareMeters}
                                onChange={(e) => setNewPlanFields({ ...newPlanFields, squareMeters: Number(e.target.value) })}
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider">Quartos</label>
                              <input
                                type="number"
                                className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-white mt-1"
                                value={newPlanFields.bedrooms}
                                onChange={(e) => setNewPlanFields({ ...newPlanFields, bedrooms: Number(e.target.value) })}
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider">Banheiros</label>
                              <input
                                type="number"
                                className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-white mt-1"
                                value={newPlanFields.bathrooms}
                                onChange={(e) => setNewPlanFields({ ...newPlanFields, bathrooms: Number(e.target.value) })}
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider">Estilo Arquitetónico</label>
                              <input
                                type="text"
                                className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-white mt-1"
                                placeholder="Design Tropical"
                                value={newPlanFields.style}
                                onChange={(e) => setNewPlanFields({ ...newPlanFields, style: e.target.value })}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider">Destaques / Recursos (Separados por vírgula)</label>
                            <input
                              type="text"
                              className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-white mt-1"
                              placeholder="Anexo Suite, Garagem para 2 viaturas, Open Space"
                              value={newPlanFields.features}
                              onChange={(e) => setNewPlanFields({ ...newPlanFields, features: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider">Descrição detalhada</label>
                            <textarea
                              className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-white mt-1 h-12"
                              value={newPlanFields.description}
                              onChange={(e) => setNewPlanFields({ ...newPlanFields, description: e.target.value })}
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full rounded-xs bg-gold-500 hover:bg-gold-600 text-black py-2.5 font-display text-[10px] font-black uppercase tracking-wider cursor-pointer"
                          >
                            Salvar Planta de Arquitetura
                          </button>
                        </form>
                      ) : null}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {housePlans.map((plan) => (
                          <div key={plan.id} className="p-3 border border-zinc-850 bg-zinc-900/40 rounded-xs flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start">
                                <h4 className="font-display text-xs font-bold uppercase text-white tracking-tight">{plan.title}</h4>
                                <span className="font-mono text-[9px] text-zinc-500 uppercase">{plan.style} &bull; {plan.squareMeters}m²</span>
                              </div>
                              <p className="font-mono text-gold-500 text-[10px] mt-1 font-bold">Custo Estimado: {formatCurrency(plan.estimatedCostMT)}</p>
                              <p className="text-zinc-400 text-[10px] font-sans mt-1 line-clamp-2">{plan.description}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {plan.features.slice(0, 3).map((f, i) => (
                                  <span key={i} className="text-[8px] font-mono bg-zinc-850 text-zinc-350 px-1 py-0.5">&bull; {f}</span>
                                ))}
                              </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-zinc-900">
                              <button
                                onClick={() => setEditingHousePlan(plan)}
                                className="flex items-center space-x-1 p-1 px-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[9px] font-bold uppercase"
                              >
                                <Edit className="h-2.5 w-2.5" />
                                <span>Modificar</span>
                              </button>
                              <button
                                onClick={() => handleDeleteHousePlan(plan.id)}
                                className="flex items-center space-x-1 p-1 px-2.5 bg-red-950/40 hover:bg-red-950/80 text-red-400 text-[9px] font-bold uppercase"
                              >
                                <Trash2 className="h-2.5 w-2.5" />
                                <span>Eliminar</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ------------ 4. SUBTAB: CODING TUTORIALS ------------ */}
                {adminActiveSubTab === 'tutorials' && (
                  <div className="space-y-6">
                    <div className="border border-zinc-850 bg-zinc-950 p-5 rounded-xs">
                      <div className="flex justify-between items-center mb-4 pb-2 border-b border-zinc-900">
                        <h3 className="font-display font-bold text-xs uppercase tracking-widest text-zinc-100">
                          CONECTAR & EDITAR TUTORIAIS AVANÇADOS JONSON JB CODER
                        </h3>
                        <button
                          onClick={() => setShowAddTutorialForm(!showAddTutorialForm)}
                          className="flex items-center space-x-1 px-3 py-1 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-gold-500 text-[10px] font-mono uppercase"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>{showAddTutorialForm ? 'Ocultar Novo' : 'Novo Tutorial'}</span>
                        </button>
                      </div>

                      {editingTutorial ? (
                        <div className="bg-zinc-900 p-4 border border-zinc-800 rounded-xs space-y-4 mb-4">
                          <h4 className="font-display font-bold text-xs text-gold-500 uppercase tracking-widest">EDITAR REGISTO DE TUTORIAL</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider">Título da Aula</label>
                              <input
                                type="text"
                                className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-white"
                                value={editingTutorial.title}
                                onChange={(e) => setEditingTutorial({ ...editingTutorial, title: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider">Categoria</label>
                              <select
                                className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-zinc-350"
                                value={editingTutorial.category}
                                onChange={(e) => setEditingTutorial({ ...editingTutorial, category: e.target.value as any })}
                              >
                                <option value="Mobile Money">Mobile Money</option>
                                <option value="SEO & Blog">SEO & Blog</option>
                                <option value="Domains & Web">Domains & Web</option>
                                <option value="WhatsApp Bots">WhatsApp Bots</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider">Sumário Rápido</label>
                            <input
                              type="text"
                              className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-white"
                              value={editingTutorial.summary}
                              onChange={(e) => setEditingTutorial({ ...editingTutorial, summary: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider">URL do Post Original (Blogger)</label>
                            <input
                              type="text"
                              className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-white"
                              value={editingTutorial.originalUrl}
                              onChange={(e) => setEditingTutorial({ ...editingTutorial, originalUrl: e.target.value })}
                            />
                          </div>
                          <div className="flex justify-end space-x-2 pt-2 border-t border-zinc-950">
                            <button
                              onClick={() => setEditingTutorial(null)}
                              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-[10px] uppercase font-bold"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => handleUpdateTutorial(editingTutorial.id, editingTutorial)}
                              className="px-4 py-1.5 bg-gold-500 hover:bg-gold-600 text-black font-display text-[10px] uppercase font-black"
                            >
                              Aplicar Edição
                            </button>
                          </div>
                        </div>
                      ) : null}

                      {showAddTutorialForm ? (
                        <form onSubmit={handleCreateTutorial} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xs space-y-4 mb-4">
                          <h4 className="font-display font-bold text-xs text-gold-500 uppercase tracking-widest">ADICIONAR TUTORIAL AO REPOSITÓRIO</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider">Título do Tutorial</label>
                              <input
                                type="text"
                                className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-white mt-1"
                                placeholder="Criar faturas com webhooks em NodeJS"
                                value={newTutorialFields.title}
                                onChange={(e) => setNewTutorialFields({ ...newTutorialFields, title: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider">Categoria Tecnológica</label>
                              <select
                                className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-zinc-300 mt-1"
                                value={newTutorialFields.category}
                                onChange={(e) => setNewTutorialFields({ ...newTutorialFields, category: e.target.value as any })}
                              >
                                <option value="Mobile Money">Mobile Money</option>
                                <option value="SEO & Blog">SEO & Blog</option>
                                <option value="Domains & Web">Domains & Web</option>
                                <option value="WhatsApp Bots">WhatsApp Bots</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider">Sumário</label>
                            <input
                              type="text"
                              className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-white mt-1"
                              placeholder="Foco em chaves de segurança e verificação de assinante M-Pesa"
                              value={newTutorialFields.summary}
                              onChange={(e) => setNewTutorialFields({ ...newTutorialFields, summary: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider">Link Completo no Blogger</label>
                            <input
                              type="text"
                              className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-white mt-1"
                              placeholder="http://jonsonjb.blogspot.com/2026/05/codando.html"
                              value={newTutorialFields.originalUrl}
                              onChange={(e) => setNewTutorialFields({ ...newTutorialFields, originalUrl: e.target.value })}
                            />
                          </div>
                          <div className="border border-zinc-800 p-3 bg-zinc-950 rounded-xs space-y-2">
                            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block">Incluir Passo Inicial Inicializável</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <input
                                type="text"
                                placeholder="Passo 1: Nome da Ação"
                                className="bg-zinc-900 border border-zinc-850 p-2 text-xs text-zinc-300"
                                value={newTutorialFields.stepTitle}
                                onChange={(e) => setNewTutorialFields({ ...newTutorialFields, stepTitle: e.target.value })}
                              />
                              <input
                                type="text"
                                placeholder="Descrição do código..."
                                className="bg-zinc-900 border border-zinc-850 p-2 text-xs text-zinc-300"
                                value={newTutorialFields.stepContent}
                                onChange={(e) => setNewTutorialFields({ ...newTutorialFields, stepContent: e.target.value })}
                              />
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="w-full rounded-xs bg-gold-500 hover:bg-gold-600 text-black py-2.5 font-display text-[10px] font-black uppercase tracking-wider cursor-pointer"
                          >
                            Publicar Tutorial no Sistema
                          </button>
                        </form>
                      ) : null}

                      <div className="space-y-2">
                        {tutorials.map((tut) => (
                          <div key={tut.id} className="p-3 border border-zinc-850 bg-zinc-900/30 rounded-xs flex items-center justify-between">
                            <div>
                              <span className="font-mono text-[9px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded-sm uppercase tracking-widest">{tut.category}</span>
                              <h4 className="font-display text-xs font-bold uppercase mt-1 text-white tracking-tight">{tut.title}</h4>
                              <p className="text-[10px] text-zinc-500 font-mono italic max-w-[500px] truncate">{tut.summary}</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingTutorial(tut)}
                                className="p-1 px-2.5 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 text-[9px] uppercase font-mono font-bold"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleDeleteTutorial(tut.id)}
                                className="p-1 px-2.5 bg-red-950/30 hover:bg-red-900 text-red-400 text-[9px] uppercase font-mono font-bold"
                              >
                                Apagar
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ------------ 5. SUBTAB: USERS WORKSPACE  ------------ */}
                {adminActiveSubTab === 'users' && (
                  <div className="space-y-6">
                    <div className="border border-zinc-850 bg-zinc-950 p-5 rounded-xs">
                      <div className="flex justify-between items-center mb-4 pb-2 border-b border-zinc-900">
                        <h3 className="font-display font-bold text-xs uppercase tracking-widest text-zinc-100">
                          GERIR CONTAS REAIS & PERMISSÕES (ADMIN / USER)
                        </h3>
                        <button
                          onClick={() => setShowAddUserForm(!showAddUserForm)}
                          className="flex items-center space-x-1 px-3 py-1 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-gold-500 text-[10px] uppercase font-bold"
                        >
                          <UserPlus className="h-4 w-4" />
                          <span>{showAddUserForm ? 'Ocultar Registo' : 'Registrar Utilizador'}</span>
                        </button>
                      </div>

                      {editingUser ? (
                        <div className="bg-zinc-900 p-4 border border-zinc-800 rounded-xs space-y-4 mb-4">
                          <h4 className="font-display font-medium text-xs text-gold-500 uppercase">EDITAR PERMISSÕES: {editingUser.email}</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[9px] font-mono text-zinc-400 uppercase mb-1">Nome Completo</label>
                              <input
                                type="text"
                                className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-white"
                                value={editingUser.name}
                                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-zinc-400 uppercase mb-1">Contacto Telefónico</label>
                              <input
                                type="text"
                                className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-white"
                                value={editingUser.phone}
                                onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-zinc-400 uppercase mb-1">Privilégio do Nível</label>
                              <select
                                className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-zinc-350"
                                value={editingUser.role}
                                onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                              >
                                <option value="user">User (Padrão)</option>
                                <option value="admin">Administrador Geral</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-zinc-400 uppercase mb-1">Palavra-passe (Modificar)</label>
                              <input
                                type="text"
                                className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-white"
                                placeholder="Indicar nova senha..."
                                value={editingUser.password || ''}
                                onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2 pt-2 border-t border-zinc-950">
                            <button
                              onClick={() => setEditingUser(null)}
                              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-350 font-mono text-[10px] uppercase font-bold"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => handleUpdateUser(editingUser.email, editingUser)}
                              className="px-4 py-1.5 bg-gold-500 hover:bg-gold-600 text-black font-display text-[10px] uppercase font-black"
                            >
                              Aplicar Edição de Perfil
                            </button>
                          </div>
                        </div>
                      ) : null}

                      {showAddUserForm ? (
                        <form onSubmit={handleCreateUser} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xs space-y-4 mb-4">
                          <h4 className="font-display font-bold text-xs text-gold-500 uppercase tracking-widest">REGISTRAR UTILIZADOR DIRETAMENTE</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[9px] font-mono text-zinc-400 uppercase">Nome Completo</label>
                              <input
                                type="text"
                                className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-white mt-1"
                                placeholder="Eusebio Francisco"
                                value={newUserFields.name}
                                onChange={(e) => setNewUserFields({ ...newUserFields, name: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-zinc-400 uppercase">Endereço de Email (Chave Única)</label>
                              <input
                                type="email"
                                className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-white mt-1"
                                placeholder="eusebio@gmail.com"
                                value={newUserFields.email}
                                onChange={(e) => setNewUserFields({ ...newUserFields, email: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-zinc-400 uppercase">Telemóvel (+258)</label>
                              <input
                                type="text"
                                className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-white mt-1"
                                placeholder="+258 84 999 1111"
                                value={newUserFields.phone}
                                onChange={(e) => setNewUserFields({ ...newUserFields, phone: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-zinc-400 uppercase">Senha Críptica</label>
                              <input
                                type="text"
                                className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-white mt-1"
                                placeholder="senhaforte777"
                                value={newUserFields.password}
                                onChange={(e) => setNewUserFields({ ...newUserFields, password: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono text-zinc-400 uppercase">Tipo do Escalão</label>
                              <select
                                className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs text-zinc-350 mt-1"
                                value={newUserFields.role}
                                onChange={(e) => setNewUserFields({ ...newUserFields, role: e.target.value as any })}
                              >
                                <option value="user">User (Visualizador de Imóvel e Preços)</option>
                                <option value="admin">Administrador Completo</option>
                              </select>
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="w-full rounded-xs bg-gold-500 hover:bg-gold-600 text-black py-2.5 font-display text-[10px] font-black uppercase tracking-wider cursor-pointer"
                          >
                            Efetuar Registo Seguro
                          </button>
                        </form>
                      ) : null}

                      <div className="space-y-2">
                        {usersList.map((user) => (
                          <div key={user.email} className="p-3 border border-zinc-850 bg-zinc-900/30 rounded-xs flex items-center justify-between">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-display text-xs font-bold uppercase text-white">{user.name}</span>
                                <span className={`font-mono text-[8px] uppercase font-black px-1.5 rounded-sm ${user.role === 'admin' ? 'bg-amber-950 text-gold-500 border border-amber-900' : 'bg-zinc-800 text-zinc-400'}`}>
                                  {user.role}
                                </span>
                              </div>
                              <p className="text-[10px] text-zinc-400 font-mono">{user.email} &bull; {user.phone || 'Sem Telefone'}</p>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => setEditingUser(user)}
                                className="p-1 px-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[9px] uppercase font-mono font-bold"
                              >
                                Ajustar
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.email)}
                                className="p-1 px-2.5 bg-red-950/40 hover:bg-red-900/90 text-red-400 border border-red-950 text-[9px] uppercase font-mono font-bold"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ------------ 6. SUBTAB: LEDGER LOGS & AUDITS ------------ */}
                {adminActiveSubTab === 'ledger' && (
                  <div className="space-y-6 animate-fade-in">
                    
                    {/* subscriber renewals section */}
                    <div className="border border-zinc-800 bg-zinc-950 p-5 rounded-xs">
                      <div className="flex items-center space-x-2 pb-2 border-b border-zinc-900 mb-4">
                        <Bell className="h-4.5 w-4.5 text-gold-500" />
                        <h3 className="font-display font-bold text-xs uppercase tracking-widest text-zinc-100">
                          RENOVAÇÕES DE PLANO PREMIUM (TEMPOS DE EXPIRAÇÃO)
                        </h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left font-mono text-[11px] text-zinc-400 border-collapse">
                          <thead>
                            <tr className="border-b border-zinc-850 text-zinc-500 font-bold">
                              <th className="py-2">Proprietário / Titular</th>
                              <th className="py-2">Serviço Classificado</th>
                              <th className="py-2 text-right">Preço Boleto</th>
                              <th className="py-2 text-center">Dias Restantes</th>
                              <th className="py-2 text-center">Status</th>
                              <th className="py-2 text-right">Controles</th>
                            </tr>
                          </thead>
                          <tbody>
                            {metrics && metrics.subscriberExpirations.length > 0 ? (
                              metrics.subscriberExpirations.map((exp, idx) => (
                                <tr key={idx} className="border-b border-zinc-900 hover:bg-zinc-900/30">
                                  <td className="py-2.5 text-white font-sans font-semibold uppercase">{exp.title}</td>
                                  <td className="py-2.5 text-zinc-450">{exp.ownerEmail}</td>
                                  <td className="py-2.5 text-right text-gold-500 font-bold">{formatCurrency(exp.amountDue)}</td>
                                  <td className="py-2.5 text-center">
                                    <span className="bg-zinc-850 text-zinc-350 px-1.5 py-0.5 rounded-sm font-bold">
                                      {exp.daysRemaining} dias
                                    </span>
                                  </td>
                                  <td className="py-2.5 text-center">
                                    <span className={`inline-flex items-center rounded-xs px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                                      exp.status === 'Aviso Enviado' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-amber-500/10 text-amber-500'
                                    }`}>
                                      {exp.status}
                                    </span>
                                  </td>
                                  <td className="py-2.5 text-right">
                                    <button
                                      onClick={() => sendBillingAlert(exp.listingId)}
                                      className="text-[9px] bg-zinc-900 hover:bg-zinc-800 text-white uppercase px-2 py-1 border border-zinc-800 cursor-pointer"
                                    >
                                      Cobrar
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={6} className="text-center py-4 text-zinc-650">Nenhuma data de encerramento monitorada para assinaturas premium.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* database blueprints */}
                    <div className="border border-zinc-800 bg-zinc-950 p-5 rounded-xs">
                      <div className="flex items-center space-x-2 pb-2 border-b border-zinc-900 mb-4">
                        <Database className="h-4.5 w-4.5 text-gold-500" />
                        <h3 className="font-display font-bold text-xs uppercase tracking-widest text-zinc-100">
                          BLUEPRINT BUBBLE.IO / XANO SCHEMA (BANCO DE DADOS INTEGRADO)
                        </h3>
                      </div>
                      <div className="space-y-3 font-mono text-[10px] text-zinc-400">
                        <div className="border-b border-zinc-900 pb-2">
                          <span className="text-gold-500 font-bold block uppercase">Table User:</span>
                          <p className="text-zinc-[500] pl-1">&bull; email (text) &bull; password (text/hash) &bull; name (text) &bull; role (text, admin/user) &bull; phone (text)</p>
                        </div>
                        <div className="border-b border-zinc-900 pb-2">
                          <span className="text-gold-500 font-bold block uppercase">Table Listings:</span>
                          <p className="text-zinc-[500] pl-1">&bull; title (text) &bull; description (text) &bull; price (number) &bull; location (text) &bull; category (text, Netek/KayaMoz/FixMoz) &bull; status (text) &bull; ownerEmail (text) &bull; contactPhone (text)</p>
                        </div>
                        <div className="border-b border-zinc-900 pb-2">
                          <span className="text-gold-500 font-bold block uppercase">Table HousePlans:</span>
                          <p className="text-zinc-[500] pl-1">&bull; title (text) &bull; bedrooms/bathrooms (number) &bull; squareMeters (number) &bull; estimatedCostMT (number) &bull; style (text) &bull; description (text) &bull; features (list of texts)</p>
                        </div>
                        <div>
                          <span className="text-gold-500 font-bold block uppercase">Table Tutorials:</span>
                          <p className="text-zinc-[500] pl-1">&bull; title (text) &bull; summary (text) &bull; category (text) &bull; publishedDate (text) &bull; readTime (text) &bull; steps (list of objects: title, content, code)</p>
                        </div>
                      </div>
                    </div>

                    {/* console live ledger */}
                    <div className="border border-zinc-300 bg-zinc-950 p-5 rounded-xs font-mono">
                      <h3 className="font-display font-bold text-xs uppercase tracking-widest text-white mb-2 pb-1 border-b border-zinc-900">
                        M-PESA / e-MOLA LEDGER AUDIT CODES (LOGS EM TEMPO REAL)
                      </h3>
                      <div className="max-h-40 overflow-y-auto space-y-2 p-3 bg-black rounded-xs border border-zinc-900">
                        <p className="text-[10px] text-zinc-600">[SYSTEM_CONSOLE_READY] Monitorização de chaves de webhooks de mobile wallets moçambicanas ativa.</p>
                        {metrics && metrics.transactions.length > 0 ? (
                          metrics.transactions.map((tx, idx) => (
                            <div key={idx} className="text-[9px] text-zinc-400 border-b border-zinc-950 pb-2">
                              {/* log detail */}
                              <span className="text-emerald-500 font-bold">● CALLBACK SUCCESS</span> - IP operadora validado. <br />
                              <span className="text-zinc-500">Data: {new Date(tx.timestamp).toLocaleString()} | ID transação: {tx.transactionCode} </span> <br />
                              Anúncio: <span className="text-gold-500 font-bold">{tx.listingTitle}</span> foi auto-ativado com receita de {formatCurrency(tx.amount)} via {tx.paymentMethod} do subscritor {tx.phone}.
                            </div>
                          ))
                        ) : (
                          <p className="text-[9px] text-zinc-650">Nenhuma transação registada de momento. Faça simulação de webhook de fatura pendente na tab imobiliário ou classificados para testar os webhooks C2B automáticos.</p>
                        )}
                      </div>
                    </div>

                  </div>
                )}

              </div>
            )}
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-zinc-850 bg-neutral-950 py-8 px-4 text-center font-mono text-[10px] font-bold tracking-widest uppercase text-zinc-500">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
          <p>&copy; 2026 MOZ TECH HUB. DESENVOLVIDO POR JONSON JB.</p>
          <div className="flex gap-4">
            <span>PROVEDORES: VODACOM / TMCEL</span>
            <span>SECURE BIOMETRIC AUTH</span>
          </div>
        </div>
      </footer>

      {/* CO-PILOT CREATE NEW LISTING DIALOG / MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 rounded-xs flex flex-col max-h-[90vh]">
            
            <div className="flex justify-between items-start border-b border-zinc-900 pb-4 mb-4">
              <div>
                <span className="font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Inclusão de Item</span>
                <h3 className="font-display font-black text-xl uppercase tracking-wider text-white mt-1">NOVO ANÚNCIO NO PORTAL</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-zinc-500 hover:text-white font-mono text-xs font-bold uppercase cursor-pointer"
              >
                [ FECHAR ]
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-6">
              
              {/* Gemini 3.5 Copilot Copy Draft generator */}
              <div className="rounded-xs bg-zinc-900 border border-zinc-800 p-4">
                <div className="flex items-center space-x-2 text-gold-500">
                  <Sparkles className="h-4.5 w-4.5 animate-pulse" />
                  <span className="font-display text-xs font-black uppercase tracking-widest leading-none">GEMINI 3.5 FLASH REDAÇÃO IA</span>
                </div>
                <p className="text-[10.5px] font-sans text-zinc-400 mt-2 leading-relaxed">
                  Insira uma ideia resumida abaixo e o Gemini gerará uma descrição completa com contextualização de Moçambique, recomendando bairros e preços em Meticais!
                </p>

                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    placeholder="Ex: T3 na Sommerchield luxo com piscina ou Telemóvel iPhone 15 selado na Polana..."
                    value={suggestPrompt}
                    onChange={(e) => setSuggestPrompt(e.target.value)}
                    className="flex-1 p-2 text-xs font-sans bg-zinc-950 border border-zinc-800 text-white rounded-xs focus:outline-none focus:border-gold-500"
                  />
                  <button
                    type="button"
                    onClick={generateAiDescription}
                    disabled={aiLoading}
                    className="rounded-xs bg-gold-500 hover:bg-gold-650 text-black px-4 py-2 text-xs font-black tracking-widest uppercase transition-colors cursor-pointer"
                  >
                    {aiLoading ? 'EMISSÃO...' : 'GERAR'}
                  </button>
                </div>
              </div>

              {/* General Form fields */}
              <form onSubmit={handleCreateListing} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Título do Anúncio *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Apartamento T2 com mobília moderna"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full p-2.5 text-xs font-mono bg-zinc-900 border border-zinc-800 text-white rounded-xs focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Categoria do Ecossistema *</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full p-2.5 text-xs font-mono bg-zinc-900 border border-zinc-800 text-white rounded-xs focus:outline-none focus:border-gold-500"
                    >
                      <option value="Netek">Netek (Tecnologia & Geral)</option>
                      <option value="KayaMoz">KayaMoz (Imobiliário / Casas)</option>
                      <option value="FixMoz">FixMoz (Prestador de Serviços / Reparações)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Preço em Meticais (MT) *</label>
                    <input
                      type="number"
                      required
                      placeholder="Ex: 125000"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-full p-2.5 text-xs font-mono bg-zinc-900 border border-zinc-800 text-white rounded-xs focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Localização (Moçambique) *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Polana, Maputo"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full p-2.5 text-xs font-mono bg-zinc-900 border border-zinc-800 text-white rounded-xs focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Descrição Detalhada *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Descreva as especificidades do seu produto ou serviço..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full p-2.5 text-xs font-sans bg-zinc-900 border border-zinc-800 text-white rounded-xs focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Contacto Telefónico *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: +258 84 123 4567"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full p-2.5 text-xs font-mono bg-zinc-900 border border-zinc-800 text-white rounded-xs focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Tipo de Subscrição</label>
                    <select
                      value={newTier}
                      onChange={(e) => setNewTier(e.target.value as any)}
                      className="w-full p-2.5 text-xs font-mono bg-zinc-900 border border-zinc-800 text-white rounded-xs focus:outline-none focus:border-gold-500"
                    >
                      <option value="Gratuito">Gratuito (Anúncio Simples)</option>
                      <option value="Mensal">Mensal Premium (Apenas 1.499 MT)</option>
                      <option value="Anual">Anual Premium (Super Destaque, 12.999 MT)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Características adicionais (Separadas por vírgula)</label>
                  <input
                    type="text"
                    placeholder="Ex: Garagem, Segurança 24h, Ar Condicionado"
                    value={newFeatures}
                    onChange={(e) => setNewFeatures(e.target.value)}
                    className="w-full p-2.5 text-xs font-mono bg-zinc-900 border border-zinc-800 text-white rounded-xs focus:outline-none focus:border-gold-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xs bg-white hover:bg-zinc-200 text-black font-display text-xs font-black tracking-widest uppercase py-3 transition-colors cursor-pointer shadow-md"
                >
                  Confirmar e Criar Anúncio
                </button>

              </form>
            </div>
          </div>
        </div>
      )}

      {/* MPESA / E-MOLA CALLBACK WEBHOOK DIALOG SIMULATOR */}
      {payingListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md border border-zinc-800 bg-zinc-950 p-6 sm:p-8 rounded-xs font-mono text-xs">
            
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3 mb-4">
              <span className="font-display font-black tracking-widest text-[#FFFFFF]">PUSH MOBILE MONEY WEBHOOK</span>
              <button
                onClick={() => setPayingListing(null)}
                className="text-zinc-500 hover:text-white"
              >
                [ X ]
              </button>
            </div>

            <div className="mb-4 rounded-xs bg-zinc-900 p-3 border border-zinc-800 flex flex-col gap-1.5 leading-relaxed tracking-wide">
              <p className="text-zinc-500 uppercase text-[9px] font-bold">Anúncio Alvo:</p>
              <p className="text-white font-sans font-bold text-sm uppercase">{payingListing.title}</p>
              
              <div className="flex justify-between mt-2 border-t border-zinc-900 pt-2 text-[10px]">
                <span className="text-zinc-550">PREÇO BOLETA PREMIUM</span>
                <span className="text-gold-500 font-bold">{formatCurrency(paymentAmount)}</span>
              </div>
            </div>

            <div className="space-y-4">
              
              <div>
                <label className="block text-[10px] uppercase text-zinc-500 mb-1 font-bold">Telemóvel Moçambique *</label>
                <input
                  type="text"
                  placeholder="Ex: +258 84 111 2222"
                  value={paymentPhone}
                  onChange={(e) => setPaymentPhone(e.target.value)}
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-800 text-white rounded-xs focus:outline-none focus:border-gold-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-zinc-500 mb-1 font-bold">Canal do Gatway Local</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('M-Pesa')}
                    className={`py-2 text-center font-bold border rounded-xs uppercase tracking-wider cursor-pointer transition-all ${
                      paymentMethod === 'M-Pesa' 
                        ? 'border-red-650 text-red-400 bg-red-950/20' 
                        : 'border-zinc-800 text-zinc-400 bg-zinc-900'
                    }`}
                  >
                    M-Pesa (Vodacom)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('e-Mola')}
                    className={`py-2 text-center font-bold border rounded-xs uppercase tracking-wider cursor-pointer transition-all ${
                      paymentMethod === 'e-Mola' 
                        ? 'border-emerald-600 text-emerald-400 bg-emerald-950/20' 
                        : 'border-zinc-800 text-zinc-400 bg-zinc-900'
                    }`}
                  >
                    e-Mola (Tmcel)
                  </button>
                </div>
              </div>

              <div className="p-3 bg-black rounded-xs text-[10px] text-zinc-500 border border-zinc-900 leading-relaxed">
                <span className="font-bold text-zinc-400 uppercase">Simulação Técnica:</span> Este simulador contorna barreiras reais enviando uma chamada fictícia de C2B diretamente para a nossa API na porta 3000, forçando as modificações de estatuto para &ldquo;Ativo&rdquo; e gerando identificadores de transações oficiais no ledger de auditorias.
              </div>

              <button
                onClick={executePaymentSimulation}
                disabled={simulatingWebhook}
                className="w-full bg-gold-500 hover:bg-gold-650 text-black py-3 rounded-xs font-display text-[10px] font-black tracking-widest uppercase transition-colors cursor-pointer"
              >
                {simulatingWebhook ? 'A ENVIAR WEBHOOK...' : 'EFETUAR TRANSAÇÃO AUTOMÁTICA'}
              </button>

            </div>

          </div>
        </div>
      )}

      {/* LOGIN POPUP MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm border border-zinc-800 bg-zinc-950 p-6 sm:p-8 rounded-xs relative">
            
            <button
              onClick={() => {
                setShowLoginModal(false);
                setShowBiometricScreen(false);
              }}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white font-mono text-xs font-bold"
            >
              [ X ]
            </button>

            {!showBiometricScreen ? (
              // STEP 1: Email Password Form
              <div className="font-mono text-xs">
                <div className="text-center mb-6">
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Portal Único</span>
                  <h3 className="font-display font-black text-xl uppercase tracking-wider text-white mt-1">INICIAR SESSÃO</h3>
                  <p className="text-[10px] text-zinc-400 mt-2 font-sans">Efetue login de perfil ou use as credenciais de teste fornecidas para conferir o ambiente de desenvolvimento.</p>
                </div>

                {loginError && (
                  <div className="mb-4 bg-red-950/50 border border-red-900/60 p-3 text-[11px] text-red-400 leading-normal rounded-xs">
                    {loginError}
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">Email Registado</label>
                    <input
                      type="email"
                      required
                      placeholder="admin@jonsonjb.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full p-2.5 bg-zinc-900 border border-zinc-800 text-white rounded-xs focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">Palavra-passe (Senha)</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full p-2.5 bg-zinc-900 border border-zinc-800 text-white rounded-xs focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div className="rounded-xs bg-zinc-900 border border-zinc-850 p-3 text-[10px] text-zinc-400 leading-relaxed font-sans mt-2">
                    <span className="font-bold text-gold-500 uppercase font-mono block mb-0.5">Credenciais Iniciais Administrador:</span>
                    Login: <strong className="font-mono text-white select-all bg-zinc-950 px-1 py-0.5 rounded-sm">admin@jonsonjb.com</strong> <br />
                    Senha: <strong className="font-mono text-white select-all bg-zinc-950 px-1 py-0.5 rounded-sm">25021995Jb@</strong>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gold-400 hover:bg-gold-500 text-black py-3 rounded-xs font-display font-black tracking-widest uppercase cursor-pointer"
                  >
                    AVANÇAR
                  </button>
                </form>
              </div>
            ) : (
              // STEP 2: PROFESSIONAL BIOMETRIC AUTH SIMULATOR
              <div className="text-center font-mono text-xs py-2">
                <Fingerprint className="h-14 w-14 text-gold-500 mx-auto mb-4 animate-pulse" />
                <h4 className="font-display font-black text-lg text-white uppercase tracking-wider">RECONHECIMENTO BIOMÉTRICO</h4>
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest my-2.5">Solicitado para Admin - Segurança Avançada</p>
                <p className="text-[11px] text-zinc-350 leading-relaxed mb-6 font-sans">
                  O ecossistema unificado exige validação biométrica de segurança para o terminal Jonson JB. Toque ou clique abaixo para ler as impressões digitais criptografadas.
                </p>

                <button
                  onClick={handleBiometricSimulate}
                  disabled={biometricSimulating}
                  className="w-full rounded-xs bg-white text-black hover:bg-zinc-200 font-display text-xs font-black tracking-widest uppercase py-3 shadow-md focus:outline-none transition-all cursor-pointer"
                >
                  {biometricSimulating ? 'A VERIFICAR...' : 'EFETUAR LEITURA DIGITAL'}
                </button>

                <button
                  onClick={() => setShowBiometricScreen(false)}
                  className="text-zinc-550 hover:text-white mt-4 block mx-auto uppercase tracking-wider text-[10px]"
                >
                  Voltar ao Formulário
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
