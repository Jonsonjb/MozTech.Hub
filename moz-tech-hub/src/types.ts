/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ListingCategory = 'Netek' | 'KayaMoz' | 'FixMoz';
export type ListingStatus = 'Pendente' | 'Ativo' | 'Expirado';
export type SubscriptionTier = 'Gratuito' | 'Mensal' | 'Anual';

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: ListingCategory;
  price: number; // In MT (Meticais)
  location: string; // Mozambican major cities (Maputo, Beira, Nampula, Sofala, etc.)
  status: ListingStatus;
  ownerEmail: string;
  contactPhone: string;
  subscriptionTier: SubscriptionTier;
  paymentMethod: 'M-Pesa' | 'e-Mola' | 'Nenhum';
  paymentId?: string;
  createdAt: string;
  views: number;
  // Specific metadata per category
  features?: string[]; // e.g. T3 apartment, plumber certificate, etc.
  imageUrl?: string;
  expiryDate?: string; // Estimated expiry date for automatic billing alerts
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  summary: string;
  author: string;
  category: string;
  createdAt: string;
  readTime: string;
  isDraft: boolean;
  imageUrl?: string;
}

export interface PaymentNotification {
  id: string;
  listingId: string;
  listingTitle: string;
  amount: number;
  phone: string;
  paymentMethod: 'M-Pesa' | 'e-Mola';
  status: 'Pendente' | 'Sucesso' | 'Falhado';
  transactionCode: string;
  timestamp: string;
}

export interface FinancialStats {
  totalRevenueMT: number;
  activeSubscribers: number;
  platformDistribution: {
    Netek: number;
    KayaMoz: number;
    FixMoz: number;
  };
  monthlyRevenueCurve: { month: string; amount: number }[];
  transactions: PaymentNotification[];
  subscriberExpirations: {
    listingId: string;
    ownerEmail: string;
    title: string;
    daysRemaining: number;
    amountDue: number;
    status: 'Aviso Enviado' | 'Pendente';
  }[];
}

export interface UserSession {
  email: string;
  role: 'admin' | 'user';
  name: string;
  phone?: string;
  password?: string;
}

export interface HousePlan {
  id: string;
  title: string;
  bedrooms: number;
  bathrooms: number;
  squareMeters: number;
  floors: number;
  estimatedCostMT: number;
  style: string;
  description: string;
  bluePrintGrid: string[][];
  features: string[];
  imageUrl: string;
}

export interface Tutorial {
  id: string;
  title: string;
  summary: string;
  category: 'Mobile Money' | 'SEO & Blog' | 'Domains & Web' | 'WhatsApp Bots';
  publishedDate: string;
  readTime: string;
  originalUrl: string;
  steps: { title: string; content: string; code?: string; codeLang?: string }[];
}

export interface DocumentRequest {
  id: string;
  documentType: 'BI' | 'NUIT' | 'Passaporte' | 'Carta de Condução' | 'Registo Criminal' | 'Outro';
  otherDocumentName?: string;
  fullName: string;
  contactPhone: string;
  whatsappNumber?: string;
  preferredProvince: string;
  preferredDate: string;
  status: 'Pendente' | 'Processado' | 'Concluido' | 'Cancelado';
  feesChargedMT: number; // For time & megas
  paymentStatus: 'Pendente' | 'Pago';
  paymentMethod: 'M-Pesa' | 'e-Mola' | 'Nenhum';
  createdAt: string;
  userEmail?: string;
  notes?: string;
}

