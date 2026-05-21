/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Listing } from '../types';
import { MapPin, Phone, Eye, Calendar, Award, Zap, Laptop, ArrowUpRight, Hammer } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
  onPayPremium: (listing: Listing) => void;
  onDelete?: (id: string) => void;
  isAdminView?: boolean;
  key?: string;
}

export default function ListingCard({
  listing,
  onPayPremium,
  onDelete,
  isAdminView = false
}: ListingCardProps) {
  const isPremium = listing.subscriptionTier !== 'Gratuito';
  const isPending = listing.status === 'Pendente';

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' })
      .format(val)
      .replace('MZN', 'MT');
  };

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-xs border transition-all duration-300 ${
        isPremium 
          ? 'border-gold-500/40 bg-zinc-950/90 shadow-[0_0_15px_rgba(212,175,55,0.06)]' 
          : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
      }`}
    >
      {/* Category Ribbon / Badge */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-1.5">
        <span className={`inline-flex items-center rounded-xs px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
          listing.category === 'KayaMoz'
            ? 'bg-blue-650 text-white'
            : listing.category === 'FixMoz'
            ? 'bg-emerald-600 text-white'
            : 'bg-indigo-600 text-white'
        }`}>
          {listing.category}
        </span>

        {/* Status Badge */}
        <span className={`inline-flex items-center rounded-xs px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
          listing.status === 'Ativo'
            ? 'bg-emerald-500/10 text-[#22C55E] border border-emerald-500/35'
            : listing.status === 'Pendente'
            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30 animate-pulse'
            : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
        }`}>
          {listing.status}
        </span>
      </div>

      {/* Premium Badge Ribbon */}
      {isPremium && (
        <div className="absolute top-4 right-4 z-10 flex items-center space-x-1 rounded-xs bg-gold-500 px-2.5 py-1 text-[9px] font-black text-black tracking-widest uppercase">
          <Award className="h-3 w-3 fill-amber-950 text-black" />
          <span>PREMIUM {listing.subscriptionTier === 'Anual' ? 'ANUAL' : 'MENSAL'}</span>
        </div>
      )}

      {/* Card Cover Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
        <img
          src={listing.imageUrl || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600"}
          alt={listing.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102 filter brightness-90 group-hover:brightness-100"
        />
        <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
        
        {/* Cost Badge overlay */}
        <div className="absolute bottom-4 left-4 text-white">
          <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-zinc-400">Preço / Base</span>
          <p className="font-display text-2xl font-black tracking-tighter text-white drop-shadow-md">
            {formatCurrency(listing.price)}
          </p>
        </div>
      </div>

      {/* Listing details */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-2.5 flex items-center space-x-1.5 text-zinc-400 font-mono text-xs font-semibold">
          <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0" />
          <span className="uppercase tracking-wider">{listing.location}</span>
        </div>

        <h3 className="mb-2 font-display text-lg font-black leading-tight tracking-tight text-white uppercase line-clamp-2 hover:text-gold-500 transition-colors">
          {listing.title}
        </h3>

        <p className="mb-4 text-xs text-zinc-400 line-clamp-3 leading-relaxed flex-1">
          {listing.description}
        </p>

        {/* Feature Tags list */}
        {listing.features && listing.features.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-1.5">
            {listing.features.map((feat, idx) => (
              <span
                key={idx}
                className="inline-flex items-center rounded-xs bg-zinc-900 px-2.5 py-1 text-[9px] font-bold tracking-wider text-zinc-350 border border-zinc-800"
              >
                {feat}
              </span>
            ))}
          </div>
        )}

        {/* Contacts & engagement indicators */}
        <div className="flex items-center justify-between border-t border-zinc-800 pt-4 font-mono text-xs text-zinc-500">
          <div className="flex items-center space-x-1">
            <Eye className="h-3.5 w-3.5" />
            <span>{listing.views} VISUALIZAÇÕES</span>
          </div>

          <div className="flex items-center space-x-1.5 font-bold text-zinc-300">
            <Phone className="h-3.5 w-3.5 text-[#22C55E]" />
            <span>{listing.contactPhone}</span>
          </div>
        </div>

        {/* Specific Interactive Payment Actions */}
        {isPending && (
          <div className="mt-5 rounded-xs bg-zinc-900 p-4 border border-zinc-800">
            <p className="text-[10px] font-mono text-zinc-400 leading-normal mb-3 uppercase tracking-wider">
              Anúncio premium requer pagamento para mudar o status de <strong className="font-bold text-amber-500">Pendente</strong> para <strong className="font-bold text-[#22C55E]">Ativo</strong>.
            </p>
            <button
              onClick={() => onPayPremium(listing)}
              className="group/btn w-full flex items-center justify-center space-x-2 rounded-xs bg-gold-500 hover:bg-gold-650 text-black font-display text-[10px] font-black tracking-wider uppercase py-2.5 shadow-md cursor-pointer transition-all active:scale-98"
            >
              <Zap className="h-3.5 w-3.5 fill-black text-black" />
              <span>Simular Webhook M-Pesa / e-Mola</span>
            </button>
          </div>
        )}

        {/* Show premium confirmation code if active and billing premium */}
        {!isPending && isPremium && (
          <div className="mt-4 rounded-xs bg-zinc-900 p-2.5 border border-zinc-800 flex items-center justify-between text-[10px] font-mono text-[#22C55E]">
            <span className="flex items-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-[#22C55E] animate-pulse" />
              <span>TX: <strong className="font-bold select-all text-white">{listing.paymentId}</strong></span>
            </span>
            {listing.expiryDate && (
              <span className="text-zinc-500 uppercase">EXPIRA: {listing.expiryDate}</span>
            )}
          </div>
        )}

        {/* Admin Delete Action option */}
        {isAdminView && onDelete && (
          <button
            onClick={() => onDelete(listing.id)}
            className="mt-4 w-full rounded-xs bg-red-950/40 hover:bg-red-950/70 text-red-400 border border-red-900/40 font-display text-[10px] font-black tracking-widest uppercase py-2 transition-all cursor-pointer"
          >
            Remover do Portal
          </button>
        )}
      </div>
    </div>
  );
}
